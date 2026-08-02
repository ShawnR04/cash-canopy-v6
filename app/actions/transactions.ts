"use server";

import { db } from "@/db";
import { 
  transactionsTable, 
  categoriesTable, 
  budgetsTable, 
  goalsTable, 
  InsertTransaction
} from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type TransactionType = "Income" | "Expense";

export type CreateTransactionInput = Omit<
  InsertTransaction,
  "id" | "userId" | "createdAt" | "updatedAt" | "date"
> & {
  date?: string | Date | null;
};

/* ==========================================================================
   CREATE TRANSACTION
   ========================================================================== */
export async function createTransaction(data: CreateTransactionInput): Promise<{ success: boolean; error?: string | null }> {
  try {
    const userId = await getAuthenticatedUser();

    // 1. Force 'Expense' if assigned to a goal
    const goalId = data.goalId ?? null;
    const finalType: TransactionType = goalId ? "Expense" : (data.type ?? "Expense");
    const numAmount = parseFloat(String(data.amount));

    // 2. Insert transaction
    await db.insert(transactionsTable).values({
      description: data.description,
      amount: data.amount,
      type: finalType,
      currency: data.currency ?? "USD",
      date: data.date ? new Date(data.date) : new Date(),
      categoryId: data.categoryId ?? null,
      budgetId: data.budgetId ?? null,
      goalId: goalId,
      userId: userId,
    });

    // 3. Increment the goal's current total if tied to a goal
    if (goalId && !isNaN(numAmount)) {
      await db
        .update(goalsTable)
        .set({
          currentAmount: sql`${goalsTable.currentAmount} + ${numAmount}`,
          updatedAt: new Date(),
        })
        .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, userId)));
    }

    revalidatePath("/transactions");
    revalidatePath("/goals");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save transaction.",
    };
  }
}

/* ==========================================================================
   UPDATE TRANSACTION (FormData)
   ========================================================================== */
export async function updateTransaction(formData: FormData) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return { success: false, error: "Unauthorized." };
    }

    const rawId = formData.get("id");
    if (!rawId) {
      return { success: false, error: "Transaction ID is missing." };
    }

    const id = parseInt(rawId as string, 10);
    if (isNaN(id)) {
      return { success: false, error: "Invalid transaction ID." };
    }

    const description = formData.get("description") as string;
    const amount = formData.get("amount") as string;
    const rawType = formData.get("type") as TransactionType;
    const currency = (formData.get("currency") as string) || "USD";
    const rawDate = formData.get("date") as string;
    
    const rawCategoryId = formData.get("categoryId") as string;
    const rawBudgetId = formData.get("budgetId") as string;
    const rawGoalId = formData.get("goalId") as string;

    if (!description || !amount) {
      return { success: false, error: "Required fields are missing." };
    }

    const categoryId = rawCategoryId ? parseInt(rawCategoryId, 10) : null;
    const budgetId = rawBudgetId ? parseInt(rawBudgetId, 10) : null;
    const newGoalId = rawGoalId ? parseInt(rawGoalId, 10) : null;

    // Enforce "Expense" if goal is present
    const validTypes: TransactionType[] = ["Income", "Expense"];
    const initialType = validTypes.includes(rawType) ? rawType : "Expense";
    const finalType = newGoalId ? "Expense" : initialType;

    const newAmountNum = parseFloat(amount);

    // Fetch existing transaction to recalculate goal adjustments accurately
    const existing = await db
      .select({
        amount: transactionsTable.amount,
        goalId: transactionsTable.goalId,
      })
      .from(transactionsTable)
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)))
      .limit(1);

    const oldGoalId = existing[0]?.goalId ?? null;
    const oldAmountNum = existing[0] ? parseFloat(String(existing[0].amount)) : 0;

    // Execute transaction update
    await db
      .update(transactionsTable)
      .set({
        description,
        amount,
        type: finalType,
        currency,
        date: rawDate ? new Date(rawDate) : new Date(),
        categoryId: isNaN(categoryId!) ? null : categoryId,
        budgetId: isNaN(budgetId!) ? null : budgetId,
        goalId: isNaN(newGoalId!) ? null : newGoalId,
        updatedAt: new Date(),
      })
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)));

    // Rebalance goal values:
    // Case A: Goal didn't change, update difference
    if (oldGoalId && newGoalId && oldGoalId === newGoalId) {
      const diff = newAmountNum - oldAmountNum;
      if (diff !== 0) {
        await db
          .update(goalsTable)
          .set({ currentAmount: sql`${goalsTable.currentAmount} + ${diff}` })
          .where(and(eq(goalsTable.id, newGoalId), eq(goalsTable.userId, userId)));
      }
    } else {
      // Case B: Old goal unlinked -> subtract old amount
      if (oldGoalId) {
        await db
          .update(goalsTable)
          .set({ currentAmount: sql`${goalsTable.currentAmount} - ${oldAmountNum}` })
          .where(and(eq(goalsTable.id, oldGoalId), eq(goalsTable.userId, userId)));
      }
      // Case C: New goal linked -> add new amount
      if (newGoalId) {
        await db
          .update(goalsTable)
          .set({ currentAmount: sql`${goalsTable.currentAmount} + ${newAmountNum}` })
          .where(and(eq(goalsTable.id, newGoalId), eq(goalsTable.userId, userId)));
      }
    }

    revalidatePath("/transactions");
    revalidatePath("/goals");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error updating transaction:", error);
    return { success: false, error: "Failed to update transaction. Please try again." };
  }
}

/* ==========================================================================
   DELETE TRANSACTION (FormData)
   ========================================================================== */
export async function deleteTransaction(formData: FormData) {
  try {
    const userId = await getAuthenticatedUser();

    const rawId = formData.get("id");
    if (!rawId) {
      return { success: false, error: "Transaction ID is missing." };
    }

    const id = parseInt(rawId as string, 10);
    if (isNaN(id)) {
      return { success: false, error: "Invalid transaction ID." };
    }

    // Get goal info before deletion so we can deduct it
    const existing = await db
      .select({
        amount: transactionsTable.amount,
        goalId: transactionsTable.goalId,
      })
      .from(transactionsTable)
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      const { goalId, amount } = existing[0];
      const numAmount = parseFloat(String(amount));

      // Delete transaction
      await db
        .delete(transactionsTable)
        .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)));

      // Deduct from goal
      if (goalId && !isNaN(numAmount)) {
        await db
          .update(goalsTable)
          .set({
            currentAmount: sql`${goalsTable.currentAmount} - ${numAmount}`,
            updatedAt: new Date(),
          })
          .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, userId)));
      }
    }

    revalidatePath("/transactions");
    revalidatePath("/goals");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete transaction:", error);
    return {
      success: false,
      error: "An error occurred while deleting the transaction.",
    };
  }
}

/* ==========================================================================
   GET TRANSACTIONS (WITH RELATIONS)
   ========================================================================== */
export async function getTransactions() {
  try {
    const userId = await getAuthenticatedUser();

    const rows = await db
      .select({
        id: transactionsTable.id,
        description: transactionsTable.description,
        amount: transactionsTable.amount,
        currency: transactionsTable.currency,
        type: transactionsTable.type,
        date: transactionsTable.date,
        category: {
          id: categoriesTable.id,
          name: categoriesTable.name,
          icon: categoriesTable.icon,
          color: categoriesTable.color,
        },
        budget: {
          id: budgetsTable.id,
          name: budgetsTable.name,
        },
        goal: {
          id: goalsTable.id,
          name: goalsTable.name,
        },
      })
      .from(transactionsTable)
      .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
      .leftJoin(budgetsTable, eq(transactionsTable.budgetId, budgetsTable.id))
      .leftJoin(goalsTable, eq(transactionsTable.goalId, goalsTable.id))
      .where(eq(transactionsTable.userId, userId))
      .orderBy(desc(transactionsTable.date));

    return rows.map((row) => ({
      ...row,
      category: row.category?.id ? row.category : null,
      budget: row.budget?.id ? row.budget : null,
      goal: row.goal?.id ? row.goal : null,
    }));
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return [];
  }
}


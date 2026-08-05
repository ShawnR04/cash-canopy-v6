"use server";

import { db } from "@/db";
import { 
  transactionsTable, 
  categoriesTable, 
  budgetsTable, 
  goalsTable, 
  userSettingsTable,
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

/**
 * Helper: Updates user_settings.netBalance atomically.
 * Compatible with neon-http driver.
 */
async function updateNetBalance(
  userId: string,
  amountChange: number
) {
  if (amountChange === 0) return;

  await db
    .insert(userSettingsTable)
    .values({
      userId,
      netBalance: String(amountChange),
    })
    .onConflictDoUpdate({
      target: userSettingsTable.userId,
      set: {
        netBalance: sql`${userSettingsTable.netBalance} + ${amountChange}::numeric`,
        updatedAt: new Date(),
      },
    });
}

/* ==========================================================================
   GET TRANSACTION OPTIONS (CATEGORIES, BUDGETS, GOALS)
   ========================================================================== */
export async function getTransactionOptions() {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return { categories: [], budgets: [], goals: [] };
    }

    const [categories, budgets, goals] = await Promise.all([
      db
        .select({ id: categoriesTable.id, name: categoriesTable.name })
        .from(categoriesTable)
        .where(eq(categoriesTable.userId, userId)),
      db
        .select({ id: budgetsTable.id, name: budgetsTable.name })
        .from(budgetsTable)
        .where(eq(budgetsTable.userId, userId)),
      db
        .select({ id: goalsTable.id, name: goalsTable.name })
        .from(goalsTable)
        .where(eq(goalsTable.userId, userId)),
    ]);

    return { categories, budgets, goals };
  } catch (error) {
    console.error("Failed to fetch transaction options:", error);
    return { categories: [], budgets: [], goals: [] };
  }
}

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

    if (isNaN(numAmount)) {
      return { success: false, error: "Invalid transaction amount." };
    }

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
    if (goalId) {
      await db
        .update(goalsTable)
        .set({
          currentAmount: sql`${goalsTable.currentAmount} + ${numAmount}`,
          updatedAt: new Date(),
        })
        .where(and(eq(goalsTable.id, goalId), eq(goalsTable.userId, userId)));
    }

    // 4. Update Net Balance (+ for Income, - for Expense)
    const balanceDelta = finalType === "Income" ? numAmount : -numAmount;
    await updateNetBalance(userId, balanceDelta);

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

    const categoryId = rawCategoryId && rawCategoryId !== "none" ? parseInt(rawCategoryId, 10) : null;
    const budgetId = rawBudgetId && rawBudgetId !== "none" ? parseInt(rawBudgetId, 10) : null;
    const newGoalId = rawGoalId && rawGoalId !== "none" ? parseInt(rawGoalId, 10) : null;

    const validTypes: TransactionType[] = ["Income", "Expense"];
    const initialType = validTypes.includes(rawType) ? rawType : "Expense";
    const finalType = newGoalId ? "Expense" : initialType;

    const newAmountNum = parseFloat(amount);
    if (isNaN(newAmountNum)) {
      return { success: false, error: "Invalid transaction amount." };
    }

    // Fetch existing transaction to calculate delta adjustments accurately
    const existing = await db
      .select({
        amount: transactionsTable.amount,
        type: transactionsTable.type,
        goalId: transactionsTable.goalId,
      })
      .from(transactionsTable)
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)))
      .limit(1);

    if (existing.length === 0) {
      return { success: false, error: "Transaction not found." };
    }

    const oldGoalId = existing[0].goalId ?? null;
    const oldAmountNum = parseFloat(String(existing[0].amount));
    const oldType = existing[0].type as TransactionType;

    // Update transaction
    await db
      .update(transactionsTable)
      .set({
        description,
        amount,
        type: finalType,
        currency,
        date: rawDate ? new Date(rawDate) : new Date(),
        categoryId: categoryId && !isNaN(categoryId) ? categoryId : null,
        budgetId: budgetId && !isNaN(budgetId) ? budgetId : null,
        goalId: newGoalId && !isNaN(newGoalId) ? newGoalId : null,
        updatedAt: new Date(),
      })
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)));

    // Rebalance goal values
    if (oldGoalId && newGoalId && oldGoalId === newGoalId) {
      const diff = newAmountNum - oldAmountNum;
      if (diff !== 0) {
        await db
          .update(goalsTable)
          .set({ 
            currentAmount: sql`${goalsTable.currentAmount} + ${diff}`,
            updatedAt: new Date(),
          })
          .where(and(eq(goalsTable.id, newGoalId), eq(goalsTable.userId, userId)));
      }
    } else {
      if (oldGoalId) {
        await db
          .update(goalsTable)
          .set({ 
            currentAmount: sql`${goalsTable.currentAmount} - ${oldAmountNum}`,
            updatedAt: new Date(),
          })
          .where(and(eq(goalsTable.id, oldGoalId), eq(goalsTable.userId, userId)));
      }
      if (newGoalId) {
        await db
          .update(goalsTable)
          .set({ 
            currentAmount: sql`${goalsTable.currentAmount} + ${newAmountNum}`,
            updatedAt: new Date(),
          })
          .where(and(eq(goalsTable.id, newGoalId), eq(goalsTable.userId, userId)));
      }
    }

    // Rebalance Net Balance
    const oldContribution = oldType === "Income" ? oldAmountNum : -oldAmountNum;
    const newContribution = finalType === "Income" ? newAmountNum : -newAmountNum;
    const netBalanceDelta = newContribution - oldContribution;

    await updateNetBalance(userId, netBalanceDelta);

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
   DELETE TRANSACTION (Supports number OR FormData)
   ========================================================================== */
export async function deleteTransaction(input: number | FormData) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return { success: false, error: "Unauthorized." };
    }

    // Extract ID dynamically based on input type
    let id: number;
    if (typeof input === "number") {
      id = input;
    } else if (input instanceof FormData) {
      const rawId = input.get("id");
      if (!rawId) {
        return { success: false, error: "Transaction ID is missing." };
      }
      id = parseInt(rawId as string, 10);
    } else {
      return { success: false, error: "Invalid input provided." };
    }

    if (isNaN(id)) {
      return { success: false, error: "Invalid transaction ID." };
    }

    // Get goal and amount info before deletion
    const existing = await db
      .select({
        amount: transactionsTable.amount,
        type: transactionsTable.type,
        goalId: transactionsTable.goalId,
      })
      .from(transactionsTable)
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)))
      .limit(1);

    if (existing.length > 0) {
      const { goalId, amount, type } = existing[0];
      const numAmount = parseFloat(String(amount));
      const txType = type as TransactionType;

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

      // Reverse impact on Net Balance
      const balanceDelta = txType === "Income" ? -numAmount : numAmount;
      await updateNetBalance(userId, balanceDelta);
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
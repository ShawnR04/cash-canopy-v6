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
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Defining transaction type imports
export type TransactionType = "Income" | "Expense";

// Omit server-assigned fields (id, userId, createdAt, updatedAt) and allow date as string/Date
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
    // 1. Get the authenticated user ID on the server
    const userId = await getAuthenticatedUser();

    // 2. Insert into database using an explicit object
    await db.insert(transactionsTable).values({
      description: data.description,
      amount: data.amount,
      type: data.type,
      currency: data.currency ?? "USD",
      date: data.date ? new Date(data.date) : new Date(),
      categoryId: data.categoryId ?? null,
      budgetId: data.budgetId ?? null,
      goalId: data.goalId ?? null,
      userId: userId, // Uses the real server-authenticated user ID
    });

    revalidatePath("/transactions");
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

    // Extract form values with proper types
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

    // Validate/Fallback TransactionType
    const validTypes: TransactionType[] = ["Income", "Expense"];
    const type: TransactionType = validTypes.includes(rawType)
      ? rawType
      : "Expense";

    // Parse relational IDs safely
    const categoryId = rawCategoryId ? parseInt(rawCategoryId, 10) : null;
    const budgetId = rawBudgetId ? parseInt(rawBudgetId, 10) : null;
    const goalId = rawGoalId ? parseInt(rawGoalId, 10) : null;

    // Execute update in Drizzle
    await db
      .update(transactionsTable)
      .set({
        description,
        amount,
        type,
        currency,
        date: rawDate ? new Date(rawDate) : new Date(),
        categoryId: isNaN(categoryId!) ? null : categoryId,
        budgetId: isNaN(budgetId!) ? null : budgetId,
        goalId: isNaN(goalId!) ? null : goalId,
        updatedAt: new Date(),
      })
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)));

    revalidatePath("/transactions");
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

    await db
      .delete(transactionsTable)
      .where(and(eq(transactionsTable.id, id), eq(transactionsTable.userId, userId)));

    revalidatePath("/transactions");
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

    // Cleanup null joins so objects default cleanly
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
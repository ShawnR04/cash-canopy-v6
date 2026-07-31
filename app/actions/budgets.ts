"use server";

import { db } from "@/db";
import { 
  budgetsTable, 
  transactionsTable, 
  categoriesTable 
} from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq, and, sql, or, isNull, gte, lte } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type BudgetStatus = "Monthly" | "Weekly" | "Yearly" | "Custom";

/**
 * Create a new budget using FormData
 */
export async function createBudget(formData: FormData) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return { success: false, error: "Unauthorized." };
    }

    const name = formData.get("name") as string;
    const amount = formData.get("amount") as string;
    const currency = (formData.get("currency") as string) || "USD";
    const period = (formData.get("period") as BudgetStatus) || "Monthly";
    const startDateRaw = formData.get("startDate") as string;
    const endDateRaw = formData.get("endDate") as string | null;
    const rawCategoryId = formData.get("categoryId");

    if (!name || !amount || !startDateRaw) {
      return { success: false, error: "Required fields are missing." };
    }

    const categoryId = rawCategoryId ? parseInt(rawCategoryId as string, 10) : null;

    await db.insert(budgetsTable).values({
      name,
      amount,
      currency,
      period,
      startDate: new Date(startDateRaw),
      endDate: endDateRaw ? new Date(endDateRaw) : null,
      categoryId: categoryId && !isNaN(categoryId) ? categoryId : null,
      userId,
    });

    revalidatePath("/budgets");

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to create budget:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save budget.",
    };
  }
}

/**
 * Fetch all budgets for the authenticated user with net spent calculations
 */
export async function getBudgets() {
  try {
    const userId = await getAuthenticatedUser();

    const budgets = await db
      .select({
        id: budgetsTable.id,
        name: budgetsTable.name,
        amount: budgetsTable.amount,
        currency: budgetsTable.currency,
        period: budgetsTable.period,
        startDate: budgetsTable.startDate,
        endDate: budgetsTable.endDate,
        categoryId: budgetsTable.categoryId,
        categoryName: categoriesTable.name,
        categoryIcon: categoriesTable.icon,
        categoryColor: categoriesTable.color,
        // Net Spent Calculation:
        // - 'Expense': +amount (adds to spent)
        // - 'Income': -amount (reduces spent / credits back to budget)
        spentAmount: sql<number>`
          COALESCE(
            SUM(
              CASE 
                WHEN ${transactionsTable.type} = 'Expense' 
                  THEN CAST(${transactionsTable.amount} AS NUMERIC)
                WHEN ${transactionsTable.type} = 'Income' 
                  THEN -CAST(${transactionsTable.amount} AS NUMERIC)
                ELSE 0 
              END
            ), 0
          )::float
        `.mapWith(Number),
      })
      .from(budgetsTable)
      .leftJoin(
        categoriesTable,
        eq(budgetsTable.categoryId, categoriesTable.id)
      )
      .leftJoin(
        transactionsTable,
        and(
          eq(transactionsTable.userId, userId),
          
          // Link via explicit budgetId OR shared categoryId
          or(
            eq(transactionsTable.budgetId, budgetsTable.id),
            and(
              eq(transactionsTable.categoryId, budgetsTable.categoryId),
              sql`${budgetsTable.categoryId} IS NOT NULL`
            )
          ),

          // Date Range Filtering
          gte(transactionsTable.date, budgetsTable.startDate),
          or(
            isNull(budgetsTable.endDate),
            lte(transactionsTable.date, budgetsTable.endDate)
          )
        )
      )
      .where(eq(budgetsTable.userId, userId))
      .groupBy(
        budgetsTable.id,
        budgetsTable.name,
        budgetsTable.amount,
        budgetsTable.currency,
        budgetsTable.period,
        budgetsTable.startDate,
        budgetsTable.endDate,
        budgetsTable.categoryId,
        categoriesTable.id,
        categoriesTable.name,
        categoriesTable.icon,
        categoriesTable.color
      );

    return budgets;
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    return [];
  }
}

/**
 * Update an existing budget using FormData
 */
export async function updateBudget(formData: FormData) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return { success: false, error: "Unauthorized." };
    }

    const rawId = formData.get("id");
    if (!rawId) {
      return { success: false, error: "Budget ID is missing." };
    }

    const id = parseInt(rawId as string, 10);
    if (isNaN(id)) {
      return { success: false, error: "Invalid budget ID." };
    }

    const name = formData.get("name") as string;
    const amount = formData.get("amount") as string;
    const currency = formData.get("currency") as string;
    const period = formData.get("period") as BudgetStatus;
    const startDateRaw = formData.get("startDate") as string;
    const endDateRaw = formData.get("endDate") as string | null;
    const rawCategoryId = formData.get("categoryId");

    if (!name || !amount || !startDateRaw) {
      return { success: false, error: "Required fields are missing." };
    }

    const categoryId = rawCategoryId ? parseInt(rawCategoryId as string, 10) : null;

    await db
      .update(budgetsTable)
      .set({
        name,
        amount,
        currency,
        period,
        startDate: new Date(startDateRaw),
        endDate: endDateRaw ? new Date(endDateRaw) : null,
        categoryId: categoryId && !isNaN(categoryId) ? categoryId : null,
        updatedAt: new Date(),
      })
      .where(and(eq(budgetsTable.id, id), eq(budgetsTable.userId, userId)));

    revalidatePath("/budgets");

    return { success: true };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: "Failed to update budget. Please try again." };
  }
}

/**
 * Delete a budget using FormData
 */
export async function deleteBudget(formData: FormData) {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) {
      return { success: false, error: "Unauthorized." };
    }

    const rawId = formData.get("id");
    if (!rawId) {
      return { success: false, error: "Budget ID is missing." };
    }

    const id = parseInt(rawId as string, 10);
    if (isNaN(id)) {
      return { success: false, error: "Invalid budget ID." };
    }

    await db
      .delete(budgetsTable)
      .where(and(eq(budgetsTable.id, id), eq(budgetsTable.userId, userId)));

    revalidatePath("/budgets");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete budget:", error);
    return { 
      success: false, 
      error: "An error occurred while deleting the budget." 
    };
  }
}
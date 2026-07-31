"use server";

import { db } from "@/db";
import { budgetsTable, transactionsTable, categoriesTable, InsertBudget } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Accept dates as strings from the client form
type CreateBudgetInput = Omit<
  InsertBudget,
  "id" | "userId" | "createdAt" | "updatedAt" | "startDate" | "endDate"
> & {
  startDate: string;
  endDate?: string | null;
};

export async function createBudget(data: CreateBudgetInput) {
  try {
    const userId = await getAuthenticatedUser();

    await db.insert(budgetsTable).values({
      ...data,
      userId,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      categoryId: data.categoryId ?? null,
    } as InsertBudget);

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
        spent: sql<number>`COALESCE(SUM(ABS(${transactionsTable.amount})), 0)`.mapWith(Number),
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
          eq(transactionsTable.categoryId, budgetsTable.categoryId),
          gte(transactionsTable.date, budgetsTable.startDate),
          lte(transactionsTable.date, budgetsTable.endDate)
        )
      )
      .where(eq(budgetsTable.userId, userId))
      .groupBy(
        budgetsTable.id,
        categoriesTable.id
      );

    return budgets;
  } catch (error) {
    console.error("Failed to fetch budgets:", error);
    return [];
  }
}
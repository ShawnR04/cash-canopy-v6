"use server";

import { db } from "@/db";
import { budgetsTable, InsertBudget } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";

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

    // Spread input data and cast directly to satisfy Drizzle's single-row insert type
    await db.insert(budgetsTable).values({
      ...data,
      userId,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : null,
      categoryId: data.categoryId ?? null,
    } as InsertBudget);

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to create budget:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save budget.",
    };
  }
}
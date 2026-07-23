"use server";

import { db } from "@/db";
import { transactionsTable } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser"; // Adjust import path if needed
import { InferInsertModel } from "drizzle-orm";

export type InsertTransaction = InferInsertModel<typeof transactionsTable>;

type CreateTransactionInput = Omit<
  InsertTransaction,
  "id" | "userId" | "createdAt" | "updatedAt" | "date"
> & {
  date: string;
};

export async function createTransaction(data: CreateTransactionInput) {
  try {
    const userId = await getAuthenticatedUser();

    await db.insert(transactionsTable).values({
      ...data,
      userId,
      date: new Date(data.date),
      currency: data.currency ?? "USD",
      categoryId: data.categoryId ?? null,
      budgetId: data.budgetId ?? null,
      goalId: data.goalId ?? null,
    } as InsertTransaction);

    return { success: true, error: null };
  } catch (error) {
    console.error("Failed to create transaction:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save transaction.",
    };
  }
}
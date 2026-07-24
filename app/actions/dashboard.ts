"use server";

import { db } from "@/db";
import { categoriesTable, budgetsTable, goalsTable, transactionsTable } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser"; // Adjust import path
import { eq, desc } from "drizzle-orm";

export async function getDashboardData() {
  try {
    const userId = await getAuthenticatedUser();

    const [categories, budgets, goals, transactions] = await Promise.all([
      db.select().from(categoriesTable).where(eq(categoriesTable.userId, userId)),
      db.select().from(budgetsTable).where(eq(budgetsTable.userId, userId)),
      db.select().from(goalsTable).where(eq(goalsTable.userId, userId)),
      db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId))
        .orderBy(desc(transactionsTable.date))
        .limit(10), // Latest 10 transactions
    ]);

    return { categories, budgets, goals, transactions };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return { categories: [], budgets: [], goals: [], transactions: [] };
  }
}
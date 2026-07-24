"use server";

import { db } from "@/db";
import { transactionsTable, categoriesTable } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq, desc } from "drizzle-orm";

export async function getReportsData() {
  try {
    const userId = await getAuthenticatedUser();

    // Fetch transactions and categories in parallel
    const [transactions, categories] = await Promise.all([
      db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId))
        .orderBy(desc(transactionsTable.date)),
      db.select().from(categoriesTable).where(eq(categoriesTable.userId, userId)),
    ]);

    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // --- 1. Compute 12-Month Annual Timeline Data ---
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyMap: Record<string, { month: string; income: number; expense: number }> = {};

    months.forEach((m) => {
      monthlyMap[m] = { month: m, income: 0, expense: 0 };
    });

    let totalExpenses = 0;
    const categoryTotals: Record<number, number> = {};

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const monthName = months[d.getMonth()];
      const amount = Number(tx.amount);

      if (tx.type === "Income") {
        if (monthlyMap[monthName]) monthlyMap[monthName].income += amount;
      } else if (tx.type === "Expense") {
        if (monthlyMap[monthName]) monthlyMap[monthName].expense += amount;
        totalExpenses += amount;

        if (tx.categoryId) {
          categoryTotals[tx.categoryId] = (categoryTotals[tx.categoryId] || 0) + amount;
        }
      }
    });

    const timelineData = Object.values(monthlyMap);

    // --- 2. Compute Top Expenses ---
    const topExpenses = transactions
      .filter((tx) => tx.type === "Expense")
      .slice(0, 5)
      .map((tx) => {
        const cat = tx.categoryId ? categoryMap.get(tx.categoryId) : null;
        return {
          id: tx.id,
          name: tx.description,
          amount: Number(tx.amount),
          color: cat?.color || "#3b82f6",
          icon: cat?.icon || "ShoppingBag",
        };
      });

    // --- 3. Compute Category Breakdown ---
    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([catId, amount]) => {
        const category = categoryMap.get(Number(catId));
        const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : "0.0";
        return {
          id: Number(catId),
          name: category?.name || "Uncategorized",
          icon: category?.icon || "Folder",
          color: category?.color || "#10b981",
          amount,
          percentage: `${percentage}%`,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return {
      timelineData,
      topExpenses,
      categoryBreakdown,
    };
  } catch (error) {
    console.error("Failed to fetch reports data:", error);
    return null;
  }
}
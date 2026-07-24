"use server";

import { db } from "@/db";
import { transactionsTable, categoriesTable, budgetsTable, goalsTable } from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq, sql, desc, gte } from "drizzle-orm";

export async function getDashboardMetrics() {
  try {
    const userId = await getAuthenticatedUser();

    // 1. Fetch raw data in parallel
    const [transactions, categories, budgets, goals] = await Promise.all([
      db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId))
        .orderBy(desc(transactionsTable.date)),
      db.select().from(categoriesTable).where(eq(categoriesTable.userId, userId)),
      db.select().from(budgetsTable).where(eq(budgetsTable.userId, userId)),
      db.select().from(goalsTable).where(eq(goalsTable.userId, userId)),
    ]);

    // 2. Map Categories for fast lookup
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // 3. Compute High-Level Financial Metrics
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals: Record<number, number> = {};

    transactions.forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.type === "Income") {
        totalIncome += amount;
      } else if (tx.type === "Expense") {
        totalExpenses += amount;
        if (tx.categoryId) {
          categoryTotals[tx.categoryId] = (categoryTotals[tx.categoryId] || 0) + amount;
        }
      }
    });

    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    // 4. Build Category Spending Breakdown with Percentages
    const categoryBreakdown = Object.entries(categoryTotals).map(([catId, amount]) => {
      const category = categoryMap.get(Number(catId));
      const percentage = totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) : "0.0";
      return {
        id: Number(catId),
        name: category?.name || "Uncategorized",
        icon: category?.icon || "Folder",
        color: category?.color || "#3b82f6",
        amount,
        percentage: `${percentage}%`,
      };
    }).sort((a, b) => b.amount - a.amount);

    // 5. Build Monthly Timeline Data (12 Months) for Line/Area Charts
    const monthlyMap: Record<string, { month: string; income: number; expense: number }> = {};
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    months.forEach((m) => {
      monthlyMap[m] = { month: m, income: 0, expense: 0 };
    });

    transactions.forEach((tx) => {
      const d = new Date(tx.date);
      const monthName = months[d.getMonth()];
      const amount = Number(tx.amount);

      if (monthlyMap[monthName]) {
        if (tx.type === "Income") monthlyMap[monthName].income += amount;
        if (tx.type === "Expense") monthlyMap[monthName].expense += amount;
      }
    });

    const timelineData = Object.values(monthlyMap);

    return {
      metrics: {
        totalBalance: netBalance,
        totalIncome,
        totalExpenses,
        savingsRate,
      },
      categoryBreakdown,
      timelineData,
      recentTransactions: transactions.slice(0, 5), // Top 5 recent
      categories,
      budgets,
      goals,
    };
  } catch (error) {
    console.error("Error computing dashboard metrics:", error);
    return null;
  }
}
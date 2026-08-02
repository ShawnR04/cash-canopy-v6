"use server";

import { db } from "@/db";
import { 
  transactionsTable, 
  categoriesTable, 
  budgetsTable, 
  goalsTable 
} from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq, desc } from "drizzle-orm";

export async function getDashboardMetrics() {
  try {
    const userId = await getAuthenticatedUser();

    // 1. Fetch raw data in parallel
    const [transactions, categories, budgets, goals, recentTxRows] = await Promise.all([
      db
        .select()
        .from(transactionsTable)
        .where(eq(transactionsTable.userId, userId))
        .orderBy(desc(transactionsTable.date)),
      db.select().from(categoriesTable).where(eq(categoriesTable.userId, userId)),
      db.select().from(budgetsTable).where(eq(budgetsTable.userId, userId)),
      db.select().from(goalsTable).where(eq(goalsTable.userId, userId)),
      
      // 🚨 Joined Query for Recent Transactions (Classification details)
      db
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
        .orderBy(desc(transactionsTable.date))
        .limit(5),
    ]);

    // Cleanup null joins for recent transactions
    const processedRecentTransactions = recentTxRows.map((row) => ({
      ...row,
      category: row.category?.id ? row.category : null,
      budget: row.budget?.id ? row.budget : null,
      goal: row.goal?.id ? row.goal : null,
    }));

    // 2. Map Categories for fast lookup
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    // 3. Compute High-Level Financial Metrics
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryTotals: Record<number, number> = {};
    const budgetTotals: Record<number, number> = {};

    transactions.forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.type === "Income") {
        totalIncome += amount;
      } else if (tx.type === "Expense") {
        totalExpenses += amount;
        
        if (tx.categoryId) {
          categoryTotals[tx.categoryId] = (categoryTotals[tx.categoryId] || 0) + amount;
        }
        if (tx.budgetId) {
          budgetTotals[tx.budgetId] = (budgetTotals[tx.budgetId] || 0) + amount;
        }
      }
    });

    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    // 4. Build Category Spending Breakdown
    const categoryBreakdown = Object.entries(categoryTotals)
      .map(([catId, amount]) => {
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
      })
      .sort((a, b) => b.amount - a.amount);

    // 5. Build Budgets with Spent Amounts
    const processedBudgets = budgets.map((b) => {
      const spent = budgetTotals[b.id] || 0;
      const limit = Number(b.amount || 0);
      return {
        ...b,
        spent,
        limit,
        percentageSpent: limit > 0 ? Math.min(Math.round((spent / limit) * 100), 100) : 0,
      };
    });

    // 6. Process Goals
    const processedGoals = goals.map((g) => {
      const current = Number(g.currentAmount || 0);
      const target = Number(g.targetAmount || 1);
      return {
        ...g,
        currentAmount: current,
        targetAmount: target,
        progressPercentage: Math.min(Math.round((current / target) * 100), 100),
      };
    });

    return {
      metrics: {
        totalBalance: netBalance,
        totalIncome,
        totalExpenses,
        savingsRate,
      },
      categoryBreakdown,
      recentTransactions: processedRecentTransactions,
      categories,
      budgets: processedBudgets,
      goals: processedGoals,
    };
  } catch (error) {
    console.error("Error computing dashboard metrics:", error);
    return null;
  }
}
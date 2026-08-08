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

    // Fast lookups
    const categoryMap = new Map(categories.map((c) => [c.id, c]));
    const budgetMap = new Map(budgets.map((b) => [b.id, b]));
    const goalMap = new Map(goals.map((g) => [g.id, g]));

    let totalIncome = 0;
    let totalExpenses = 0;

    // Grouping container for Expenses across Categories, Budgets, and Goals
    const spendingMap = new Map<
      string,
      {
        id: string;
        name: string;
        type: "category" | "budget" | "goal" | "uncategorized";
        icon?: string;
        color: string;
        amount: number;
      }
    >();

    transactions.forEach((tx) => {
      const amount = Number(tx.amount);

      if (tx.type === "Income") {
        totalIncome += amount;
      } else if (tx.type === "Expense") {
        totalExpenses += amount;

        let key = "";
        let name = "";
        let groupType: "category" | "budget" | "goal" | "uncategorized" = "uncategorized";
        let icon = "Folder";
        let color = "#64748b";

        // Priority 1: Direct Category
        if (tx.categoryId && categoryMap.has(tx.categoryId)) {
          const cat = categoryMap.get(tx.categoryId)!;
          key = `cat-${cat.id}`;
          name = cat.name;
          groupType = "category";
          icon = cat.icon || "Folder";
          color = cat.color || "#3b82f6";
        } 
        // Priority 2: Budget
        else if (tx.budgetId && budgetMap.has(tx.budgetId)) {
          const b = budgetMap.get(tx.budgetId)!;
          key = `budget-${b.id}`;
          name = b.name;
          groupType = "budget";
          icon = "PieChart";
          color = "#eab308";
        } 
        // Priority 3: Goal
        else if (tx.goalId && goalMap.has(tx.goalId)) {
          const g = goalMap.get(tx.goalId)!;
          key = `goal-${g.id}`;
          name = g.name;
          groupType = "goal";
          icon = "Target";
          color = "#10b981";
        } 
        // Fallback: Uncategorized
        else {
          key = "uncategorized";
          name = "Uncategorized";
          groupType = "uncategorized";
          icon = "HelpCircle";
          color = "#6b7280";
        }

        const current = spendingMap.get(key) || {
          id: key,
          name,
          type: groupType,
          icon,
          color,
          amount: 0,
        };

        current.amount += amount;
        spendingMap.set(key, current);
      }
    });

    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) : 0;

    // Build spending breakdown with calculated percentage
    const categoryBreakdown = Array.from(spendingMap.values())
      .map((item) => {
        const percentage = totalExpenses > 0 ? ((item.amount / totalExpenses) * 100).toFixed(1) : "0.0";
        return {
          ...item,
          percentage: `${percentage}%`,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    // Compute progress for budgets & goals
    const budgetTotals: Record<number, number> = {};
    transactions.forEach((tx) => {
      if (tx.type === "Expense" && tx.budgetId) {
        budgetTotals[tx.budgetId] = (budgetTotals[tx.budgetId] || 0) + Number(tx.amount);
      }
    });

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
      recentTransactions: recentTxRows,
      categories,
      budgets: processedBudgets,
      goals: processedGoals,
    };
  } catch (error) {
    console.error("Error computing dashboard metrics:", error);
    return null;
  }
}
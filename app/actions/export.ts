"use server";

import { db } from "@/db";
import { 
  user,
  transactionsTable, 
  categoriesTable, 
  budgetsTable, 
  goalsTable 
} from "@/db/schema";
import { getAuthenticatedUser } from "./getAuthenticatedUser";
import { eq, desc } from "drizzle-orm";

export interface ExportDataResult {
  username: string;
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  transactions: Array<{
    id: number;
    date: Date;
    description: string;
    amount: number;
    type: string;
    currency: string;
    categoryName: string | null;
  }>;
  goals: Array<{
    id: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: Date;
  }>;
}

export async function getExportData(): Promise<ExportDataResult> {
  try {
    const userId = await getAuthenticatedUser();
    if (!userId) throw new Error("Unauthorized");

    // 1. Fetch Authenticated User Details
    const userInfo = await db
      .select({
        name: user.name,
        username: user.username,
        displayUsername: user.displayUsername,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    const userName =
      userInfo[0]?.displayUsername ||
      userInfo[0]?.username ||
      userInfo[0]?.name ||
      "User";

    // 2. Fetch All Transactions (Matching Dashboard Calculation)
    const rawTransactions = await db
      .select({
        id: transactionsTable.id,
        date: transactionsTable.date,
        description: transactionsTable.description,
        amount: transactionsTable.amount,
        type: transactionsTable.type,
        currency: transactionsTable.currency,
        categoryName: categoriesTable.name,
        budgetName: budgetsTable.name,
        goalName: goalsTable.name,
      })
      .from(transactionsTable)
      .leftJoin(categoriesTable, eq(transactionsTable.categoryId, categoriesTable.id))
      .leftJoin(budgetsTable, eq(transactionsTable.budgetId, budgetsTable.id))
      .leftJoin(goalsTable, eq(transactionsTable.goalId, goalsTable.id))
      .where(eq(transactionsTable.userId, userId))
      .orderBy(desc(transactionsTable.date));

    // 3. Exact Dashboard Metric Summation Logic
    let totalIncome = 0;
    let totalExpenses = 0;

    rawTransactions.forEach((tx) => {
      const amount = Number(tx.amount || 0);
      if (tx.type === "Income") {
        totalIncome += amount;
      } else if (tx.type === "Expense") {
        totalExpenses += amount;
      }
    });

    const netBalance = totalIncome - totalExpenses;
    
    // 🚨 Identical Savings Rate formula as getDashboardMetrics()
    const savingsRate = totalIncome > 0 
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100) 
      : 0;

    const transactions = rawTransactions.map((t) => ({
      id: t.id,
      date: t.date ? new Date(t.date) : new Date(),
      description: t.description || "Untitled Transaction",
      amount: Math.abs(Number(t.amount || 0)),
      type: String(t.type || "Expense"),
      currency: t.currency || "USD",
      categoryName: t.categoryName || t.budgetName || t.goalName || "Uncategorized",
    }));

    // 4. Fetch Goals Progress
    const rawGoals = await db
      .select({
        id: goalsTable.id,
        name: goalsTable.name,
        targetAmount: goalsTable.targetAmount,
        currentAmount: goalsTable.currentAmount,
        targetDate: goalsTable.targetDate,
      })
      .from(goalsTable)
      .where(eq(goalsTable.userId, userId));

    const goals = rawGoals.map((g) => ({
      id: g.id,
      name: g.name || "Goal",
      targetAmount: Number(g.targetAmount || 0),
      currentAmount: Number(g.currentAmount || 0),
      targetDate: g.targetDate ? new Date(g.targetDate) : new Date(),
    }));

    return {
      username: userName,
      totalBalance: netBalance,
      monthlyIncome: totalIncome,
      monthlyExpenses: totalExpenses,
      savingsRate,
      transactions,
      goals,
    };
  } catch (error) {
    console.error("Failed to fetch export data:", error);
    throw error;
  }
}
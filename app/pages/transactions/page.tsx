export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getCategories } from "@/app/actions/categories";
import { getBudgets } from "@/app/actions/budgets";
import { getGoals } from "@/app/actions/goals";
import { getTransactions } from "@/app/actions/transactions";
import TransactionsClient from "./transactionsClient";
import TransactionTableView from "@/components/app/transactions/transactionTableView";

export default async function Transactions() {
  const [categories, budgets, goals, transactions] = await Promise.all([
    getCategories(),
    getBudgets(),
    getGoals(),
    getTransactions(),
  ]);

  const options = {
    categories: categories || [],
    budgets: budgets || [],
    goals: goals || [],
  };

  return (
    <TransactionsClient transactions={options}>
      <TransactionTableView 
        initialTransactions={transactions || []} 
        options={options} 
      />
    </TransactionsClient>
  );
}
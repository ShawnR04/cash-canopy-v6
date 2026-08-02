export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getCategories } from "@/app/actions/categories";
import { getBudgets } from "@/app/actions/budgets";
import BudgetsClient from "./budgetsClient";
import BudgetsCard from "@/components/app/budgets/budgetsCard";

export default async function BudgetsPage() {
  const [categories, budgets] = await Promise.all([
    getCategories(),
    getBudgets(),
  ]);

  return (
    <BudgetsClient categories={categories || []}>
      <BudgetsCard 
        budgets={budgets || []} 
        categories={categories || []} 
      />
    </BudgetsClient>
  );
}
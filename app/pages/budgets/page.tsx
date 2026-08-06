import { getCategories } from "@/app/actions/categories";
import { getBudgets } from "@/app/actions/budgets"; // Import your getBudgets action
import BudgetsClient from "./budgetsClient";
import BudgetsCard from "@/components/app/budgets/budgetsCard";

export const dynamic = "force-dynamic";

export default async function Budgets() {
  // Fetch both categories and budgets in parallel
  const [categories, budgets] = await Promise.all([
    getCategories(),
    getBudgets(),
  ]);

  return (
    <BudgetsClient categories={categories}>
      <BudgetsCard 
        budgets={budgets ?? []} 
        categories={categories ?? []} 
      />
    </BudgetsClient>
  );
}
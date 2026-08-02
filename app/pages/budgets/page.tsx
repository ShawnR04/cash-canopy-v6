import { getCategories } from "@/app/actions/categories";
import BudgetsClient from "./budgetsClient";
import BudgetsCard from "@/components/app/budgets/budgetsCard";

export default async function Budgets() {
  const categories = await getCategories();
  return (
    <>
        <BudgetsClient
          categories={categories}
        
        >
          <BudgetsCard/>
        </BudgetsClient>
    </>
  );
}
import { getCategories } from "@/app/actions/categories";
import BudgetsClient from "./budgetsClient";

export default async function Budgets() {
  const categories = await getCategories();
  return (
    <>
        <BudgetsClient
          categories={categories}
        
        ></BudgetsClient>
    </>
  );
}
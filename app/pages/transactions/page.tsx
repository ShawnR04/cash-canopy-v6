import { getCategories } from "@/app/actions/categories";
import { getBudgets } from "@/app/actions/budgets";
import { getGoals } from "@/app/actions/goals";
import TransactionsClient from "./transactionsClient";

export default async function Transactions(){
    const categories = await getCategories();
    const budgets = await getBudgets();
    const goals = await getGoals();

    const options = {
      categories: categories || [],
      budgets: budgets || [],
      goals: goals || [],
    };
    return(
        <>
            <TransactionsClient
                transactions={options}
            ></TransactionsClient>
        </>
    );
}
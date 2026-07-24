import { getSession } from "@/lib/session";
import HomeClient from "./homeClient";
import { redirect } from "next/navigation";

//? Tabs
import Dashboard from "../pages/dashboard/page";
import Transactions from "../pages/transactions/page";
import Budgets from "../pages/budgets/page";
import Categories from "../pages/categories/page";
import Report from "../pages/report/page";
import Goals from "../pages/goals/page";

export default async function Home(){
    const session = await getSession();

    if(!session){
        return redirect("/auth/login")
    }

    const username = `${session.user.username}`
    const version = "6.0.0"
    return(
        <>
            <HomeClient
                session={username}
                version={version}
                dashboardTab={<Dashboard/>}
                transactionsTab={<Transactions/>}
                budgetsTab={<Budgets/>}
                categoriesTab={<Categories/>}
                reportTab={<Report/>}
                goalsTab={<Goals/>}
            />
        </>
    );
}
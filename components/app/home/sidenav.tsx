"use client"

import { cn } from "@/lib/utils";
import { ArrowLeftRight, Boxes, LayoutDashboard, Target, TrendingUp, Wallet } from "lucide-react";

interface SidenavProps{
    session:string;
    version:string
    activeTab:string;
    setActiveTab: (id: string) => void
}
export default function SideNav({
    session,
    version,
    activeTab,
    setActiveTab
} : SidenavProps){
    const NAV_LINKS = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
        { id: "budgets", label: "Budgets", icon: Wallet },
        { id: "categories", label: "Categories", icon: Boxes },
        { id: "report", label: "Report", icon: TrendingUp },
        { id: "goals", label: "Savings Goals", icon: Target }
    ]

    const handleNavClick = (linkId: string) => {
        setActiveTab(linkId);
        //setIsOpen(false);
    }
    return(
       <>
        <div className=""></div>
        <aside className="">
            <div className=""></div>
            <nav className="">
                {NAV_LINKS.map((link) => (
                    <div key={link.id} className={cn(
                        activeTab === link.id ? "" : ""
                    )}>
                        <button 
                            onClick={() => handleNavClick(link.id)}
                            type="button"
                            className="cursor-pointer"
                        >
                            {link.label}
                        </button>
                    </div>
                ))}
            </nav>
        </aside>
       </> 
    );
}
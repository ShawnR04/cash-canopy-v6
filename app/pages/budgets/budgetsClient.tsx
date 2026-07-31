"use client"

import CreateBudgetsModal, {CategoryOption} from "@/components/app/budgets/createBudgetsModal";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";

interface BudgetsClientProps {
  categories: CategoryOption[];
  children: React.ReactNode; 
}

export default function BudgetsClient({ categories, children }:BudgetsClientProps){
    const [isOpen, setIsOpen] = useState(false);
    return(
        <>
            <div className="h-full overflow-y-auto no-scrollbar">
              <div className="open-modal-background">
                <h1 className="open-modal-heading">
                  Budgets
                </h1>

                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn("open-modal-button",
                    isOpen ? "bg-primary text-foreground" : ""
                  )}
                >
                  <Plus/>
                  Add Budget
                </button>
              </div>

              <div className="children">
                {children}
              </div>
            </div>

            {isOpen && (
                <CreateBudgetsModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    categoryOption={categories}
                />
            )}
        </>
    );
}
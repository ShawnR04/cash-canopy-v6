"use client"

import CreateTransactionsModal, {TransactionOption} from "@/components/app/transactions/createTransactionsModal";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";

interface TransactionsClientProps {
  transactions: TransactionOption;
  //children: React.ReactNode; 
}

export default function TransactionsClient({ transactions }: TransactionsClientProps){
    const [isOpen, setIsOpen] = useState(!false);
    return(
        <>
            <div className="h-full overflow-y-auto no-scrollbar">
              <div className="open-modal-background">
                <h1 className="open-modal-heading">
                  Transactions
                </h1>

                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn("open-modal-button",
                    isOpen ? "bg-primary text-foreground" : ""
                  )}
                >
                  <Plus/>
                  Add Transaction
                </button>
              </div>
            </div>

            {isOpen && (
                <CreateTransactionsModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    transactions={transactions}
                />
            )}
        </>
    );
}
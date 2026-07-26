"use client";

import GoalsModal from "@/components/app/goals/goalsModal";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function GoalsClient() {
  const [isOpen, setIsOpen] = useState(!false);
  return (
    <>
      <div className="h-full overflow-y-auto no-scrollbar">
        <div className="open-modal-background">
          <h1 className="open-modal-heading">
            Savings Goals
          </h1>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className={cn("open-modal-button",
              isOpen ? "bg-primary text-foreground" : ""
            )}
          >
            <Plus/>
            Add Goal
          </button>
        </div>
      </div>

      {isOpen && (
                <GoalsModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}
    </>
  );
}
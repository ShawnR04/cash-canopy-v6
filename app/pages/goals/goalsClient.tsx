"use client";

import CreateGoalsModal from "@/components/app/goals/createGoalsModal";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";

interface GoalsClientProps {
  children: React.ReactNode; // Add this prop to accept the Server Component
}

export default function GoalsClient({ children }: GoalsClientProps) {
  const [isOpen, setIsOpen] = useState(false);
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

        <div className="children">
          {children}
        </div>
      </div>

      {isOpen && (
                <CreateGoalsModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}
    </>
  );
}
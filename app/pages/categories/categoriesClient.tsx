"use client"

import CreateCategoriesModal from "@/components/app/categories/createCategoriesModal";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CategoriesClientProps {
  children: React.ReactNode; // Add this prop to accept the Server Component
}

export default function CategoriesClient({ children }: CategoriesClientProps){
    const [isOpen, setIsOpen] = useState(false);
    return(
        <>
            <div className="h-full overflow-y-auto no-scrollbar">
              <div className="open-modal-background">
                <h1 className="open-modal-heading">
                  Categories
                </h1>

                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn("open-modal-button",
                    isOpen ? "bg-primary text-foreground" : ""
                  )}
                >
                  <Plus/>
                  Add Category
                </button>
              </div>

              <div className="mt-3">
                {children}
              </div>
            </div>

            {isOpen && (
                <CreateCategoriesModal
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                />
            )}
        </>
    );
}
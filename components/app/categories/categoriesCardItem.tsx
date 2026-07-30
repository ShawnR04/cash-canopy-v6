"use client";

import { DynamicIcon } from "@/lib/dynamicIcon";
import { useState, useTransition, useEffect, useRef } from "react";
import UpdateCategoriesModal from "./updateCategoriesModal";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export default function CategoriesCardItem({ category }: { category: Category }) {
  const [isPending, startTransition] = useTransition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { name, icon, color } = category;

  // Close dropdown when user clicks anywhere outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="relative" ref={menuRef}>
        <div 
          className="card cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <div 
            className="absolute h-full w-2/3 opacity-8 blur-lg rounded-full top-0 right-0 pointer-events-none"
            style={{ backgroundColor: color }}
          />

          <div className="flex flex-col">
            <div className="flex gap-5 items-center justify-between">
              <div 
                className="w-12 h-12 flex items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 shrink-0"
                style={{
                  backgroundColor: `${color}20`,
                  color: color
                }}
              >
                <DynamicIcon name={icon} className="w-6 h-6 stroke-[2.5]" />
              </div>

              <div>
                <h3 
                  className="font-bold text-lg max-w-36 truncate tracking-tight transition-colors"
                  style={{ color: color }}
                >
                  {name}
                </h3>
              </div>

              <div className="relative">
                <button
                  type="button"
                  className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents parent card onClick
                    setIsMenuOpen((prev) => !prev);
                  }}
                  aria-label="More options"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className=""></div>
          </div>
        </div>

        {/* --- Dropdown Menu Overlay --- */}
        {isMenuOpen && (
          <div 
            className="absolute z-50 top-12 right-0 w-40 rounded-xl border border-border bg-popover p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()} // Stops clicks inside menu from triggering card click
          >
            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors cursor-pointer"
              onClick={() => {
                setIsMenuOpen(false);
                setIsModalOpen(true);
              }}
            >
              <Edit className="w-4 h-4 text-muted-foreground" />
              Edit Category
            </button>

            <button
              type="button"
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
              onClick={() => {
                setIsMenuOpen(false);
                // TODO: Trigger delete confirmation logic here
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <UpdateCategoriesModal
          key={`${category.id}`}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          category={category}
        />
      )}
    </>
  );
}
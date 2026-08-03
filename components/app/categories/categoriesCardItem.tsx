"use client";

import { DynamicIcon } from "@/lib/dynamicIcon";
import { useState, useEffect, useRef } from "react";
import UpdateCategoriesModal from "./updateCategoriesModal";
import { Edit, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteCategory } from "@/app/actions/categories";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export default function CategoriesCardItem({ category }: { category: Category }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { name, icon, color } = category;

  // Close menus when user clicks anywhere outside the component
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
        if (!isDeleting) {
          setShowDeleteConfirm(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDeleting]);

  // Handle Confirmed Delete Action with 1.5s Minimum Loader Duration
  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);

    const formData = new FormData();
    formData.append("id", String(category.id));

    // Guarantee minimum duration of 1500ms
    const timerPromise = new Promise((resolve) => setTimeout(resolve, 1500));
    const deletePromise = deleteCategory(formData);

    const [_, result] = await Promise.all([timerPromise, deletePromise]);

    if (result?.success) {
      toast.success(`${category.name} deleted successfully!`);
      setShowDeleteConfirm(false);
      setIsMenuOpen(false);
    } else {
      toast.error(result?.error || "Something went wrong.");
    }
    setIsDeleting(false);
  };

  return (
    <>
      <div className="relative" ref={menuRef}>
        <div 
          className="card cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (!showDeleteConfirm) {
              setIsMenuOpen((prev) => !prev);
            }
          }}
        >
          <div 
            className="absolute h-full w-2/3 opacity-8 blur-lg rounded-full top-0 right-0 pointer-events-none"
            style={{ backgroundColor: color }}
          />

          <div className="flex flex-col">
            <div className="flex gap-5 items-center">
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
                  className="font-bold text-lg w-30 truncate tracking-tight transition-colors"
                  style={{ color: color }}
                >
                  {name}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* --- Dropdown Options Popover --- */}
        {isMenuOpen && !showDeleteConfirm && (
          <div 
            className="absolute z-50 top-12 right-0 w-40 rounded-xl border border-border bg-popover p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
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
                setShowDeleteConfirm(true);
              }}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}

        {/* ================= DELETE CONFIRMATION POPOVER ================= */}
        {showDeleteConfirm && (
          <div
            className="absolute z-50 top-12 right-0 w-64 rounded-2xl border border-border bg-popover/95 backdrop-blur-md p-4 shadow-xl animate-in fade-in-0 zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-popover-foreground">
                  Delete &quot;{category.name}&quot;?
                </h4>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  This will also permanently remove all linked transactions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/60">
              <button
                type="button"
                disabled={isDeleting}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="w-1/2 h-8 text-xs font-medium border border-input rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="w-1/2 h-8 text-xs font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
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
"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import CategoriesCardItem from "./categoriesCardItem";

interface Category {
  id: number;
  name: string;
  icon?: string | null;
  color?: string | null;
}

interface CategoriesCardProps {
  categories?: Category[];
}

export default function CategoriesCard({ categories = [] }: CategoriesCardProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter and sort categories dynamically
  const filteredCategories = useMemo(() => {
    if (!categories || categories.length === 0) return [];

    return [...categories]
      .filter((category) =>
        category.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim())
      )
      .sort((a, b) => Number(b.id) - Number(a.id)); // Most recent first
  }, [categories, searchQuery]);

  return (
    <div className="space-y-4 w-full">
      {/* ================= CONTROLS BAR ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-[#0a0f1d] text-xs text-foreground placeholder:text-muted-foreground rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
      </div>

      {/* ================= CATEGORIES GRID ================= */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 flex-1 no-scrollbar content-start">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategoriesCardItem
              key={category.id}
              category={{
                ...category,
                icon: category.icon ?? "",
                color: category.color ?? "",
              }}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-xs text-muted-foreground bg-[#0a0f1d] border border-border rounded-2xl">
            {searchQuery
              ? "No categories match your search criteria."
              : "No categories found. Click 'Add Category' to create one!"}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import BudgetsCardItem, { BudgetPeriod } from './budgetsCardItem';

interface Category {
  id: number;
  name: string;
  icon?: string | null;
  color?: string | null;
}

interface Budget {
  id: number;
  name: string;
  amount: string | number;
  spentAmount?: string | number;
  period?: BudgetPeriod | "";
  currency?: string;
  categoryId?: number | string | null;
  startDate?: Date | string | null;
  endDate?: Date | string | null;
}

interface BudgetsCardProps {
  budgets?: Budget[];
  categories?: Category[];
}

export default function BudgetsCard({ budgets = [], categories = [] }: BudgetsCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [periodFilter, setStatusFilter] = useState<string>("all");

  // Filter and sort budgets dynamically
  const filteredBudgets = useMemo(() => {
    if (!budgets || budgets.length === 0) return [];

    return [...budgets]
      .filter((budget) => {
        const matchedCategory = categories?.find(
          (cat) => String(cat.id) === String(budget.categoryId)
        );
        const categoryName = matchedCategory?.name ?? 'Uncategorized';

        // 1. Search Query Filter (Matches budget name OR category name)
        const matchesSearch =
          budget.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
          categoryName.toLowerCase().includes(searchQuery.toLowerCase().trim());

        // 2. Period Filter (e.g. "monthly", "yearly", "weekly", etc.)
        const budgetPeriod = budget.period?.toLowerCase() || "";
        const matchesPeriod =
          periodFilter === "all" ? true : budgetPeriod === periodFilter;

        return matchesSearch && matchesPeriod;
      })
      .sort((a, b) => {
        const dateA = new Date(a.startDate || 0).getTime();
        const dateB = new Date(b.startDate || 0).getTime();
        return dateB - dateA; // Newest first
      });
  }, [budgets, categories, searchQuery, periodFilter]);

  return (
    <div className="space-y-4 w-full">
      {/* ================= CONTROLS BAR ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search budgets or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-[#0a0f1d] text-xs text-foreground placeholder:text-muted-foreground rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Period Filter Badges */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0a0f1d] border border-border rounded-xl w-full sm:w-auto overflow-x-auto">
          {(["all", "monthly", "yearly", "weekly"] as const).map((period) => {
            const isActive = periodFilter === period;
            return (
              <button
                key={period}
                type="button"
                onClick={() => setStatusFilter(period)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {period}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= BUDGETS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 flex-1 overflow-y-auto no-scrollbar content-start">
        {filteredBudgets.length > 0 ? (
          filteredBudgets.map((budget) => {
            const matchedCategory = categories?.find(
              (cat) => String(cat.id) === String(budget.categoryId)
            );

            return (
              <div key={budget.id} className="h-full">
                <BudgetsCardItem
                  categoryOption={categories as any}
                  budget={{
                    ...budget,
                    amount: String(budget.amount),
                    currency: budget.currency ?? "USD",
                    period: (budget.period || "monthly") as BudgetPeriod,
                    // 🚨 FIX: Provide explicit fallback for date fields so they aren't 'undefined'
                    startDate: budget.startDate,
                    endDate: budget.endDate ?? null,
                    categoryName: matchedCategory?.name ?? 'Uncategorized',
                    categoryIcon: matchedCategory?.icon ?? undefined,
                    categoryColor: matchedCategory?.color ?? undefined,
                    spentAmount: Number(budget.spentAmount) || 0,
                  }}
                />
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-xs text-muted-foreground bg-[#0a0f1d] border border-border rounded-2xl">
            {searchQuery || periodFilter !== "all"
              ? "No budgets match your search or filter criteria."
              : "No budgets found. Click 'Add Budget' to create one!"}
          </div>
        )}
      </div>
    </div>
  );
}
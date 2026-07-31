import { DynamicIcon } from '@/lib/dynamicIcon';
import React from 'react';

export type BudgetPeriod = "Monthly" | "Weekly" | "Yearly" | "Custom";

interface Budget {
  id: number;
  name: string;
  amount: string;
  currency: string;
  period: BudgetPeriod;
  startDate: string | Date;
  endDate?: string | Date | null;
  categoryId?: number | string | null;
  categoryName?: string | null;
  categoryIcon?: string | null;
  categoryColor?: string;
  spentAmount: number;
}

export default function BudgetsCardItem({ budget }: { budget: Budget }) {
  const { 
    name, 
    amount, 
    currency, 
    categoryName, 
    categoryIcon, 
    categoryColor = "#6366f1", 
    spentAmount = 0 
  } = budget;

  const budgetAmount = Number(amount) || 0;
  const remaining = budgetAmount - spentAmount;

  // Handle surplus/negative spent amounts gracefully
  const isSurplus = spentAmount < 0;
  const absSpent = Math.abs(spentAmount);
  const rawPercentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
  
  // Clamp progress width between 0% and 100% for CSS styling
  const progressWidth = isSurplus ? 0 : Math.min(Math.max(rawPercentage, 0), 100);

  // --- DYNAMIC SPENT TEXT COLOR ---
  const getSpentTextColor = () => {
    if (isSurplus || rawPercentage < 45) {
      return "text-emerald-600 dark:text-emerald-400"; // Green (< 45%)
    }
    if (rawPercentage >= 45 && rawPercentage < 85) {
      return "text-amber-500 dark:text-amber-400"; // Yellow (45% - 84%)
    }
    return "text-destructive"; // Red (85%+)
  };

  // --- DYNAMIC PROGRESS BAR COLOR ---
  // Turns red at 85%+, otherwise uses the category color
  const isNearOrOverLimit = rawPercentage >= 85 && !isSurplus;
  const progressBgColor = isNearOrOverLimit ? "#ef4444" : categoryColor;

  // Currency Formatter Helper
  const formatMoney = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(val);

  return (
    <div className="card shadow-xs rounded-2xl border border-border bg-card p-4 text-card-foreground transition-all hover:shadow-md space-y-3">
      {/* Header */}
      <div className="h-12 gap-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 shrink-0"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
            }}
          >
            <DynamicIcon name={categoryIcon || "Wallet"} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-semibold capitalize tracking-tight">
              {name}
            </h1>
            <p className="text-xs text-muted-foreground">
              Limit: {formatMoney(budgetAmount)}
            </p>
          </div>
        </div>
        <span
          className="rounded-full text-center border px-2.5 py-1 text-[11px] font-medium"
          style={{
            borderColor: `${categoryColor}40`,
            backgroundColor: `${categoryColor}10`,
            color: categoryColor,
          }}
        >
          {categoryName || "General"}
        </span>
      </div>

      {/* Spent & Remaining Overview */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
            {isSurplus ? "Surplus / Credit" : "Spent"}
          </span>
          {/* Dynamic Spent Text Color */}
          <span className={`text-base font-bold transition-colors ${getSpentTextColor()}`}>
            {isSurplus ? `+${formatMoney(absSpent)}` : formatMoney(spentAmount)}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground block">
            {remaining >= 0 ? "Remaining" : "Over Budget"}
          </span>
          <span
            className={`text-base font-bold ${
              remaining < 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {formatMoney(Math.abs(remaining))}
          </span>
        </div>
      </div>

      {/* Progress Bar (Turns Red at >= 85%) */}
      <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            backgroundColor: progressBgColor,
            width: `${progressWidth}%`,
          }}
        />
      </div>

      {/* Progress Footer */}
      <div className="flex gap-2 justify-between">
        <p className="text-[13px] text-muted-foreground">
          {isSurplus
            ? `+${formatMoney(absSpent)} added`
            : `${Math.max(0, rawPercentage).toFixed(0)}% used`}
        </p>
        <p
          className={`text-[13px] font-medium ${
            remaining < 0 ? "text-destructive" : "text-muted-foreground"
          }`}
        >
          {formatMoney(Math.abs(remaining))} {remaining < 0 ? "over limit" : "left"}
        </p>
      </div>
    </div>
  );
}
"use client";

import { DynamicIcon } from "@/lib/dynamicIcon";
import React, { useState, useEffect, useRef } from "react";
import UpdateBudgetsModal from "./updateBudgetsModal";
import { Edit, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { deleteBudget } from "@/app/actions/budgets";
import { toast } from "sonner";
import { CategoryOption } from "./createBudgetsModal";

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

export default function BudgetsCardItem({
  budget,
  categoryOption = [],
}: {
  budget: Budget;
  categoryOption?: CategoryOption[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    name,
    amount,
    currency,
    categoryName,
    categoryIcon,
    categoryColor = "#6366f1",
    spentAmount = 0,
  } = budget;

  // Close menus when user clicks outside
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

  const budgetAmount = Number(amount) || 0;
  const remaining = budgetAmount - spentAmount;

  const isSurplus = spentAmount < 0;
  const absSpent = Math.abs(spentAmount);
  const rawPercentage = budgetAmount > 0 ? (spentAmount / budgetAmount) * 100 : 0;
  const progressWidth = isSurplus ? 0 : Math.min(Math.max(rawPercentage, 0), 100);

  const getSpentTextColor = () => {
    if (isSurplus || rawPercentage < 45) {
      return "text-emerald-600 dark:text-emerald-400";
    }
    if (rawPercentage >= 45 && rawPercentage < 85) {
      return "text-amber-500 dark:text-amber-400";
    }
    return "text-destructive";
  };

  const isNearOrOverLimit = rawPercentage >= 85 && !isSurplus;
  const progressBgColor = isNearOrOverLimit ? "#ef4444" : categoryColor;

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(val);

  // Handle Confirmed Delete Action with 2.0s Minimum Loader Duration
  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleting(true);

    const formData = new FormData();
    formData.append("id", String(budget.id));

    // Guarantee minimum duration of 2000ms (2 seconds)
    const timerPromise = new Promise((resolve) => setTimeout(resolve, 2000));
    const deletePromise = deleteBudget(formData);

    const [_, result] = await Promise.all([timerPromise, deletePromise]);

    if (result?.success) {
      toast.success(`${budget.name} deleted successfully!`);
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
          className="card cursor-pointer shadow-xs rounded-2xl border border-border bg-card p-4 text-card-foreground transition-all hover:shadow-md space-y-3"
          onClick={(e) => {
            e.stopPropagation();
            if (!showDeleteConfirm) {
              setIsMenuOpen((prev) => !prev);
            }
          }}
        >
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

          {/* Progress Bar */}
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

        {/* Dropdown Menu Options */}
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
              Edit Budget
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
                  Delete &quot;{budget.name}&quot;?
                </h4>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  This will also permanently remove all linked budget transactions.
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
        <UpdateBudgetsModal
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          budget={budget}
          categoryOption={categoryOption}
        />
      )}
    </>
  );
}
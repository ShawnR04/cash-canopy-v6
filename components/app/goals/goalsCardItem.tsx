"use client";

import { updateGoalStatus, deleteGoal } from "@/app/actions/goals";
import { useState, useTransition, useEffect, useRef } from "react";
import UpdateGoalsModal from "./updateGoalsModal";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Goal {
  id: number;
  name: string;
  targetAmount: string;
  currentAmount: string;
  currency: string;
  status: string;
  targetDate: Date;
}

export type GoalStatus = "active" | "achieved" | "paused";

export default function GoalsCardItem({ goal }: { goal: Goal }) {
  const [isPending, startTransition] = useTransition();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Delete Action
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const formData = new FormData();
    formData.append("id", String(goal.id));
    setIsDeleting(true);

    const result = await deleteGoal(formData);
    if (result?.success) {
      toast.success(`${goal.name} deleted successfully!`);
      setIsMenuOpen(false);
      setIsDeleting(false);
    } else {
      toast.error(result?.error || "Failed to delete goal.");
      setIsDeleting(false);
    }
  };

  // 1. Progress Metrics
  const targetAmount = parseFloat(goal.targetAmount) || 0;
  const currentAmount = parseFloat(goal.currentAmount) || 0;
  const progress = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;

  // 2. Auto-detect target reached state
  const isTargetReached = targetAmount > 0 && currentAmount >= targetAmount;

  // 3. Derive effective status
  const effectiveStatus: GoalStatus = isTargetReached
    ? "achieved"
    : ((goal.status?.toLowerCase() as GoalStatus) || "active");

  const statusStyles: Record<GoalStatus, string> = {
    active: "bg-blue-500/10 text-primary border-blue-200 hover:bg-blue-500/20",
    achieved: "bg-emerald-500/10 text-success border-emerald-200 hover:bg-emerald-500/20",
    paused: "bg-amber-500/10 text-warning border-amber-200 hover:bg-amber-500/20",
  };

  const progressBarStyles: Record<GoalStatus, string> = {
    active: "bg-primary",
    achieved: "bg-success",
    paused: "bg-warning",
  };

  const daysLeftStyles: Record<GoalStatus, string> = {
    achieved: "text-success",
    active: "text-primary",
    paused: "text-warning",
  };

  const handleStatusToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isTargetReached) return;

    const nextStatus: GoalStatus = effectiveStatus === "paused" ? "active" : "paused";

    startTransition(async () => {
      try {
        await updateGoalStatus(goal.id, nextStatus);
      } catch (error) {
        console.error("Failed to update status on server", error);
      }
    });
  };

  let dateObject: Date | null = null;
  let daysLeftDisplay = "N/A";

  if (goal.targetDate) {
    const rawDate = new Date(goal.targetDate);
    if (!isNaN(rawDate.getTime())) {
      const targetYear = rawDate.getUTCFullYear();
      const targetMonth = rawDate.getUTCMonth();
      const targetDate = rawDate.getUTCDate();
      dateObject = new Date(targetYear, targetMonth, targetDate);

      const today = new Date();
      const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const diffInMs = dateObject.getTime() - current.getTime();
      const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInDays > 0) daysLeftDisplay = `${diffInDays} days left`;
      else if (diffInDays === 0) daysLeftDisplay = "Today";
      else daysLeftDisplay = "Overdue";
    }
  }

  const formattedDate =
    dateObject && !isNaN(dateObject.getTime())
      ? dateObject.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "N/A";

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    CAD: "$",
    AUD: "$",
    "$": "$",
  };

  const sign = currencySymbols[goal.currency] || "$";

  const getDaysLeftColor = () => {
    if (daysLeftDisplay === "Overdue" || daysLeftDisplay === "N/A") {
      return "text-destructive";
    }
    if (daysLeftDisplay === "Today") {
      return "text-success";
    }
    return daysLeftStyles[effectiveStatus] || daysLeftStyles.active;
  };

  return (
    <>
      <div className="relative h-full" ref={menuRef}>
        <div
          className="card cursor-pointer h-full flex flex-col justify-between"
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen((prev) => !prev);
          }}
        >
          {/* Top Section */}
          <div className="flex gap-2 items-start justify-between">
            <div className="w-1/2">
              <h1 className="text-lg font-semibold tracking-tight capitalize line-clamp-2">
                {goal.name}
              </h1>
              <p className="text-[12px] text-muted-foreground mt-0.5">
                Target: {sign}{targetAmount.toFixed(2)}
              </p>
            </div>
            <div className="w-1/2 flex flex-col gap-1.5 items-end justify-start">
              <button
                onClick={handleStatusToggle}
                disabled={isPending || isTargetReached}
                className={`px-2.5 py-0.5 text-xs font-medium rounded-full border transition-all capitalize ${
                  statusStyles[effectiveStatus] || statusStyles.active
                } ${isPending ? "opacity-70 cursor-wait" : ""}`}
              >
                {effectiveStatus}
              </button>
              <h1 className={`text-sm font-medium ${getDaysLeftColor()}`}>
                {daysLeftDisplay}
              </h1>
            </div>
          </div>

          {/* Middle & Bottom Section */}
          <div className="mt-4 space-y-2">
            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ease-out rounded-full ${
                  progressBarStyles[effectiveStatus] || progressBarStyles.active
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex gap-2 items-end justify-between pt-1">
              <div className="w-1/2">
                <h1 className="font-medium text-[14px]">
                  Saved: {sign}{currentAmount.toFixed(2)}
                </h1>
                <p className="text-[14px] text-muted-foreground">
                  ({progress.toFixed(0)}%)
                </p>
              </div>
              <p className="w-1/2 text-[14px] text-muted-foreground flex items-center justify-end">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>

        {/* Dropdown Menu Overlay */}
        {isMenuOpen && (
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
              Edit Goal
            </button>

            <button
              type="button"
              disabled={isDeleting}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors cursor-pointer disabled:opacity-50"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <UpdateGoalsModal
          key={`${goal.id}-${goal.currentAmount}-${goal.targetAmount}`}
          isOpen={isModalOpen}
          setIsOpen={setIsModalOpen}
          goal={goal}
        />
      )}
    </>
  );
}
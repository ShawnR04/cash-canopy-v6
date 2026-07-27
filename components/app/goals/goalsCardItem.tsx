"use client";

import { updateGoalStatus } from "@/app/actions/goals";
import { useState, useTransition } from "react";
import UpdateGoalsModal from "./updateGoalsModal";

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
  const [isOpen, setIsOpen] = useState(false);

  // 1. Progress Metrics
  const targetAmount = parseFloat(goal.targetAmount) || 0;
  const currentAmount = parseFloat(goal.currentAmount) || 0;
  const progress = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;

  // 2. Auto-detect target reached state
  const isTargetReached = targetAmount > 0 && currentAmount >= targetAmount;

  // 3. Directly derive status during render (No local useState for status!)
  // If target reached, it MUST be "achieved". Otherwise, fall back to DB status or "active".
  const effectiveStatus: GoalStatus = isTargetReached
    ? "achieved"
    : ((goal.status?.toLowerCase() as GoalStatus) || "active");

  // Color & Badge configuration for UI
  const statusStyles: Record<GoalStatus, string> = {
    active: "bg-blue-500/10 text-primary border-blue-200 hover:bg-blue-500/20",
    achieved: "bg-emerald-500/10 text-success border-emerald-200 hover:bg-emerald-500/20",
    paused: "bg-amber-500/10 text-warning border-amber-200 hover:bg-amber-500/20",
  };

  // Dynamic progress bar colors
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

  // Status Toggle (Only toggles active <-> paused if goal isn't achieved)
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
      <div className="card cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex gap-2">
          <div className="w-1/2">
            <h1 className="text-lg font-semibold tracking-tight capitalize">
              {goal.name}
            </h1>
            <p className="text-[12px] text-muted-foreground">
              Target: {sign}{targetAmount.toFixed(2)}
            </p>
          </div>
          <div className="w-1/2 flex flex-col gap-2 items-end justify-center">
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

        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden my-2">
          <div
            className={`h-full transition-all duration-300 ease-out rounded-full ${
              progressBarStyles[effectiveStatus] || progressBarStyles.active
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex gap-2">
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

      {isOpen && (
        <UpdateGoalsModal
          key={`${goal.id}-${goal.currentAmount}-${goal.targetAmount}`}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          goal={goal}
        />
      )}
    </>
  );
}
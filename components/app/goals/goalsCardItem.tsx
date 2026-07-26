"use client"

import { updateGoalStatus } from "@/app/actions/goals";
import { useState, useTransition } from "react";
import UpdateGoalsModal from "./updateGoalsModal";

interface Goal {
    id: number;
    name: string;
    targetAmount: string;
    currentAmount: string;
    currency: string;
    status: string
    targetDate: Date;
}

export type GoalStatus = "active" | "achieved" | "paused"

export default function GoalsCardItem({ goal }: { goal: Goal }){
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    //Progress Metrics
    const targetAmount = parseFloat(goal.targetAmount) || 0;
    const currentAmount = parseFloat(goal.currentAmount) || 0;
    const progress = Math.min((currentAmount / targetAmount) * 100, 100);

    //Auto detects if target amount has been reached
    const isTargetReached = targetAmount > 0 && currentAmount >= targetAmount;

    //Local status state
    const initialStatus = isTargetReached
    ? "achieved"
    : ((goal.status?.toLowerCase() as GoalStatus) || "active");

    const [status, setStatus] = useState<GoalStatus>(initialStatus);

    // Color & Badge configuration for UI
    const statusStyles: Record<GoalStatus, string> = {
      active: "bg-blue-500/10 text-primary border-blue-200 hover:bg-blue-500/20",
      achieved: "bg-emerald-500/10 text-success border-emerald-200 hover:bg-emerald-500/20",
      paused: "bg-amber-500/10 text-warning border-amber-200 hover:bg-amber-500/20",
    };

    //Status Toggle
    const handleStatusToggle = ((e: React.MouseEvent<HTMLButtonElement>) => {
        // Prevent the event from bubbling up to the card container
        e.stopPropagation();

        if(isTargetReached) return;

        const previousStatus = status;
        const nextStatus: GoalStatus = status === "paused" ? "active" : "paused"

        setStatus(nextStatus);

        startTransition(async () => {
            try{
                await updateGoalStatus(goal.id,nextStatus);
            }catch(error){
                console.error("Failed to update status on server", error)
                setStatus(previousStatus)
            }
        })
    })

    //Dynamin progress bar colors
    const progressBarStyles: Record<GoalStatus, string> = {
        active:"bg-primary",
        achieved: "bg-success",
        paused: "bg-warning"
    }

    const daysLeftStyles: Record<GoalStatus, string> = {
        achieved: "text-success",
        active: "text-primary",
        paused: "text-warning"
    }

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

    const formattedDate = dateObject && !isNaN(dateObject.getTime())
        ? dateObject.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "N/A";

    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      CAD: "$",
      AUD: "$",
      "$": "$",
    };

    // Now TypeScript allows indexing with any string
    const sign = currencySymbols[goal.currency] || "$";

    // Determine the days-left text color
    const getDaysLeftColor = () => {
      if (daysLeftDisplay === "Overdue" || daysLeftDisplay === "N/A") {
        return "text-destructive";
      }
      if (daysLeftDisplay === "Today") {
        return "text-success";
      }
      return daysLeftStyles[status] || daysLeftStyles.active;
    };
    return(
        <>
        <div 
            className="card"
            onClick={() => setIsOpen(!isOpen)}
        >
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
                      disabled={isPending}
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full border transition-all capitalize ${
                        statusStyles[status] || statusStyles.active
                      } ${isPending ? "opacity-70 cursor-wait" : ""}`}
                    >
                      {status}
                    </button>
                    <h1 className={`text-sm font-medium ${getDaysLeftColor()}`}>
                        {daysLeftDisplay}
                    </h1>
                </div>
            </div>

            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div 
                    className={`bg-primary h-full transition-all duration-300 ease-out rounded-full ${
                        progressBarStyles[status] || progressBarStyles.active
                    }`} 
                    style={{ width: `${progress}%` }} 
                />
            </div>

            <div className="flex gap-2">
                <div className="w-1/2">
                    <h1 className="font-medium text-[14px]">
                        Saved: ${currentAmount.toFixed(2)}
                    </h1>
                    <p className="text-[14px] text-muted-foreground">
                        ({progress.toFixed(0)}%)
                    </p>
                </div>
                <p className="w-1/2 text-[14px] text-muted-foreground flex items-center justify-end">{formattedDate}</p>
            </div>
        </div>

        {isOpen && (
            <UpdateGoalsModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                goal={goal}
            />
        )}
        </>
    );
}
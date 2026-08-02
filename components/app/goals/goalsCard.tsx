"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import GoalsCardItem, { GoalStatus } from "./goalsCardItem";

interface Goal {
  id: number;
  name: string;
  targetAmount: string;
  currentAmount: string;
  currency: string;
  status: string;
  targetDate: Date;
}

interface GoalsCardProps {
  goals: Goal[];
}

export default function GoalsCard({ goals = [] }: GoalsCardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | GoalStatus>("all");

  // Filter and sort goals dynamically based on search and status tabs
  const filteredGoals = useMemo(() => {
    if (!goals || goals.length === 0) return [];

    return [...goals]
      .filter((goal) => {
        // 1. Search Query Filter (Matches Goal Name)
        const matchesSearch = goal.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim());

        // 2. Status Filter
        const goalStatus = goal.status?.toLowerCase() as GoalStatus;
        const matchesStatus =
          statusFilter === "all" ? true : goalStatus === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => Number(b.id) - Number(a.id)); // Most recent first
  }, [goals, searchQuery, statusFilter]);

  return (
    <div className="space-y-4 w-full">
      {/* ================= CONTROLS BAR ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-[#0a0f1d] text-xs text-foreground placeholder:text-muted-foreground rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Status Filter Badges */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0a0f1d] border border-border rounded-xl w-full sm:w-auto overflow-x-auto">
          {(["all", "active", "achieved", "paused"] as const).map((status) => {
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {status}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= GOALS GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 flex-1 overflow-y-auto no-scrollbar content-start">
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal) => (
            <GoalsCardItem key={goal.id} goal={goal} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-xs text-muted-foreground bg-[#0a0f1d] border border-border rounded-2xl">
            {searchQuery || statusFilter !== "all"
              ? "No goals match your search or filter criteria."
              : "No goals found. Click 'Add Goal' to create one!"}
          </div>
        )}
      </div>
    </div>
  );
}
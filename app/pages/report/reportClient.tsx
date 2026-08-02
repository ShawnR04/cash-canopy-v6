"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ShoppingBag } from "lucide-react";
import { DynamicIcon } from "@/lib/dynamicIcon";

interface TimelineItem {
  month: string;
  income: number;
  expense: number;
}

interface ExpenseItem {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  amount: number;
}

interface CategoryBreakdownItem {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  amount: number;
  percentage: string;
}

interface ReportsChartsProps {
  timelineData: TimelineItem[];
  topExpenses: ExpenseItem[];
  categoryBreakdown: CategoryBreakdownItem[];
}

// Custom Tooltip defined outside render to prevent re-render issues
const CustomAreaTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0e1626]/95 border border-zinc-700/80 backdrop-blur-md p-3 rounded-xl shadow-2xl text-xs space-y-2 min-w-[140px]">
        <p className="font-bold text-zinc-200 border-b border-zinc-800 pb-1">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-zinc-400 capitalize">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-zinc-100">${Number(entry.value).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// Helper renderer for dynamic icons & emojis
const renderIcon = (iconName?: string | null) => {
  if (!iconName) return <ShoppingBag className="w-4 h-4" />;
  if (/\p{Extended_Pictographic}/u.test(iconName)) {
    return <span className="text-xs leading-none">{iconName}</span>;
  }
  const formattedName = iconName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return <DynamicIcon name={formattedName} className="w-4 h-4" />;
};

export default function ReportsCharts({
  timelineData = [],
  topExpenses = [],
  categoryBreakdown = [],
}: ReportsChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Prevent SSR hydration mismatches with Recharts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div className="h-80 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-64">
          <div className="bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl animate-pulse" />
          <div className="bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= ANNUAL TIMELINE CURVE AREA CHART ================= */}
      <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl shadow-xl space-y-4">
        {/* Chart Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/60 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">Financial Performance</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Monthly breakdown of income vs expenses</p>
          </div>

          {/* Legend Indicators */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-zinc-300 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-zinc-300 font-medium">Expenses</span>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-72 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />

              <XAxis
                dataKey="month"
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: "#27272a" }}
              />
              <YAxis
                stroke="#71717a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `$${val}`}
              />

              <Tooltip content={<CustomAreaTooltip />} />

              {/* Income Area */}
              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10b981"
                strokeWidth={2.5}
                fill="url(#incomeGradient)"
              />

              {/* Expense Area */}
              <Area
                type="monotone"
                dataKey="expense"
                name="Expenses"
                stroke="#ef4444"
                strokeWidth={2.5}
                fill="url(#expenseGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= TOP EXPENSES & CATEGORY BREAKDOWN GRID ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Expenses Card */}
        <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex flex-col justify-between shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <h3 className="text-sm font-semibold text-zinc-100">Top Expenses</h3>
            <span className="text-[11px] text-zinc-400 font-medium">Largest transactions</span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
            {topExpenses.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No recorded expenses.</p>
            ) : (
              topExpenses.map((item) => {
                const itemColor = item.color || "#ef4444";

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2.5 bg-[#0e1626]/80 border border-zinc-800/60 rounded-xl hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                        style={{
                          backgroundColor: `${itemColor}20`,
                          color: itemColor,
                        }}
                      >
                        {renderIcon(item.icon)}
                      </div>
                      <span className="text-xs font-semibold text-zinc-200 truncate">
                        {item.name}
                      </span>
                    </div>

                    <span className="text-xs font-bold text-rose-500 shrink-0 ml-2">
                      -${item.amount.toFixed(2)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex flex-col justify-between shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
            <h3 className="text-sm font-semibold text-zinc-100">Category Breakdown</h3>
            <span className="text-[11px] text-zinc-400 font-medium">Share of total</span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-zinc-500 py-6 text-center">No category data.</p>
            ) : (
              categoryBreakdown.map((cat) => {
                const catColor = cat.color || "#3b82f6";
                const numPercentage = parseFloat(cat.percentage) || 0;

                return (
                  <div
                    key={cat.id}
                    className="p-2.5 bg-[#0e1626]/80 border border-zinc-800/60 rounded-xl space-y-1.5 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold"
                          style={{
                            backgroundColor: `${catColor}20`,
                            color: catColor,
                          }}
                        >
                          {renderIcon(cat.icon)}
                        </div>
                        <span className="font-semibold text-zinc-200 truncate">
                          {cat.name}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-zinc-100">
                          ${cat.amount.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-zinc-400 ml-1.5 font-medium">
                          ({cat.percentage})
                        </span>
                      </div>
                    </div>

                    {/* Progress Indicator Bar */}
                    <div className="w-full bg-zinc-800/60 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(numPercentage, 100)}%`,
                          backgroundColor: catColor,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
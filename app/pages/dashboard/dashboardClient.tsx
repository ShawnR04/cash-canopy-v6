"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Folder, PieChart as BudgetIcon, Target, HelpCircle } from "lucide-react";
import { DynamicIcon } from "@/lib/dynamicIcon";

export interface SpendingItem {
  id: string;
  name: string;
  type: "category" | "budget" | "goal" | "uncategorized";
  icon?: string;
  color: string;
  amount: number;
  percentage: string;
}

interface DashboardChartsProps {
  categoryBreakdown: SpendingItem[];
  totalExpenses: number;
  totalIncome: number;
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0e1626]/95 border border-zinc-700/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-2xl text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-white">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
          {data.name}
          <span className="text-[10px] text-zinc-400 capitalize">({data.type})</span>
        </div>
        <div className="text-white font-bold">
          ${data.amount?.toFixed(2)}{" "}
          <span className="text-[10px] font-normal text-zinc-300">({data.percentage})</span>
        </div>
      </div>
    );
  }
  return null;
};

const renderCategoryIcon = (item: SpendingItem) => {
  if (item.type === "budget") return <BudgetIcon className="w-3.5 h-3.5" />;
  if (item.type === "goal") return <Target className="w-3.5 h-3.5" />;
  if (item.type === "uncategorized" || !item.icon) return <HelpCircle className="w-3.5 h-3.5" />;

  if (/\p{Extended_Pictographic}/u.test(item.icon)) {
    return <span className="text-xs leading-none">{item.icon}</span>;
  }
  const formattedName = item.icon.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return <DynamicIcon name={formattedName} className="w-3.5 h-3.5" />;
};

export default function DashboardCharts({
  categoryBreakdown,
  totalExpenses,
  totalIncome,
}: DashboardChartsProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "category" | "budget" | "goal">("all");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const overviewData = [
    { name: "Income", amount: totalIncome, color: "#10b981" },
    { name: "Expenses", amount: totalExpenses, color: "#f43f5e" },
  ];

  const filteredBreakdown = categoryBreakdown.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-64">
        <div className="bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl animate-pulse" />
        <div className="bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SPENDING BREAKDOWN CARD */}
      <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
        
        {/* Header & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800/60 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Spending Breakdown</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Distribution across categories, budgets & goals</p>
          </div>

          <div className="flex items-center gap-1 bg-[#0e1626] p-1 rounded-lg border border-zinc-800/80 self-start sm:self-auto">
            {(["all", "category", "budget", "goal"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2 py-0.5 text-[10px] font-semibold rounded-md capitalize transition-colors ${
                  activeTab === tab
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-12 items-center gap-4 my-4">
          
          {/* Donut Chart */}
          <div className="sm:col-span-5 h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={
                    filteredBreakdown.length > 0
                      ? filteredBreakdown
                      : [{ name: "None", amount: 1, color: "#27272a", percentage: "0%", type: "uncategorized" }]
                  }
                  innerRadius={62}
                  outerRadius={82}
                  paddingAngle={4}
                  dataKey="amount"
                  stroke="transparent"
                >
                  {filteredBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Donut Center Overlay */}
            <div className="absolute text-center pointer-events-none flex flex-col items-center">
              <span className="text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">
                Expenses
              </span>
              <span className="text-base font-extrabold text-white mt-0.5">
                ${totalExpenses.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Progress Item List */}
          <div className="sm:col-span-7 flex flex-col gap-2.5 max-h-52 overflow-y-auto pr-1">
            {filteredBreakdown.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-6">No spending records found.</p>
            ) : (
              filteredBreakdown.map((item) => {
                const numPercentage = parseFloat(item.percentage) || 0;

                return (
                  <div
                    key={item.id}
                    className="p-2.5 bg-[#0e1626]/80 border border-zinc-800/60 rounded-xl space-y-1.5 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0"
                          style={{
                            backgroundColor: `${item.color}20`,
                            color: item.color,
                          }}
                        >
                          {renderCategoryIcon(item)}
                        </span>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-white truncate max-w-[100px]">
                            {item.name}
                          </span>
                          <span className="text-[9px] text-zinc-400 uppercase tracking-wide">
                            {item.type}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-white">
                          ${item.amount.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-zinc-400 ml-1.5 font-medium">
                          {item.percentage}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-800/60 h-1 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(numPercentage, 100)}%`,
                          backgroundColor: item.color,
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

      {/* TOTAL OVERVIEW BAR CHART */}
      <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Total Overview</h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Compare overall income vs expenses</p>
          </div>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
            Net: +${(totalIncome - totalExpenses).toFixed(2)}
          </span>
        </div>

        <div className="h-52 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overviewData} barSize={50}>
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} />
              <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                contentStyle={{
                  backgroundColor: "#0e1626",
                  borderColor: "#27272a",
                  borderRadius: "12px",
                  color: "#ffffff",
                }}
                itemStyle={{ color: "#008cea" }}
                labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
              />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {overviewData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
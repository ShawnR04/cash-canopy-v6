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
import { Folder } from "lucide-react";
import { DynamicIcon } from "@/lib/dynamicIcon";

interface CategoryItem {
  id: number;
  name: string;
  icon?: string;
  color: string;
  amount: number;
  percentage: string;
}

interface DashboardChartsProps {
  categoryBreakdown: CategoryItem[];
  totalExpenses: number;
  totalIncome: number;
}

// Custom Tooltip for Pie Chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0e1626]/95 border border-zinc-700/80 backdrop-blur-md px-3 py-2 rounded-xl shadow-2xl text-xs space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-white">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
          {data.name}
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

// Helper for rendering dynamic icons inside legend pills
const renderCategoryIcon = (iconName?: string | null) => {
  if (!iconName) return <Folder className="w-3.5 h-3.5" />;
  if (/\p{Extended_Pictographic}/u.test(iconName)) {
    return <span className="text-xs leading-none">{iconName}</span>;
  }
  const formattedName = iconName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  return <DynamicIcon name={formattedName} className="w-3.5 h-3.5" />;
};

export default function DashboardCharts({
  categoryBreakdown,
  totalExpenses,
  totalIncome,
}: DashboardChartsProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const overviewData = [
    { name: "Income", amount: totalIncome, color: "#10b981" },
    { name: "Expenses", amount: totalExpenses, color: "#f43f5e" },
  ];

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
      
      {/* SPENDING BY CATEGORY CARD */}
      <div className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex flex-col justify-between shadow-xl relative overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">Spending by Category</h3>
            <p className="text-[11px] text-foreground mt-0.5">Distribution across active categories</p>
          </div>
          <span className="text-xs font-bold text-sky-400 bg-sky-950/40 border border-sky-800/40 px-2.5 py-1 rounded-full">
            {categoryBreakdown.length} Categories
          </span>
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
                    categoryBreakdown.length > 0 
                      ? categoryBreakdown 
                      : [{ name: "None", amount: 1, color: "#27272a", percentage: "0%" }]
                  }
                  innerRadius={62}
                  outerRadius={82}
                  paddingAngle={4}
                  dataKey="amount"
                  stroke="transparent"
                >
                  {categoryBreakdown.map((entry, index) => (
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
              <span className="text-[10px] text-foreground font-semibold tracking-wider uppercase">
                Expenses
              </span>
              <span className="text-base font-extrabold text-foreground mt-0.5">
                ${totalExpenses.toFixed(0)}
              </span>
            </div>
          </div>

          {/* Category Progress List */}
          <div className="sm:col-span-7 flex flex-col gap-2.5 max-h-52 overflow-y-auto pr-1">
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-foreground text-center py-6">No spending data available.</p>
            ) : (
              categoryBreakdown.map((cat) => {
                const numPercentage = parseFloat(cat.percentage) || 0;

                return (
                  <div
                    key={cat.id}
                    className="p-2.5 bg-[#0e1626]/80 border border-zinc-800/60 rounded-xl space-y-1.5 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span 
                          className="w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0"
                          style={{ 
                            backgroundColor: `${cat.color}20`,
                            color: cat.color 
                          }}
                        >
                          {renderCategoryIcon(cat.icon)}
                        </span>
                        <span className="font-semibold text-foreground truncate max-w-[100px]">
                          {cat.name}
                        </span>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-foreground">
                          ${cat.amount.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-foreground ml-1.5 font-medium">
                          {cat.percentage}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-zinc-800/60 h-1 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${Math.min(numPercentage, 100)}%`,
                          backgroundColor: cat.color
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
            <p className="text-[11px] text-foreground mt-0.5">Compare overall income vs expenses</p>
          </div>
          <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-800/40">
            Net: +${(totalIncome - totalExpenses).toFixed(2)}
          </span>
        </div>

        <div className="h-52 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overviewData} barSize={50}>
              <XAxis dataKey="name" stroke="currentColor" className="text-foreground" fontSize={11} tickLine={false} />
              <YAxis stroke="currentColor" className="text-foreground" fontSize={11} tickLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(255, 255, 255, 0.03)" }}
                contentStyle={{ 
                  backgroundColor: "#0e1626", 
                  borderColor: "#27272a", 
                  borderRadius: "12px",
                  color: "#ffffff"
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
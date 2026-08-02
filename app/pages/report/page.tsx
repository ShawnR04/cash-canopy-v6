import React from "react";
import * as LucideIcons from "lucide-react";
import { getReportsData } from "@/app/actions/report";
import ReportsCharts from "./reportClient";


export default async function ReportsPage() {
  const data = await getReportsData();

  if (!data) {
    return (
      <div className="p-8 text-center text-zinc-400 bg-[#06090e] min-h-screen">
        Failed to load report data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06090e] text-zinc-100 p-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Financial Reports</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Annual spending, income trends, and category distribution.
          </p>
        </div>

        <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0e1626] border border-cyan-500/30 text-cyan-400 text-xs font-medium hover:bg-cyan-950/30 transition-all">
          <LucideIcons.UserCheck className="w-3.5 h-3.5" />
          <span>Switch account</span>
        </button>
      </div>

      {/* Dynamic Report Charts */}
      <ReportsCharts
        timelineData={data.timelineData}
        topExpenses={data.topExpenses}
        categoryBreakdown={data.categoryBreakdown}
      />

    </div>
  );
}
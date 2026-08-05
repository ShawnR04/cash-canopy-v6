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
    <div className="h-full overflow-y-auto no-scrollbar">
      
      {/* Top Header */}
      <div className="open-modal-background">
        <h1 className="open-modal-heading">
          Financial Report
        </h1>
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
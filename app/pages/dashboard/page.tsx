import React from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  PiggyBank, 
  Folder,
  Target
} from "lucide-react";
import { DynamicIcon } from "@/lib/dynamicIcon";
import { getDashboardMetrics } from "@/app/actions/dashboard";
import DashboardCharts from "./dashboardClient";

export default async function DashboardPage() {
  const data = await getDashboardMetrics();

  if (!data) {
    return (
      <div className="p-8 text-center text-zinc-400 bg-[#06090e] min-h-screen">
        Failed to load dashboard metrics.
      </div>
    );
  }

  const { metrics, categoryBreakdown, recentTransactions, categories, budgets, goals } = data;

  // Helper for dynamic icon rendering
  const renderCategoryIcon = (iconName?: string | null) => {
    if (!iconName) return <Folder className="w-3.5 h-3.5" />;
    if (/\p{Extended_Pictographic}/u.test(iconName)) {
      return <span className="text-xs leading-none">{iconName}</span>;
    }
    const formattedName = iconName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    return <DynamicIcon name={formattedName} className="w-3.5 h-3.5" />;
  };

  // Helper to resolve Classification (Category / Budget / Goal)
  const getClassification = (tx: any) => {
    if (tx.category && tx.category.name) {
      return {
        name: tx.category.name,
        icon: renderCategoryIcon(tx.category.icon),
        color: tx.category.color || '#14b8a6',
      };
    }
    if (tx.budget && tx.budget.name) {
      return {
        name: tx.budget.name,
        icon: <PiggyBank className="w-3.5 h-3.5" />,
        color: tx.budget.color || '#3b82f6',
      };
    }
    if (tx.goal && tx.goal.name) {
      return {
        name: tx.goal.name,
        icon: <Target className="w-3.5 h-3.5" />,
        color: tx.goal.color || '#8b5cf6',
      };
    }
    return {
      name: 'Uncategorized',
      icon: <Folder className="w-3.5 h-3.5" />,
      color: '#64748b',
    };
  };

  return (
    <div className="min-h-screen bg-[#06090e] text-zinc-100 p-6 space-y-6">
      
      {/* Top Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Total Balance</p>
            <h3 className="text-2xl font-bold text-[#00a3ff] mt-1">${metrics.totalBalance.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-cyan-950/40 rounded-xl text-[#00a3ff]">
            <Wallet className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Total Income</p>
            <h3 className="text-2xl font-bold text-emerald-400 mt-1">${metrics.totalIncome.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-emerald-950/30 rounded-xl text-emerald-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Total Expenses</p>
            <h3 className="text-2xl font-bold text-rose-500 mt-1">${metrics.totalExpenses.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-rose-950/30 rounded-xl text-rose-500">
            <ArrowDownRight className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-zinc-400">Savings Rate</p>
            <h3 className="text-2xl font-bold text-zinc-100 mt-1">{metrics.savingsRate}%</h3>
          </div>
          <div className="p-3 bg-indigo-950/30 rounded-xl text-indigo-400">
            <PiggyBank className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recharts Analytics */}
      <DashboardCharts
        categoryBreakdown={categoryBreakdown}
        totalExpenses={metrics.totalExpenses}
        totalIncome={metrics.totalIncome}
      />

      {/* Database Budgets and Goals Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Active Budgets from DB */}
        <div className="bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-sky-400" /> Active Budgets
            </h3>
            <span className="text-xs text-zinc-400">{budgets.length} Active</span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto">
            {budgets.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4">No budgets set in database.</p>
            ) : (
              budgets.map((b) => (
                <div key={b.id} className="p-3 bg-[#0e1626] rounded-xl border border-zinc-800/60 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-200">{b.name}</span>
                    <span className="text-zinc-400">
                      ${b.spent.toFixed(2)} / <span className="text-zinc-100">${b.limit.toFixed(2)}</span>
                    </span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        b.percentageSpent > 90 ? 'bg-rose-500' : 'bg-sky-400'
                      }`}
                      style={{ width: `${b.percentageSpent}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Active Goals from DB */}
        <div className="bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" /> Financial Goals
            </h3>
            <span className="text-xs text-zinc-400">{goals.length} Tracked</span>
          </div>

          <div className="space-y-3 max-h-56 overflow-y-auto">
            {goals.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-4">No goals recorded in database.</p>
            ) : (
              goals.map((g) => (
                <div key={g.id} className="p-3 bg-[#0e1626] rounded-xl border border-zinc-800/60 space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-zinc-200">{g.name}</span>
                    <span className="text-purple-400 font-bold">{g.progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${g.progressPercentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Recent Transactions Table */}
      <div className="bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-zinc-800/80">
          <h3 className="text-sm font-semibold text-zinc-100">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0e1626] text-cyan-400 font-bold uppercase tracking-wider border-b border-zinc-800/80">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Classification</th>
                <th className="p-4">Type</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50 text-zinc-200">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-zinc-500">
                    No transactions found in database.
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => {
                  const classification = getClassification(tx);
                  const isIncome = tx.type === "Income";

                  return (
                    <tr key={tx.id} className="hover:bg-[#0e1626]/40 transition-colors">
                      <td className="p-4 text-zinc-400 font-medium">
                        {new Date(tx.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-4 font-semibold text-zinc-100 max-w-[180px] truncate">
                        {tx.description}
                      </td>

                      {/* Dynamic Classification Badge (Category, Budget, or Goal) */}
                      <td className="p-4">
                        <span 
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `${classification.color}20`,
                            color: classification.color,
                          }}
                        >
                          <span className="shrink-0">{classification.icon}</span>
                          <span className="truncate max-w-[110px]">{classification.name}</span>
                        </span>
                      </td>

                      <td className={`p-4 font-semibold ${isIncome ? "text-emerald-400" : "text-rose-500"}`}>
                        {tx.type}
                      </td>
                      <td className={`p-4 font-bold text-right ${isIncome ? "text-emerald-400" : "text-rose-500"}`}>
                        {isIncome ? "+" : "-"}${Number(tx.amount).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
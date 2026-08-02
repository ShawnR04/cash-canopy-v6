"use client";

import React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CreditCard,
  Tag,
  Target,
  Wallet,
} from "lucide-react";
import { DynamicIcon } from "@/lib/dynamicIcon";

export interface TransactionItem {
  id: number;
  description: string;
  amount: number | string;
  currency: string;
  type: "Income" | "Expense";
  date: Date | string;
  category?: { id: number; name: string; icon?: string; color?: string } | null;
  budget?: { id: number; name: string } | null;
  goal?: { id: number; name: string } | null;
}

interface TransactionsTableProps {
  transactions?: TransactionItem[];
  isLoading?: boolean;
}

export default function TransactionsTable({
  transactions = [],
  isLoading = false,
}: TransactionsTableProps) {
  if (isLoading) {
    return (
      <div className="w-full bg-white border border-zinc-200/80 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col gap-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-zinc-100 rounded-xl w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!transactions.length) {
    return (
      <div className="w-full bg-white border border-zinc-200/80 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400">
          <CreditCard className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-zinc-900 text-base">No transactions yet</h3>
        <p className="text-sm text-zinc-500 max-w-sm">
          Log a new transaction using the form above to track your spending and income.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white border border-zinc-200/80 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/50 text-zinc-400 uppercase text-[11px] font-bold tracking-wider">
              <th className="py-3.5 px-4">Transaction</th>
              <th className="py-3.5 px-4">Linked To</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            {transactions.map((tx) => {
              const isIncome = tx.type === "Income";
              const formattedDate = new Date(tx.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <tr
                  key={tx.id}
                  className="hover:bg-zinc-50/60 transition-colors group"
                >
                  {/* Description & Icon */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm shrink-0 font-medium ${
                          isIncome
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-zinc-100 text-zinc-600"
                        }`}
                        style={
                          tx.category?.color
                            ? { backgroundColor: tx.category.color, color: "#fff" }
                            : undefined
                        }
                      >
                        {tx.category?.icon ? (
                          <DynamicIcon name={tx.category.icon} className="w-4 h-4" />
                        ) : isIncome ? (
                          <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-rose-600" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 line-clamp-1">
                          {tx.description}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-medium">
                          {tx.type}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Linked Association (Category, Budget, or Goal) */}
                  <td className="py-3.5 px-4">
                    {tx.category ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-100 text-zinc-700">
                        <Tag className="w-3 h-3 text-zinc-400" />
                        {tx.category.name}
                      </span>
                    ) : tx.budget ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        <Wallet className="w-3 h-3 text-blue-500" />
                        {tx.budget.name}
                      </span>
                    ) : tx.goal ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                        <Target className="w-3 h-3 text-purple-500" />
                        {tx.goal.name}
                      </span>
                    ) : (
                      <span className="text-xs text-zinc-400 italic">Unlinked</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      {formattedDate}
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span
                      className={`font-bold text-sm ${
                        isIncome ? "text-emerald-600" : "text-zinc-900"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {tx.currency === "USD" ? "$" : `${tx.currency} `}
                      {Number(tx.amount).toFixed(2)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
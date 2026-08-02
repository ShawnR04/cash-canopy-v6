"use client";

import React, { useState } from "react";
import { Wallet, TrendingUp, DollarSign, X, Edit2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TotalIncomeProps {
  initialTotalIncome?: number;
  initialMonthlyIncome?: number;
  currency?: string;
  onSave?: (data: { totalIncome: number; monthlyIncome: number }) => void;
}

export default function TotalIncome({
  initialTotalIncome = 0,
  initialMonthlyIncome = 0,
  currency = "USD",
  onSave,
}: TotalIncomeProps) {
  const [totalIncome, setTotalIncome] = useState<number>(initialTotalIncome);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(initialMonthlyIncome);
  const [isOpen, setIsOpen] = useState(false);

  // Modal input state
  const [tempTotal, setTempTotal] = useState<string>(String(initialTotalIncome));
  const [tempMonthly, setTempMonthly] = useState<string>(String(initialMonthlyIncome));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    }).format(val);
  };

  const handleOpen = () => {
    setTempTotal(String(totalIncome));
    setTempMonthly(String(monthlyIncome));
    setIsOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newTotal = parseFloat(tempTotal) || 0;
    const newMonthly = parseFloat(tempMonthly) || 0;

    setTotalIncome(newTotal);
    setMonthlyIncome(newMonthly);
    setIsOpen(false);

    if (onSave) {
      onSave({ totalIncome: newTotal, monthlyIncome: newMonthly });
    }
  };

  return (
    <>
      {/* ================= INTERACTIVE INCOME CARD ================= */}
      <div
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleOpen()}
        className="p-5 bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl shadow-xl relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:border-zinc-700 transition-all group"
      >
        {/* Background Accent Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Edit Hint Icon */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg bg-zinc-800/80 text-zinc-300">
          <Edit2 className="w-3.5 h-3.5" />
        </div>

        {/* Left Section: Icon & Main Metrics */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            <Wallet className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Total Earned Income
              </span>
              <span className="text-[10px] text-emerald-400/80 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded-full font-medium">
                Click to edit
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
              {formatCurrency(totalIncome)}
            </div>
          </div>
        </div>

        {/* Right Section: Monthly Breakdown */}
        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-zinc-800/80 pt-3 sm:pt-0 sm:pl-6 relative z-10">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-zinc-400">
              This Month&apos;s Income
            </span>
            <span className="text-sm font-bold text-emerald-400 mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {formatCurrency(monthlyIncome)}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-zinc-400">Currency</span>
            <span className="text-sm font-semibold text-zinc-200 mt-0.5 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
              {currency}
            </span>
          </div>
        </div>
      </div>

      {/* ================= EDIT INCOME MODAL ================= */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0a0f1d] border border-zinc-800/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
              <div>
                <h2 className="text-base font-semibold text-zinc-100">
                  Set Income Amounts
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Update your current monthly and total overall income values.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-zinc-100 p-1 rounded-lg hover:bg-zinc-800/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Inputs */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome" className="text-xs font-medium text-zinc-300">
                  Monthly Income ({currency})
                </Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={tempMonthly}
                  onChange={(e) => setTempMonthly(e.target.value)}
                  className="h-11 bg-[#0e1626] border-zinc-800 text-zinc-100 focus-visible:ring-emerald-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalIncome" className="text-xs font-medium text-zinc-300">
                  Total Earned Income ({currency})
                </Label>
                <Input
                  id="totalIncome"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={tempTotal}
                  onChange={(e) => setTempTotal(e.target.value)}
                  className="h-11 bg-[#0e1626] border-zinc-800 text-zinc-100 focus-visible:ring-emerald-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-1/2 h-11 border-zinc-800 text-zinc-300 hover:bg-zinc-800/50"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-1/2 h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Save Income
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
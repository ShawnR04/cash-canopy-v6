"use client";

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import TransactionsTable, { Transaction } from './transactionsTable';

interface TransactionTableViewProps {
  initialTransactions?: Transaction[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function TransactionTableView({ 
  initialTransactions = [], 
  onEdit, 
  onDelete 
}: TransactionTableViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "Income" | "Expense">("all");

  // Filter transactions dynamically by search query and type
  const filteredTransactions = useMemo(() => {
    if (!initialTransactions || initialTransactions.length === 0) return [];

    return initialTransactions.filter((t) => {
      // Resolve classification name (Category, Budget, or Goal)
      const classificationName = 
        t.category?.name || 
        t.budget?.name || 
        t.goal?.name || 
        "Uncategorized";

      const query = searchQuery.toLowerCase().trim();

      // 1. Search Matches Description, Amount, or Classification
      const matchesSearch =
        t.description.toLowerCase().includes(query) ||
        String(t.amount).includes(query) ||
        classificationName.toLowerCase().includes(query);

      // 2. Type Filter Matches "all", "Income", or "Expense"
      const matchesType =
        typeFilter === "all" ? true : t.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [initialTransactions, searchQuery, typeFilter]);

  if (!initialTransactions || initialTransactions.length === 0) {
    return <div className="col-span-full py-12 text-center text-xs text-muted-foreground bg-[#0a0f1d] border border-border rounded-2xl">
              No transactions found. Click &apos;Add Transaction&apos; to create one!
        </div>
  }

  return (
    <div className="space-y-4 w-full">
      {/* ================= CONTROLS BAR ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions, category, amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 bg-[#0a0f1d] text-xs text-foreground placeholder:text-muted-foreground rounded-xl border border-border focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
        </div>

        {/* Type Filter Badges */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0a0f1d] border border-border rounded-xl w-full sm:w-auto overflow-x-auto">
          {(["all", "Expense", "Income"] as const).map((filter) => {
            const isActive = typeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => setTypeFilter(filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TRANSACTIONS TABLE VIEW ================= */}
      {filteredTransactions.length > 0 ? (
        <TransactionsTable 
          transactions={filteredTransactions} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ) : (
        <div className="col-span-full py-12 text-center text-xs text-muted-foreground bg-[#0a0f1d] border border-border rounded-2xl">
              No transactions found. Click &apos;Add Transaction&apos; to create one!
        </div>
      )}
    </div>
  );
}
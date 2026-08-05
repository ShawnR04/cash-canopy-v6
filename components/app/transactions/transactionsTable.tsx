"use client";

import React, { useState } from 'react';
import { 
  Pencil, 
  Trash2, 
  Folder, 
  PiggyBank, 
  Target,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { DynamicIcon } from '@/lib/dynamicIcon';
import { deleteTransaction } from '@/app/actions/transactions';
import UpdateTransactionModal, { TransactionOption } from './updateTransactions';

export interface Transaction {
  id: number;
  description: string;
  amount: number | string;
  currency: string;
  type: "Income" | "Expense";
  date: Date | string;
  category?: { id: number; name: string; icon?: string | React.ReactNode; color?: string } | null;
  budget?: { id: number; name: string; color?: string } | null;
  goal?: { id: number; name: string; color?: string } | null;
}

interface TransactionsTableProps {
  transactions?: Transaction[];
  options?: TransactionOption;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function TransactionsTable({ transactions = [], options, onEdit, onDelete }: TransactionsTableProps) {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Safe handler for deleting transactions
  const handleDelete = async (id: number, description?: string) => {
    try {
      setDeletingId(id);

      // Execute server action (passes direct numeric ID)
      const res = await deleteTransaction(id);

      if (res.success) {
        toast.success(
          description 
            ? `Deleted "${description}" successfully` 
            : "Transaction deleted successfully"
        );
        onDelete?.(id);
      } else {
        toast.error(res.error || "Failed to delete transaction.");
      }
    } catch (error) {
      console.error("Failed to delete transaction:", error);
      toast.error("An unexpected error occurred while deleting.");
    } finally {
      setDeletingId(null);
    }
  };

  // Safe handler for edit modal triggering
  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    onEdit?.(transaction.id);
  };

  // Format transaction object for UpdateTransactionModal (extract flat IDs)
  const formattedTransactionForModal = editingTransaction ? {
    id: editingTransaction.id,
    description: editingTransaction.description,
    amount: editingTransaction.amount,
    currency: editingTransaction.currency,
    type: editingTransaction.type,
    date: editingTransaction.date,
    categoryId: editingTransaction.category?.id ?? null,
    budgetId: editingTransaction.budget?.id ?? null,
    goalId: editingTransaction.goal?.id ?? null,
  } : null;

  // Safe date formatting
  const formatDate = (dateStr: Date | string) => {
    if (!dateStr) return '';
    const date = typeof dateStr === 'string' ? new Date(dateStr.replace(/-/g, '/')) : new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Safe amount formatting
  const formatAmount = (amount: number | string, type: "Income" | "Expense", currency: string) => {
    const num = Math.abs(Number(amount)).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const prefix = type === 'Income' ? '+' : '-';
    const symbol = currency === 'USD' || !currency ? '$' : currency; 
    return `${prefix}${symbol}${num}`;
  };

  /**
   * Safe Renderer for Dynamic Icons
   */
  const renderDynamicIcon = (icon?: string | React.ReactNode, fallbackIcon: React.ReactNode = <Folder size={14} />) => {
    if (!icon) return fallbackIcon;

    if (typeof icon === 'string') {
      if (/\p{Extended_Pictographic}/u.test(icon)) {
        return <span className="text-xs leading-none">{icon}</span>;
      }

      const formattedName = icon
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase() as any;

      return (
        <DynamicIcon
          name={formattedName} 
        />
      );
    }

    return icon;
  };

  // Classification helper
  const getClassification = (t: Transaction) => {
    if (t.category && t.category.name) {
      return {
        name: t.category.name,
        icon: renderDynamicIcon(t.category.icon, <Folder size={14} />),
        color: t.category.color || '#14b8a6',
      };
    }
    if (t.budget && t.budget.name) {
      return {
        name: t.budget.name,
        icon: renderDynamicIcon(t.category?.icon, <PiggyBank size={14} />),
        color: t.budget.color || '#3b82f6',
      };
    }
    if (t.goal && t.goal.name) {
      return {
        name: t.goal.name,
        icon: renderDynamicIcon(t.category?.icon, <Target size={14} />),
        color: t.goal.color || '#8b5cf6',
      };
    }
    return {
      name: 'Uncategorized',
      icon: <Folder size={14} />,
      color: '#64748b',
    };
  };

  return (
    <>
      <div className="w-full bg-[#030712] text-slate-100 rounded-lg overflow-hidden shadow-xl border border-slate-800">
        
        {/* ================= DESKTOP TABLE VIEW (md and up) ================= */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-sky-400 font-semibold text-sm">
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Classification</th>
                <th className="py-4 px-6">Type</th>
                <th className="py-4 px-6 text-right">Amount</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transactions?.map((t) => {
                const classification = getClassification(t);
                const isDeleting = deletingId === t.id;

                return (
                  <tr key={t.id} className="hover:bg-slate-900/50 transition-colors">
                    {/* Date */}
                    <td className="py-4 px-6 text-sm text-slate-300 font-medium">
                      {formatDate(t.date)}
                    </td>

                    {/* Description */}
                    <td className="py-4 px-6 text-sm font-semibold text-white max-w-[200px] truncate">
                      {t.description}
                    </td>

                    {/* Classification */}
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center gap-2">
                        <span 
                          className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0"
                          style={{
                            backgroundColor: `${classification.color}20`,
                            color: classification.color,
                          }}
                        >
                          {classification.icon}
                        </span>
                        <span className="text-slate-300 max-w-[120px] truncate">
                          {classification.name}
                        </span>
                      </div>
                    </td>

                    {/* Type */}
                    <td className={`py-4 px-6 text-sm font-semibold ${
                      t.type === 'Income' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {t.type}
                    </td>

                    {/* Amount */}
                    <td className={`py-4 px-6 text-sm font-bold text-right ${
                      t.type === 'Income' ? 'text-emerald-400' : 'text-red-500'
                    }`}>
                      {formatAmount(t.amount, t.type, t.currency)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => handleEdit(t)}
                          disabled={isDeleting}
                          className="text-sky-400 hover:text-sky-300 disabled:opacity-50 transition-colors"
                          aria-label="Edit transaction"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id, t.description)}
                          disabled={isDeleting}
                          className="text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors"
                          aria-label="Delete transaction"
                        >
                          {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE LIST VIEW (sm and below) ================= */}
        <div className="block md:hidden divide-y divide-slate-800">
          {transactions?.map((t) => {
            const classification = getClassification(t);
            const isDeleting = deletingId === t.id;

            return (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40">
                <div className="flex flex-col gap-1 pr-2 overflow-hidden">
                  <h4 className="font-bold text-white text-base truncate">
                    {t.description}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{formatDate(t.date)}</span>
                    <span 
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: `${classification.color}20`,
                        color: classification.color,
                      }}
                    >
                      <span className="w-3.5 h-3.5 flex items-center justify-center shrink-0">
                        {classification.icon}
                      </span>
                      <span className="truncate max-w-[100px]">
                        {classification.name}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className={`text-xs font-semibold ${
                      t.type === 'Income' ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {t.type}
                    </div>
                    <div className={`text-sm font-bold ${
                      t.type === 'Income' ? 'text-emerald-400' : 'text-red-500'
                    }`}>
                      {formatAmount(t.amount, t.type, t.currency)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
                    <button 
                      onClick={() => handleEdit(t)} 
                      disabled={isDeleting}
                      className="text-sky-400 hover:text-sky-300 disabled:opacity-50 p-1 transition-colors"
                      aria-label="Edit transaction"
                    >
                      <Pencil size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(t.id, t.description)} 
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50 p-1 transition-colors"
                      aria-label="Delete transaction"
                    >
                      {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Render Update Modal */}
      {editingTransaction && (
        <UpdateTransactionModal
          isOpen={Boolean(editingTransaction)}
          setIsOpen={(open) => {
            if (!open) setEditingTransaction(null);
          }}
          options={options || { categories: [], budgets: [], goals: [] }}
          transaction={formattedTransactionForModal}
        />
      )}
    </>
  );
}
"use client";

import React, { useTransition, useState, useRef, useEffect } from 'react';
import { 
  Pencil, 
  Trash2, 
  MoreVertical, 
  Folder, 
  PiggyBank, 
  Target,
  Loader2
} from 'lucide-react';
import { DynamicIcon } from '@/lib/dynamicIcon';
import { deleteTransaction } from '@/app/actions/transactions';
import { toast } from 'sonner';

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
  transactions: Transaction[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function TransactionsTable({ transactions, onEdit, onDelete }: TransactionsTableProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Close active dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // Delete Handler
  const handleDelete = (id: number, description: string) => {
    setActiveMenuId(null);

    if (onDelete) {
      onDelete(id);
      return;
    }

    setDeletingId(id);

    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", String(id));

      const result = await deleteTransaction(formData);

      if (result?.success) {
        toast.success(`"${description}" deleted successfully!`);
      } else {
        toast.error(result?.error || "Failed to delete transaction.");
      }

      setDeletingId(null);
    });
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

      return <DynamicIcon name={formattedName} />;
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
        icon: <PiggyBank size={14} />,
        color: t.budget.color || '#3b82f6',
      };
    }
    if (t.goal && t.goal.name) {
      return {
        name: t.goal.name,
        icon: <Target size={14} />,
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
    <div className="w-full bg-[#030712] text-slate-100 rounded-lg shadow-xl border border-slate-800">
      
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
            {transactions.map((t) => {
              const classification = getClassification(t);
              const isDeletingThis = isPending && deletingId === t.id;

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

                  {/* Desktop Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => onEdit?.(t.id)}
                        className="text-sky-400 hover:text-sky-300 transition-colors"
                        aria-label="Edit transaction"
                        disabled={isDeletingThis}
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(t.id, t.description)}
                        disabled={isDeletingThis}
                        className="text-red-500 hover:text-red-400 transition-colors disabled:opacity-50"
                        aria-label="Delete transaction"
                      >
                        {isDeletingThis ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
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
        {transactions.map((t) => {
          const classification = getClassification(t);
          const isDeletingThis = isPending && deletingId === t.id;
          const isMenuOpen = activeMenuId === t.id;

          return (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-900/40 relative">
              
              {/* Left Column: Title, Date, Classification Badge */}
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

              {/* Right Column: Amount & Dynamic Action Menu */}
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

                {/* Mobile Menu Trigger & Dropdown */}
                <div className="relative" ref={isMenuOpen ? menuRef : null}>
                  <button 
                    onClick={() => setActiveMenuId(isMenuOpen ? null : t.id)} 
                    disabled={isDeletingThis}
                    className="text-slate-400 hover:text-white p-1 disabled:opacity-50"
                    aria-label="Options"
                  >
                    {isDeletingThis ? (
                      <Loader2 size={18} className="animate-spin text-red-400" />
                    ) : (
                      <MoreVertical size={18} />
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isMenuOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-slate-900 border border-slate-700 rounded-md shadow-2xl z-50 py-1">
                      <button
                        onClick={() => {
                          setActiveMenuId(null);
                          onEdit?.(t.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors"
                      >
                        <Pencil size={14} className="text-sky-400" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id, t.description)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-slate-800 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
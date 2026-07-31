
import { DynamicIcon } from '@/lib/dynamicIcon';
import React from 'react'

interface Budget {
    id: number;
    name: string;
    amount: string;
    currency: string;
    period: BudgetPeriod;
    startDate: string | Date;
    endDate?: string | Date | null;
    categoryId?: number | string | null;
    categoryName?: string | null;
    categoryIcon?: string | null;
    categoryColor?: string;
}

export type BudgetPeriod = "Monthly" | "Weekly" | "Yearly" | "Custom";
export default function BudgetsCardItem({ budget }: { budget: Budget}) {
    const { name, amount, currency, period, startDate, endDate, categoryId, categoryName, categoryIcon, categoryColor } = budget;

    const spentAmount = amount || 0;

  return (
    <>
        <div className="card">
            <div className="gap-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl shadow-xs transition-transform group-hover:scale-105 shrink-0"
                        style={{
                          backgroundColor: `${categoryColor}20`,
                          color: categoryColor
                        }}
                    >
                        <DynamicIcon name={categoryIcon}/>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-[14px] font-semibold capitalize">
                            {name}
                        </h1>
                        <p className="">0100</p>
                    </div>
                </div>
                <h1 className="text-[11px]"
                    style={{ color: categoryColor }}
                >
                    {categoryName}
                </h1>
            </div>
        </div>
    </>
  )
}

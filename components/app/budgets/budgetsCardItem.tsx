
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
}

export type BudgetPeriod = "Monthly" | "Weekly" | "Yearly" | "Custom";
export default function BudgetsCardItem({ budget }: { budget: Budget}) {
  return (
    <></>
  )
}

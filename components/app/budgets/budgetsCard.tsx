import React from 'react';
import BudgetsCardItem from './budgetsCardItem';
import { getBudgets } from '@/app/actions/budgets';
import { getCategories } from '@/app/actions/categories';

export default async function BudgetsCard() {
  const budgets = await getBudgets();
  const categories = await getCategories();

  // Sort budgets from most recent (newest) to least recent
  const sortedBudgets = budgets && budgets.length > 0
    ? [...budgets].sort((a, b) => {
        const dateA = new Date(a.startDate || 0).getTime();
        const dateB = new Date(b.startDate || 0).getTime();
        return dateB - dateA; // Newest first
      })
    : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 flex-1 overflow-y-auto no-scrollbar content-start">
      {sortedBudgets.length > 0 ? (
        sortedBudgets.map((budget) => {
          const matchedCategory = categories?.find(
            (cat) => String(cat.id) === String(budget.categoryId)
          );

          return (
            <BudgetsCardItem
              key={budget.id}
              categoryOption={categories}
              budget={{
                ...budget,
                categoryName: matchedCategory?.name ?? 'Uncategorized',
                categoryIcon: matchedCategory?.icon ?? undefined,
                categoryColor: matchedCategory?.color ?? undefined,
                spentAmount: budget.spentAmount ?? 0,
              }}
            />
          );
        })
      ) : (
        <div className=""></div>
      )}
    </div>
  );
}
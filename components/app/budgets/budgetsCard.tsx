import React from 'react';
import BudgetsCardItem from './budgetsCardItem';
import { getBudgets } from '@/app/actions/budgets';
import { getCategories } from '@/app/actions/categories';

export default async function BudgetsCard() {
  const budgets = await getBudgets();
  const categories = await getCategories();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5 flex-1 overflow-y-auto no-scrollbar content-start">
      {budgets && budgets.length > 0 ? (
        budgets.map((budget) => {
          // Find the category matching this budget's categoryId
          const matchedCategory = categories?.find(
            (cat) => String(cat.id) === String(budget.categoryId)
          );

          return (
            <BudgetsCardItem
              key={budget.id}
              budget={{
                ...budget,
                categoryName: matchedCategory?.name ?? 'Uncategorized',
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
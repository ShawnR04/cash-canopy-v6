import { getTransactions } from '@/app/actions/transactions';
import React from 'react';
import TransactionsTable from './transactionsTable';

export default async function TransactionTableView() {
  const transactions = await getTransactions();

  if (!transactions || transactions.length === 0) {
    return <div className="p-4 text-center text-gray-500">No transactions found.</div>;
  }

  return <TransactionsTable transactions={transactions} />;
}
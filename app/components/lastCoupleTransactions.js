import React from 'react';

const TransactionHistory = ({ transactions }) => {
  console.log(transactions)
  const recentTransactions = transactions.slice(-4);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-800">Recent Transactions</h2>
      </div>
      {recentTransactions.length === 0 ? (
        <p className="text-gray-500">No recent transactions.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {recentTransactions.map((transaction, index) => (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="text-gray-800">{transaction.message}</p>
                <p className="text-sm text-gray-500">{transaction.timestamp}</p>
              </div>
              <p className={`font-semibold ${transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;

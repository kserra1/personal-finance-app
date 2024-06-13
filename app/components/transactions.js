import React from 'react';



const Transactions = ({transactions}) => {
  return (
    <div className="container mx-auto mt-4">
      <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500">
        <h2 className="text-3xl font-bold text-white">
          Transactions
        </h2>
        <table className="w-full rounded-lg shadow overflow-hidden mt-4 bg-white">
          <thead className="bg-black-100 text-left font-medium">
            <tr>
              <th className="p-4 text-white">Description</th>
              <th className="p-4 text-right text-white">Amount</th>
              <th className="p-4 text-white">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b hover:bg-purple-400">
                <td className="p-4 bg-gray-100 text-black">{transaction.message}</td>
                <td className="p-4 text-right bg-gray-100 text-black">
                  <span className={`text-${transaction.type === 'withdrawal' ? 'red-500' : 'green-500'}`}>
                    ${transaction.amount.toFixed(2)}
                  </span>
                </td>
                <td className="p-4 bg-gray-100 text-black">{new Date(transaction.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;

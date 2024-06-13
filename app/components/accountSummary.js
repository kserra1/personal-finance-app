import React from 'react';

const AccountSummary = ({ accounts }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-lg bg-gradient-to-r from-purple-400 to-indigo-500">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
        Account Summary
      </h2>
      <ul className="mt-4 w-full">
        {accounts.map((account, index) => (
          <li key={index} className="flex justify-between items-center bg-white bg-opacity-20 p-4 rounded-lg mb-2">
            <span className="text-xl font-semibold text-white">{account.account_name}</span>
            <span className="text-xl font-semibold text-white">${account.balance.toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountSummary;

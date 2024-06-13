"use client";
import React, { useState } from 'react'
const WithdrawMoney = ({ accounts, username }) => {
    const [fromAccount, setFromAccount] = useState('');
    const [amount, setAmount] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState('');
  
    const handleWithdrawal = async () => {
      if (fromAccount === '' || amount <= 0) {
        setMessage('Please fill in all fields and provide a valid amount.');
        return;
      }
  
      const fromBalance = accounts.find(acc => acc.account_name === fromAccount)?.balance;
      if (!fromBalance || fromBalance < amount) {
        setMessage('Insufficient funds.');
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await fetch('http://localhost:8000/person/api/auth/withdraw/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            account_name: fromAccount,
            amount: parseFloat(amount),
            message: `Withdrawal of $${amount} from Account ${fromAccount}`,
            reason: reason
          })
        });
  
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message);
          setFromAccount('');
          setAmount(0);
          setReason('');
        } else {
          const errorData = await response.json();
          setMessage(errorData.detail || 'Failed to withdraw money');
        }
      } catch (err) {
        setMessage('Something went wrong. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="px-4 py-4">
        <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            Withdraw Money
          </h2>
          <div className="flex flex-col items-center mt-4">
            <div className="flex flex-col items-center">
              <label htmlFor="fromAccount" className="text-lg font-semibold text-white">
                From Account
              </label>
              <select
                id="fromAccount"
                className="mt-1 p-2 rounded-lg text-black"
                value={fromAccount}
                onChange={(e) => setFromAccount(e.target.value)}
              >
                <option value="">Select Account</option>
                {accounts.map((account, index) => (
                  <option key={index} value={account.id}>
                    {account.account_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-center mt-4">
              <label htmlFor="amount" className="text-lg font-semibold text-white">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                className="mt-1 p-2 rounded-lg text-black"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center mt-4">
            <label htmlFor="reason" className="text-lg font-semibold text-white">
              Reason
            </label>
            <input
              id="reason"
              type="text"
              className="mt-1 p-2 rounded-lg text-black"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          
            <button
              className="mt-4 p-2 rounded-lg bg-white text-indigo-500 font-semibold"
              onClick={handleWithdrawal}
              disabled={loading}
            >
              {loading ? 'Withdrawing...' : 'Withdraw'}
            </button>
            {message && <p className="mt-4 text-white">{message}</p>}
          </div>
        </div>
      </div>
    );
  };
  
  export default WithdrawMoney;
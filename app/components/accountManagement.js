"use client";

import React, { useEffect, useState } from 'react'

const AccountManagement = () => {
    const [accounts, setAccounts] = useState([]);
    const [bankName, setBankName] = useState('');
    const [initialBalance, setInitialBalance] = useState(0);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('')


    useEffect(() => {
      const fetchData = async () => {
        await fetchUsername();
      };
      fetchData();
    }, []);

   useEffect(() => {
    if (username) {
      fetchAccounts();
    }
  }, [username]);

    const fetchUsername = async () => {
        try {
            const token = localStorage.getItem('token')
            console.log(token)
            if (token){
                const response = await fetch('http://localhost:8000/person/api/auth/user/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsername(data.username)
                }

            }  
        }catch (err) {
            console.log(err)

        }
    }
    const fetchAccounts = async () => {
        try {
            const token = localStorage.getItem('token')
            if (token){
          const response = await fetch(`http://localhost:8000/person/api/auth/getaccount/${username}/`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
          }); // Replace 'username' with the actual username
          if (!response.ok) {
            throw new Error('Failed to fetch accounts');
          }
          const data = await response.json();
          console.log(data);
          setAccounts(data);
        }
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      };
  
    const handleAddAccount = async () => {
      if (bankName === '' || initialBalance < 0) {
        setMessage('Please provide a valid bank name and initial balance.');
        return;
      }
      
      const newAccount = { account_name: bankName, balance: initialBalance };
  
      setAccounts(prevAccounts => prevAccounts ? [...prevAccounts, newAccount] : [newAccount]);
      setBankName('');
      setInitialBalance(0);
      try {
        const token = localStorage.getItem('token')
        if (token){
          const response = await fetch('http://localhost:8000/person/api/auth/addaccount/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({ username: username, account_name: bankName, balance: initialBalance }),
          });
          if (!response.ok) {
            throw new Error('Failed to add account');
          }
        }
      } catch (error) {
        console.error('Error adding account:', error);
      }
      setMessage(`Successfully added ${bankName} with initial balance of $${initialBalance}.`);
    };
  
    const handleRemoveAccount = async (accountName) => {
        try {
            const token = localStorage.getItem('token')
            if (token){
          const response = await fetch('http://localhost:8000/person/api/auth/removeaccount/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({ username: username, account_name: accountName }),
          });
          if (!response.ok) {
            throw new Error('Failed to remove account');
          }
        }
        }
        catch (error) {
          console.error('Error removing account:', error);
        }
        setAccounts(accounts.filter(account => account.account_name !== accountName));
    };
  
    return (
      <div className="px-4 py-4">
        <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">Account Management</h2>
          <div className="flex flex-col items-center mt-4">
            <div className="flex flex-col items-center">
              <label htmlFor="bankName" className="text-lg font-semibold text-white">Bank Name</label>
              <input
                id="bankName"
                type="text"
                className="mt-1 p-2 rounded-lg text-black"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center mt-4">
              <label htmlFor="initialBalance" className="text-lg font-semibold text-white">Initial Balance</label>
              <input
                id="initialBalance"
                type="text"
                className="mt-1 p-2 rounded-lg text-black"
                value={initialBalance}
                onChange={(e) => setInitialBalance(Number(e.target.value))}
              />
            </div>
            <button
              className="mt-4 p-2 rounded-lg bg-white text-indigo-500 font-semibold"
              onClick={handleAddAccount}
            >
              Add Account
            </button>
            {message && <p className="mt-4 text-white">{message}</p>}
          </div>  {accounts.length > 0 && (
          <div className="mt-8 w-full">
            <h3 className="text-2xl font-bold text-white mb-4">Your Accounts</h3>
            <ul className="list-disc pl-6 text-white">
              {accounts.map((account) => (
                <li key={account.account_name} className="mb-2">
                  <span>
                    {account.account_name} - Balance: ${account.balance}
                  </span>
                  <button
                    className="ml-4 p-1 rounded bg-red-500 text-white"
                    onClick={() => handleRemoveAccount(account.account_name)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagement;
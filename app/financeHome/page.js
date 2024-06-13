"use client";
import React from 'react'
import Balance from '../components/balance.js'
import NavBar from '../components/navBar.js'
import AccountSummary from '../components/accountSummary.js'
import BalanceBarChart from '../components/BalanceBarChart.js'
import TransactionHistory from '../components/lastCoupleTransactions.js'
import { useState, useEffect } from 'react'

const Page = () => {
  const [transactions, setTransactions] = useState([]);
  const [username, setUsername] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      await fetchUsername();

    };
    fetchData();
  }, []);

  useEffect(() => {
    if (username) {
      fetchTransactions();
      fetchAccounts();
    }
  }, [username]);



  const [accounts, setAccounts] = useState([]);
  const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0)

  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('http://localhost:8000/person/api/auth/user/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token && username) {
        console.log(`http://localhost:8000/person/api/auth/get_transactions/${username}/`)
        const response = await fetch(`http://localhost:8000/person/api/auth/get_transactions/${username}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          setTransactions(data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };


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
            // Convert balance amounts from strings to integers
            const accountsWithIntegerBalances = data.map(account => ({
                ...account,
                balance: parseInt(account.balance)
            }));
            setAccounts(accountsWithIntegerBalances);
        }
    } catch (error) {
        console.error('Error fetching accounts:', error);
    }
};


  return (
    <div style={{ height: '100vh', overflow: 'scroll' }}>
      <NavBar />
      <div className="px-5 py-5">
        <AccountSummary accounts={accounts} />
      </div>
      <div className="px-5 py-5">
      <Balance totalBalance={totalBalance} />
      </div>
      <div className="px-5 py-5">
        <BalanceBarChart accounts={accounts} />
      </div>
      <div className="px-5 py-5">
        <TransactionHistory transactions={transactions} />
      </div>
    </div>
  );
};

export default Page
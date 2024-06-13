"use client";
import React, { useState, useEffect } from 'react';
import NavBar from '@/app/components/navBar';
import TransferMoney from '@/app/components/transferMoney';
import DepositMoney from '@/app/components/depositMoney';
import WithdrawMoney from '@/app/components/withdrawMoney';

const Page = () => {
  const [accounts, setAccounts] = useState([]);
  const [username, setUsername] = useState(null);

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

  const fetchAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch(`http://localhost:8000/person/api/auth/getaccount/${username}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
          },
        });
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
    <div>
      <NavBar />
      <TransferMoney className='px-15 py-5' accounts={accounts} username={username} />
      <DepositMoney accounts={accounts} username = {username} />
      <WithdrawMoney accounts={accounts} username={username} />
    </div>
  );
};

export default Page;

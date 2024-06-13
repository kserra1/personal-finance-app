"use client";
import React from 'react'
import Transactions from '@/app/components/transactions'
import { useState, useEffect } from 'react'
import NavBar from '../components/navBar'
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

  return (
    <div>
      <NavBar />
      <Transactions transactions = {transactions}/>
    </div>
  )
}

export default Page
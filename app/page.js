"use client";
import React from 'react'
import Balance from './components/balance.js'
import NavBar from './components/navBar.js'
import { useState } from 'react'
import Header from './components/header.js';
import Login from './components/login.js';
import Signup from './components/signup.js';

const Page = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const toggleLogin = () => {
      setIsLoggedIn(!isLoggedIn)
  }
  return (
<div className="flex items-center justify-center bg-gray-100 h-screen">
<div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
      <Login />
      <Signup />
      </div>
    </div>
  )
}

export default Page
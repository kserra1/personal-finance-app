"use client";
import React from 'react'
import Balance from '../components/balance.js'
import NavBar from '../components/navBar.js'
import { useState } from 'react'
import Header from '../components/header.js';


const Page = ({children}) => {

  

  return (
    <div>
      <NavBar/>
      {children}
      <Header/>
    </div>
  )
}

export default Page
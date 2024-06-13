import React from 'react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
const Header = () => {
    const [username, setUsername] = useState('')

    useEffect(() => {
        fetchUsername();
    }, []);

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

  return (
    //Do the same thing as above but have everything centered within the center of screen and make the font and everything cleaner
    <div className="h-screen flex flex-col justify-center items-center py-7">
        <h1 className="text-6xl font-bold">Welcome to Personal Finance {username}</h1>
        <p className="text-3xl py-3">Manage your money with ease</p>
        <Link href="/financeHome">
        <button className="text-2xl text-teal-600 transition transform hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:transform-none ...">
            Get Started
        </button>
        </Link>
    </div>

    )
}

export default Header
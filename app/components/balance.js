import React from 'react'
const Balance = ({totalBalance}) => {
  //create a simple component that will display the balance of the user
  const curBalance=totalBalance

  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-lg bg-gradient-to-r from-green-400 to-blue-500">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
        Current Balance
      </h2>
      <p className="text-5xl font-bold text-white mt-4">
        ${curBalance.toFixed(2)}
      </p>
      <div className="w-full h-2 bg-gradient-to-r from-green-300 to-blue-400 rounded-full mt-8" />
    </div>
  )
}

export default Balance
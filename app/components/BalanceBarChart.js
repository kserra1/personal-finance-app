import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BalanceBarChart = ({ accounts }) => {
  const data = {
    labels: accounts.map(account => account.account_name),
    datasets: [
      {
        label: 'Account Balance',
        data: accounts.map(account => account.balance),
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff', // White color for legend text
        },
      },
      title: {
        display: true,
        text: 'Account Balances',
        color: '#ffffff', // White color for title text
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return '$' + tooltipItem.raw.toFixed(2); // Format tooltip value with dollar sign and two decimal places
          },
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark background for tooltips
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#ffffff', // White color for y-axis labels
          callback: function(value, index, values) {
            return '$' + value.toFixed(2); // Add dollar sign and format to two decimal places
          },
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Light white grid lines
        },
      },
      x: {
        ticks: {
          color: '#ffffff', // White color for x-axis labels
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Light white grid lines
        },
      },
    },
  };

  return (
    <div className="w-full h-96 p-4 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-500">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BalanceBarChart;

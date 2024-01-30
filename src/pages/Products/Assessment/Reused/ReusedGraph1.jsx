import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function ReusedGraph1({ reusedCount, totalParts }) {
  const data = {
    labels: ['Reused Parts', 'Total Parts'],
    datasets: [{
      label: 'Number of Items',
      data: [reusedCount, totalParts],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      },
      x: {
        barPercentage: 0.5,
        categoryPercentage: 0.7
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return <Bar data={data} options={options} />;
}

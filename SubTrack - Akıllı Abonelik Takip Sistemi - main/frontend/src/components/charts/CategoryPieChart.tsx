import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryDistribution } from '../../types';
import { formatCurrency } from '../../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryPieChartProps {
  data: CategoryDistribution[];
}

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = {
    labels: data.map(d => d.category),
    datasets: [
      {
        data: data.map(d => d.total),
        backgroundColor: data.map(d => d.color + '30'),
        borderColor: data.map(d => d.color),
        borderWidth: 2,
        hoverOffset: 8,
        spacing: 2,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 15, 35, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
  };

  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-[180px] h-[180px] flex-shrink-0">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-gray-500 dark:text-gray-400">Toplam</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
      <div className="flex-1 space-y-2.5">
        {data.map((item) => (
          <div key={item.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.category}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(item.total)}
              </span>
              <span className="text-xs text-gray-400 ml-1">
                ({item.count})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

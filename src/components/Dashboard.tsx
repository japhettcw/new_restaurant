import React, { useState } from 'react';
import { BarChart2, TrendingUp, TrendingDown, AlertTriangle, AlertCircle } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { BusinessMetrics } from '../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ... rest of your Dashboard component code ...

interface DashboardProps {
  metrics: BusinessMetrics;
}

export default function Dashboard({ metrics }: DashboardProps) {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 6)),
    end: new Date()
  });

  // Calculate metrics changes
  const revenueChange = ((metrics.revenue - metrics.previousRevenue) / metrics.previousRevenue) * 100;
  const expensesChange = ((metrics.expenses - metrics.previousExpenses) / metrics.previousExpenses) * 100;
  const profitChange = ((metrics.netProfit - metrics.previousProfit) / metrics.previousProfit) * 100;

  // Revenue vs Expenses Chart Data
  const revenueExpensesData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 59000, 80000, 81000, 56000, 55000],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true
      },
      {
        label: 'Expenses',
        data: [28000, 48000, 40000, 19000, 86000, 27000],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  // Revenue by Category Data
  const categoryData = {
    labels: ['Food', 'Beverages', 'Desserts', 'Catering', 'Other'],
    datasets: [{
      data: [30, 25, 15, 20, 10],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(107, 114, 128, 0.8)'
      ]
    }]
  };

  // Expense Breakdown Data
  const expenseData = {
    labels: ['Food Costs', 'Labor', 'Utilities', 'Rent', 'Marketing', 'Other'],
    datasets: [{
      label: 'Expenses',
      data: [25000, 35000, 8000, 15000, 5000, 7000],
      backgroundColor: 'rgba(59, 130, 246, 0.8)'
    }]
  };

  // Predictive Sales Data
  const predictiveSalesData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5 (Predicted)', 'Week 6 (Predicted)'],
    datasets: [{
      label: 'Sales Trend',
      data: [45000, 48000, 52000, 49000, 54000, 56000],
      borderColor: 'rgb(16, 185, 129)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true,
      segment: {
        borderDash: (ctx) => (ctx.p0 && ctx.p0.parsed && ctx.p0.parsed.x > 3 ? [6, 6] : undefined),
      },
      
    }]
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Dashboard</h1>
          <p className="text-gray-600">Track your restaurant's performance</p>
        </div>
        <div className="flex gap-4">
          <input
            type="date"
            value={dateRange.start.toISOString().split('T')[0]}
            onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}
            className="border rounded-lg px-3 py-2"
          />
          <input
            type="date"
            value={dateRange.end.toISOString().split('T')[0]}
            onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}
            className="border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <h3 className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</h3>
            </div>
            <div className={`flex items-center ${revenueChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {revenueChange >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              <span className="ml-1">{Math.abs(revenueChange).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Expenses</p>
              <h3 className="text-2xl font-bold">${metrics.expenses.toLocaleString()}</h3>
            </div>
            <div className={`flex items-center ${expensesChange <= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {expensesChange <= 0 ? <TrendingDown size={24} /> : <TrendingUp size={24} />}
              <span className="ml-1">{Math.abs(expensesChange).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <h3 className="text-2xl font-bold">${metrics.netProfit.toLocaleString()}</h3>
            </div>
            <div className={`flex items-center ${profitChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {profitChange >= 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
              <span className="ml-1">{Math.abs(profitChange).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Health Alerts */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Business Health Check</h2>
        <div className="space-y-4">
          {revenueChange < -10 && (
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-4 rounded-lg">
              <AlertTriangle />
              <span>Revenue is {Math.abs(revenueChange).toFixed(1)}% below average. Consider promotional activities.</span>
            </div>
          )}
          {expensesChange > 10 && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
              <AlertCircle />
              <span>Expenses are {expensesChange.toFixed(1)}% above average. Review cost management.</span>
            </div>
          )}
          {profitChange >= 0 && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
              <TrendingUp />
              <span>Profit margin is healthy with a {profitChange.toFixed(1)}% increase.</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Revenue vs Expenses</h2>
          <Line 
            data={revenueExpensesData} 
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${Number(value).toLocaleString()}`,
                  },
                }
              }
            }}
          />
        </div>

        {/* Revenue by Category */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Revenue by Category</h2>
          <Pie 
            data={categoryData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'right' as const,
                }
              }
            }}
          />
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>
          <Bar 
            data={expenseData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${Number(value).toLocaleString()}`,
                  },
                }
              }
            }}
          />
        </div>

        {/* Predictive Sales Trend */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Predictive Sales Trend</h2>
          <Line 
            data={predictiveSalesData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `$${context.parsed.y.toLocaleString()}`
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${Number(value).toLocaleString()}`,
                  },
                }
              }
            }}
          />
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Anomaly Detection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Revenue Anomalies</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle size={20} />
                <span>Unusual spike on June 15th (+45% above average)</span>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                <span>Significant drop on June 22nd (-30% below average)</span>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Expense Anomalies</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle size={20} />
                <span>Unusual utility costs in May (+25% above average)</span>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={20} />
                <span>High labor costs in June (+20% above average)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
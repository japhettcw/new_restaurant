import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Trash, TrendingUp, AlertCircle } from 'lucide-react';

interface WasteRecord {
  id: string;
  itemName: string;
  quantity: number;
  reason: string;
  date: string;
  cost: number;
}

export default function WasteDashboard() {
  const [wasteData, setWasteData] = useState<WasteRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch waste data from your backend
    fetchWasteData();
  }, []);

  const fetchWasteData = async () => {
    try {
      const response = await fetch('/api/waste');
      const data = await response.json();
      setWasteData(data);
    } catch (error) {
      console.error('Error fetching waste data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalWasteCost = () => {
    return wasteData.reduce((total, record) => total + record.cost, 0);
  };

  const getWasteByReason = () => {
    const groupedData = wasteData.reduce((acc, record) => {
      acc[record.reason] = (acc[record.reason] || 0) + record.quantity;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groupedData).map(([reason, quantity]) => ({
      reason,
      quantity
    }));
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Trash className="w-5 h-5" />
            Total Waste Items
          </h3>
          <p className="text-3xl font-bold">{wasteData.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Total Waste Cost
          </h3>
          <p className="text-3xl font-bold">${getTotalWasteCost().toFixed(2)}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Most Common Reason
          </h3>
          <p className="text-3xl font-bold">
            {getWasteByReason().sort((a, b) => b.quantity - a.quantity)[0]?.reason || 'N/A'}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Waste by Reason</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getWasteByReason()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="reason" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Waste Records</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {wasteData.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{record.itemName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{record.reason}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${record.cost.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
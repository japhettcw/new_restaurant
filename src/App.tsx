import React, { useState } from 'react';
import {
  Calendar, Users, Clock, MessageSquare, BarChart2,
  Settings, Menu as MenuIcon, Bell, ChevronLeft,
  ChevronRight, Plus, Trash2, Package, Recycle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import MenuManagement from './components/MenuManagement';
import InventoryDashboard from './components/Inventory/InventoryDashboard';
import WasteDashboard from './components/WasteAnalytics/WasteDashboard';
import StaffSchedule from './components/Scheduling/StaffSchedule';
import { BusinessMetrics } from './types';

const mockMetrics: BusinessMetrics = {
  revenue: 125000,
  expenses: 85000,
  netProfit: 40000,
  previousRevenue: 115000,
  previousExpenses: 80000,
  previousProfit: 35000,
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('dashboard');


  const renderContent = () => {
    console.log('renderContent called with tab:', selectedTab);
    switch (selectedTab) {
      case 'dashboard':
        return <Dashboard metrics={mockMetrics} />;
      case 'menu':
        return <MenuManagement />;
      case 'inventory':
        return <InventoryDashboard />;
      case 'waste':
        return <WasteDashboard />;
      case 'schedule':
        return <StaffSchedule />;
      default:
        return <Dashboard metrics={mockMetrics} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md backdrop-blur-sm bg-opacity-90 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200"
          >
            <MenuIcon className="w-6 h-6 text-blue-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              Restaurant Manager
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200 relative">
            <Bell className="w-6 h-6 text-blue-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3 p-1.5 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-200">
            <img
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100"
              alt="Profile"
              className="w-8 h-8 rounded-full ring-2 ring-blue-100"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700">John Manager</span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Enhanced Sidebar */}
      <div className="flex pt-16">
        {/* Enhanced Sidebar */}
        <aside 
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'w-64' : 'w-20'} overflow-hidden`}
        >
          <div className="p-4 flex flex-col gap-2">
            {[
              { id: 'dashboard', icon: BarChart2, label: 'Dashboard' },
              { id: 'menu', icon: MessageSquare, label: 'Menu Management' },
              { id: 'inventory', icon: Package, label: 'Inventory' },
              { id: 'waste', icon: Recycle, label: 'Waste Analytics' },
              { id: 'schedule', icon: Calendar, label: 'Schedule' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200
                  ${selectedTab === item.id 
                    ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600' 
                    : 'text-gray-700 hover:bg-blue-50'
                  } ${!isSidebarOpen && 'justify-center'}`}
              >
                <item.icon className={`w-6 h-6 ${!isSidebarOpen && 'mx-auto'}`} />
                {isSidebarOpen && (
                  <span className="font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Enhanced Main Content Area */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out p-6
            ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}
        >
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
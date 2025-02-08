export interface BusinessMetrics {
  revenue: number;
  expenses: number;
  netProfit: number;
  previousRevenue: number;
  previousExpenses: number;
  previousProfit: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  isAvailable: boolean;
  ingredients: string[];
  allergens: string[];
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  expiryDate: string;
  category: string;
}

export interface WasteRecord {
  id: string;
  itemName: string;
  quantity: number;
  reason: string;
  date: string;
  cost: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  maxHoursPerWeek: number;
}

export interface ShiftSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
}
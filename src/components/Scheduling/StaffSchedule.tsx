import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

interface ShiftSchedule {
  id: string;
  employeeId: string;
  employeeName: string;
  role: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  maxHoursPerWeek: number;
}

export default function StaffSchedule() {
  const [schedule, setSchedule] = useState<ShiftSchedule[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch schedule and employee data
    Promise.all([
      fetch('/api/schedule').then(res => res.json()),
      fetch('/api/employees').then(res => res.json())
    ]).then(([scheduleData, employeeData]) => {
      setSchedule(scheduleData);
      setEmployees(employeeData);
      setLoading(false);
    }).catch(error => {
      console.error('Error fetching data:', error);
      setLoading(false);
    });
  }, []);

  const getWeekDates = () => {
    const today = new Date();
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const getShiftsForDate = (date: Date) => {
    return schedule.filter(shift => 
      new Date(shift.date).toDateString() === date.toDateString()
    );
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Total Staff
          </h3>
          <p className="text-3xl font-bold">{employees.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Shifts
          </h3>
          <p className="text-3xl font-bold">{schedule.length}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Today's Shifts
          </h3>
          <p className="text-3xl font-bold">
            {getShiftsForDate(new Date()).length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
          <div className="grid grid-cols-7 gap-4">
            {getWeekDates().map((date) => (
              <div key={date.toISOString()} className="border rounded-lg p-4">
                <h3 className="font-semibold text-sm mb-2">
                  {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </h3>
                <div className="space-y-2">
                  {getShiftsForDate(date).map((shift) => (
                    <div
                      key={shift.id}
                      className="bg-blue-50 p-2 rounded text-sm"
                    >
                      <p className="font-semibold">{shift.employeeName}</p>
                      <p className="text-gray-600">{shift.startTime} - {shift.endTime}</p>
                      <p className="text-gray-500">{shift.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Staff List</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Hours/Week</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scheduled Hours</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.maxHoursPerWeek}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {schedule
                        .filter(shift => shift.employeeId === employee.id)
                        .reduce((total, shift) => {
                          const start = new Date(`2000-01-01T${shift.startTime}`);
                          const end = new Date(`2000-01-01T${shift.endTime}`);
                          return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                        }, 0)
                        .toFixed(1)}
                    </td>
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
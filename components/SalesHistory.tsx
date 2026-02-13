
import React, { useState } from 'react';
import { Calendar, Search, ArrowDownCircle, FileText } from 'lucide-react';
import { Sale, Medicine } from '../types';

interface SalesHistoryProps {
  sales: Sale[];
  medicines: Medicine[];
}

const SalesHistory: React.FC<SalesHistoryProps> = ({ sales, medicines }) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const getMedicineName = (id: string) => {
    return medicines.find(m => m.id === id)?.name || 'Unknown Item';
  };

  const filteredSales = sales.filter(sale => {
    const matchesDate = selectedDate ? sale.timestamp.startsWith(selectedDate) : true;
    const medName = getMedicineName(sale.medicineId).toLowerCase();
    const matchesSearch = medName.includes(searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const totalRevenue = filteredSales.reduce((acc, curr) => acc + curr.totalAmount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Sales History</h2>
          <p className="text-slate-500 text-sm">View and analyze past transaction records</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500">Total Filtered Revenue:</span>
            <span className="text-lg font-bold text-green-600">₹{totalRevenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search by medicine name..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="date"
            className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-600"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
        {selectedDate && (
          <button 
            onClick={() => setSelectedDate('')}
            className="text-sm text-red-500 hover:text-red-700 font-medium px-2"
          >
            Clear Date
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {filteredSales.length === 0 ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center">
            <FileText size={48} className="mb-4 opacity-50" />
            <p>No sales records found for the selected criteria.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Date & Time</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Invoice ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Item Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Qty</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(sale.timestamp).toLocaleDateString()}
                    <div className="text-xs text-slate-400">{new Date(sale.timestamp).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 select-all">
                      {sale.id.split('-')[1]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800">{getMedicineName(sale.medicineId)}</div>
                    <div className="text-xs text-slate-500">Rate: ₹{sale.unitPrice}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-700">
                    {sale.quantity}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-600 font-bold">₹{sale.totalAmount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SalesHistory;

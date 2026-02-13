
import React, { useState } from 'react';
import { Package, Plus, AlertTriangle, Clock, Edit, Trash2, X, Search } from 'lucide-react';
import { Medicine } from '../types';

interface InventoryProps {
  medicines: Medicine[];
  onAdd: (med: Medicine) => void;
  onEdit: (med: Medicine) => void;
  onDelete: (id: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ medicines, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMed, setCurrentMed] = useState<Partial<Medicine>>({});

  const isExpiringSoon = (date: string) => {
    const exp = new Date(date);
    const today = new Date();
    const diff = exp.getTime() - today.getTime();
    return diff < (1000 * 60 * 60 * 24 * 90);
  };

  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setCurrentMed({
      id: `m${Date.now()}`,
      name: '',
      category: '',
      manufacturer: '',
      batchNumber: '',
      expiryDate: '',
      purchasePrice: 0,
      mrp: 0,
      stock: 0,
      threshold: 10
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (med: Medicine) => {
    setCurrentMed(med);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (medicines.find(m => m.id === currentMed.id)) {
      onEdit(currentMed as Medicine);
    } else {
      onAdd(currentMed as Medicine);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200"
        >
          <Plus size={20} /> Add New Stock
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm font-medium">Total Items</span>
            <Package className="text-blue-500" size={20} />
          </div>
          <div className="text-2xl font-bold mt-2">{medicines.length} SKU</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm font-medium">Low Stock Items</span>
            <AlertTriangle className="text-orange-500" size={20} />
          </div>
          <div className="text-2xl font-bold mt-2">{medicines.filter(m => m.stock <= m.threshold).length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 text-sm font-medium">Expiring Soon</span>
            <Clock className="text-red-500" size={20} />
          </div>
          <div className="text-2xl font-bold mt-2">{medicines.filter(m => isExpiringSoon(m.expiryDate)).length}</div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search inventory..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Medicine Details</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Batch Info</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Current Stock</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Expiry Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Financials</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMedicines.map(med => (
              <tr key={med.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-800">{med.name}</div>
                  <div className="text-xs text-slate-500 uppercase">{med.category} | {med.manufacturer}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-700">{med.batchNumber}</div>
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm font-bold ${med.stock <= med.threshold ? 'text-red-600' : 'text-slate-700'}`}>
                    {med.stock} <span className="text-xs font-normal text-slate-400">units</span>
                  </div>
                  {med.stock <= med.threshold && <div className="text-[10px] text-red-500 animate-pulse uppercase">Refill Needed</div>}
                </td>
                <td className="px-6 py-4">
                  <div className={`text-sm ${isExpiringSoon(med.expiryDate) ? 'text-orange-600 font-bold' : 'text-slate-600'}`}>
                    {med.expiryDate}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-slate-500">Buy: ₹{med.purchasePrice}</div>
                  <div className="text-sm font-bold text-slate-800">MRP: ₹{med.mrp}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenEdit(med)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => { if(window.confirm(`Delete ${med.name}?`)) onDelete(med.id); }}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {medicines.find(m => m.id === currentMed.id) ? 'Edit Medicine' : 'Add New Medicine'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Medicine Name</label>
                  <input required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentMed.name} onChange={e => setCurrentMed({...currentMed, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <input required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentMed.category} onChange={e => setCurrentMed({...currentMed, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Manufacturer</label>
                  <input required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentMed.manufacturer} onChange={e => setCurrentMed({...currentMed, manufacturer: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Batch Number</label>
                  <input required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentMed.batchNumber} onChange={e => setCurrentMed({...currentMed, batchNumber: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                  <input type="date" required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentMed.expiryDate} onChange={e => setCurrentMed({...currentMed, expiryDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock Quantity</label>
                  <input type="number" required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentMed.stock} onChange={e => setCurrentMed({...currentMed, stock: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Low Stock Threshold</label>
                  <input type="number" required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentMed.threshold} onChange={e => setCurrentMed({...currentMed, threshold: parseInt(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Purchase Price (₹)</label>
                  <input type="number" required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentMed.purchasePrice} onChange={e => setCurrentMed({...currentMed, purchasePrice: parseFloat(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">MRP (₹)</label>
                  <input type="number" required className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentMed.mrp} onChange={e => setCurrentMed({...currentMed, mrp: parseFloat(e.target.value)})} />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-6">
                Save Medicine Details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;

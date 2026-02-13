
import React, { useState } from 'react';
import { Pharmacist } from '../types';
import { Plus, Edit, Trash2, User, Phone, Search, X, BadgeCheck } from 'lucide-react';

interface PharmacistsManagerProps {
  pharmacists: Pharmacist[];
  onAdd: (phar: Pharmacist) => void;
  onEdit: (phar: Pharmacist) => void;
  onDelete: (id: string) => void;
}

const PharmacistsManager: React.FC<PharmacistsManagerProps> = ({ pharmacists, onAdd, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPhar, setCurrentPhar] = useState<Partial<Pharmacist>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenAdd = () => {
    setCurrentPhar({
      id: `ph${Date.now()}`,
      name: '',
      contact: '',
      shift: '',
      licenseNumber: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (phar: Pharmacist) => {
    setCurrentPhar(phar);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pharmacists.find(p => p.id === currentPhar.id)) {
      onEdit(currentPhar as Pharmacist);
    } else {
      onAdd(currentPhar as Pharmacist);
    }
    setIsModalOpen(false);
  };

  const filteredPharmacists = pharmacists.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Pharmacist Staff Management</h2>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200"
        >
          <Plus size={20} /> Add New Pharmacist
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by name or license number..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPharmacists.map(phar => (
          <div key={phar.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                <User size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleOpenEdit(phar)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => { if(window.confirm('Remove this pharmacist?')) onDelete(phar.id) }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{phar.name}</h3>
            <p className="text-green-600 font-medium text-sm mb-4">{phar.shift}</p>

            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>{phar.contact}</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={14} />
                <span className="font-mono bg-slate-100 px-1 rounded text-xs">{phar.licenseNumber}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {pharmacists.find(p => p.id === currentPhar.id) ? 'Edit Pharmacist' : 'Add New Pharmacist'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentPhar.name}
                  onChange={e => setCurrentPhar({...currentPhar, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                <input
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentPhar.contact}
                  onChange={e => setCurrentPhar({...currentPhar, contact: e.target.value})}
                />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Shift Timing</label>
                <input
                  required
                  placeholder="e.g. Morning (8AM-4PM)"
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentPhar.shift}
                  onChange={e => setCurrentPhar({...currentPhar, shift: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">License Number</label>
                <input
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentPhar.licenseNumber}
                  onChange={e => setCurrentPhar({...currentPhar, licenseNumber: e.target.value})}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-4"
              >
                Save Staff Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacistsManager;


import React, { useState } from 'react';
import { Doctor } from '../types';
import { Plus, Edit, Trash2, User, Clock, Search, X } from 'lucide-react';

interface DoctorsManagerProps {
  doctors: Doctor[];
  onAdd: (doc: Doctor) => void;
  onEdit: (doc: Doctor) => void;
  onDelete: (id: string) => void;
}

const DoctorsManager: React.FC<DoctorsManagerProps> = ({ doctors, onAdd, onEdit, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoc, setCurrentDoc] = useState<Partial<Doctor>>({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleOpenAdd = () => {
    setCurrentDoc({
      id: `d${Date.now()}`,
      name: '',
      specialization: '',
      availability: 'Mon-Fri',
      opdHours: '09:00 AM - 05:00 PM'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (doc: Doctor) => {
    setCurrentDoc(doc);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (doctors.find(d => d.id === currentDoc.id)) {
      onEdit(currentDoc as Doctor);
    } else {
      onAdd(currentDoc as Doctor);
    }
    setIsModalOpen(false);
  };

  const filteredDoctors = doctors.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Doctor Management</h2>
        <button 
          onClick={handleOpenAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200"
        >
          <Plus size={20} /> Add New Doctor
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search doctors by name or specialization..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doc => (
          <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                <User size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleOpenEdit(doc)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => { if(window.confirm('Delete this doctor?')) onDelete(doc.id) }}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800">{doc.name}</h3>
            <p className="text-indigo-600 font-medium text-sm mb-4">{doc.specialization}</p>
            
            <div className="space-y-2 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{doc.availability}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                <span>{doc.opdHours}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {doctors.find(d => d.id === currentDoc.id) ? 'Edit Doctor' : 'Add New Doctor'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Doctor Name</label>
                <input 
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentDoc.name}
                  onChange={e => setCurrentDoc({...currentDoc, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                <input 
                  required
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={currentDoc.specialization}
                  onChange={e => setCurrentDoc({...currentDoc, specialization: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Availability Days</label>
                  <input 
                    placeholder="e.g. Mon-Fri"
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentDoc.availability}
                    onChange={e => setCurrentDoc({...currentDoc, availability: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">OPD Hours</label>
                  <input 
                    placeholder="e.g. 10AM - 2PM"
                    required
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={currentDoc.opdHours}
                    onChange={e => setCurrentDoc({...currentDoc, opdHours: e.target.value})}
                  />
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-4"
              >
                Save Doctor Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsManager;

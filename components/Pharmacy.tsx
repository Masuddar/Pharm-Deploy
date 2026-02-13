
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, History, Archive, Search, CheckCircle2, AlertCircle, Truck, PackagePlus } from 'lucide-react';
import { Medicine, Sale } from '../types';

interface PharmacyProps {
  medicines: Medicine[];
  onSaleComplete: (saleItems: { medicineId: string; quantity: number; unitPrice?: number }[]) => void;
  todaysSales: Sale[]; 
  onDeleteSale: (saleId: string) => void;
  onEditSale: (sale: Sale) => void;
  onPlaceOrder: (order: { medicineName: string; quantity: number; supplier: string }) => void;
}

const Pharmacy: React.FC<PharmacyProps> = ({ 
  medicines, 
  onSaleComplete,
  todaysSales = [],
  onDeleteSale,
  onEditSale,
  onPlaceOrder
}) => {
  // --- Form State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [customPrice, setCustomPrice] = useState<string>(''); // string to handle empty input
  
  // --- Edit Modal State ---
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [editQty, setEditQty] = useState<number>(0);

  // --- Order Modal State ---
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderParams, setOrderParams] = useState({ name: '', quantity: 100, supplier: 'Generic Wholesaler' });

  // Filter for autocomplete
  const filteredMedicines = medicines.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 5); // Limit suggestions

  const handleSelectMedicine = (med: Medicine) => {
    setSelectedMed(med);
    setSearchTerm(med.name);
    setCustomPrice(med.mrp.toString());
    setShowSuggestions(false);
    setQuantity(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMed) return;

    const finalPrice = parseFloat(customPrice) || selectedMed.mrp;
    
    if (quantity > selectedMed.stock) {
      alert(`Insufficient stock! Available: ${selectedMed.stock}`);
      return;
    }

    onSaleComplete([{ 
      medicineId: selectedMed.id, 
      quantity: quantity,
      unitPrice: finalPrice
    }]);

    // Reset Form
    setSearchTerm('');
    setSelectedMed(null);
    setQuantity(1);
    setCustomPrice('');
  };

  const getMedicineName = (id: string) => medicines.find(m => m.id === id)?.name || 'Unknown';

  const handleSaveEdit = () => {
    if (!editingSale) return;
    const updatedSale = { 
      ...editingSale, 
      quantity: editQty, 
      totalAmount: editQty * editingSale.unitPrice 
    };
    onEditSale(updatedSale);
    setEditingSale(null);
  };

  const handleInitiateOrder = (name: string) => {
    setOrderParams({ name, quantity: 100, supplier: 'Generic Wholesaler' });
    setIsOrderModalOpen(true);
    setShowSuggestions(false);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    onPlaceOrder({
      medicineName: orderParams.name,
      quantity: orderParams.quantity,
      supplier: orderParams.supplier
    });
    setIsOrderModalOpen(false);
    setSearchTerm(''); // Clear search to reset view
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* 1. ENTRY FORM CARD */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Plus size={24} /> Log Daily Sale
          </h2>
          <span className="text-slate-400 text-sm">Enter sale details below</span>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Medicine Search (Autocomplete) */}
            <div className="relative col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Medicine Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Type to search inventory..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                    if (!e.target.value) setSelectedMed(null);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  // Delay blur to allow click on suggestion
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 300)} // Increased delay to allow button click
                />
              </div>
              
              {/* Dropdown */}
              {showSuggestions && searchTerm && !selectedMed && (
                <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-xl shadow-xl mt-1 z-50 max-h-60 overflow-y-auto">
                  {filteredMedicines.length === 0 ? (
                    <div 
                      className="p-4 cursor-pointer hover:bg-indigo-50 group border-b border-indigo-100 last:border-0 transition-colors"
                      onClick={() => handleInitiateOrder(searchTerm)}
                    >
                      <div className="flex items-center gap-3 text-indigo-600">
                        <div className="bg-indigo-100 p-2 rounded-full">
                           <Truck size={18} />
                        </div>
                        <div>
                           <div className="font-bold">Item not available in inventory.</div>
                           <div className="text-sm">Click to Order <span className="font-bold underline">"{searchTerm}"</span> from Wholesaler.</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    filteredMedicines.map(med => (
                      <div 
                        key={med.id}
                        className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0"
                        onClick={() => handleSelectMedicine(med)}
                      >
                        <div>
                          <div className="font-bold text-slate-800">{med.name}</div>
                          <div className="text-xs text-slate-500">{med.category} • {med.manufacturer}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-blue-600">₹{med.mrp}</div>
                          <div className={`text-xs ${med.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                            Stock: {med.stock}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Quantity</label>
              <input 
                type="number"
                min="1"
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              />
              {selectedMed && (
                <p className="text-xs text-slate-500 mt-1">Available: {selectedMed.stock}</p>
              )}
            </div>

            {/* Unit Price */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Unit Price (₹)</label>
              <input 
                type="number"
                min="0"
                step="0.01"
                required
                className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                value={customPrice}
                onChange={(e) => setCustomPrice(e.target.value)}
              />
            </div>

          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
            <div className="text-slate-600">
               Total: <span className="text-2xl font-bold text-slate-800 ml-2">₹{((parseFloat(customPrice) || 0) * quantity).toFixed(2)}</span>
            </div>
            <button 
              type="submit"
              disabled={!selectedMed || quantity <= 0}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
            >
              <CheckCircle2 size={20} /> Add Entry
            </button>
          </div>
        </form>
      </div>

      {/* 2. TODAY'S LOG TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <History size={20} className="text-slate-400" /> Today's Records
            </h3>
            <p className="text-xs text-slate-500">History appears here immediately after entry</p>
          </div>
          <span className="bg-white border border-slate-200 px-3 py-1 rounded-full text-sm font-bold text-slate-600">
            {todaysSales.length} Entries
          </span>
        </div>

        <div className="overflow-x-auto">
          {todaysSales.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400">
              <Archive size={48} className="mb-4 opacity-30" />
              <p>No sales logged yet today.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-bold">
                <tr>
                  <th className="px-6 py-4">Time</th>
                  <th className="px-6 py-4">Medicine</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Unit Price</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {todaysSales.slice().reverse().map(sale => (
                  <tr key={sale.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm text-slate-600">
                      {new Date(sale.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{getMedicineName(sale.medicineId)}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {sale.quantity}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      ₹{sale.unitPrice}
                    </td>
                    <td className="px-6 py-4 font-bold text-blue-600">
                      ₹{sale.totalAmount}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingSale(sale); setEditQty(sale.quantity); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => { if(window.confirm('Delete this entry? Stock will be restored.')) onDeleteSale(sale.id); }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingSale && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Edit Entry</h3>
                <button onClick={() => setEditingSale(null)} className="text-slate-400 hover:text-slate-600"><AlertCircle size={20}/></button>
             </div>
             <p className="text-sm text-slate-500 mb-4">
               Update quantity for <strong>{getMedicineName(editingSale.medicineId)}</strong>.
             </p>
             <div className="mb-6">
                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">New Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  className="w-full p-3 border border-slate-300 rounded-xl font-bold text-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editQty}
                  onChange={(e) => setEditQty(parseInt(e.target.value) || 0)}
                />
             </div>
             <div className="flex gap-3">
               <button onClick={() => setEditingSale(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
               <button onClick={handleSaveEdit} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Update</button>
             </div>
          </div>
        </div>
      )}

      {/* Order Modal (Wholesaler) */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
           <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3">
                 <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg"><PackagePlus size={24}/></div>
                 <h3 className="text-xl font-bold text-slate-800">Place Supply Order</h3>
               </div>
               <button onClick={() => setIsOrderModalOpen(false)} className="text-slate-400 hover:text-slate-600"><AlertCircle size={24}/></button>
             </div>

             <form onSubmit={handleSubmitOrder} className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Medicine Name</label>
                  <input 
                    readOnly 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-not-allowed"
                    value={orderParams.name}
                  />
                  <p className="text-xs text-indigo-500 mt-1">Ordering specific item not found in inventory.</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Quantity</label>
                    <input 
                      type="number"
                      required
                      min="1"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={orderParams.quantity}
                      onChange={e => setOrderParams({...orderParams, quantity: parseInt(e.target.value)})}
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Supplier</label>
                    <input 
                      type="text"
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={orderParams.supplier}
                      onChange={e => setOrderParams({...orderParams, supplier: e.target.value})}
                    />
                 </div>
               </div>

               <div className="pt-4 flex gap-3">
                 <button 
                  type="button" 
                  onClick={() => setIsOrderModalOpen(false)} 
                  className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200"
                 >
                   Cancel
                 </button>
                 <button 
                  type="submit" 
                  className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                 >
                   Confirm Order
                 </button>
               </div>
             </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default Pharmacy;

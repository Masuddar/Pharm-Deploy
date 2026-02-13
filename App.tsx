
import React, { useState, useCallback } from 'react';
import { 
  LayoutDashboard, ShoppingCart, Package, Calendar, Settings, 
  Menu, X, Bell, BrainCircuit, Loader2, Sparkles, LogOut, History, UserCog, Users
} from 'lucide-react';
import { 
  UserRole, Appointment, Medicine, Sale, AppointmentStatus, AnalyticsInsight, Doctor, PurchaseOrder, Pharmacist 
} from './types';
import { MOCK_DOCTORS, MOCK_MEDICINES, GENERATE_MOCK_SALES, MOCK_PHARMACISTS } from './constants';
import Dashboard from './components/Dashboard';
import Pharmacy from './components/Pharmacy';
import Inventory from './components/Inventory';
import Appointments from './components/Appointments';
import LandingPage from './components/LandingPage';
import PatientPortal from './components/PatientPortal';
import SalesHistory from './components/SalesHistory';
import DoctorsManager from './components/DoctorsManager';
import PharmacistsManager from './components/PharmacistsManager';
import { getSmartInsights } from './services/geminiService';

type ViewState = 'LANDING' | 'ADMIN' | 'PATIENT' | 'PHARMACIST';

const App: React.FC = () => {
  // --- Global State ---
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');
  const [adminTab, setAdminTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Data State
  const [medicines, setMedicines] = useState<Medicine[]>(MOCK_MEDICINES);
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [pharmacists, setPharmacists] = useState<Pharmacist[]>(MOCK_PHARMACISTS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  
  // Initialize with generated mock history for a "live" feel
  const [sales, setSales] = useState<Sale[]>(GENERATE_MOCK_SALES());
  
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'a1', patientId: 'Rajesh Kumar', doctorId: 'd1', date: new Date().toISOString().split('T')[0], time: '10:30 AM', status: AppointmentStatus.BOOKED },
    { id: 'a2', patientId: 'Anita Desai', doctorId: 'd2', date: new Date().toISOString().split('T')[0], time: '11:15 AM', status: AppointmentStatus.CHECKED_IN },
  ]);

  // AI State
  const [aiInsights, setAiInsights] = useState<AnalyticsInsight[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- Handlers: Sales & Appointments ---

  const handleBookAppointment = (newAppt: Partial<Appointment>) => {
    const appointment: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: newAppt.patientId || 'Unknown',
      doctorId: newAppt.doctorId || '',
      date: newAppt.date || '',
      time: newAppt.time || '',
      status: AppointmentStatus.BOOKED
    };
    setAppointments(prev => [...prev, appointment]);
  };

  const handleSaleComplete = (saleItems: { medicineId: string; quantity: number; unitPrice?: number }[]) => {
    const newSales: Sale[] = [];
    const updatedMedicines = [...medicines];

    saleItems.forEach(item => {
      const medIndex = updatedMedicines.findIndex(m => m.id === item.medicineId);
      if (medIndex > -1) {
        const med = updatedMedicines[medIndex];
        const finalPrice = item.unitPrice !== undefined ? item.unitPrice : med.mrp;
        const saleAmount = finalPrice * item.quantity;
        
        newSales.push({
          id: `sale-${Date.now()}-${item.medicineId}`,
          medicineId: item.medicineId,
          quantity: item.quantity,
          unitPrice: finalPrice,
          totalAmount: saleAmount,
          timestamp: new Date().toISOString(),
        });

        updatedMedicines[medIndex] = {
          ...med,
          stock: med.stock - item.quantity
        };
      }
    });

    setSales(prev => [...prev, ...newSales]);
    setMedicines(updatedMedicines);
  };

  // --- NEW: Handle Deleting a Sale (Void) ---
  const handleDeleteSale = (saleId: string) => {
    const saleToDelete = sales.find(s => s.id === saleId);
    if (!saleToDelete) return;

    // 1. Restore Stock
    setMedicines(prev => prev.map(m => {
      if (m.id === saleToDelete.medicineId) {
        return { ...m, stock: m.stock + saleToDelete.quantity };
      }
      return m;
    }));

    // 2. Remove Sale
    setSales(prev => prev.filter(s => s.id !== saleId));
  };

  // --- NEW: Handle Editing a Sale ---
  const handleEditSale = (updatedSale: Sale) => {
    const originalSale = sales.find(s => s.id === updatedSale.id);
    if (!originalSale) return;

    const quantityDifference = updatedSale.quantity - originalSale.quantity;

    // 1. Update Stock (Subtract difference. If new qty is higher, diff is positive, so stock decreases)
    setMedicines(prev => prev.map(m => {
      if (m.id === updatedSale.medicineId) {
        return { ...m, stock: m.stock - quantityDifference };
      }
      return m;
    }));

    // 2. Update Sale Record
    setSales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));
  };

  // --- NEW: Handle Wholesaler Order ---
  const handlePlaceOrder = (orderData: { medicineName: string; quantity: number; supplier: string }) => {
    const newOrder: PurchaseOrder = {
      id: `po-${Date.now()}`,
      medicineName: orderData.medicineName,
      quantity: orderData.quantity,
      supplier: orderData.supplier,
      status: 'PENDING',
      orderDate: new Date().toISOString().split('T')[0]
    };
    setPurchaseOrders(prev => [...prev, newOrder]);
    // In a real app, this would trigger an API call or email.
    alert(`Purchase Order Created!\nItem: ${orderData.medicineName}\nQty: ${orderData.quantity}\nSupplier: ${orderData.supplier}`);
  };


  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  // --- Handlers: CRUD Operations ---

  // Inventory CRUD
  const handleAddMedicine = (med: Medicine) => {
    setMedicines(prev => [...prev, med]);
  };

  const handleEditMedicine = (updatedMed: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === updatedMed.id ? updatedMed : m));
  };

  const handleDeleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  };

  // Doctor CRUD
  const handleAddDoctor = (doc: Doctor) => {
    setDoctors(prev => [...prev, doc]);
  };

  const handleEditDoctor = (updatedDoc: Doctor) => {
    setDoctors(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
  };

  const handleDeleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  // Pharmacist CRUD
  const handleAddPharmacist = (phar: Pharmacist) => {
    setPharmacists(prev => [...prev, phar]);
  };

  const handleEditPharmacist = (updatedPhar: Pharmacist) => {
    setPharmacists(prev => prev.map(p => p.id === updatedPhar.id ? updatedPhar : p));
  };

  const handleDeletePharmacist = (id: string) => {
    setPharmacists(prev => prev.filter(p => p.id !== id));
  };

  // AI Handler
  const fetchInsights = useCallback(async () => {
    if (!process.env.API_KEY) return;
    setIsAiLoading(true);
    const insights = await getSmartInsights(sales, medicines);
    setAiInsights(insights);
    setIsAiLoading(false);
  }, [sales, medicines]);

  // --- Helper: Get Today's Sales for Pharmacy View ---
  const todaysSales = sales.filter(s => 
    s.timestamp.startsWith(new Date().toISOString().split('T')[0])
  );

  // --- Render Views ---

  const handleLandingNavigation = (view: ViewState) => {
    setCurrentView(view);
    // Set default tabs based on view
    if (view === 'PHARMACIST') setAdminTab('daily-sales');
    if (view === 'ADMIN') setAdminTab('dashboard');
  };

  if (currentView === 'LANDING') {
    return <LandingPage onNavigate={handleLandingNavigation} />;
  }

  if (currentView === 'PATIENT') {
    return (
      <PatientPortal 
        doctors={doctors} 
        onBook={handleBookAppointment} 
        onBack={() => setCurrentView('LANDING')} 
      />
    );
  }

  // --- Dashboard View (Admin & Pharmacist) ---

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN'] },
    { id: 'daily-sales', label: 'Daily Sales', icon: ShoppingCart, roles: ['ADMIN', 'PHARMACIST'] },
    { id: 'inventory', label: 'Inventory', icon: Package, roles: ['ADMIN', 'PHARMACIST'] },
    { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['ADMIN'] },
    { id: 'doctors', label: 'Doctors', icon: UserCog, roles: ['ADMIN'] },
    { id: 'pharmacists', label: 'Pharmacists', icon: Users, roles: ['ADMIN'] },
    { id: 'history', label: 'Sales History', icon: History, roles: ['ADMIN', 'PHARMACIST'] },
  ];

  const currentRole = currentView === 'PHARMACIST' ? 'PHARMACIST' : 'ADMIN';
  const navItems = allNavItems.filter(item => item.roles.includes(currentRole));

  return (
    <div className="min-h-screen bg-[#f8fafc] flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-slate-900 text-white flex flex-col z-50 shadow-xl`}
      >
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/20 ${currentRole === 'PHARMACIST' ? 'bg-emerald-600' : 'bg-blue-600'}`}>
            S
          </div>
          {isSidebarOpen && (
            <div>
              <h1 className="font-bold text-lg leading-tight">SIT Pharmacy</h1>
              <p className="text-xs text-slate-400">{currentRole === 'PHARMACIST' ? 'Pharmacist Panel' : 'Admin Panel'}</p>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setAdminTab(item.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                adminTab === item.id 
                  ? `${currentRole === 'PHARMACIST' ? 'bg-emerald-600 shadow-emerald-900/30' : 'bg-blue-600 shadow-blue-900/30'} text-white font-semibold shadow-lg` 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={22} />
              {isSidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => setCurrentView('LANDING')}
            className="flex items-center gap-3 p-3 text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors w-full rounded-xl"
          >
            <LogOut size={22} />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-xl font-bold text-slate-800 capitalize">{adminTab.replace('-', ' ')}</h1>
          </div>

          <div className="flex items-center gap-4">
            {currentRole === 'ADMIN' && (
              <button 
                onClick={fetchInsights}
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:shadow-lg transition-all"
              >
                {isAiLoading ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
                Ask AI Insights
              </button>
            )}
            <div className="relative p-2 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-600">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800">{currentRole === 'PHARMACIST' ? 'Staff Member' : 'Admin User'}</p>
                <p className="text-[10px] text-slate-500 font-medium">{currentRole === 'PHARMACIST' ? 'Pharmacist' : 'Head Pharmacist'}</p>
              </div>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold border-2 border-white shadow-sm ${currentRole === 'PHARMACIST' ? 'bg-emerald-500' : 'bg-blue-500'}`}>
                {currentRole === 'PHARMACIST' ? 'P' : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {aiInsights.length > 0 && currentRole === 'ADMIN' && (
            <div className="mb-8 p-6 bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl animate-in fade-in slide-in-from-top-4">
              <div className="flex items-center gap-2 mb-4 text-indigo-700 font-bold">
                <Sparkles size={20} /> AI Business Intelligence
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiInsights.map((insight, idx) => (
                  <div key={idx} className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 border-b border-indigo-50 pb-1">{insight.type}</div>
                    <h5 className="font-bold text-slate-800 text-sm mb-1">{insight.title}</h5>
                    <p className="text-xs text-slate-500 leading-relaxed">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="animate-in fade-in duration-300">
            {adminTab === 'dashboard' && currentRole === 'ADMIN' && (
              <Dashboard 
                medicines={medicines} 
                sales={sales} 
                appointments={appointments} 
              />
            )}
            {adminTab === 'daily-sales' && (
              <Pharmacy 
                medicines={medicines} 
                onSaleComplete={handleSaleComplete} 
                todaysSales={todaysSales}
                onDeleteSale={handleDeleteSale}
                onEditSale={handleEditSale}
                onPlaceOrder={handlePlaceOrder}
              />
            )}
            {adminTab === 'inventory' && (
              <Inventory 
                medicines={medicines}
                onAdd={handleAddMedicine}
                onEdit={handleEditMedicine}
                onDelete={handleDeleteMedicine}
              />
            )}
            {adminTab === 'appointments' && currentRole === 'ADMIN' && (
              <Appointments 
                appointments={appointments} 
                doctors={doctors} 
                onUpdateStatus={updateAppointmentStatus}
              />
            )}
            {adminTab === 'doctors' && currentRole === 'ADMIN' && (
              <DoctorsManager 
                doctors={doctors}
                onAdd={handleAddDoctor}
                onEdit={handleEditDoctor}
                onDelete={handleDeleteDoctor}
              />
            )}
            {adminTab === 'pharmacists' && currentRole === 'ADMIN' && (
              <PharmacistsManager 
                pharmacists={pharmacists}
                onAdd={handleAddPharmacist}
                onEdit={handleEditPharmacist}
                onDelete={handleDeletePharmacist}
              />
            )}
            {adminTab === 'history' && (
              <SalesHistory sales={sales} medicines={medicines} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;


import React, { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, Package, AlertTriangle 
} from 'lucide-react';
import { Medicine, Sale, Appointment } from '../types';

interface DashboardProps {
  medicines: Medicine[];
  sales: Sale[];
  appointments: Appointment[];
}

const Dashboard: React.FC<DashboardProps> = ({ medicines, sales, appointments }) => {
  
  // --- 1. Key Metrics Calculation ---
  const metrics = useMemo(() => {
    const totalRevenue = sales.reduce((acc, s) => acc + s.totalAmount, 0);
    
    // Calculate Profit (Revenue - Cost of Goods Sold)
    const totalProfit = sales.reduce((acc, s) => {
      const med = medicines.find(m => m.id === s.medicineId);
      const cost = med ? med.purchasePrice * s.quantity : 0;
      return acc + (s.totalAmount - cost);
    }, 0);

    const lowStockCount = medicines.filter(m => m.stock <= m.threshold).length;
    const outOfStockCount = medicines.filter(m => m.stock === 0).length;
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = appointments.filter(a => a.date === todayStr).length;

    return { totalRevenue, totalProfit, lowStockCount, outOfStockCount, todayAppointments };
  }, [sales, medicines, appointments]);

  // --- 2. Chart Data: Weekly Revenue & Profit ---
  const trendData = useMemo(() => {
    const last7Days = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const daySales = sales.filter(s => s.timestamp.startsWith(date));
      const dailyRevenue = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
      
      const dailyProfit = daySales.reduce((sum, s) => {
        const med = medicines.find(m => m.id === s.medicineId);
        const cost = med ? med.purchasePrice * s.quantity : 0;
        return sum + (s.totalAmount - cost);
      }, 0);

      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        Revenue: dailyRevenue,
        Profit: dailyProfit
      };
    });
  }, [sales, medicines]);

  // --- 3. Chart Data: Sales by Category ---
  const categoryData = useMemo(() => {
    const categoryMap: Record<string, number> = {};
    sales.forEach(sale => {
      const med = medicines.find(m => m.id === sale.medicineId);
      if (med) {
        categoryMap[med.category] = (categoryMap[med.category] || 0) + sale.totalAmount;
      }
    });

    return Object.entries(categoryMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 categories
  }, [sales, medicines]);

  const COLORS = ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <DollarSign size={100} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <TrendingUp size={20} />
            </div>
            <span className="text-slate-500 font-medium text-sm">Total Revenue</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">₹{metrics.totalRevenue.toLocaleString()}</h3>
          <p className="text-xs text-green-600 font-medium mt-1 flex items-center">
             Verified Real-time Data
          </p>
        </div>

        {/* Profit Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Activity size={100} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg">
              <DollarSign size={20} />
            </div>
            <span className="text-slate-500 font-medium text-sm">Est. Net Profit</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">₹{metrics.totalProfit.toLocaleString()}</h3>
          <p className="text-xs text-slate-400 mt-1">
             Based on MRP - Purchase Price
          </p>
        </div>

        {/* Inventory Health */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Package size={100} />
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <AlertTriangle size={20} />
            </div>
            <span className="text-slate-500 font-medium text-sm">Inventory Alerts</span>
          </div>
          <div className="flex gap-4">
             <div>
                <h3 className="text-2xl font-bold text-slate-800">{metrics.lowStockCount}</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Low Stock</p>
             </div>
             <div className="w-px bg-slate-200"></div>
             <div>
                <h3 className="text-2xl font-bold text-red-600">{metrics.outOfStockCount}</h3>
                <p className="text-[10px] text-slate-500 uppercase font-bold">Out of Stock</p>
             </div>
          </div>
        </div>

        {/* Appointments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Activity size={20} />
            </div>
            <span className="text-slate-500 font-medium text-sm">Today's Visits</span>
          </div>
          <h3 className="text-3xl font-bold text-slate-800">{metrics.todayAppointments}</h3>
          <p className="text-xs text-purple-600 mt-1 font-medium">
             Scheduled for {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Trend Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold text-slate-800">Financial Performance (Last 7 Days)</h4>
            <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Revenue</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Profit</div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="Revenue" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="Profit" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorProf)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h4 className="text-lg font-bold text-slate-800 mb-2">Sales by Category</h4>
          <p className="text-slate-400 text-xs mb-6">Top performing medicine categories</p>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categoryData} 
                  innerRadius={60} 
                  outerRadius={100} 
                  paddingAngle={5} 
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;

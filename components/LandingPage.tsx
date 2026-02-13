
import React from 'react';
import { ShieldCheck, UserPlus, HeartPulse, Stethoscope, ArrowRight, Activity, Pill } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'ADMIN' | 'PATIENT' | 'PHARMACIST') => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white px-8 py-4 shadow-sm flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <HeartPulse size={24} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight">SIT Pharmacy & Clinic</span>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Serving the community since 2010
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-green-100 rounded-full opacity-50 blur-3xl"></div>
        </div>

        <div className="text-center max-w-3xl mb-12 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-6 border border-blue-100">
            <Activity size={16} /> Now with AI-Powered Insights
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Healthcare Management <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Simplified for Everyone
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Welcome to SIT Pharmacy. Whether you are managing the facility or booking a visit, we have streamlined the experience for you.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl relative z-10">
          
          {/* Admin Login Card */}
          <div 
            onClick={() => onNavigate('ADMIN')}
            className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 cursor-pointer relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck size={120} className="text-blue-600" />
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Admin Portal</h3>
              <p className="text-slate-500 mb-6 text-sm">
                Full access to Inventory, Staff Management, Analytics, and Clinic settings.
              </p>
              <div className="flex items-center text-blue-600 font-bold group-hover:gap-2 transition-all text-sm">
                Login as Admin <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

          {/* Pharmacist Portal Card */}
          <div 
            onClick={() => onNavigate('PHARMACIST')}
            className="group bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-slate-100 cursor-pointer relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Pill size={120} className="text-emerald-600" />
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <Pill size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Pharmacist Portal</h3>
              <p className="text-slate-500 mb-6 text-sm">
                Daily sales logging, Medicine stock check, and Billing operations.
              </p>
              <div className="flex items-center text-emerald-600 font-bold group-hover:gap-2 transition-all text-sm">
                Login as Pharmacist <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

          {/* Patient Booking Card */}
          <div 
            onClick={() => onNavigate('PATIENT')}
            className="group bg-gradient-to-br from-indigo-600 to-blue-700 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-transparent cursor-pointer relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <UserPlus size={120} className="text-white" />
            </div>
            <div className="relative">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white mb-6">
                <Stethoscope size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Book Appointment</h3>
              <p className="text-blue-100 mb-6 text-sm">
                Check doctor availability and book your consultation slot instantly.
              </p>
              <div className="flex items-center text-white font-bold group-hover:gap-2 transition-all text-sm">
                Book Now <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>

        </div>
      </div>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} SIT Pharmacy & Clinic Management System. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;


import React, { useState } from 'react';
import { Calendar, User, Clock, CheckCircle2, XCircle, Search } from 'lucide-react';
import { Appointment, Doctor, AppointmentStatus } from '../types';

interface AppointmentsProps {
  appointments: Appointment[];
  doctors: Doctor[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
}

const Appointments: React.FC<AppointmentsProps> = ({ appointments, doctors, onUpdateStatus }) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredAppointments = appointments.filter(a => 
    filter === 'ALL' || a.status === filter
  );

  const getStatusColor = (status: AppointmentStatus) => {
    switch(status) {
      case AppointmentStatus.BOOKED: return 'bg-blue-50 text-blue-600';
      case AppointmentStatus.CHECKED_IN: return 'bg-orange-50 text-orange-600';
      case AppointmentStatus.COMPLETED: return 'bg-green-50 text-green-600';
      case AppointmentStatus.CANCELLED: return 'bg-red-50 text-red-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Daily Appointments</h2>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['ALL', 'BOOKED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.map(app => {
          const doc = doctors.find(d => d.id === app.doctorId);
          return (
            <div key={app.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                    {app.patientId.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Patient #{app.patientId}</h4>
                    <p className="text-xs text-slate-500">{doc?.name} • {doc?.specialization}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getStatusColor(app.status)}`}>
                  {app.status.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-sm font-medium">{app.date}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock size={16} className="text-slate-400" />
                  <span className="text-sm font-medium">{app.time}</span>
                </div>
              </div>

              <div className="flex gap-2">
                {app.status === AppointmentStatus.BOOKED && (
                  <button 
                    onClick={() => onUpdateStatus(app.id, AppointmentStatus.CHECKED_IN)}
                    className="flex-1 py-2 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg hover:bg-orange-100"
                  >
                    Check In
                  </button>
                )}
                {app.status === AppointmentStatus.CHECKED_IN && (
                  <button 
                    onClick={() => onUpdateStatus(app.id, AppointmentStatus.COMPLETED)}
                    className="flex-1 py-2 bg-green-50 text-green-600 text-xs font-bold rounded-lg hover:bg-green-100 flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 size={14} /> Finish Visit
                  </button>
                )}
                {app.status !== AppointmentStatus.CANCELLED && app.status !== AppointmentStatus.COMPLETED && (
                  <button 
                    onClick={() => onUpdateStatus(app.id, AppointmentStatus.CANCELLED)}
                    className="px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100"
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Appointments;

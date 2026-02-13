
import React, { useState } from 'react';
import { 
  ArrowLeft, Calendar, Clock, User, Phone, CheckCircle, Search, Stethoscope, ChevronRight, MessageCircle 
} from 'lucide-react';
import { Doctor, Appointment, AppointmentStatus } from '../types';

interface PatientPortalProps {
  doctors: Doctor[];
  onBook: (appointment: Partial<Appointment>) => void;
  onBack: () => void;
}

const PatientPortal: React.FC<PatientPortalProps> = ({ doctors, onBook, onBack }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [bookingToken, setBookingToken] = useState<string>('');
  
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    phone: '',
    age: '',
    gender: 'Male'
  });

  // Generate slots based on doctor's OPD hours (Mock logic for demo)
  const generateSlots = (opdHours: string) => {
    // Parsing logic is simplified for demo; returns static slots for now
    return [
      '10:00 AM', '10:15 AM', '10:30 AM', '10:45 AM',
      '11:00 AM', '11:15 AM', '11:30 AM',
      '05:00 PM', '05:15 PM', '05:30 PM'
    ];
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !selectedTime) return;

    // Generate a consistent Token ID for this session
    const newToken = `TK-${Math.floor(1000 + Math.random() * 9000)}`;
    setBookingToken(newToken);

    onBook({
      doctorId: selectedDoctor.id,
      patientId: patientDetails.name, // Using name as ID for demo simplicity
      date: selectedDate,
      time: selectedTime,
      status: AppointmentStatus.BOOKED
    });
    setStep(3);
  };

  const sendWhatsAppNotification = () => {
    if (!selectedDoctor) return;

    // Format the message
    const message = `
*✅ Appointment Confirmed!*

🏥 *SIT Pharmacy & Clinic*
👋 Hello ${patientDetails.name}, your appointment is scheduled.

🎫 *Token ID:* ${bookingToken}
👨‍⚕️ *Doctor:* ${selectedDoctor.name} (${selectedDoctor.specialization})
📅 *Date:* ${selectedDate}
⏰ *Time:* ${selectedTime}

📍 Please arrive 10 minutes early.
    `.trim();

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Clean phone number: remove non-digits
    let phone = patientDetails.phone.replace(/\D/g,'');

    // Heuristic: If user entered a 10-digit number (common in India/USA), append default Country Code (91 for India context)
    // If the number is already long (e.g. 12 digits), assume they included country code.
    if (phone.length === 10) {
      phone = '91' + phone; 
    }
    
    // Use api.whatsapp.com which is generally more robust for web-to-app deep linking than wa.me
    // If phone number is valid, send to that number.
    // If not, just open the message so user can pick a contact.
    let waUrl = '';
    
    if (phone.length >= 10) {
      waUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`;
    } else {
      // Fallback: Allows user to select contact if phone number is missing/invalid
      waUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
    }
    
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="bg-indigo-700 text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Patient Portal</h1>
            <p className="text-indigo-200 text-sm">SIT Pharmacy & Clinic</p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full p-6">
        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Search className="text-indigo-600" /> Select a Specialist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map(doc => (
                <div 
                  key={doc.id}
                  onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:border-indigo-500 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
                        <Stethoscope size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">
                          {doc.name}
                        </h3>
                        <p className="text-indigo-600 font-medium text-sm">{doc.specialization}</p>
                        <p className="text-slate-500 text-xs mt-2 flex items-center gap-1">
                          <Clock size={12} /> {doc.opdHours}
                        </p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedDoctor && (
          <div className="animate-in slide-in-from-right duration-500">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-slate-50 p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Book Appointment</h2>
                <p className="text-slate-500 text-sm">with {selectedDoctor.name} ({selectedDoctor.specialization})</p>
              </div>
              
              <form onSubmit={handleBooking} className="p-6 md:p-8 space-y-8">
                {/* Date & Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Select Date</label>
                    <input 
                      type="date" 
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Available Slots</label>
                    <div className="grid grid-cols-3 gap-2">
                      {generateSlots(selectedDoctor.opdHours).map(slot => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-1 text-xs font-bold rounded-lg border transition-all ${
                            selectedTime === slot 
                              ? 'bg-indigo-600 text-white border-indigo-600' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <User size={18} /> Patient Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Full Name"
                      required
                      className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={patientDetails.name}
                      onChange={e => setPatientDetails({...patientDetails, name: e.target.value})}
                    />
                    <div className="relative">
                      <input 
                        type="tel" 
                        placeholder="Phone (e.g. 9876543210)"
                        required
                        className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={patientDetails.phone}
                        onChange={e => setPatientDetails({...patientDetails, phone: e.target.value})}
                      />
                      <span className="absolute right-3 top-3 text-[10px] text-slate-400 bg-slate-50 px-1 rounded">No + needed</span>
                    </div>
                    <div className="flex gap-4">
                      <input 
                        type="number" 
                        placeholder="Age"
                        required
                        className="w-24 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={patientDetails.age}
                        onChange={e => setPatientDetails({...patientDetails, age: e.target.value})}
                      />
                      <select 
                        className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={patientDetails.gender}
                        onChange={e => setPatientDetails({...patientDetails, gender: e.target.value})}
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={!selectedTime || !patientDetails.name || !patientDetails.phone}
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:shadow-none"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center pt-12 animate-in zoom-in duration-500 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
              <CheckCircle size={64} />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
            <p className="text-slate-500 max-w-md mb-8">
              Your appointment with <strong>{selectedDoctor?.name}</strong> on <strong>{selectedDate}</strong> at <strong>{selectedTime}</strong> has been successfully booked.
            </p>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm w-full max-w-md mb-8 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Token ID</span>
                <span className="font-mono font-bold text-slate-800 text-lg">#{bookingToken}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Patient</span>
                <span className="font-bold text-slate-800">{patientDetails.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-500">Phone</span>
                <span className="font-bold text-slate-800">{patientDetails.phone}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full max-w-md">
               <button 
                onClick={sendWhatsAppNotification}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#20bd5a] transition-colors shadow-lg shadow-green-200"
              >
                <MessageCircle size={20} /> Send Details to WhatsApp
              </button>
              
              <button 
                onClick={() => {
                  setStep(1);
                  setPatientDetails({ name: '', phone: '', age: '', gender: 'Male' });
                  setSelectedTime('');
                  setBookingToken('');
                }}
                className="w-full px-8 py-4 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors"
              >
                Book Another Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientPortal;

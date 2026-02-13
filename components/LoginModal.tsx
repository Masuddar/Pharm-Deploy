
import React, { useState } from 'react';
import { X, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (u: string, p: string) => Promise<boolean>;
  role: 'ADMIN' | 'PHARMACIST';
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin, role }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for effect
    await new Promise(r => setTimeout(r, 600));

    const success = await onLogin(username, password);
    setIsLoading(false);

    if (success) {
      onClose();
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8 pb-6 text-center">
          <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg ${
            role === 'ADMIN' ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-emerald-600 text-white shadow-emerald-200'
          }`}>
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">
            {role === 'ADMIN' ? 'Admin Portal' : 'Pharmacist Portal'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">Please sign in to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg text-center border border-red-100 font-medium animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Enter username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button 
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!username || !password || isLoading}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 mt-4 ${
              role === 'ADMIN' 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
            } disabled:opacity-50 disabled:shadow-none`}
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;

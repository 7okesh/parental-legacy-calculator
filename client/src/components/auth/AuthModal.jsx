import React, { useState } from 'react';
import { User, Lock, Mail, X, AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();
  const { login, register } = useAuth();
  
  const [tab, setTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(email, password);
        setSuccess('Authentication successful. Loading workspace...');
      } else {
        await register(name, email, password);
        setSuccess('Account created and authenticated.');
      }
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || 'Unable to authenticate. Check credentials and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className={`
        w-full max-w-sm p-5 rounded-xl border shadow-xl transition-all
        ${isDark ? 'bg-[#111827] border-[#26324A] text-slate-100' : 'bg-white border-slate-200 text-slate-800'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-inherit">
          <div className="flex items-center space-x-2.5">
            <BrandLogo size={28} />
            <div>
              <h3 className="font-bold text-sm tracking-tight">Enterprise Access</h3>
              <p className="text-[11px] text-slate-400 font-mono">JWT Session Authentication</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className={`grid grid-cols-2 p-1 my-3.5 rounded-lg border text-xs ${
          isDark ? 'bg-[#151D2F] border-[#26324A]' : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            className={`py-1.5 rounded font-medium transition-colors ${
              tab === 'login' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            className={`py-1.5 rounded font-medium transition-colors ${
              tab === 'register' ? 'bg-blue-600 text-white font-semibold shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {tab === 'register' && (
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lokesh Prajapati"
                  className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 ${
                    isDark ? 'bg-[#151D2F] border-[#26324A] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-[#151D2F] border-[#26324A] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="h-3.5 w-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-8 pr-3 py-1.5 rounded-lg text-xs font-medium border focus:outline-none focus:border-blue-500 ${
                  isDark ? 'bg-[#151D2F] border-[#26324A] text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>
          </div>

          {error && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1.5 py-2 rounded-lg font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 shadow-sm flex items-center justify-center space-x-1.5 transition-colors"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            <span>{tab === 'login' ? 'Authenticate' : 'Create Account'}</span>
          </button>
        </form>

        <div className="mt-3.5 pt-2.5 border-t border-inherit text-[10px] text-center text-slate-500 font-mono">
          HS256 JWT • SHA-256 / bcrypt
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

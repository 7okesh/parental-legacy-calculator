import React from 'react';
import { 
  BarChart3, 
  UploadCloud, 
  Layers, 
  FileText, 
  Sparkles, 
  Moon, 
  Sun, 
  User, 
  LogOut,
  X
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenUpload, 
  onOpenHistory,
  onOpenAuth,
  mobileOpen,
  setMobileOpen
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { user, logout, isAuthenticated } = useAuth();

  const navItems = [
    { id: 'upload', label: 'Upload Data', icon: UploadCloud, action: onOpenUpload },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'career', label: 'Career Matrix', icon: Layers },
    { id: 'reports', label: 'Reports', icon: FileText, action: onOpenHistory },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static top-0 left-0 z-50 h-screen w-64 flex flex-col justify-between 
        border-r transition-transform duration-300 ease-in-out
        ${isDark ? 'bg-[#0e1424] border-[#1e2942]' : 'bg-white border-slate-200'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Header / Branding */}
        <div>
          <div className="flex items-center justify-between px-6 py-6 border-b border-inherit">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="font-extrabold text-base tracking-tight leading-none bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Quantum Vedic
                </div>
                <div className="text-[10px] font-semibold tracking-widest text-indigo-400 uppercase mt-1">
                  LEGACY ANALYTICS
                </div>
              </div>
            </div>

            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 rounded-lg hover:bg-slate-800/50 text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      setActiveTab(item.id);
                    }
                    setMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 font-semibold' 
                      : isDark 
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-[#161f36]' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.id === 'analytics' && (
                    <span className="ml-auto flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-200"></span>
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Settings & Auth */}
        <div className="p-4 border-t border-inherit space-y-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`
              w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium border transition-colors
              ${isDark 
                ? 'bg-[#141b30] border-[#222e4d] text-slate-300 hover:bg-[#1b2440]' 
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }
            `}
          >
            <span className="flex items-center space-x-2">
              {isDark ? <Moon className="h-3.5 w-3.5 text-indigo-400" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
              <span>{isDark ? 'Dark Theme' : 'Light Theme'}</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Switch</span>
          </button>

          {/* User Account / Login */}
          {isAuthenticated ? (
            <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#141b30] border-[#222e4d]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold truncate leading-tight">{user?.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
                </div>
              </div>
              <button 
                onClick={logout}
                title="Logout" 
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all"
            >
              <User className="h-3.5 w-3.5" />
              <span>Login / Register (JWT)</span>
            </button>
          )}

          {/* Author Badge */}
          <div className="text-[10px] text-center text-slate-500 pt-1">
            Built by <span className="text-indigo-400 font-medium">Lokesh Prajapati</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

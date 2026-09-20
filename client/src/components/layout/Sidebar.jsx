import React from 'react';
import { 
  BarChart3, 
  UploadCloud, 
  Layers, 
  FileText, 
  Moon, 
  Sun, 
  User, 
  LogOut,
  X
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
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
  const { isDark, toggleTheme } = useTheme();
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
        border-r transition-transform duration-200 ease-in-out
        ${isDark ? 'bg-[#0E1526] border-[#202C45]' : 'bg-white border-slate-200'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Top Header / Enterprise Branding */}
        <div>
          <div className="flex items-center justify-between px-5 py-5 border-b border-inherit">
            <div className="flex items-center space-x-3">
              <BrandLogo size={34} />
              <div>
                <div className={`font-bold text-sm tracking-tight leading-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  QUANTUM VEDIC
                </div>
                <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">
                  LEGACY ANALYTICS
                </div>
              </div>
            </div>

            <button 
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1 rounded-md hover:bg-slate-800 text-slate-400"
              aria-label="Close Sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Navigation Item List */}
          <nav className="p-3 space-y-1">
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
                    w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg font-medium text-xs transition-all duration-150
                    ${isActive 
                      ? isDark
                        ? 'bg-[#18233C] text-blue-400 font-semibold border-l-2 border-blue-500'
                        : 'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-600'
                      : isDark 
                        ? 'text-slate-400 hover:text-slate-200 hover:bg-[#141C30]' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className={`h-4 w-4 ${isActive ? (isDark ? 'text-blue-400' : 'text-blue-600') : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Settings & Auth */}
        <div className="p-3 border-t border-inherit space-y-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`
              w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium border transition-colors
              ${isDark 
                ? 'bg-[#121A2E] border-[#222E49] text-slate-300 hover:bg-[#18233C]' 
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }
            `}
          >
            <span className="flex items-center space-x-2">
              {isDark ? <Moon className="h-3.5 w-3.5 text-blue-400" /> : <Sun className="h-3.5 w-3.5 text-amber-500" />}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
              {isDark ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* User Account / Login */}
          {isAuthenticated ? (
            <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
              isDark ? 'bg-[#121A2E] border-[#222E49]' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className="h-6 w-6 rounded bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">
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
                className="p-1 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className={`
                w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors
                ${isDark 
                  ? 'bg-[#121A2E] border-[#263554] text-slate-200 hover:bg-[#18233C] hover:text-white' 
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }
              `}
            >
              <User className="h-3.5 w-3.5 text-slate-400" />
              <span>Sign In / Account</span>
            </button>
          )}

          {/* Subtle Metadata */}
          <div className="text-[10px] text-center text-slate-500 pt-1 font-mono">
            Platform v2.4 • Enterprise
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

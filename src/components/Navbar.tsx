import React from 'react';
import { User } from '../types';
import { Link2, LayoutDashboard, LogOut, ShieldAlert, LogIn, UserPlus, Gift } from 'lucide-react';

interface NavbarProps {
  user: User | null;
  currentPath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export default function Navbar({ user, currentPath, onNavigate, onLogout }: NavbarProps) {
  return (
    <nav className="bg-slate-950 border-b border-cyan-500/20 px-4 md:px-8 py-4 sticky top-0 z-50 backdrop-blur-md bg-slate-950/90" id="main-navbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onNavigate('/')} 
          className="flex items-center space-x-2 cursor-pointer group"
          id="navbar-logo"
        >
          <div className="bg-gradient-to-r from-cyan-500 to-green-400 p-2 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300">
            <Link2 className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <span className="text-xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-400 to-green-500 hover:brightness-110 transition-all">
            CLICK TO EARN
          </span>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center space-x-3 md:space-x-6" id="navbar-links-container">
          {user ? (
            <>
              {/* Common Dashboard Link */}
              <button 
                onClick={() => onNavigate('/dashboard')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  currentPath === '/dashboard' 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' 
                    : 'text-slate-300 hover:text-cyan-400 hover:bg-slate-900'
                }`}
                id="nav-btn-dashboard"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>

              {/* Withdrawals Link */}
              <button 
                onClick={() => onNavigate('/withdrawal')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  currentPath === '/withdrawal' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                    : 'text-slate-300 hover:text-emerald-400 hover:bg-slate-900'
                }`}
                id="nav-btn-withdraw"
              >
                <Gift className="w-4 h-4" />
                <span className="hidden sm:inline">Withdrawals</span>
              </button>

              {/* Admin Link (Only for admins) */}
              {(user.role === 'admin' || user.isAdmin) && (
                <button 
                  onClick={() => onNavigate('/admin/master-control-panel')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    currentPath === '/admin/master-control-panel' 
                      ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30' 
                      : 'text-slate-300 hover:text-pink-400 hover:bg-slate-900'
                  }`}
                  id="nav-btn-admin"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </button>
              )}

              {/* Logout Button */}
              <button 
                onClick={onLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all duration-200"
                id="nav-btn-logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onNavigate('/login')}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm font-semibold text-slate-300 hover:text-cyan-400 transition-all"
                id="nav-btn-login"
              >
                <LogIn className="w-4 h-4 mr-1" />
                Login
              </button>
              <button 
                onClick={() => onNavigate('/register')}
                className="flex items-center space-x-1 px-4 py-1.5 rounded-lg bg-cyan-500 text-slate-950 text-sm font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] hover:brightness-110 transition-all"
                id="nav-btn-signup"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

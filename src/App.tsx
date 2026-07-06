import React, { useState, useEffect } from 'react';
import { User } from './types';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Dashboard from './components/Dashboard';
import WithdrawalHistory from './components/WithdrawalHistory';
import AdminPanel from './components/AdminPanel';
import GatePage from './components/GatePage';
import AdminLoginPage from './components/AdminLoginPage';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Parse path matching gate /gate/:code/step
  const gateMatch = currentPath.match(/^\/gate\/([a-zA-Z0-9_-]+)\/(p1|p2|p3|p4)$/);

  useEffect(() => {
    // Restore session from localStorage on start
    const savedUser = localStorage.getItem('cte_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('cte_user');
      }
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    localStorage.setItem('cte_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cte_user');
    navigate('/');
  };

  const handleAdminLogout = () => {
    setUser(null);
    localStorage.removeItem('cte_user');
    navigate('/admin/login');
  };

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('cte_user', JSON.stringify(updatedUser));
  };

  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
    // Smooth scroll to top when changing views
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Is active page a Gate Page?
  const isGatePage = !!gateMatch;

  // Route Dispatcher
  const renderContent = () => {
    if (gateMatch) {
      const shortCode = gateMatch[1];
      const step = gateMatch[2] as 'p1' | 'p2' | 'p3' | 'p4';
      return <GatePage shortCode={shortCode} step={step} onNavigate={navigate} />;
    }

    switch (currentPath) {
      case '/':
        return <LandingPage user={user} onNavigate={navigate} />;
      case '/login':
        return <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />;
      case '/register':
        return <RegisterPage onRegisterSuccess={handleLoginSuccess} onNavigate={navigate} />;
      case '/dashboard':
        return user ? (
          <Dashboard user={user} onNavigate={navigate} onUserUpdate={handleUserUpdate} />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />
        );
      case '/withdrawal':
        return user ? (
          <WithdrawalHistory user={user} onUserUpdate={handleUserUpdate} />
        ) : (
          <LoginPage onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />
        );
      case '/admin/login':
        return <AdminLoginPage onLoginSuccess={handleLoginSuccess} onNavigate={navigate} />;
      case '/admin/master-control-panel':
        if (user && (user.role === 'admin' || user.isAdmin)) {
          return <AdminPanel user={user} onLogout={handleAdminLogout} />;
        } else {
          return (
            <AdminLoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigate={navigate}
              accessDeniedMsg="Access Denied: You must possess administrative credentials to access the master control panel."
            />
          );
        }
      default:
        return <LandingPage user={user} onNavigate={navigate} />;
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen font-sans flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="flex-1 flex flex-col">
        {/* Render Navbar only if it's NOT a distraction-free sequential Gate Page */}
        {!isGatePage && (
          <Navbar 
            user={user} 
            currentPath={currentPath} 
            onNavigate={navigate} 
            onLogout={handleLogout} 
          />
        )}
        
        {/* Render Active Route Layout */}
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>

      {/* Footer (Common for non-gate pages) */}
      {!isGatePage && (
        <footer className="bg-slate-950 border-t border-slate-900 py-6 text-center text-xs text-slate-500" id="common-footer">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>&copy; {new Date().getFullYear()} Click To Earn. All Rights Reserved.</span>
            <div className="flex space-x-4">
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); }} className="hover:text-cyan-400">Home</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }} className="hover:text-cyan-400">Login</a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }} className="hover:text-cyan-400">Sign Up</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

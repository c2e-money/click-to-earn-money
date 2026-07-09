import React, { useState, useEffect } from "react";
import { 
  BarChart3, Shield, LogOut, Link2, HelpCircle, 
  User as UserIcon, Globe, ShieldAlert, CreditCard, ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import RedirectLoop from "./components/RedirectLoop";
import AuthScreens from "./components/AuthScreens";
import UserDashboard from "./components/UserDashboard";
import AdminPanel from "./components/AdminPanel";
import WithdrawalsTab from "./components/WithdrawalsTab";
import SecurityTab from "./components/SecurityTab";
import { listenToUserProfile, logOutSession } from "./lib/firebaseService";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [user, setUser] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"dashboard" | "withdraw" | "security" | "admin">("dashboard");

  // Hook into active popstate navigation
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  // Sync user session on launch
  useEffect(() => {
    const savedUser = localStorage.getItem("click_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem("click_user");
      }
    }
  }, []);

  // Listen to active profile changes in real-time
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = listenToUserProfile(user.uid, (profile) => {
      if (profile) {
        // Force security check on role updates in real-time to prevent route bypass
        setUser(profile);
        localStorage.setItem("click_user", JSON.stringify(profile));
      } else {
        // Document deleted, force logout
        handleLogout();
      }
    });

    return () => unsubscribe();
  }, [user?.uid]);

  // Intercept manual /admin navigation and protect routes
  useEffect(() => {
    if (currentPath === "/admin") {
      if (user) {
        if (user.role === "admin") {
          setActiveTab("admin");
        } else {
          // Strictly block and redirect normal users
          window.history.pushState({}, "", "/");
          setCurrentPath("/");
          setActiveTab("dashboard");
        }
      }
    }
  }, [currentPath, user]);

  const handleLogout = async () => {
    await logOutSession();
    setUser(null);
    setActiveTab("dashboard");
    // Go home
    window.history.pushState({}, "", "/");
    setCurrentPath("/");
  };

  const handleAuthSuccess = (authUser: any) => {
    setUser(authUser);
    if (authUser.role === "admin" && currentPath === "/admin") {
      setActiveTab("admin");
    } else {
      setActiveTab("dashboard");
    }
  };

  // Helper route matching for shortener redirects
  const redirectMatch = currentPath.match(/^\/r\/([a-zA-Z0-9_\-]+)/);

  // Case 1: Monetization Redirect Loop
  if (redirectMatch) {
    const shortCode = redirectMatch[1];
    return <RedirectLoop shortCode={shortCode} />;
  }

  // Case 2: Unauthenticated Visitor
  if (!user) {
    return (
      <div className="min-h-screen bg-[#060911] flex flex-col justify-between" id="app-viewport">
        <header className="bg-[#0b0f19] border-b border-slate-800/80 sticky top-0 z-40 select-none px-4 py-4">
          <div className="max-w-md mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 text-white rounded-lg">
                <Link2 className="w-4.5 h-4.5" />
              </div>
              <span className="text-sm font-black text-white tracking-tight">
                Click To Earn Ultimate
              </span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2 py-1 rounded-full">
              Mobile Portal
            </span>
          </div>
        </header>

        <main className="flex-grow">
          <AuthScreens onAuthSuccess={handleAuthSuccess} />
        </main>

        <footer className="bg-[#0b0f19] border-t border-slate-900 py-4 text-center select-none">
          <div className="max-w-md mx-auto text-[10px] text-slate-600 font-bold">
            &copy; {new Date().getFullYear()} Click To Earn Ultimate. Optimized for Mobile.
          </div>
        </footer>
      </div>
    );
  }

  // Case 3: Fully Authenticated User View (Mobile Shell layout)
  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col justify-between" id="app-viewport">
      
      {/* Upper Navigation Bar */}
      <header className="bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 select-none px-4 py-3.5">
        <div className="max-w-md mx-auto flex justify-between items-center">
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-md shadow-indigo-600/15">
              <Link2 className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="text-sm font-black text-white tracking-tight">
              Click To Earn Ultimate
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Operator Identifier */}
            <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-bold text-slate-400 bg-[#131a2e] px-2.5 py-1.5 border border-slate-800 rounded-xl">
              <UserIcon className="w-3 h-3 text-indigo-400" />
              <span className="max-w-[80px] truncate">{user.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-all cursor-pointer"
              title="Log Out Session"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* Primary Workstation */}
      <main className="flex-grow pt-4">
        <div className="max-w-md mx-auto">
          {activeTab === "dashboard" ? (
            <UserDashboard userUid={user.uid} />
          ) : activeTab === "withdraw" ? (
            <WithdrawalsTab userUid={user.uid} />
          ) : activeTab === "security" ? (
            <SecurityTab 
              userUid={user.uid} 
              userEmail={user.email} 
              onProfileUpdated={(updated) => setUser(updated)} 
            />
          ) : user.role === "admin" ? (
            <AdminPanel userUid={user.uid} />
          ) : (
            <div className="p-6 text-center">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-2" />
              <h3 className="text-white font-bold">Unauthorized View</h3>
              <p className="text-xs text-slate-400 mt-1">Access to admin panels is protected by security constraints.</p>
            </div>
          )}
        </div>
      </main>

      {/* Premium Bottom Mobile Navigation Bar - Compact Touch Targets */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#0b0f19]/95 backdrop-blur-md border-t border-slate-800 py-2 shadow-2xl">
        <div className="max-w-md mx-auto px-4 flex justify-around items-center select-none">
          
          {/* Dashboard Trigger */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all ${
              activeTab === "dashboard" 
                ? "text-indigo-400 font-extrabold scale-105" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="text-[8px] uppercase tracking-wider font-extrabold">Dashboard</span>
          </button>

          {/* Withdraw Trigger */}
          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all ${
              activeTab === "withdraw" 
                ? "text-amber-400 font-extrabold scale-105" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-[8px] uppercase tracking-wider font-extrabold">Withdraw</span>
          </button>

          {/* Security Trigger */}
          <button
            onClick={() => setActiveTab("security")}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all ${
              activeTab === "security" 
                ? "text-indigo-400 font-extrabold scale-105" 
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[8px] uppercase tracking-wider font-extrabold">Security</span>
          </button>

          {/* Admin Control Trigger (Rendered conditional to match role) */}
          {user.role === "admin" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all ${
                activeTab === "admin" 
                  ? "text-rose-400 font-extrabold scale-105" 
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="text-[8px] uppercase tracking-wider font-extrabold">Admin</span>
            </button>
          )}

        </div>
      </nav>

    </div>
  );
}

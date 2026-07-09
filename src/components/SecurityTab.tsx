import React, { useState } from "react";
import { 
  ShieldCheck, Mail, Lock, AlertTriangle, CheckCircle, 
  Eye, EyeOff, KeyRound, ArrowRight
} from "lucide-react";
import { updateUserSecurityProfile } from "../lib/firebaseService";
import { User } from "../types";

interface SecurityTabProps {
  userUid: string;
  userEmail: string;
  onProfileUpdated?: (updatedUser: User) => void;
}

export default function SecurityTab({ userUid, userEmail, onProfileUpdated }: SecurityTabProps) {
  // Input fields state
  const [newEmail, setNewEmail] = useState(userEmail);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Re-auth modal controls
  const [showReauthModal, setShowReauthModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  // Password visibility triggers
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);

  // Status controls
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle Initial Submit Request
  const handlePreSubmitCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const emailModified = newEmail.trim().toLowerCase() !== userEmail.toLowerCase();
    const passwordModified = newPassword.length > 0;

    if (!emailModified && !passwordModified) {
      setError("No security details were changed.");
      return;
    }

    if (passwordModified) {
      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("New password and confirmation fields do not match.");
        return;
      }
    }

    // Trigger re-authentication dialog to secure session operations
    setShowReauthModal(true);
  };

  // Perform actual profile mutator operation after password verification
  const handleActualSecurityUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError("Current account password is required to verify your identity.");
      return;
    }

    setLoading(true);
    setShowReauthModal(false);

    try {
      const emailModified = newEmail.trim().toLowerCase() !== userEmail.toLowerCase() ? newEmail.trim() : undefined;
      const passwordModified = newPassword.length > 0 ? newPassword : undefined;

      const updatedUser = await updateUserSecurityProfile(
        userUid,
        emailModified,
        passwordModified,
        currentPassword
      );

      // Clean up modal password
      setCurrentPassword("");

      let message = "Account details updated successfully.";
      if (emailModified) {
        message = "Verification link has been sent to your new email. Please verify the link to complete change.";
      } else if (passwordModified) {
        message = "Session security credentials successfully updated.";
      }

      setSuccess(message);
      setNewPassword("");
      setConfirmPassword("");

      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }
    } catch (err: any) {
      setError(err.message || "Failed to update security profile details.");
      // Re-trigger modal so they can re-try password comfortably
      setCurrentPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-md mx-auto pb-12 px-4" id="security-tab-viewport">
      
      {/* 1. Header welcome */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <span className="text-xs font-bold text-indigo-400 tracking-wider uppercase">Authentication Gate</span>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Access & Credentials</h1>
        </div>
        <div className="px-3 py-1.5 bg-[#131a2e] border border-slate-800 rounded-2xl text-[10px] text-slate-400 font-bold select-none flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
          Re-auth mandated
        </div>
      </div>

      {/* 2. Main Profile Change Card */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
            <KeyRound className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-white uppercase tracking-tight">Security Credentials</h2>
        </div>

        <form onSubmit={handlePreSubmitCheck} className="space-y-4">
          
          {/* Email section */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Registered Email</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-500">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                placeholder="email@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-all font-mono"
                id="security-email-input"
              />
            </div>
            <p className="text-[9px] text-slate-500 mt-1">
              Email changes send a verification link to confirm the new address securely first.
            </p>
          </div>

          {/* New password input */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">New Password (Optional)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-all font-mono"
                id="security-new-password-input"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5"
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm new password */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Confirm New Password</label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-slate-500">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-600 transition-all font-mono"
                id="security-confirm-password-input"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5"
              >
                {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-300 rounded-xl text-xs flex gap-2 select-none">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 rounded-xl text-xs flex gap-2 select-none">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 transition-all cursor-pointer"
            id="security-submit-btn"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Encrypting updates...
              </>
            ) : (
              <>
                APPLY SECURITY CHANGES
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>
      </div>

      {/* 3. RE-AUTHENTICATION MODAL PANEL */}
      {showReauthModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-indigo-500/30 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-fade-in">
            
            <div className="flex items-center gap-2.5 text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-sm font-black text-white uppercase tracking-tight">
                Re-Authenticate Session
              </h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              To proceed with sensitive profile updating operations, please confirm your current account credentials first to guarantee account safety.
            </p>

            <form onSubmit={handleActualSecurityUpdate} className="space-y-4">
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full bg-[#131a2e] border border-slate-800 rounded-xl pl-9 pr-9 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                    id="reauth-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-2 text-slate-500 hover:text-slate-300 p-0.5"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowReauthModal(false);
                    setCurrentPassword("");
                  }}
                  className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-bold text-slate-300 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl transition-all flex items-center justify-center gap-1"
                  id="reauth-confirm-btn"
                >
                  Confirm Re-Auth
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

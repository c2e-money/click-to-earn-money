"use client";
export default function Settings() {
  return (
    <div className="h-screen bg-[#0b0e14] text-white p-4">
      <h1 className="text-lg font-black uppercase mb-6">Account Settings</h1>
      
      <div className="space-y-4">
        {/* Email & Password Change */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937]">
          <input type="email" placeholder="New Email" className="w-full bg-[#0b0e14] p-3 rounded-lg border border-[#1f2937] mb-2" />
          <input type="password" placeholder="New Password" className="w-full bg-[#0b0e14] p-3 rounded-lg border border-[#1f2937] mb-3" />
          <button className="w-full bg-purple-600 p-3 rounded-lg font-black text-xs uppercase">Update Profile</button>
        </div>

        {/* Contact Admin */}
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] text-center">
          <p className="text-gray-400 text-xs mb-3">Need help? Contact Admin</p>
          <a href="mailto:admin@c2e.com" className="block w-full bg-emerald-600 p-3 rounded-lg font-black text-xs uppercase">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}

"use client";
// ... (imports wahi rahenge)

export default function Login() {
  // ... (logic wahi rahega)

  return (
    <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center p-4">
      {/* Ab koi white strip nahi hogi, seedha dark background */}
      <div className="bg-[#131722] border border-[#1f2937] p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-black text-white mb-2 text-center">Create Account</h2>
        <p className="text-gray-400 text-sm text-center mb-6">Join us and start earning</p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0b0e14] border border-[#1f2937] text-white p-3 rounded-lg outline-none" required />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0b0e14] border border-[#1f2937] text-white p-3 rounded-lg outline-none" required />
          
          <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg">
            {loading ? "..." : "SIGN UP"}
          </button>
        </form>
      </div>
    </div>
  );
}

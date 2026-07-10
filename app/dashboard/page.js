"use client";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0b0e14] p-6 md:p-12">
      
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-2xl font-black text-white italic">CLICK TO EARN</h1>
        <p className="text-gray-500 text-sm font-medium">Welcome back, creator</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: "AVAILABLE BALANCE", val: "$1,250.75" },
          { label: "TOTAL CLICKS", val: "25.8M" },
          { label: "AVG CPM", val: "$4.25" }
        ].map((stat, i) => (
          <div key={i} className="bg-[#131722] border border-[#1f2937] p-6 rounded-3xl shadow-lg">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-black text-white mt-2">{stat.val}</p>
          </div>
        ))}
      </div>

      {/* Shortener Section */}
      <div className="bg-[#131722] border border-[#1f2937] p-8 rounded-3xl shadow-lg">
        <h2 className="text-lg font-bold text-white mb-6">Shorten New Link</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Paste your long URL here..." 
            className="flex-1 bg-[#0b0e14] border border-[#1f2937] text-white p-4 rounded-xl outline-none focus:border-purple-500 transition" 
          />
          <button className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-4 rounded-xl font-black text-white hover:opacity-90 transition">
            SHORTEN
          </button>
        </div>
      </div>
    </div>
  );
}

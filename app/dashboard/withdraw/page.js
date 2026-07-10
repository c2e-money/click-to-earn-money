"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  const [method, setMethod] = useState("phonepe");
  const [history] = useState([]);

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937] flex justify-between items-center shrink-0">
        <h1 className="text-lg font-black italic uppercase tracking-wider">WITHDRAW FUNDS</h1>
        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-black">LG</div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
        <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937]">
          <p className="text-[10px] text-gray-500 font-bold uppercase">Available Balance</p>
          <p className="text-3xl font-black text-emerald-400 mb-6">$0.00</p>
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm mb-3 outline-none">
            <option value="phonepe">PhonePe</option>
            <option value="gpay">Google Pay</option>
            <option value="paytm">Paytm</option>
            <option value="anyupi">Any UPI</option>
            <option value="paypal">PayPal</option>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
            <option value="bank">Bank Transfer</option>
          </select>
          <input type="number" placeholder="Enter Amount ($)" className="w-full bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937] text-sm mb-3 outline-none" />
          <button className="w-full bg-emerald-600 p-3 rounded-xl font-black text-xs uppercase">Withdraw Now</button>
        </div>
      </main>
      <Navbar active="withdraw" />
    </div>
  );
}

"use client";
import { useState } from "react";

export default function WithdrawPage() {
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState("");
  const [amount, setAmount] = useState("");

  const handleRequest = (e) => {
    e.preventDefault();
    alert(`LG Network: Withdrawal Request Sent via ${method}! Status is now PENDING.`);
    // Firebase backend me data push karne ka logic yaha aayega
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg border border-slate-200">
      <h2 className="text-3xl font-extrabold text-slate-800 mb-6">Withdraw Earnings</h2>
      
      <div className="bg-blue-50 text-blue-900 p-5 rounded-lg mb-8 border border-blue-200 flex justify-between items-center">
        <div>
          <p className="text-sm text-blue-700 mb-1">Available Balance</p>
          <p className="text-3xl font-black">$24.50</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-blue-700 mb-1">Current CPM</p>
          <p className="text-xl font-bold">$5.00</p>
        </div>
      </div>

      <form onSubmit={handleRequest} className="space-y-5">
        <div>
          <label className="block font-bold text-slate-700 mb-2">Select Payment Method</label>
          <select 
            className="w-full border border-slate-300 p-3 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" 
            value={method} 
            onChange={(e) => setMethod(e.target.value)} 
            required
          >
            <option value="" disabled>-- Select Method --</option>
            <option value="GooglePay">GooglePay (GPay)</option>
            <option value="PhonePe">PhonePe</option>
            <option value="UPI">UPI (Any App)</option>
            <option value="Bank">Bank Transfer</option>
            <option value="bKash">bKash</option>
            <option value="Nagad">Nagad</option>
            <option value="PayPal">PayPal</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-2">Payment Details (UPI ID / Number / Bank Info)</label>
          <textarea 
            className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            rows="3"
            placeholder="Enter your payment details carefully..."
            value={details} onChange={(e) => setDetails(e.target.value)} required
          ></textarea>
        </div>

        <div>
          <label className="block font-bold text-slate-700 mb-2">Amount to Withdraw ($)</label>
          <input 
            type="number" className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
            placeholder="Minimum $5" min="5" 
            value={amount} onChange={(e) => setAmount(e.target.value)} required 
          />
        </div>

        <button type="submit" className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-extrabold text-lg hover:bg-green-700 transition shadow-md hover:shadow-lg mt-4">
          Submit Withdrawal Request
        </button>
      </form>
    </div>
  );
              }
              

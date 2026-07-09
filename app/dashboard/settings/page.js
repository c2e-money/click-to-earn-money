"use client";
import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function Settings() {
  const [upi, setUpi] = useState("");
  const [loading, setLoading] = useState(false);

  const saveDetails = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateDoc(doc(db, "users", auth.currentUser.uid), { upiId: upi });
    alert("Payment details saved!");
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-6 p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
      <h2 className="text-xl font-black text-white mb-6">Payment Settings</h2>
      <form onSubmit={saveDetails} className="space-y-4">
        <input 
          type="text" 
          placeholder="Enter UPI ID (e.g. name@upi)" 
          value={upi} 
          onChange={(e) => setUpi(e.target.value)}
          className="w-full bg-neutral-950 border border-neutral-800 p-4 rounded-xl text-white font-bold"
        />
        <button className="w-full bg-emerald-500 py-4 rounded-xl font-black text-neutral-950">Save Details</button>
      </form>
    </div>
  );
}


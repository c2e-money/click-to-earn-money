"use client";
import { useState } from "react";
import Navbar from "@/app/components/Navbar";

export default function Settings() {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");

  const handleUpdate = () => {
    // Yahan "secret123" ki jagah tumhara actual logic hoga
    if (current !== "current_password_from_db") {
      alert("Error: Current password valid nahi hai!");
    } else {
      alert("Password Update ho gaya!");
    }
  };

  return (
    <div className="h-screen bg-[#0b0e14] text-white p-4">
      <h1 className="text-lg font-black uppercase mb-4">Settings</h1>
      <input type="password" placeholder="Current Password" onChange={(e) => setCurrent(e.target.value)} className="w-full bg-[#131722] p-3 rounded-lg mb-3 border border-[#1f2937]" />
      <input type="password" placeholder="New Password" onChange={(e) => setNewPass(e.target.value)} className="w-full bg-[#131722] p-3 rounded-lg mb-3 border border-[#1f2937]" />
      <button onClick={handleUpdate} className="w-full bg-purple-600 p-3 rounded-lg font-black uppercase">Update Password</button>
      
      {/* Navbar ka use yahan */}
      <Navbar active="settings" />
    </div>
  );
}

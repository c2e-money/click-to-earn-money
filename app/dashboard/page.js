"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <header className="p-4 border-b border-[#1f2937]">
        <h1 className="text-xl font-black italic">CLICK TO EARN</h1>
      </header>
      <main className="flex-1 p-4">
        <p>Dashboard Loading...</p>
      </main>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

// Navbar ko dynamic import karo taaki server-side rendering error na aaye
const Navbar = dynamic(() => import('../../components/Navbar'), { ssr: false });

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white font-sans overflow-hidden">
      {/* ... tumhara dashboard ka baaki content ... */}
      <Navbar />
    </div>
  );
}

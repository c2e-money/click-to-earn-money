"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase"; // <-- Dekh, ye import sabse upar hai
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import Navbar from "@/app/components/Navbar";

export default function Dashboard() {
  // Tera logic yahan...
  return (
    <div className="bg-[#0b0e14] min-h-screen text-white">
      {/* UI Code */}
    </div>
  );
}

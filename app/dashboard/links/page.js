"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/app/components/Navbar";

export default function Links() {
  const [links, setLinks] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem("loggedInUserId") || "guest";
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists()) setLinks(docSnap.data().links || []);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#0b0e14] text-white">
      <main className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        {links.map((l) => (
          <div key={l.id} className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
            <p className="text-xs">{l.alias}</p>
          </div>
        ))}
      </main>
      <Navbar active="links" />
    </div>
  );
}

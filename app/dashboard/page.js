"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase"; // Auth import kiya gaya
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔒 YAHAN SECURITY LOCK LAGAYA HAI
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Agar user login nahi hai, toh Login page par phenk do
        router.push("/"); 
      } else {
        // Agar login hai, toh uska data fetch karo
        fetchLinks(user.uid);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const fetchLinks = async (userId) => {
    // Database logic yahan aayega jab proper login ban jayega
    setLoading(false);
  };

  if (loading) return <div className="text-center mt-20 font-bold text-slate-500 text-lg">🔒 Verifying Security...</div>;

  return (
    <div className="mt-6 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-black text-slate-800 mb-4 px-2">My Links</h2>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {links.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            No links generated yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {/* Jab links aayenge toh list yahan banegi */}
          </ul>
        )}
      </div>
    </div>
  );
}

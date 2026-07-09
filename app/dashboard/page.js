"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        // User ka earnings data fetch karna
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) return <div className="text-center mt-20 font-bold text-slate-500">Loading Dashboard...</div>;

  return (
    <div className="mt-6 w-full max-w-md mx-auto px-4">
      <h2 className="text-2xl font-black text-slate-800 mb-6">Overview</h2>
      
      {/* Earnings Grid System */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-400 mb-1">CURRENT CPM</p>
          <p className="text-xl font-black text-blue-600">${userData?.cpm?.toFixed(2) || "0.00"}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-400 mb-1">TOTAL CLICKS</p>
          <p className="text-xl font-black text-slate-800">{userData?.totalClicks || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-xs font-bold text-slate-400 mb-1">TOTAL EARNINGS</p>
          <p className="text-xl font-black text-green-600">${userData?.totalEarnings?.toFixed(4) || "0.0000"}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-200 bg-blue-50">
          <p className="text-xs font-bold text-blue-700 mb-1">WALLET BALANCE</p>
          <p className="text-xl font-black text-slate-900">${userData?.walletBalance?.toFixed(4) || "0.0000"}</p>
        </div>
      </div>
      
      {/* Generate Link Button directly going to home */}
      <button onClick={() => router.push("/")} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-md">
        + Create New Short Link
      </button>
    </div>
  );
}

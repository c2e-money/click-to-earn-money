"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      // onSnapshot se data LIVE sync hota hai
      const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          
          // Agar Admin ne ban kar diya hai, toh turant bahar phenko
          if (data.status === "banned") {
            alert("Your account has been BANNED by the Admin.");
            signOut(auth);
            router.push("/login");
          } else {
            setUserData(data);
          }
        }
      });
      return () => unsub();
    }
  }, [router]);

  if (!userData) return null;

  return (
    <div className="mt-6 w-full max-w-md mx-auto px-4">
      <h2 className="text-2xl font-black text-slate-800 mb-6">LG Click To Earn - Live Stats</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] font-extrabold text-slate-400 mb-1 tracking-wider">YOUR CPM</p>
          <p className="text-2xl font-black text-blue-600">${userData.cpm?.toFixed(2) || "0.00"}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] font-extrabold text-slate-400 mb-1 tracking-wider">VALID CLICKS</p>
          <p className="text-2xl font-black text-slate-800">{userData.totalClicks || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-[10px] font-extrabold text-slate-400 mb-1 tracking-wider">TOTAL EARNED</p>
          <p className="text-2xl font-black text-green-600">${userData.totalEarnings?.toFixed(4) || "0.0000"}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-200 bg-blue-50">
          <p className="text-[10px] font-extrabold text-blue-700 mb-1 tracking-wider">WITHDRAWABLE</p>
          <p className="text-2xl font-black text-slate-900">${userData.walletBalance?.toFixed(4) || "0.0000"}</p>
        </div>
      </div>
      
      <button onClick={() => router.push("/")} className="w-full bg-blue-700 hover:bg-blue-800 text-white font-extrabold py-4 rounded-xl shadow-lg transition">
        + Create New Link
      </button>
    </div>
  );
}

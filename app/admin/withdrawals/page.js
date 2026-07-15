"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, getDoc, increment } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function WithdrawalCenter() {
  const [withdrawals, setWithdrawals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Purana logic: Centralized withdrawal list (Sabhi users ka ek jagah)
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let allW = [];
      snapshot.docs.forEach(uDoc => {
        const uData = uDoc.data();
        if (uData.withdrawals) {
          uData.withdrawals.forEach((w, i) => {
            allW.push({ ...w, uid: uDoc.id, index: i, userEmail: uData.email });
          });
        }
      });
      setWithdrawals(allW.sort((a, b) => new Date(b.date) - new Date(a.date)));
    });
    return () => unsub();
  }, []);

  const updateWithdrawalStatus = async (uid, index, amount, newStatus, currentStatus) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    let withdrawals = snap.data().withdrawals;
    
    // Purana logic: Reject par paisa wapas add karna
    if (currentStatus === 'Pending' && newStatus === 'Rejected') {
        await updateDoc(userRef, { walletBalance: increment(parseFloat(amount)) });
    }

    withdrawals[index].status = newStatus;
    await updateDoc(userRef, { withdrawals: withdrawals });
    alert("Updated!");
  };

  return (
    <div className="p-4 bg-[#050608] min-h-screen text-white">
      <button onClick={() => router.back()} className="text-[10px] font-black text-purple-500 mb-4 underline">← BACK TO MASTER PANEL</button>
      <h1 className="text-center font-black text-purple-500 mb-6 uppercase">Withdrawal Center</h1>
      
      <div className="space-y-4">
        {withdrawals.map((w, i) => (
          <div key={i} className="bg-[#0b0e14] p-4 rounded-xl border border-[#1f2937]">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400">{w.userEmail}</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${w.status === 'Paid' ? 'bg-emerald-900 text-emerald-400' : 'bg-yellow-900 text-yellow-400'}`}>{w.status}</span>
            </div>
            <p className="text-sm font-black">${w.amount} <span className="text-[9px] font-normal text-gray-500">ID: {w.id}</span></p>
            <p className="text-[10px] text-purple-400 font-bold mt-1">{w.method}</p>
            
            {/* Details Section */}
            <div className="text-[9px] text-gray-300 font-mono mt-2 bg-[#050608] p-2 rounded">
                {w.details && Object.entries(w.details).map(([k, v]) => (
                  <p key={k} className="capitalize">{k}: <span className="text-white">{v}</span></p>
                ))}
            </div>

            {w.status === 'Pending' && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => updateWithdrawalStatus(w.uid, w.index, w.amount, 'Paid', w.status)} className="bg-emerald-700 flex-1 py-2 rounded text-[10px] font-black">APPROVE</button>
                  <button onClick={() => updateWithdrawalStatus(w.uid, w.index, w.amount, 'Rejected', w.status)} className="bg-red-700 flex-1 py-2 rounded text-[10px] font-black">REJECT</button>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
              }

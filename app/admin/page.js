"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, setDoc, getDoc, increment } from "firebase/firestore";

export default function AdminPage() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [globalCpm, setGlobalCpm] = useState(5.00);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isAdmin) return;

    getDoc(doc(db, "settings", "global")).then(s => s.exists() && setGlobalCpm(s.data().cpm));

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
  }, [isAdmin]);

  // NAYA LOGIC: Status update ke saath Balance wapas add karna
  const updateWithdrawalStatus = async (uid, index, amount, newStatus, currentStatus) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    let withdrawals = snap.data().withdrawals;
    
    // Agar pehle 'Pending' tha aur ab 'Rejected' kar rahe hain, toh paisa return karo
    if (currentStatus === 'Pending' && newStatus === 'Rejected') {
        await updateDoc(userRef, {
            walletBalance: increment(parseFloat(amount))
        });
    }

    withdrawals[index].status = newStatus;
    await updateDoc(userRef, { withdrawals: withdrawals });
    alert("Status Updated & Balance Handled!");
  };

  if (!isAdmin) {
    return (
      <div className="h-screen bg-[#050608] flex items-center justify-center p-6 text-white">
        <div className="bg-[#0b0e14] p-8 rounded-3xl border border-[#1f2937] w-full max-w-sm">
          <h1 className="text-xl font-black mb-6 text-center text-purple-500">ADMIN LOGIN</h1>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl mb-3 border border-[#1f2937]" />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#050608] p-3 rounded-xl mb-4 border border-[#1f2937]" />
          <button onClick={() => email === "admin@c2e.com" && password === "admin123" ? setIsAdmin(true) : alert("No!")} className="w-full bg-purple-600 p-3 rounded-xl font-black uppercase">Access</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-[#050608] min-h-screen text-white pb-20">
      <h1 className="text-center font-black text-purple-500 mb-6 uppercase">Withdrawal Center</h1>
      
      {/* Global CPM */}
      <div className="bg-[#0b0e14] p-4 rounded-xl border border-purple-500 mb-6">
        <p className="text-[10px] font-black text-purple-300">GLOBAL CPM</p>
        <div className="flex gap-2 mt-2">
            <input type="number" value={globalCpm} onChange={(e) => setGlobalCpm(e.target.value)} className="bg-black p-2 rounded w-full text-sm font-black"/>
            <button onClick={() => setDoc(doc(db, "settings", "global"), { cpm: parseFloat(globalCpm) })} className="bg-purple-600 px-4 rounded font-black text-[10px]">SAVE</button>
        </div>
      </div>

      <div className="space-y-4">
        {withdrawals.map((w, i) => (
          <div key={i} className="bg-[#0b0e14] p-4 rounded-2xl border border-[#1f2937]">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400">{w.userEmail}</span>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded ${w.status === 'Paid' ? 'bg-emerald-900 text-emerald-400' : w.status === 'Rejected' ? 'bg-red-900 text-red-400' : 'bg-yellow-900 text-yellow-400'}`}>{w.status}</span>
            </div>
            <p className="text-sm font-black">${w.amount} <span className="text-[9px] font-normal text-gray-500">ID: {w.id}</span></p>
            <p className="text-[10px] text-purple-400 font-bold mt-1">{w.method}</p>
            
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
                         

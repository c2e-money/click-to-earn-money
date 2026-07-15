"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";

export default function Withdraw() {
  const [data, setData] = useState({ walletBalance: 0, withdrawals: [], paymentMethod: null });
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("");
  const [details, setDetails] = useState({});

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { if (u) { setUser(u); fetchData(u.uid); } });
    return () => unsub();
  }, []);

  const fetchData = async (uid) => {
    const docSnap = await getDoc(doc(db, "users", uid));
    if (docSnap.exists()) setData(docSnap.data());
  };

  const handleWithdraw = async () => {
    const wAmount = parseFloat(amount);
    if (wAmount < 5) return alert("Min $5");
    if (wAmount > data.walletBalance) return alert("Low balance");

    setLoading(true);
    try {
      const withdrawId = "WD-" + Date.now().toString().slice(-6); // UNIQUE ID
      await updateDoc(doc(db, "users", user.uid), {
        walletBalance: increment(-wAmount),
        withdrawals: arrayUnion({
          id: withdrawId,
          amount: wAmount.toFixed(2),
          method: data.paymentMethod.method,
          details: data.paymentMethod.details,
          status: 'Pending',
          date: new Date().toISOString()
        })
      });
      alert("Requested ID: " + withdrawId);
      setAmount("");
      fetchData(user.uid);
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#050608] text-white p-4 pb-24">
      <h1 className="text-purple-500 font-black uppercase mb-4">Withdraw</h1>
      <div className="space-y-4">
        {data.withdrawals?.slice().reverse().map((w, i) => (
          <div key={i} className="bg-[#0b0e14] p-4 rounded-xl border border-[#1f2937]">
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>ID: {w.id}</span>
              <span className={w.status === 'Paid' ? 'text-emerald-500' : 'text-yellow-500'}>{w.status}</span>
            </div>
            <p className="font-black">${w.amount}</p>
          </div>
        ))}
      </div>
      <Navbar active="withdraw" />
    </div>
  );
}

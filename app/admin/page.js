"use client";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]); // Separate list for withdrawals
  const [globalCpm, setGlobalCpm] = useState(5.00);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editVal, setEditVal] = useState({});

  useEffect(() => {
    if (!isAdmin) return;

    // Fetch Global CPM
    getDoc(doc(db, "settings", "global")).then(s => s.exists() && setGlobalCpm(s.data().cpm));

    // Live Users & Centralized Withdrawals Listener
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      let allUsers = [];
      let allW = [];
      
      snapshot.docs.forEach(uDoc => {
        const uData = uDoc.data();
        allUsers.push({ id: uDoc.id, ...uData });
        
        // Add to global withdrawal list
        if (uData.withdrawals) {
          uData.withdrawals.forEach((w, i) => {
            allW.push({ ...w, uid: uDoc.id, index: i, userEmail: uData.email });
          });
        }
      });
      setUsers(allUsers);
      setWithdrawals(allW.sort((a, b) => new Date(b.date) - new Date(a.date)));
    });
    return () => unsub();
  }, [isAdmin]);

  const updateUserData = async (uid, field, value) => {
    await updateDoc(doc(db, "users", uid), { [field]: value });
    alert("Updated!");
  };

  const updateWithdrawalStatus = async (uid, index, amount, newStatus, currentStatus) => {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    let withdrawals = snap.data().withdrawals;
    
    // Refund logic: Agar Reject hua toh paisa wapas add karo
    if (currentStatus === 'Pending' && newStatus === 'Rejected') {
        await updateDoc(userRef, { walletBalance: (snap.data().walletBalance || 0) + parseFloat(amount) });
    }

    withdrawals[index].status = newStatus;
    await updateDoc(userRef, { withdrawals: withdrawals });
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
      <h1 className="text-center font-black text-purple-500 mb-6 uppercase">Master Control Center</h1>
      
      {/* 1. Global CPM */}
      <div className="bg-[#0b0e14] p-4 rounded-xl border border-purple-500 mb-6">
          <p className="text-[10px] font-black text-purple-300">GLOBAL CPM</p>
          <div className="flex gap-2 mt-2">
            <input type="number" value={globalCpm} onChange={(e) => setGlobalCpm(e.target.value)} className="bg-black p-2 rounded w-full text-sm font-black"/>
            <button onClick={() => setDoc(doc(db, "settings", "global"), { cpm: parseFloat(globalCpm) })} className="bg-purple-600 px-4 rounded font-black text-[10px]">SAVE</button>
          </div>
      </div>

      {/* 2. Centralized Withdrawal Center */}
      <h2 className="text-xs font-black text-white mb-3 uppercase">Withdrawal Center</h2>
      <div className="space-y-3 mb-8">
        {withdrawals.map((w, i) => (
          <div key={i} className="bg-[#0b0e14] p-3 rounded-xl border border-[#1f2937]">
            <div className="flex justify-between text-[9px] font-bold text-gray-400">
               <span>{w.userEmail}</span>
               <span className={`px-2 py-0.5 rounded ${w.status === 'Paid' ? 'bg-emerald-900 text-emerald-400' : 'bg-yellow-900 text-yellow-400'}`}>{w.status}</span>
            </div>
            <p className="text-sm font-black">${w.amount} <span className="text-[9px] font-normal text-gray-500">ID: {w.id}</span></p>
            <div className="text-[9px] text-gray-300 font-mono mt-1 bg-[#1f2937] p-2 rounded">
                <p className="text-purple-400 font-bold mb-1">{w.method}</p>
                {w.details && Object.entries(w.details).map(([k, v]) => <p key={k} className="capitalize">{k}: {v}</p>)}
            </div>
            {w.status === 'Pending' && (
                <div className="flex gap-2 mt-2">
                  <button onClick={() => updateWithdrawalStatus(w.uid, w.index, w.amount, 'Paid', w.status)} className="bg-emerald-700 flex-1 py-1 rounded text-[9px] font-black">APPROVE</button>
                  <button onClick={() => updateWithdrawalStatus(w.uid, w.index, w.amount, 'Rejected', w.status)} className="bg-red-700 flex-1 py-1 rounded text-[9px] font-black">REJECT</button>
                </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. User Management List */}
      <h2 className="text-xs font-black text-white mb-3 uppercase">User Management</h2>
      {users.map(u => (
        <div key={u.id} className="bg-[#0b0e14] p-4 rounded-xl mb-4 border border-[#1f2937]">
          <div className="flex justify-between items-center mb-2">
             <p className="text-[10px] font-black text-emerald-400 uppercase">{u.email}</p>
             <p className="text-[9px] text-gray-500">Joined: {u.createdAt?.toDate().toLocaleDateString() || "N/A"}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <input type="number" placeholder={`Bal: ${u.walletBalance?.toFixed(2)}`} onChange={(e) => setEditVal({...editVal, [`bal_${u.id}`]: e.target.value})} className="bg-black p-2 text-xs rounded"/>
              <button onClick={() => updateUserData(u.id, "walletBalance", parseFloat(editVal[`bal_${u.id}`]))} className="bg-blue-600 rounded text-[9px] font-black">EDIT BAL</button>
              <input type="number" placeholder={`CPM: ${u.personalCpm || "Default"}`} onChange={(e) => setEditVal({...editVal, [`cpm_${u.id}`]: e.target.value})} className="bg-black p-2 text-xs rounded"/>
              <button onClick={() => updateUserData(u.id, "personalCpm", parseFloat(editVal[`cpm_${u.id}`]))} className="bg-orange-600 rounded text-[9px] font-black">EDIT CPM</button>
          </div>
        </div>
      ))}
    </div>
  );
      }
  

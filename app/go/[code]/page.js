"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function AdPage({ params }) {
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get("step")) || 1;
  const [timer, setTimer] = useState(step === 4 ? 5 : 30);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanContinue(true);
    }
  }, [timer]);

  const handleContinue = async () => {
    if (step < 4) {
      window.open(`/go/${params.code}?step=${step + 1}`, '_blank');
      window.close();
    } else {
      const q = query(collection(db, "urls"), where("shortCode", "==", params.code));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0].data();
        const settings = await getDoc(doc(db, "settings", "global"));
        const cpm = settings.exists() ? settings.data().cpm : 0;
        await updateDoc(doc(db, "users", docData.userId), {
          clicks: increment(1),
          earnings: increment(cpm / 1000)
        });
        window.location.href = docData.originalUrl;
      }
    }
  };

  return (
    <div className="bg-white min-h-screen text-black font-sans">
      {/* 1. Header Ad (Top) */}
      <div className="text-center py-2 bg-gray-100">
        <script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js"></script>
      </div>

      <div className="p-4">
        {/* Instruction Box (Yellow) */}
        <div className="border-2 border-yellow-300 bg-yellow-50 p-4 rounded-xl text-center mb-6">
          <p className="font-bold text-sm">👆👇 Click banner and wait {timer > 0 ? timer : 10}s to unlock link 👆👇</p>
          <p className="text-xs mt-2 text-red-600 font-bold">CLICK BANNER WAIT & BACK</p>
        </div>

        {/* 2. Main Ad Unit */}
        <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="flex justify-center my-8">
          <script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js"></script>
        </div>

        {/* Gap */}
        <div className="h-64"></div>

        {/* 3. Continue Button */}
        <button 
          onClick={handleContinue} 
          disabled={!canContinue}
          className={`w-full py-4 text-white font-bold text-lg rounded-lg ${canContinue ? "bg-blue-600" : "bg-gray-400"}`}
        >
          {timer > 0 ? `Please Wait ${timer}s` : "Continue"}
        </button>

        {/* 4. Footer Ad */}
        <div className="mt-10">
          <script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js"></script>
        </div>
      </div>
    </div>
  );
}

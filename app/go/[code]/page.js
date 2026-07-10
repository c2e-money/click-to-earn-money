"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function AdPage({ params }) {
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(30);
  const [dest, setDest] = useState("");
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "urls"), where("shortCode", "==", params.code));
      const snap = await getDocs(q);
      if (!snap.empty) setDest(snap.docs[0].data().originalUrl);
    }
    fetchData();
  }, [params.code]);

  useEffect(() => {
    const t = step === 4 ? 5 : 30;
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanContinue(true);
    }
  }, [timer, step]);

  const handleNext = async () => {
    if (step < 4) {
      // Pop-under triggering new tab
      window.open(window.location.origin + `/go/${params.code}?step=${step + 1}`, '_blank');
      window.close();
    } else {
      await updateStats();
      window.location.href = dest;
    }
  };

  const updateStats = async () => {
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
    }
  };

  return (
    <div className="bg-white min-h-screen text-black p-4">
      {/* Top Popup/Banner Injection */}
      <div className="mb-4">
         <script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js"></script>
      </div>

      <div className="text-center font-black text-xl mb-4">STEP {step} OF 4</div>

      {/* Dynamic Content */}
      <div className="my-8">
         <script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js"></script>
         <div id="container-b594fd33ac3477b8549752f47e5a4e56"></div>
      </div>

      {/* Aggressive Continue Button */}
      <button 
        onClick={handleNext} 
        disabled={!canContinue}
        className={`w-full py-6 font-black rounded-xl ${canContinue ? "bg-blue-600 text-white animate-bounce" : "bg-gray-300"}`}
      >
        {timer > 0 ? `WAIT ${timer}s` : "CLICK BANNER & CONTINUE"}
      </button>

      {/* Bottom Popup Injection */}
      <div className="mt-8">
        <script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js"></script>
      </div>
    </div>
  );
}

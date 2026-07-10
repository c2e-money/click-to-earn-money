"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function AdPage({ params }) {
  const [step, setStep] = useState(1); // 1, 2, 3 (30s) -> 4 (5s)
  const [timer, setTimer] = useState(30);
  const [dest, setDest] = useState("");

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "urls"), where("shortCode", "==", params.code));
      const snap = await getDocs(q);
      if (!snap.empty) setDest(snap.docs[0].data().originalUrl);
    }
    fetchData();
  }, [params.code]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (step < 4) {
      setStep(step + 1);
      setTimer(step === 3 ? 5 : 30); // Step 4 ke liye 5s
    } else {
      updateStats();
      window.location.href = dest;
    }
  }, [timer, step]);

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
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-black mb-4">Step {step} of 4</h1>
      <p className="mb-6 italic text-gray-400">Scroll and Wait: {timer}s</p>
      
      {/* AD TAGS GO HERE */}
      <div className="w-full max-w-sm">
        <script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js"></script>
        <div id="container-b594fd33ac3477b8549752f47e5a4e56"></div>
        <script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" async="async"></script>
        <script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js"></script>
      </div>
    </div>
  );
}

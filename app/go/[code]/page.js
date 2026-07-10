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
      // Agla step naye tab mein khulega
      window.open(`/go/${params.code}?step=${step + 1}`, '_blank');
      window.close();
    } else {
      // Final destination
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
    <div className="bg-white min-h-screen text-black p-4 flex flex-col items-center">
      <div className="font-black text-2xl mb-4">STEP {step} OF 4</div>

      {/* Ad Unit 1: Top */}
      <div className="my-4"><script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js"></script></div>

      <div className="text-center font-bold text-red-600 my-6 italic">👇 SCROLL DOWN FOR ADS 👇</div>

      {/* Ad Unit 2: Native Banner */}
      <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="my-10">
        <script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js"></script>
      </div>

      <div className="h-48"></div> {/* Bada gap */}

      {/* Ad Unit 3: Banner */}
      <div className="my-10">
        <script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js"></script>
      </div>

      {/* Continue Button */}
      <button 
        onClick={handleContinue} 
        disabled={!canContinue}
        className={`w-full py-6 font-black text-xl rounded-xl shadow-2xl ${canContinue ? "bg-blue-600 text-white animate-pulse" : "bg-gray-300"}`}
      >
        {timer > 0 ? `WAIT ${timer}s` : "CLICK BANNER & CONTINUE"}
      </button>

      {/* Ad Unit 4: Footer */}
      <div className="mt-20">
         <script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js"></script>
      </div>
    </div>
  );
        }

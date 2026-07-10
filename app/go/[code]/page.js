"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function AdPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get("step")) || 1;
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanContinue(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = async () => {
    window.open("https://rightyrely.com/hjp8zumk?key=47ecd200fbc88445d9ed4da82bf6ad5f", "_blank");
    if (step < 4) {
      router.push(`/go/${params.code}?step=${step + 1}`);
    } else {
      const q = query(collection(db, "urls"), where("shortCode", "==", params.code));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0].data();
        const settings = await getDoc(doc(db, "settings", "global"));
        const cpm = settings.exists() ? settings.data().cpm : 0;
        await updateDoc(doc(db, "users", docData.userId), { clicks: increment(1), earnings: increment(cpm / 1000) });
        window.location.href = docData.originalUrl;
      }
    }
  };

  return (
    <div className="bg-white text-black min-h-screen p-4 flex flex-col items-center">
      <div className="font-black text-xl mb-4">STEP {step} OF 4</div>
      
      {/* Script yahan direct daalo, useEffect mein mat daalo */}
      <script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js"></script>

      <div className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded-lg text-center font-bold text-xs my-4 w-full max-w-sm">
        👆👆 Click Banner Ads & Wait 15s To Unlock Your Link 👇👇
      </div>

      {/* Ad Unit Container */}
      <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="my-8">
        <script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js"></script>
      </div>

      <button 
        onClick={handleContinue}
        disabled={!canContinue}
        className={`w-full max-w-sm py-4 my-6 rounded-lg font-bold text-white ${canContinue ? "bg-blue-600" : "bg-gray-400"}`}
      >
        {canContinue ? "CONTINUE" : "PLEASE WAIT..."}
      </button>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function AdPage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get("step")) || 1;
  const [timer, setTimer] = useState(15);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanContinue(true);
    }
  }, [timer]);

  // Ads ko 'dangerouslySetInnerHTML' ya 'appendChild' se load karna padega
  useEffect(() => {
    const container = document.getElementById("ad-container");
    if (container && !container.innerHTML) {
      const script = document.createElement("script");
      script.src = "https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js";
      script.async = true;
      container.appendChild(script);
    }
  }, [step]);

  const handleContinue = async () => {
    // Popup Trigger
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
    <div className="bg-white min-h-screen text-black p-4 flex flex-col items-center">
      <div className="font-black text-xl mb-4">STEP {step} OF 4</div>
      
      <div className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded-lg text-center font-bold text-xs my-4 w-full max-w-sm">
        {timer > 0 ? `Please Wait ${timer}s to Unlock` : "👆👆 Click Banner Ads To Unlock 👇👇"}
      </div>

      {/* Ad Container */}
      <div id="ad-container" className="my-8 w-full max-w-sm min-h-[250px] border border-gray-200"></div>

      <button 
        onClick={handleContinue}
        disabled={!canContinue}
        className={`w-full max-w-sm py-4 my-6 rounded-lg font-bold text-white ${canContinue ? "bg-blue-600" : "bg-gray-400"}`}
      >
        {canContinue ? "CONTINUE" : `WAIT ${timer}s`}
      </button>
    </div>
  );
}

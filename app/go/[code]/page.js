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
    // 15 seconds timer
    const timer = setTimeout(() => setCanContinue(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  // Ads ko load karne ka dynamic tareeka
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js";
    script.async = true;
    document.body.appendChild(script);
  }, [step]);

  const handleContinue = async () => {
    // Popup open karo
    window.open("https://rightyrely.com/hjp8zumk?key=47ecd200fbc88445d9ed4da82bf6ad5f", "_blank");

    if (step < 4) {
      // Agla step load karo
      router.push(`/go/${params.code}?step=${step + 1}`);
    } else {
      // Final link
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
      <div className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded-lg text-center font-bold text-xs my-4 w-full max-w-sm">
        👆👆 Click This Ads Wait 15s & Back Now Unlock Your Link 👇👇
      </div>

      {/* Ad Units */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="my-4 border p-2 w-full max-w-sm text-center text-gray-400 text-[10px]">
          AD UNIT {i}
          <div id="container-b594fd33ac3477b8549752f47e5a4e56"></div>
        </div>
      ))}

      <button 
        onClick={handleContinue}
        className={`w-full max-w-sm py-4 my-6 rounded-lg font-bold text-white ${canContinue ? "bg-blue-600" : "bg-gray-400"}`}
      >
        {canContinue ? "CONTINUE" : "PLEASE WAIT..."}
      </button>
    </div>
  );
}

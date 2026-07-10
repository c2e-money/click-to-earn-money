"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function AdPage({ params }) {
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get("step")) || 1;
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    // 15 seconds timer for button
    const timer = setTimeout(() => setCanContinue(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = async () => {
    // Popup Ad Trigger (Smart Link)
    window.open("https://rightyrely.com/hjp8zumk?key=47ecd200fbc88445d9ed4da82bf6ad5f", "_blank");

    if (step < 4) {
      window.open(`/go/${params.code}?step=${step + 1}`, "_self");
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
      {/* Top Banner Ad */}
      <div className="my-2 w-full"><script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js"></script></div>

      {/* The Requested Layout */}
      <div className="w-full max-w-sm">
        <h2 className="text-center font-bold mb-2">Stream NBA games for free!</h2>
        
        {/* Yellow Box */}
        <div className="bg-yellow-50 border-2 border-yellow-300 p-3 rounded-lg text-center font-bold text-xs my-4">
          👆👆 Click Banner Ads & Wait 15s To Unlock Your Link 👇👇
        </div>

        {/* Ad Clusters (Units 3, 4, 5, 7, 8, 9, 12) */}
        {[3, 4, 5, 7, 8, 9, 12].map((id) => (
          <div key={id} className="my-4 bg-gray-100 p-2 text-center text-[10px] text-gray-500 border border-gray-200">
            ADS UNIT {id}
            <script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js"></script>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <button 
        onClick={handleContinue}
        disabled={!canContinue}
        className={`w-full max-w-sm py-4 my-6 rounded-lg font-bold text-white ${canContinue ? "bg-blue-500" : "bg-gray-400"}`}
      >
        CONTINUE
      </button>

      {/* Ad under Continue Button */}
      <div className="my-4 w-full max-w-sm">
        <script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js"></script>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import Script from "next/script";

export default function AdPage() {
  const { code } = useParams();
  const [step, setStep] = useState(1);
  const [targetUrl, setTargetUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      const docSnap = await getDoc(doc(db, "urls", code));
      if (docSnap.exists()) {
        setTargetUrl(docSnap.data().originalUrl);
      }
      setLoading(false);
    };
    fetchLink();
  }, [code]);

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // 4th Step complete: Earnings aur Click count update karo
      const urlRef = doc(db, "urls", code);
      const urlSnap = await getDoc(urlRef);
      const data = urlSnap.data();

      if (data.userId) {
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        const cpm = settingsSnap.exists() ? settingsSnap.data().cpm : 5.00;
        const earnings = cpm / 1000;

        await updateDoc(doc(db, "users", data.userId), {
          walletBalance: increment(earnings),
          earnings: increment(earnings),
          clicks: increment(1),
          [`dailyClicks.${new Date().toLocaleDateString('en-US', { weekday: 'short' })}`]: increment(1)
        });
        await updateDoc(urlRef, { clicks: increment(1) });
      }

      window.location.href = targetUrl;
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050608] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050608] flex flex-col items-center justify-center p-4">
      {/* Ads Scripts */}
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="lazyOnload" />
      
      <div className="bg-[#131722] p-8 rounded-3xl border border-[#1f2937] text-center w-full max-w-md">
        <h2 className="text-white text-lg font-black mb-2 uppercase">Step {step} of 4</h2>
        <p className="text-gray-500 text-[10px] mb-6">Complete all steps to continue to link.</p>
        
        {/* Ad Container */}
        <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="w-full min-h-[250px] mb-6 flex justify-center items-center bg-[#0b0e14] rounded-xl border border-[#1f2937]">
           <span className="text-xs text-gray-600">Ad Loading...</span>
        </div>

        <button 
          onClick={handleNext}
          className="w-full bg-purple-600 py-4 rounded-xl font-black text-white active:scale-95 transition-transform uppercase text-sm"
        >
          {step === 4 ? "GET LINK" : "NEXT STEP"}
        </button>
      </div>
    </div>
  );
}

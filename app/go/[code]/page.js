"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import Script from "next/script";
import ReCAPTCHA from "react-google-recaptcha";

export default function AdPage() {
  const { code } = useParams();
  const [step, setStep] = useState(1);
  const [targetUrl, setTargetUrl] = useState(null);
  const [timer, setTimer] = useState(10);
  const [canClick, setCanClick] = useState(false);
  const [verified, setVerified] = useState(false); // Captcha state
  const [loading, setLoading] = useState(true);

  // 1. URL Fetch & Back Button Trap
  useEffect(() => {
    const fetchLink = async () => {
      const docSnap = await getDoc(doc(db, "urls", code));
      if (docSnap.exists()) setTargetUrl(docSnap.data().originalUrl);
      setLoading(false);
    };
    fetchLink();

    // Back Button Trap
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [code]);

  // Timer Logic
  useEffect(() => {
    setCanClick(false);
    setVerified(false); // Reset captcha for new step
    setTimer(10);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClick(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  const handleNext = async () => {
    if (!canClick || !verified) return;

    if (step < 4) {
      setStep(step + 1);
    } else {
      // Earning & Click Logic
      const urlRef = doc(db, "urls", code);
      const urlSnap = await getDoc(urlRef);
      const data = urlSnap.data();

      if (data?.userId) {
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        const cpm = settingsSnap.exists() ? settingsSnap.data().cpm : 5.00;
        const earningPerClick = cpm / 1000;

        await updateDoc(doc(db, "users", data.userId), {
          walletBalance: increment(earningPerClick),
          earnings: increment(earningPerClick),
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
      {/* Header Ad Slot */}
      <div id="container-header-ad" className="mb-4"></div>

      <div className="bg-[#131722] p-8 rounded-3xl border border-[#1f2937] text-center w-full max-w-md">
        <h2 className="text-white text-lg font-black mb-2 uppercase">Step {step} of 4</h2>
        
        {/* Ad Space Slot */}
        <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="w-full min-h-[250px] mb-6 flex justify-center items-center bg-[#0b0e14] rounded-xl border border-[#1f2937]">
           <span className="text-xs text-gray-600">Ad Loading...</span>
        </div>

        {/* Captcha */}
        <div className="mb-6 flex justify-center">
          <ReCAPTCHA sitekey="YOUR_GOOGLE_RECAPTCHA_SITE_KEY" onChange={(val) => val && setVerified(true)} />
        </div>

        <button 
          onClick={handleNext}
          disabled={!canClick || !verified}
          className={`w-full py-4 rounded-xl font-black text-white uppercase text-sm transition-all ${canClick && verified ? 'bg-purple-600 active:scale-95' : 'bg-gray-700 cursor-not-allowed'}`}
        >
          {canClick ? (step === 4 ? "GET LINK" : "NEXT STEP") : `PLEASE WAIT (${timer}s)`}
        </button>
      </div>

      {/* Footer Ad Slot */}
      <div id="container-footer-ad" className="mt-4"></div>
      
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="lazyOnload" />
    </div>
  );
}

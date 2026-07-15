"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import Script from "next/script";

// Captcha ko dynamic load karo taki hydration error na aaye
import dynamic from 'next/dynamic';
const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

export default function AdPage() {
  const { code } = useParams();
  const [step, setStep] = useState(1);
  const [targetUrl, setTargetUrl] = useState(null);
  const [timer, setTimer] = useState(10);
  const [canClick, setCanClick] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLink = async () => {
      if (!code) return;
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

  useEffect(() => {
    setCanClick(false);
    setVerified(false);
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
      try {
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
      } catch (e) { console.error("Error updating:", e); }
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050608] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#050608] flex flex-col items-center justify-center p-4">
      {/* External Script Loading */}
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="lazyOnload" />

      <div className="bg-[#131722] p-8 rounded-3xl border border-[#1f2937] text-center w-full max-w-md">
        <h2 className="text-white text-lg font-black mb-2 uppercase">Step {step} of 4</h2>
        
        <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="w-full min-h-[250px] mb-6 flex justify-center items-center bg-[#0b0e14] rounded-xl border border-[#1f2937]">
           <span className="text-xs text-gray-600">Loading Ads...</span>
        </div>

        <div className="mb-6 flex justify-center">
          <ReCAPTCHA sitekey="YOUR_GOOGLE_RECAPTCHA_SITE_KEY" onChange={(val) => val && setVerified(true)} />
        </div>

        <button 
          onClick={handleNext}
          disabled={!canClick || !verified}
          className={`w-full py-4 rounded-xl font-black text-white uppercase text-sm ${canClick && verified ? 'bg-purple-600 active:scale-95' : 'bg-gray-700 cursor-not-allowed'}`}
        >
          {canClick ? (step === 4 ? "GET LINK" : "NEXT STEP") : `PLEASE WAIT (${timer}s)`}
        </button>
      </div>
    </div>
  );
    }

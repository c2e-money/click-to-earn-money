"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

export default function StepPage() {
  const { code, step } = useParams();
  const currentStep = parseInt(step);
  const [showModal, setShowModal] = useState(true);
  const [showContinue, setShowContinue] = useState(false);
  const [timer, setTimer] = useState(currentStep === 4 ? 5 : 20);

  // Popup aur Button timer ka logic
  useEffect(() => {
    // 15 seconds mein popup auto-close
    const modalTimer = setTimeout(() => setShowModal(false), 15000);
    // 10 seconds mein "Continue" button reveal
    const revealTimer = setTimeout(() => setShowContinue(true), 10000);
    
    // Page ka main timer (20s ya 5s)
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { clearTimeout(modalTimer); clearTimeout(revealTimer); clearInterval(countdown); };
  }, []);

  const handleContinue = () => {
    if (currentStep < 4) {
      // Agla step naye tab mein
      window.open(`/go/${code}/${currentStep + 1}`, "_blank");
    } else {
      // Last step: Redirect
      window.location.href = "/final-url"; 
    }
  };

  return (
    <div className="bg-[#050608] min-h-screen text-white p-4">
      {/* 1. POPUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative text-center">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-3 text-2xl font-bold text-gray-500">×</button>
            <h3 className="text-black font-black text-lg mb-4">👇👇 CLICK BANNER WAIT & BACK 👇👇</h3>
            <p className="text-black text-sm mb-6">Click Image & Wait 10s & Come back to <b>Get Link</b>.</p>
            
            {/* Modal Ad Container */}
            <div id="container-4f8b4de41cea03dc9d830849c3900efa" className="min-h-[250px] bg-gray-200 flex items-center justify-center">
               <Script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js" strategy="lazyOnload" />
            </div>
          </div>
        </div>
      )}

      {/* 2. PAGE HEADER */}
      <div className="flex justify-center mb-4">
        <Script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js" strategy="lazyOnload" />
      </div>

      <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937] text-center mb-8">
        <h2 className="text-xl font-black uppercase">Step {currentStep} of 4</h2>
      </div>

      {/* 3. MIDDLE AD */}
      <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] bg-gray-900 mb-8 rounded-xl flex items-center justify-center">
        <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
      </div>

      {/* 4. CONTINUE BUTTON */}
      {showContinue && (
        <div className="text-center mt-10">
          <p className="text-emerald-400 font-black mb-4">SCROLL DOWN & CONTINUE</p>
          <button 
            disabled={timer > 0}
            onClick={handleContinue}
            className={`w-full py-4 rounded-xl font-black ${timer > 0 ? "bg-gray-700" : "bg-purple-600 active:scale-95 transition-all"}`}
          >
            {timer > 0 ? `WAIT ${timer} SECONDS` : "CONTINUE"}
          </button>
        </div>
      )}

      {/* 5. FOOTER AD */}
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="afterInteractive" />
    </div>
  );
        }

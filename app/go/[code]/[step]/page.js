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

  useEffect(() => {
    // 15 seconds mein popup auto-close (no close button)
    const modalTimer = setTimeout(() => setShowModal(false), 15000);
    // 10 seconds mein "Continue" button reveal
    const revealTimer = setTimeout(() => setShowContinue(true), 10000);
    
    const countdown = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? (clearInterval(countdown), 0) : prev - 1));
    }, 1000);

    return () => { clearTimeout(modalTimer); clearTimeout(revealTimer); clearInterval(countdown); };
  }, []);

  const handleContinue = () => {
    if (currentStep < 4) window.open(`/go/${code}/${currentStep + 1}`, "_blank");
    else window.location.href = "/final-url";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white font-sans selection:bg-purple-500">
      
      {/* 1. FORCED POPUP */}
      {showModal && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#131722] border border-[#2d3748] rounded-3xl p-6 w-full max-w-sm text-center shadow-2xl shadow-purple-900/20">
            <h3 className="text-white font-black text-xl mb-3 animate-pulse">👇 CLICK BANNER & WAIT 👇</h3>
            <p className="text-gray-400 text-sm mb-6">Support us by clicking the ad below to unlock the next step.</p>
            <div id="container-4f8b4de41cea03dc9d830849c3900efa" className="min-h-[250px] bg-gray-900 rounded-xl flex items-center justify-center">
              <Script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js" strategy="lazyOnload" />
            </div>
            <p className="text-[10px] text-gray-500 mt-4">Auto-closing in 15s...</p>
          </div>
        </div>
      )}

      {/* 2. HEADER */}
      <header className="p-4 text-center border-b border-[#1f2937]">
        <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">STEPS PROGRESS</h1>
      </header>

      {/* 3. STEP INDICATOR */}
      <div className="max-w-md mx-auto mt-6 px-4">
        <div className="bg-[#131722] p-4 rounded-2xl border border-[#1f2937] flex justify-between items-center">
          <span className="text-gray-400 text-sm font-bold">CURRENT STEP</span>
          <span className="bg-purple-600 px-4 py-1 rounded-full font-black text-sm">{currentStep} / 4</span>
        </div>
      </div>

      {/* 4. MAIN CONTENT */}
      <main className="max-w-md mx-auto p-4 space-y-6">
        <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] bg-[#0b0e14] rounded-2xl border border-[#1f2937] flex items-center justify-center">
          <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
        </div>

        {showContinue && (
          <div className="text-center animate-fade-in">
            <p className="text-emerald-400 font-black mb-4 tracking-widest text-xs uppercase">Scroll down to continue</p>
            <button 
              disabled={timer > 0}
              onClick={handleContinue}
              className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${timer > 0 ? "bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-900/40 hover:scale-[1.02]"}`}
            >
              {timer > 0 ? `WAIT ${timer} SECONDS` : "CONTINUE"}
            </button>
          </div>
        )}
      </main>

      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="afterInteractive" />
    </div>
  );
}

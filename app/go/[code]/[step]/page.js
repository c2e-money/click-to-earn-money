"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

export default function StepPage() {
  const { code, step } = useParams();
  const router = useRouter();
  const currentStep = parseInt(step);
  
  const [showModal, setShowModal] = useState(true);
  const [showContinue, setShowContinue] = useState(false);
  const [timer, setTimer] = useState(currentStep === 4 ? 5 : 20);

  useEffect(() => {
    // 10 second wait ke baad "Continue" button reveal hoga
    const timer1 = setTimeout(() => setShowContinue(true), 10000);
    
    // Page load hone par timer shuru
    const timer2 = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer2);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { clearTimeout(timer1); clearInterval(timer2); };
  }, []);

  const handleContinue = () => {
    if (currentStep < 4) {
      window.open(`/go/${code}/${currentStep + 1}`, "_blank");
    } else {
      window.location.href = "/final-redirect-url"; // Apni final link yahan daalo
    }
  };

  return (
    <div className="bg-[#050608] min-h-screen text-white p-4">
      {/* 1. MODAL POPUP */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm relative text-center">
            <button onClick={() => setShowModal(false)} className="absolute top-2 right-3 text-2xl font-bold text-gray-500">×</button>
            <h3 className="text-black font-black text-lg mb-4">👇👇 CLICK BANNER WAIT & BACK 👇👇</h3>
            <p className="text-black text-sm mb-6">👇 Click Image & Wait 10 seconds & Come back this page to <b>Get Link - Download</b>.</p>
            <div className="min-h-[250px] bg-gray-200 flex items-center justify-center">
              <Script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js" strategy="lazyOnload" />
            </div>
          </div>
        </div>
      )}

      {/* 2. PAGE CONTENT */}
      <div className="flex justify-center mb-4">
        <Script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js" />
      </div>

      <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937] text-center mb-8">
        <h2 className="text-xl font-black uppercase">Step {currentStep} of 4</h2>
      </div>

      <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] bg-gray-900 mb-8 rounded-xl flex items-center justify-center">
        <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" />
      </div>

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

      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="afterInteractive" />
    </div>
  );
        }
        

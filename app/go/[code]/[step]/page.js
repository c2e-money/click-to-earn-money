"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

export default function StepPage() {
  const { code, step } = useParams();
  const currentStep = parseInt(step);
  const [showContinue, setShowContinue] = useState(false);
  const [timer, setTimer] = useState(currentStep === 4 ? 5 : 20); // Step 4 ke liye 5s, baaki ke liye 20s

  useEffect(() => {
    // 10 second wait ke baad "Scroll down" dikhana
    const timer1 = setTimeout(() => setShowContinue(true), 10000);
    
    // Total wait time (20s ya 5s) ke baad button active karna
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
  }, [currentStep]);

  const handleContinue = () => {
    if (currentStep < 4) {
      // Naye tab mein agla step kholo
      window.open(`/go/${code}/${currentStep + 1}`, "_blank");
    } else {
      // Final step par verification (Math captcha) + redirect
      alert("Verification Success! Redirecting...");
      window.location.href = "/final-url"; // Yahan apna target URL logic lagayein
    }
  };

  return (
    <div className="bg-[#050608] min-h-screen text-white p-4">
      {/* Banner Ad (Top) */}
      <div className="flex justify-center mb-4">
        <Script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js" />
      </div>

      {/* Instruction Card */}
      <div className="bg-[#131722] p-6 rounded-2xl border border-[#1f2937] text-center mb-8">
        <p className="text-sm font-bold animate-pulse">👆👆 Click Banner Ads Wait 10 Seconds & Back This Page To Get Link 👇👇</p>
      </div>

      {/* Other Ads (Middle) */}
      <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] bg-gray-900 mb-8 rounded-xl">
        <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" />
      </div>

      {/* Conditional Reveal */}
      {showContinue && (
        <div className="text-center mt-10">
          <p className="text-emerald-400 font-black mb-4">SCROLL DOWN & CONTINUE</p>
          <button 
            disabled={timer > 0}
            onClick={handleContinue}
            className={`w-full py-4 rounded-xl font-black ${timer > 0 ? "bg-gray-700" : "bg-purple-600"}`}
          >
            {timer > 0 ? `WAIT ${timer} SECONDS` : "CONTINUE"}
          </button>
        </div>
      )}

      {/* Bottom Ads */}
      <div className="mt-10">
        <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" />
      </div>
    </div>
  );
        }
        

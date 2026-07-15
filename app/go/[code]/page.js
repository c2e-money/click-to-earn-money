"use client";
import { useEffect, useState } from "react";
import Script from "next/script";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";

export default function AdPage({ params }) {
  const [targetUrl, setTargetUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processClick = async () => {
      const code = params.code;
      
      try {
        const urlRef = doc(db, "urls", code);
        const urlSnap = await getDoc(urlRef);

        if (urlSnap.exists()) {
          const data = urlSnap.data();
          setTargetUrl(data.originalUrl);

          await updateDoc(urlRef, { clicks: increment(1) });

          const settingsSnap = await getDoc(doc(db, "settings", "global"));
          const cpm = settingsSnap.exists() ? settingsSnap.data().cpm : 5.00;
          
          if (data.userId) {
              const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short' }); 
              
              // LOGIC: Jab koi link click karega, dono mein plus hoga.
              await updateDoc(doc(db, "users", data.userId), { 
                  walletBalance: increment(cpm / 1000), // Pura paisa judega
                  earnings: increment(cpm / 1000),      // Lifetime total earnings
                  clicks: increment(1),                 
                  [`dailyClicks.${todayStr}`]: increment(1) 
              });
          }
        }
      } catch (e) {
        console.error("Firebase Error:", e);
      }
      setLoading(false);
    };

    processClick();
  }, [params.code]);

  if (loading) {
    return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white font-bold">Loading...</div>;
  }

  if (!targetUrl) {
    return <div className="min-h-screen bg-[#0b0e14] flex items-center justify-center text-white font-bold">Invalid Link or Removed</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-4">
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="lazyOnload" />
      <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
      
      <div className="bg-[#131722] p-8 rounded-3xl border border-[#1f2937] text-center w-full max-w-md shadow-2xl">
        <h2 className="text-white text-xl font-black mb-6 uppercase">Verify To Continue</h2>
        
        <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="w-full min-h-[100px] mb-6 flex justify-center items-center bg-[#0b0e14] rounded-xl overflow-hidden border border-[#1f2937]">
           <span className="text-xs text-gray-600">Ad Loading...</span>
        </div>

        <button 
          onClick={() => window.open(targetUrl, "_self")}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-600 py-4 rounded-xl font-black text-white shadow-lg active:scale-95 transition-transform uppercase"
        >
          CONTINUE TO LINK
        </button>
      </div>
    </div>
  );
    }

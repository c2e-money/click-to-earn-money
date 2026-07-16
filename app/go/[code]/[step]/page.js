"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

// --- FIREBASE IMPORT & CONFIG ---
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3Yl0BR4o6qEX6MeXYjX6Qjlr5BCid5C8",
  authDomain: "my-website-242fc.firebaseapp.com",
  projectId: "my-website-242fc",
  storageBucket: "my-website-242fc.firebasestorage.app",
  messagingSenderId: "78108710064",
  appId: "1:78108710064:web:7b5e79f33721fbc7f71775"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
// --------------------------------

export default function StepPage() {
  const { code, step } = useParams();
  const currentStep = parseInt(step);
  const router = useRouter();
  
  // States
  const [showModal, setShowModal] = useState(currentStep !== 4); // Step 4 par popup nahi aayega
  const [showContinue, setShowContinue] = useState(false);
  const [timer, setTimer] = useState(currentStep === 4 ? 5 : 15);
  const [isFetching, setIsFetching] = useState(false);

  // SVG Circular Timer Math (Only for Step 4)
  const totalTime = currentStep === 4 ? 5 : 15;
  const timerDashoffset = 251 - (251 * (timer / totalTime));

  useEffect(() => {
    const modalTimer = setTimeout(() => setShowModal(false), 15000);
    const revealTimer = setTimeout(() => setShowContinue(true), 10000);
    const countdown = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? (clearInterval(countdown), 0) : prev - 1));
    }, 1000);

    return () => { clearTimeout(modalTimer); clearTimeout(revealTimer); clearInterval(countdown); };
  }, []);

  const handleContinue = async () => {
    setIsFetching(true);
    
    try {
      let destinationUrl = null;
      let targetDocRef = null;

      // 1. Database Search Logic
      const docSnap = await getDoc(doc(db, "urls", code));
      if (docSnap.exists() && docSnap.data().originalUrl) {
        destinationUrl = docSnap.data().originalUrl; 
        targetDocRef = doc(db, "urls", code);
      }
      
      if (!destinationUrl) {
        const qCode = query(collection(db, "urls"), where("code", "==", code));
        const snapCode = await getDocs(qCode);
        if (!snapCode.empty && snapCode.docs[0].data().originalUrl) {
          destinationUrl = snapCode.docs[0].data().originalUrl; 
          targetDocRef = snapCode.docs[0].ref;
        }
      }
      
      if (!destinationUrl) {
        const qAlias = query(collection(db, "urls"), where("alias", "==", code));
        const snapAlias = await getDocs(qAlias);
        if (!snapAlias.empty && snapAlias.docs[0].data().originalUrl) {
          destinationUrl = snapAlias.docs[0].data().originalUrl; 
          targetDocRef = snapAlias.docs[0].ref;
        }
      }

      // 2. CLICK COUNT UPDATE (SIRF STEP 4 PAR)
      if (currentStep === 4 && targetDocRef) {
        try { 
          await updateDoc(targetDocRef, { clicks: increment(1) }); 
          console.log("Click count +1 successful");
        } catch (e) {
          console.error("Click update failed", e);
        }
      }

      // 3. FINAL REDIRECT
      if (currentStep < 4) {
        window.open(`/go/${code}/${currentStep + 1}`, "_blank");
        setIsFetching(false);
      } else {
        if (destinationUrl) {
          window.location.href = destinationUrl;
        } else {
          alert(`Link not found for: ${code}`); 
          setIsFetching(false);
        }
      }
    } catch (error) {
      alert("System Error: " + error.message); 
      setIsFetching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-800 font-sans relative flex flex-col pb-6">
      
      {/* BACKGROUND ADS */}
      <Script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js" strategy="afterInteractive" />
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="afterInteractive" />

      {/* HEADER */}
      <nav className="bg-[#0f172a] text-white p-4 shadow-md flex justify-between items-center z-10">
        <div className="font-bold text-xl tracking-wide">CLICK TO EARN</div>
        <button className="border border-gray-500 rounded px-3 py-1 bg-gray-800 text-sm">☰</button>
      </nav>

      {/* POPUP MODAL (Only for Step 1 to 3) */}
      {showModal && currentStep !== 4 && (
        <div className="fixed inset-0 bg-gray-500/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-[340px] text-center shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute -top-3 -right-1 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 shadow-md font-bold text-lg"
            >
              ×
            </button>
            <h3 className="text-[#0a3d62] font-bold text-lg mb-2">👇 CLICK BANNER & WAIT 👇</h3>
            <p className="text-black text-sm font-semibold mb-4">Click Image & Wait 10s to get link.</p>
            <div className="w-[300px] h-[250px] mx-auto bg-gray-200 border border-gray-300">
              <iframe 
                srcDoc={`<html><head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #e5e7eb; }</style></head><body><script type="text/javascript">atOptions = {'key' : 'de5e912a7a8c5518645029951b957f5f','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</script><script type="text/javascript" src="https://rightyrely.com/de5e912a7a8c5518645029951b957f5f/invoke.js"></script></body></html>`}
                width="300" height="250" frameBorder="0" scrolling="no"
              />
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA - flex-grow ensures it takes full height so mt-auto works */}
      <main className="flex-grow flex flex-col w-full max-w-xl mx-auto px-4 mt-6 space-y-6">
        
        {/* ========================================== */}
        {/* STEP 4 UI (Premium Look at Top, Ads at Bottom) */}
        {/* ========================================== */}
        {currentStep === 4 ? (
          <>
            {/* Main Premium UI Box */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md w-full">
              <div className="text-center font-bold mb-4 text-gray-700">STEP 4 OF 4</div>
              
              {/* Circular Timer */}
              <div className="relative w-32 h-32 mx-auto my-6 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                  <circle cx="64" cy="64" r="40" stroke="#0275d8" strokeWidth="8" fill="none"
                          strokeDasharray="251" strokeDashoffset={timerDashoffset}
                          className="transition-all duration-1000 ease-linear" strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <div className="text-4xl font-black text-gray-800">{timer}</div>
                  <div className="text-[10px] text-gray-500 tracking-widest font-bold uppercase mt-1">Seconds</div>
                </div>
              </div>

              {/* Status Box */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-full text-xl">🚀</div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-800">Preparing your secure link...</p>
                  <p className="text-xs text-blue-600 font-semibold mt-0.5">{timer > 0 ? "Please wait a moment" : "Almost ready!"}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  disabled={timer > 0 || isFetching}
                  onClick={handleContinue}
                  className={`w-full flex items-center justify-center p-4 rounded-xl font-bold transition-all gap-2 ${
                    timer > 0 
                      ? 'bg-gray-100 border border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-[#0275d8] border border-[#0275d8] text-white hover:bg-blue-700 shadow-md'
                  }`}
                >
                  {timer > 0 ? (
                    `WAIT ${timer}s`
                  ) : isFetching ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      VERIFYING...
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🔗</span> GET YOUR DESTINATION LINK
                    </>
                  )}
                </button>

                {/* Landing Page Redirect Button */}
                <button 
                  onClick={() => window.location.href = "/"}
                  className="w-full flex items-center justify-center gap-2 p-4 rounded-xl font-bold bg-white border-2 border-purple-500 text-purple-600 hover:bg-purple-50 transition-all shadow-sm"
                >
                  <span className="text-lg">✨</span> CREATE THE SAME LINK FOR YOU
                </button>
              </div>

              {/* Features Row */}
              <div className="flex justify-between mt-8 text-center divide-x divide-gray-200">
                <div className="flex-1 px-1">
                  <span className="text-blue-500 text-xl block mb-1">🛡️</span>
                  <p className="text-[11px] text-gray-800 font-bold">100% Secure</p>
                </div>
                <div className="flex-1 px-1">
                  <span className="text-blue-500 text-xl block mb-1">⚡</span>
                  <p className="text-[11px] text-gray-800 font-bold">Super Fast</p>
                </div>
                <div className="flex-1 px-1">
                  <span className="text-emerald-500 text-xl block mb-1">💵</span>
                  <p className="text-[11px] text-gray-800 font-bold">Earn Money</p>
                </div>
              </div>
            </div>

            {/* Step 4 Ads (Pushed to bottom) */}
            <div className="w-full mt-4 space-y-4">
              <div className="w-full bg-white p-2 rounded shadow-sm border border-gray-200 flex flex-col items-center">
                <span className="text-[10px] text-gray-400 mb-1 font-bold">ADVERTISEMENT</span>
                <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] w-full bg-gray-50 flex items-center justify-center">
                  <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ========================================== */
          /* STEP 1-3 UI (Buttons pushed to bottom)     */
          /* ========================================== */
          <>
            <div className="w-full bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-sm text-center">
              <p className="font-bold text-lg">STEP {currentStep} OF 4</p>
              <p className="text-sm font-medium">Please complete all steps to get your destination link.</p>
            </div>
            
            {showContinue && (
              <div className="w-full text-center mt-2 animate-bounce">
                <p className="text-red-600 font-bold text-lg uppercase tracking-wide">Scroll Down & Click Continue 👇</p>
              </div>
            )}

            {/* Top Ad for Step 1-3 */}
            <div className="w-full bg-white p-2 rounded shadow-sm border border-gray-200 flex flex-col items-center">
              <span className="text-[10px] text-gray-400 mb-1 font-bold">ADVERTISEMENT</span>
              <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] w-full bg-gray-50 flex items-center justify-center">
                <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
              </div>
            </div>

            {/* This div uses mt-auto to push everything inside it to the absolute bottom of the screen */}
            <div className="w-full mt-auto space-y-4 pt-10">
              {/* Keep Scrolling Dummy Box */}
              <div className="h-32 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg opacity-60">
                <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">Keep Scrolling</p>
              </div>
              
              {/* Bottom Button */}
              <div className="w-full text-center md:w-1/2 mx-auto">
                <button 
                  disabled={timer > 0 || isFetching}
                  onClick={handleContinue}
                  className={`w-full py-4 px-4 rounded font-black text-white shadow-md transition-all text-lg ${
                    timer > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#0275d8] hover:bg-[#025aa5] animate-pulse"
                  }`}
                >
                  {timer > 0 ? `Please Wait... ${timer}s` : "CONTINUE NEXT STEP"}
                </button>
              </div>

              {/* Bottom Ad for Step 1-3 */}
              <div className="w-full max-w-[320px] mx-auto bg-white p-2 rounded shadow-sm border border-gray-200 flex flex-col items-center">
                <span className="text-[10px] text-gray-400 mb-1 font-bold">SPONSORED</span>
                <div className="w-[300px] h-[250px] bg-gray-50 flex items-center justify-center overflow-hidden">
                  <iframe 
                    srcDoc={`<html><head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f9fafb; }</style></head><body><script type="text/javascript">atOptions = {'key' : 'de5e912a7a8c5518645029951b957f5f','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</script><script type="text/javascript" src="https://rightyrely.com/de5e912a7a8c5518645029951b957f5f/invoke.js"></script></body></html>`}
                    width="300" height="250" frameBorder="0" scrolling="no"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
    }
    

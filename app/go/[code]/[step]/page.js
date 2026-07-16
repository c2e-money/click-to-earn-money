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
  
  const [showModal, setShowModal] = useState(true);
  const [timer, setTimer] = useState(currentStep === 4 ? 5 : 15);
  const [isFetching, setIsFetching] = useState(false);

  // Initial Timer (Circled glow timer)
  const totalTime = currentStep === 4 ? 5 : 15;
  const timerDashoffset = 477 - (477 * (timer / totalTime));

  useEffect(() => {
    const modalTimer = setTimeout(() => setShowModal(false), 15000);
    const countdown = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? (clearInterval(countdown), 0) : prev - 1));
    }, 1000);

    return () => { clearTimeout(modalTimer); clearInterval(countdown); };
  }, []);

  const handleContinue = async () => {
    if (currentStep < 4) {
      window.open(`/go/${code}/${currentStep + 1}`, "_blank");
    } else {
      setIsFetching(true);
      try {
        let destinationUrl = null;
        let targetDocRef = null;

        // 1. Doc ID
        const docRef = doc(db, "urls", code);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().originalUrl) {
          destinationUrl = docSnap.data().originalUrl;
          targetDocRef = docRef;
        }

        // 2. 'code' field
        if (!destinationUrl) {
          const qCode = query(collection(db, "urls"), where("code", "==", code));
          const snapCode = await getDocs(qCode);
          if (!snapCode.empty && snapCode.docs[0].data().originalUrl) {
            destinationUrl = snapCode.docs[0].data().originalUrl;
            targetDocRef = snapCode.docs[0].ref;
          }
        }

        // 3. 'alias' field
        if (!destinationUrl) {
          const qAlias = query(collection(db, "urls"), where("alias", "==", code));
          const snapAlias = await getDocs(qAlias);
          if (!snapAlias.empty && snapAlias.docs[0].data().originalUrl) {
            destinationUrl = snapAlias.docs[0].data().originalUrl;
            targetDocRef = snapAlias.docs[0].ref;
          }
        }

        // CLICK UPDATE & REDIRECT
        if (destinationUrl && targetDocRef) {
          try {
            await updateDoc(targetDocRef, { clicks: increment(1) });
          } catch (e) { console.error("Click update failed:", e); }
          
          window.location.href = destinationUrl;
        } else {
          alert(`Link not found for code: ${code}`);
          setIsFetching(false);
        }
      } catch (error) {
        alert("System Error: " + error.message);
        setIsFetching(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#070513] text-white font-sans relative overflow-x-hidden pb-10">
      
      {/* BACKGROUND ADS */}
      <Script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js" strategy="afterInteractive" />
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="afterInteractive" />

      {/* POPUP MODAL (Dark Theme Match) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0f0c29] border border-[#2d2252] rounded-2xl p-5 w-full max-w-[340px] text-center shadow-[0_0_30px_rgba(139,92,246,0.2)] relative">
            <button 
              onClick={() => {}} 
              className="absolute -top-3 -right-2 bg-[#1a1438] border border-[#3d2e6d] rounded-full w-8 h-8 flex items-center justify-center text-gray-300 shadow-md font-bold text-lg"
            >
              ×
            </button>
            <h3 className="text-blue-400 font-bold text-lg mb-2">👇 CLICK BANNER & WAIT 👇</h3>
            <p className="text-gray-300 text-sm mb-4">Click Image & Wait 10s to unlock the final destination.</p>
            <div className="w-[300px] h-[250px] mx-auto bg-black rounded-lg overflow-hidden border border-gray-700">
              <iframe 
                srcDoc={`<html><head><style>body { margin: 0; background: #000; }</style></head><body><script type="text/javascript">atOptions = {'key' : 'de5e912a7a8c5518645029951b957f5f','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</script><script type="text/javascript" src="https://rightyrely.com/de5e912a7a8c5518645029951b957f5f/invoke.js"></script></body></html>`}
                width="300"
                height="250"
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="flex justify-between items-center p-5 border-b border-white/5 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          </div>
          <h1 className="font-black tracking-widest text-xl">
            CLICK TO <span className="text-purple-500">EARN</span>
          </h1>
        </div>
        <button className="text-gray-400 hover:text-white">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
        </button>
      </nav>

      {/* MAIN CONTAINER */}
      <main className="max-w-md mx-auto mt-8 px-4">
        <div className="bg-[#0c091a] border border-[#1e173a] rounded-[2rem] p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
          
          {/* STEP PROGRESS BAR */}
          <div className="flex items-center justify-between mb-8 relative px-2">
            <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-[#1e173a] -z-10"></div>
            {/* Dynamic Progress Line */}
            <div className={`absolute top-1/2 left-4 h-[2px] bg-gradient-to-r from-emerald-400 to-blue-500 -z-10 transition-all duration-500 ${currentStep === 1 ? 'w-0' : currentStep === 2 ? 'w-1/3' : currentStep === 3 ? 'w-2/3' : 'w-full'}`}></div>
            
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-all ${
                currentStep > s ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                currentStep === s ? 'bg-blue-600 border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 
                'bg-[#1a1438] text-gray-500'
              }`}>
                {currentStep > s ? '✓' : s}
              </div>
            ))}
          </div>

          {/* CIRCULAR TIMER */}
          <div className="relative w-44 h-44 mx-auto my-8 flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="88" cy="88" r="82" stroke="#161129" strokeWidth="6" fill="none" />
              <circle cx="88" cy="88" r="82" stroke="url(#timerGradient)" strokeWidth="6" fill="none"
                      strokeDasharray="515" strokeDashoffset={timerDashoffset}
                      className="transition-all duration-1000 ease-linear drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" strokeLinecap="round" />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ec4899" />
                  <stop offset="50%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="text-center">
              <div className="text-6xl font-black">{timer}</div>
              <div className="text-[10px] text-purple-400 tracking-widest mt-1 uppercase">Seconds</div>
            </div>
          </div>

          {/* STATUS BOX */}
          <div className="bg-[#130e2b] border border-[#251c4a] rounded-2xl p-4 flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-900/50 p-2 rounded-full">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200">Preparing your secure link...</p>
                <p className="text-xs text-purple-400 mt-0.5">{timer > 0 ? "Please wait a moment" : "Almost ready!"}</p>
              </div>
            </div>
            {timer > 0 && (
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce delay-150"></span>
              </div>
            )}
          </div>

          {/* ACTIONS (BUTTONS) */}
          <div className="space-y-4">
            <button 
              disabled={timer > 0 || isFetching}
              onClick={handleContinue}
              className={`w-full group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                timer > 0 
                  ? 'bg-[#121212] border-gray-800 text-gray-500 cursor-not-allowed'
                  : 'bg-[#0f172a]/50 border-blue-500/50 hover:bg-blue-600/10 shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] text-blue-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${timer > 0 ? 'bg-gray-800 text-gray-500' : 'bg-blue-500 text-white'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                </div>
                <span className="font-bold text-sm tracking-wide">
                  {timer > 0 ? "WAITING FOR TIMER" : isFetching ? "VERIFYING..." : currentStep === 4 ? "GET YOUR DESTINATION LINK" : "CONTINUE TO NEXT STEP"}
                </span>
              </div>
              <svg className={`w-5 h-5 ${timer > 0 ? 'opacity-0' : 'text-blue-400 group-hover:translate-x-1 transition-transform'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>

            {/* Optional Second Button from Screenshot */}
            <button className="w-full group flex items-center justify-between p-4 rounded-xl border border-purple-500/30 bg-[#1e0f2b]/40 hover:bg-purple-600/10 shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all">
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-purple-500 text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </div>
                <span className="font-bold text-sm tracking-wide text-purple-100">CREATE THE SAME LINK FOR YOU</span>
              </div>
              <svg className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>

          {/* BOTTOM GRADIENT BAR */}
          <div className="mt-8 h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 w-3/4"></div>
          </div>

          {/* FEATURES */}
          <div className="flex justify-between mt-6 text-center divide-x divide-gray-800">
            <div className="flex-1 px-1">
              <span className="text-purple-500 text-lg block mb-1">🛡️</span>
              <p className="text-[10px] text-gray-300 font-bold">100% Secure</p>
              <p className="text-[8px] text-gray-500 mt-0.5">Your safety is our priority</p>
            </div>
            <div className="flex-1 px-1">
              <span className="text-blue-500 text-lg block mb-1">⚡</span>
              <p className="text-[10px] text-gray-300 font-bold">Super Fast</p>
              <p className="text-[8px] text-gray-500 mt-0.5">Get your link in seconds</p>
            </div>
            <div className="flex-1 px-1">
              <span className="text-emerald-500 text-lg block mb-1">💵</span>
              <p className="text-[10px] text-gray-300 font-bold">Earn Money</p>
              <p className="text-[8px] text-gray-500 mt-0.5">Earn more with every click</p>
            </div>
          </div>
        </div>

        {/* NATIVE AD PLACEMENT (Re-styled for dark mode) */}
        <div className="mt-6 w-full bg-[#0c091a] border border-[#1e173a] p-3 rounded-2xl shadow-lg flex flex-col items-center justify-center">
          <span className="text-[9px] text-gray-500 mb-2 font-bold uppercase tracking-widest">Sponsored Advertisement</span>
          <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] w-full rounded-xl overflow-hidden flex items-center justify-center">
            <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
          </div>
        </div>
        
        {/* BANNER AD */}
        <div className="mt-4 w-full bg-[#0c091a] border border-[#1e173a] p-3 rounded-2xl shadow-lg flex flex-col items-center justify-center">
           <div className="w-[300px] h-[250px] bg-black flex items-center justify-center overflow-hidden rounded-xl border border-gray-800">
            <iframe 
                srcDoc={`<html><head><style>body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }</style></head><body><script type="text/javascript">atOptions = {'key' : 'de5e912a7a8c5518645029951b957f5f','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</script><script type="text/javascript" src="https://rightyrely.com/de5e912a7a8c5518645029951b957f5f/invoke.js"></script></body></html>`}
                width="300"
                height="250"
                frameBorder="0"
                scrolling="no"
              />
          </div>
        </div>

        <div className="text-center mt-8 text-[10px] text-gray-600">
          <p className="flex items-center justify-center gap-1">
            <span className="text-purple-800">🛡️</span> Secured by Click To Earn Enterprise
          </p>
          <p className="mt-1">© 2026 CLICK TO EARN. ALL RIGHTS RESERVED.</p>
        </div>
      </main>
    </div>
  );
        }
        

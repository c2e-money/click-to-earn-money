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
  
  const [showModal, setShowModal] = useState(currentStep !== 4);
  const [showContinue, setShowContinue] = useState(false);
  const [timer, setTimer] = useState(currentStep === 4 ? 5 : 15);
  const [isFetching, setIsFetching] = useState(false);

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
      let urlRef = null;
      let urlData = null;

      const docSnap = await getDoc(doc(db, "urls", code));
      if (docSnap.exists() && docSnap.data().originalUrl) {
        destinationUrl = docSnap.data().originalUrl; 
        urlRef = doc(db, "urls", code);
        urlData = docSnap.data();
      } else {
        const qCode = await getDocs(query(collection(db, "urls"), where("code", "==", code)));
        if (!qCode.empty) {
          destinationUrl = qCode.docs[0].data().originalUrl; 
          urlRef = qCode.docs[0].ref;
          urlData = qCode.docs[0].data();
        }
      }

      if (currentStep === 4 && urlRef && urlData) {
        try { 
          await updateDoc(urlRef, { clicks: increment(1) }); 

          if (urlData.userId) {
            const userRef = doc(db, "users", urlData.userId);
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const todayName = days[new Date().getDay()];

            await updateDoc(userRef, {
              clicks: increment(1),
              walletBalance: increment(0.005),
              earnings: increment(0.005),
              [`dailyClicks.${todayName}`]: increment(1)
            });
          }
        } catch (e) { console.error("Database Update Error:", e); }
      }

      if (currentStep < 4) {
        window.open(`/go/${code}/${currentStep + 1}`, "_blank");
        setIsFetching(false);
      } else {
        if (destinationUrl) window.location.href = destinationUrl;
        else { alert(`Link not found for: ${code}`); setIsFetching(false); }
      }
    } catch (error) { alert("System Error: " + error.message); setIsFetching(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative flex flex-col pb-10 selection:bg-blue-500 selection:text-white">
      
      {/* Background Ad Scripts */}
      <Script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js" strategy="afterInteractive" />
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="afterInteractive" />

      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-200 p-4 shadow-sm flex justify-between items-center z-50">
        <div className="font-black text-xl tracking-wide text-blue-600">CLICK<span className="text-slate-800">2</span>EARN</div>
        <button className="text-slate-500 hover:text-slate-800 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </nav>

      {/* Popup Modal (Steps 1-3 only) */}
      {showModal && currentStep !== 4 && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all">
          <div className="bg-white rounded-3xl p-5 w-full max-w-[340px] text-center shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button onClick={() => setShowModal(false)} className="absolute -top-3 -right-3 bg-white border border-slate-200 rounded-full w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-md font-bold text-lg transition-transform hover:scale-105">×</button>
            <h3 className="text-blue-600 font-black text-lg mb-1">WAIT A MOMENT</h3>
            <p className="text-slate-500 text-sm font-medium mb-4">Please interact with the ad below to continue.</p>
            <div className="w-[300px] h-[250px] mx-auto bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
              <div className="absolute inset-0 bg-slate-200 animate-pulse -z-10"></div>
              <iframe srcDoc={`<html><head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: transparent; }</style></head><body><script type="text/javascript">atOptions = {'key' : 'de5e912a7a8c5518645029951b957f5f','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</script><script type="text/javascript" src="https://rightyrely.com/de5e912a7a8c5518645029951b957f5f/invoke.js"></script></body></html>`} width="300" height="250" frameBorder="0" scrolling="no" className="relative z-10" />
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-grow flex flex-col w-full max-w-[600px] mx-auto px-4 mt-6 space-y-6">
        
        {/* ======================= STEP 4 UI ======================= */}
        {currentStep === 4 ? (
          <>
            <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full">
              <div className="text-center">
                <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase mb-2">Final Step</span>
              </div>
              
              <div className="relative w-36 h-36 mx-auto my-6 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90 drop-shadow-sm">
                  <circle cx="72" cy="72" r="54" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                  <circle cx="72" cy="72" r="54" stroke="#3b82f6" strokeWidth="8" fill="none"
                          strokeDasharray="339" strokeDashoffset={339 - (339 * (timer / totalTime))}
                          className="transition-all duration-1000 ease-linear" strokeLinecap="round" />
                </svg>
                <div className="text-center">
                  <div className="text-4xl font-black text-slate-800 tabular-nums tracking-tighter">{timer}</div>
                  <div className="text-[10px] text-slate-400 tracking-widest font-bold uppercase mt-1">Seconds</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center gap-4 mb-8">
                <div className="bg-white p-2.5 rounded-xl shadow-sm text-xl border border-slate-100">🚀</div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-700">Preparing destination link</p>
                  <p className="text-xs text-blue-500 font-semibold mt-0.5">{timer > 0 ? "Checking secure connection..." : "Ready to redirect!"}</p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  disabled={timer > 0 || isFetching}
                  onClick={handleContinue}
                  className={`w-full flex items-center justify-center p-4 rounded-2xl font-black transition-all duration-300 gap-2 text-sm tracking-wide ${
                    timer > 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.98]'
                  }`}
                >
                  {timer > 0 ? `PLEASE WAIT ${timer}s` : isFetching ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>VERIFYING...</> : <><span className="text-lg">🔗</span> GET DESTINATION LINK</>}
                </button>
                <button onClick={() => window.location.href = "/"} className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-all text-sm">
                  <span className="text-lg">✨</span> Create links and earn money
                </button>
              </div>

              <div className="flex justify-between mt-8 text-center px-2">
                <div className="flex-1"><span className="text-xl block mb-1">🛡️</span><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Secure</p></div>
                <div className="flex-1 border-x border-slate-100"><span className="text-xl block mb-1">⚡</span><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Fast</p></div>
                <div className="flex-1"><span className="text-xl block mb-1">💵</span><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Rewarding</p></div>
              </div>
            </div>

            {/* Premium Native Ad Slot (Step 4) */}
            <div className="w-full mt-2">
              <div className="w-full relative rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-100 flex justify-center items-center min-h-[250px]">
                <div className="absolute inset-0 bg-slate-100/50 animate-pulse -z-10"></div>
                <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="w-full flex justify-center z-10">
                  <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ======================= STEP 1-3 UI ======================= */
          <>
            <div className="w-full bg-blue-50 border border-blue-100 text-blue-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
               <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-black text-lg shadow-md shrink-0">
                 {currentStep}
               </div>
               <div>
                 <p className="font-bold text-sm">Step {currentStep} of 4</p>
                 <p className="text-xs font-medium text-blue-600/80 mt-0.5">Complete this step to continue.</p>
               </div>
            </div>
            
            {showContinue && (
              <div className="w-full text-center mt-2 animate-bounce">
                <span className="inline-block bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full shadow-md">
                  Scroll Down To Continue 👇
                </span>
              </div>
            )}

            {/* Premium Native Ad Slot (Step 1-3) */}
            <div className="w-full">
              <div className="w-full relative rounded-3xl overflow-hidden bg-white shadow-sm border border-slate-100 flex justify-center items-center min-h-[250px]">
                <div className="absolute inset-0 bg-slate-100/50 animate-pulse -z-10"></div>
                <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="w-full flex justify-center z-10">
                  <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
                </div>
              </div>
            </div>

            {/* Pushed to Bottom via mt-auto */}
            <div className="w-full mt-auto space-y-6 pt-10">
              
              <div className="w-full text-center md:w-3/4 mx-auto">
                <button 
                  disabled={timer > 0 || isFetching}
                  onClick={handleContinue}
                  className={`w-full py-4 px-6 rounded-2xl font-black transition-all duration-300 text-sm tracking-widest uppercase ${
                    timer > 0 ? "bg-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 animate-pulse active:scale-95"
                  }`}
                >
                  {timer > 0 ? `Please Wait ${timer}s` : "Continue Next Step"}
                </button>
              </div>

              {/* Premium Banner Ad Slot */}
              <div className="w-full flex justify-center pb-4">
                <div className="relative w-[300px] h-[250px] rounded-[2rem] overflow-hidden bg-white shadow-sm border border-slate-100">
                  <div className="absolute inset-0 bg-slate-100/50 animate-pulse -z-10"></div>
                  <iframe srcDoc={`<html><head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: transparent; }</style></head><body><script type="text/javascript">atOptions = {'key' : 'de5e912a7a8c5518645029951b957f5f','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</script><script type="text/javascript" src="https://rightyrely.com/de5e912a7a8c5518645029951b957f5f/invoke.js"></script></body></html>`} width="300" height="250" frameBorder="0" scrolling="no" className="relative z-10" />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
        }
        

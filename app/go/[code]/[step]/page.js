"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

// --- FIREBASE IMPORT & CONFIG ---
import { initializeApp, getApps, getApp } from "firebase/app";
// Yahan updateDoc aur increment add kiya gaya hai
import { getFirestore, doc, getDoc, collection, query, where, getDocs, updateDoc, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3Yl0BR4o6qEX6MeXYjX6Qjlr5BCid5C8",
  authDomain: "my-website-242fc.firebaseapp.com",
  projectId: "my-website-242fc",
  storageBucket: "my-website-242fc.firebasestorage.app",
  messagingSenderId: "78108710064",
  appId: "1:78108710064:web:7b5e79f33721fbc7f71775"
};

// Next.js safe Firebase Initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
// --------------------------------

export default function StepPage() {
  const { code, step } = useParams();
  const currentStep = parseInt(step);
  const router = useRouter();
  
  const [showModal, setShowModal] = useState(true);
  const [showContinue, setShowContinue] = useState(false);
  const [timer, setTimer] = useState(currentStep === 4 ? 5 : 20);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const modalTimer = setTimeout(() => setShowModal(false), 15000);
    const revealTimer = setTimeout(() => setShowContinue(true), 10000);
    
    const countdown = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? (clearInterval(countdown), 0) : prev - 1));
    }, 1000);

    return () => { clearTimeout(modalTimer); clearTimeout(revealTimer); clearInterval(countdown); };
  }, []);

  const handleContinue = async () => {
    if (currentStep < 4) {
      window.open(`/go/${code}/${currentStep + 1}`, "_blank");
    } else {
      setIsFetching(true);
      try {
        console.log("Searching for URL with ID/Alias:", code);
        let destinationUrl = null;
        let targetDocRef = null; // Document ka reference save karne ke liye

        // METHOD 1: Search by Document ID
        const docRef = doc(db, "urls", code);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().originalUrl) {
          destinationUrl = docSnap.data().originalUrl;
          targetDocRef = docRef; // Ref save kar liya
        }

        // METHOD 2: Search in 'code' field if Document ID fails
        if (!destinationUrl) {
          const qCode = query(collection(db, "urls"), where("code", "==", code));
          const snapCode = await getDocs(qCode);
          if (!snapCode.empty && snapCode.docs[0].data().originalUrl) {
            destinationUrl = snapCode.docs[0].data().originalUrl;
            targetDocRef = snapCode.docs[0].ref; // Ref save kar liya
          }
        }

        // METHOD 3: Search in 'alias' field if previous fail
        if (!destinationUrl) {
          const qAlias = query(collection(db, "urls"), where("alias", "==", code));
          const snapAlias = await getDocs(qAlias);
          if (!snapAlias.empty && snapAlias.docs[0].data().originalUrl) {
            destinationUrl = snapAlias.docs[0].data().originalUrl;
            targetDocRef = snapAlias.docs[0].ref; // Ref save kar liya
          }
        }

        // FINAL REDIRECTION & CLICK UPDATE
        if (destinationUrl && targetDocRef) {
          
          // ---> CLICK COUNT +1 UPDATE LOGIC <---
          try {
            await updateDoc(targetDocRef, {
              clicks: increment(1)
            });
            console.log("Click count updated successfully!");
          } catch (updateError) {
            console.error("Failed to update clicks:", updateError);
          }
          // --------------------------------------

          // User ko destination link par bhejo
          window.location.href = destinationUrl;
        } else {
          alert(`Link nahi mili! Please check karein ki "${code}" aapke database me save hai ya nahi.`);
          setIsFetching(false);
        }

      } catch (error) {
        console.error("Firebase Search Error:", error);
        alert("System Error: " + error.message);
        setIsFetching(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-800 font-sans relative">
      
      {/* --- BACKGROUND ADS --- */}
      <Script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js" strategy="afterInteractive" />
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="afterInteractive" />

      {/* --- POPUP MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500/80 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-[340px] text-center shadow-2xl relative">
            <button 
              onClick={() => { console.log("Fake close"); }} 
              className="absolute -top-3 -right-1 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 shadow-md font-bold text-lg hover:bg-gray-100"
            >
              ×
            </button>
            <h3 className="text-[#0a3d62] font-bold text-lg mb-2">👇👇 CLICK BANNER WAIT & BACK 👇👇</h3>
            <p className="text-black text-sm font-semibold mb-4 leading-relaxed">
              👇 Click Image & Wait 10 seconds & Come back this page to <span className="text-red-600">Get Link - Download</span>.
            </p>
            <div className="w-[300px] h-[250px] mx-auto bg-gray-200 border border-gray-300 flex items-center justify-center">
              <iframe 
                srcDoc={`<html><head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #e5e7eb; }</style></head><body><script type="text/javascript">atOptions = {'key' : 'de5e912a7a8c5518645029951b957f5f','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</script><script type="text/javascript" src="https://rightyrely.com/de5e912a7a8c5518645029951b957f5f/invoke.js"></script></body></html>`}
                width="300"
                height="250"
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <nav className="bg-[#0f172a] text-white p-4 shadow-md flex justify-between items-center">
        <div className="font-bold text-xl tracking-wide">EARNLINKS</div>
        <button className="border border-gray-500 rounded px-3 py-1 bg-gray-800 text-sm">☰</button>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-3xl mx-auto mt-6 px-4 pb-12 flex flex-col items-center space-y-6">
        
        {showContinue && (
          <div className="w-full text-center mt-2 animate-bounce">
            <p className="text-red-600 font-bold text-lg uppercase tracking-wide">Scroll Down & Click Continue 👇</p>
          </div>
        )}

        <div className="w-full bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-sm text-center">
          <p className="font-bold text-lg">Step {currentStep} of 4</p>
          <p className="text-sm font-medium">Please complete all steps to get your destination link.</p>
        </div>

        {/* TOP NATIVE AD */}
        <div className="w-full bg-white p-2 rounded shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 mb-1 font-bold">ADVERTISEMENT</span>
          <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] w-full bg-gray-50 flex items-center justify-center">
            <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
          </div>
        </div>

        <div className="h-32 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg opacity-60">
           <p className="text-gray-500 text-sm font-bold tracking-widest uppercase">Keep Scrolling</p>
        </div>

        {/* BOTTOM BUTTON */}
        <div className="w-full text-center w-full md:w-1/2 mx-auto">
          <button 
            disabled={timer > 0 || isFetching}
            onClick={handleContinue}
            className={`w-full py-4 px-4 rounded font-black text-white shadow-md transition-all text-lg ${
              timer > 0 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-[#0275d8] hover:bg-[#025aa5] animate-pulse"
            }`}
          >
            {timer > 0 ? `Please Wait... ${timer}s` : (isFetching ? "GETTING LINK..." : (currentStep === 4 ? "GET DESTINATION LINK" : "CONTINUE NEXT STEP"))}
          </button>
        </div>

        {/* BOTTOM AD */}
        <div className="w-full max-w-[320px] mx-auto bg-white p-2 rounded shadow-sm border border-gray-200 flex flex-col items-center justify-center mt-4">
          <span className="text-[10px] text-gray-400 mb-1 font-bold">SPONSORED</span>
          <div className="w-[300px] h-[250px] bg-gray-50 flex items-center justify-center overflow-hidden">
            <iframe 
                srcDoc={`<html><head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f9fafb; }</style></head><body><script type="text/javascript">atOptions = {'key' : 'de5e912a7a8c5518645029951b957f5f','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</script><script type="text/javascript" src="https://rightyrely.com/de5e912a7a8c5518645029951b957f5f/invoke.js"></script></body></html>`}
                width="300"
                height="250"
                frameBorder="0"
                scrolling="no"
              />
          </div>
        </div>

      </main>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD3Yl0BR4o6qEX6MeXYjX6Qjlr5BCid5C8",
  authDomain: "my-website-242fc.firebaseapp.com",
  projectId: "my-website-242fc",
  storageBucket: "my-website-242fc.firebasestorage.app",
  messagingSenderId: "78108710064",
  appId: "1:78108710064:web:7b5e79f33721fbc7f71775"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
        console.log("Searching for alias:", code);
        const linksRef = collection(db, "links");
        const q = query(linksRef, where("alias", "==", code));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          console.log("Database response:", data);
          
          if (data.url) {
            window.location.href = data.url; 
          } else {
            alert("URL field not found in the document. Please check database structure.");
            setIsFetching(false);
          }
        } else {
          alert("Link not found or expired. Make sure the alias matches exactly.");
          setIsFetching(false);
        }
      } catch (error) {
        console.error("Firestore Error:", error);
        alert("Database connection error. Please check browser console.");
        setIsFetching(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24 relative">
      
      {/* Background Ads */}
      <Script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js" strategy="afterInteractive" />
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="afterInteractive" />

      {/* Modal Ad */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-sm text-center shadow-2xl overflow-hidden">
            <div className="bg-blue-600 text-white py-3 font-bold text-sm tracking-widest uppercase relative">
              Required Step
              <button onClick={() => {}} className="absolute right-3 top-2 text-white/70 hover:text-white text-lg">×</button>
            </div>
            <div className="p-5">
              <p className="text-gray-600 text-sm font-medium mb-4">
                Click the advertisement below and wait 10 seconds to proceed.
              </p>
              <div className="w-[300px] h-[250px] mx-auto bg-gray-100 border border-gray-200 flex items-center justify-center">
                <iframe 
                  srcDoc={`<html><head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f3f4f6; }</style></head><body><script type="text/javascript">atOptions = {'key' : 'de5e912a7a8c5518645029951b957f5f','format' : 'iframe','height' : 250,'width' : 300,'params' : {}};</script><script type="text/javascript" src="https://rightyrely.com/de5e912a7a8c5518645029951b957f5f/invoke.js"></script></body></html>`}
                  width="300"
                  height="250"
                  frameBorder="0"
                  scrolling="no"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="font-extrabold text-2xl tracking-tight text-blue-600">EARNLINKS</div>
          <div className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
            Secure 256-bit
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto mt-8 px-4 flex flex-col items-center space-y-6">
        
        {/* Progress Box */}
        <div className="w-full bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">Verification Progress</h2>
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">Step {currentStep} of 4</span>
          </div>
          <div className="flex gap-2 h-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`flex-1 rounded-full ${i <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        </div>

        {/* Scroll Instruction */}
        {showContinue && (
          <div className="w-full text-center py-2 animate-pulse">
            <p className="text-red-600 font-semibold text-sm uppercase tracking-widest">
              ↓ Scroll down to continue ↓
            </p>
          </div>
        )}

        {/* Top Native Ad */}
        <div className="w-full bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
          <span className="text-[10px] text-gray-400 mb-2 font-bold uppercase tracking-wider">Advertisement</span>
          <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] w-full bg-gray-50 rounded-lg flex items-center justify-center">
            <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full max-w-sm mx-auto mt-4">
          <button 
            disabled={timer > 0 || isFetching}
            onClick={handleContinue}
            className={`w-full py-4 px-6 rounded-xl font-bold text-white shadow-md transition-all text-lg flex justify-center items-center gap-2 ${
              timer > 0 
                ? "bg-gray-400 cursor-not-allowed shadow-none" 
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            {timer > 0 ? (
              <>Please Wait... <span className="text-blue-100">{timer}s</span></>
            ) : isFetching ? (
              "Fetching Destination..."
            ) : currentStep === 4 ? (
              "Get Destination Link"
            ) : (
              "Continue to Next Step"
            )}
          </button>
        </div>
      </main>

      {/* Sticky Bottom Ad Container */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-40 p-2 flex flex-col items-center">
        <span className="text-[9px] text-gray-400 mb-1 font-bold uppercase">Sponsored</span>
        <div className="w-[300px] h-[50px] flex items-center justify-center overflow-hidden bg-gray-50 rounded">
          <iframe 
            srcDoc={`<html><head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }</style></head><body><script type="text/javascript">atOptions = {'key' : '4f8b4de41cea03dc9d830849c3900efa','format' : 'iframe','height' : 50,'width' : 320,'params' : {}};</script><script type="text/javascript" src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js"></script></body></html>`}
            width="320"
            height="50"
            frameBorder="0"
            scrolling="no"
          />
        </div>
      </div>
    </div>
  );
}

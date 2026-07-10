"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function AdPage({ params }) {
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(30);
  const [dest, setDest] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "urls"), where("shortCode", "==", params.code));
      const snap = await getDocs(q);
      if (!snap.empty) setDest(snap.docs[0].data().originalUrl);
    }
    fetchData();
  }, [params.code]);

  useEffect(() => {
    if (step < 4 && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    } else if (step === 4 && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, step]);

  const handleModalClose = () => {
    setShowModal(false);
    setShowContinue(true);
  };

  const handleContinue = async () => {
    if (step < 4) {
      setStep(prev => prev + 1);
      setTimer(30);
      setShowContinue(false);
      window.scrollTo(0, 0);
    } else {
      await updateStats();
      window.location.href = dest;
    }
  };

  const updateStats = async () => {
    const q = query(collection(db, "urls"), where("shortCode", "==", params.code));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const docData = snap.docs[0].data();
      const settings = await getDoc(doc(db, "settings", "global"));
      const cpm = settings.exists() ? settings.data().cpm : 0;
      await updateDoc(doc(db, "users", docData.userId), {
        clicks: increment(1),
        earnings: increment(cpm / 1000)
      });
    }
  };

  return (
    <div className="bg-[#050608] text-white min-h-screen p-4 flex flex-col items-center">
      <div className="text-purple-600 font-black italic text-2xl mb-4">URLKing</div>
      
      {/* Progress Bar */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= s ? "bg-purple-600" : "bg-[#1f2937]"}`}>{step > s ? "✓" : s}</div>
        ))}
      </div>

      {step < 4 ? (
        <>
          <div className="text-center font-bold mb-4">👆👇 Click banner and wait {timer > 0 ? timer : 10}s to unlock link 👆👇</div>
          {timer <= 0 && <button onClick={() => setShowModal(true)} className="bg-red-600 px-6 py-2 rounded-full font-bold mb-4 animate-bounce">CLICK BANNER</button>}
          
          <div className="bg-white p-2 rounded-xl mb-6">
             <script async src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js"></script>
             <div id="container-b594fd33ac3477b8549752f47e5a4e56"></div>
          </div>
          
          {showContinue && <button onClick={handleContinue} className="w-full bg-blue-600 py-4 rounded-2xl font-black text-lg">Continue</button>}
        </>
      ) : (
        <div className="w-full max-w-sm text-center">
          <h2 className="text-xl font-bold mb-4">Final Step: Verification</h2>
          <p className="mb-4">Please wait {timer}s to get your link</p>
          <button onClick={handleContinue} disabled={timer > 0} className={`w-full py-4 rounded-2xl font-black ${timer > 0 ? "bg-gray-600" : "bg-green-600"}`}>
            {timer > 0 ? `Please Wait ${timer}s` : "GET LINK - DOWNLOAD"}
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50">
          <div className="bg-white text-black p-6 rounded-3xl w-full max-w-sm text-center">
            <h3 className="text-green-700 font-black mb-4">CLICK BANNER WAIT & BACK</h3>
            <button onClick={handleModalClose} className="w-full bg-red-600 text-white py-3 rounded-xl font-black">OK, I CLICKED</button>
          </div>
        </div>
      )}
    </div>
  );
        }

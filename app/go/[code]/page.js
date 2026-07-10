"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, getDoc } from "firebase/firestore";

export default function AdPage({ params }) {
  const searchParams = useSearchParams();
  const step = parseInt(searchParams.get("step")) || 1;
  const [showModal, setShowModal] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  // Timer sirf popup ke liye, button visible karne ke liye nahi
  useEffect(() => {
    const timer = setTimeout(() => setCanContinue(true), 15000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = async () => {
    if (step < 4) {
      window.open(`/go/${params.code}?step=${step + 1}`, '_blank');
      window.close();
    } else {
      const q = query(collection(db, "urls"), where("shortCode", "==", params.code));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docData = snap.docs[0].data();
        const settings = await getDoc(doc(db, "settings", "global"));
        const cpm = settings.exists() ? settings.data().cpm : 0;
        await updateDoc(doc(db, "users", docData.userId), { clicks: increment(1), earnings: increment(cpm / 1000) });
        window.location.href = docData.originalUrl;
      }
    }
  };

  return (
    <div className="bg-white text-black min-h-screen p-2 text-center">
      <div className="font-black text-lg mb-2">STEP {step} OF 4</div>

      {/* Ad 1 & 2: Top */}
      <script src="https://rightyrely.com/67/f2/56/67f25683cd971ba173dadc88bb3b3a13.js"></script>
      <div className="my-2"><script src="https://rightyrely.com/4f8b4de41cea03dc9d830849c3900efa/invoke.js"></script></div>

      {/* Yellow Box ke upar Banner */}
      <div className="my-2"><div id="container-b594fd33ac3477b8549752f47e5a4e56"><script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js"></script></div></div>

      {/* Yellow Box */}
      <div className="border-2 border-yellow-300 bg-yellow-50 p-3 rounded-lg my-4">
        <p className="font-bold text-xs">👇 Click Banner Wait 15s 👇</p>
      </div>

      {/* Ad Cluster (10-12 Ads) */}
      {[...Array(10)].map((_, i) => (
        <div key={i} className="my-3 h-20 bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">ADS UNIT {i+3}</div>
      ))}

      {/* Bottom Ad Sandwich */}
      <div className="my-4"><script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js"></script></div>

      {/* Hidden/Chupa hua Continue Button */}
      {canContinue && (
        <button onClick={() => setShowModal(true)} className="w-24 h-8 bg-blue-600 text-white text-[10px] opacity-50 hover:opacity-100 mx-auto block mb-10">
          CONTINUE
        </button>
      )}

      {/* Modal Popup (Mandatory Click) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 text-center">
            <h3 className="font-black mb-4">CLICK POPUP BANNER FIRST!</h3>
            <button onClick={handleContinue} className="w-full bg-red-600 text-white py-2 rounded">PROCEED</button>
          </div>
        </div>
      )}
    </div>
  );
        }

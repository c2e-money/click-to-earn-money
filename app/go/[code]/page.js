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

          // User ka personal CPM ya global CPM fetch
          const userSnap = await getDoc(doc(db, "users", data.userId));
          const globalSnap = await getDoc(doc(db, "settings", "global"));
          const cpm = userSnap.data().personalCpm || globalSnap.data().cpm || 5.00;
          
          await updateDoc(doc(db, "users", data.userId), { 
              walletBalance: increment(cpm / 1000),
              earnings: increment(cpm / 1000),
              clicks: increment(1),
              [`dailyClicks.${new Date().toLocaleDateString('en-US', { weekday: 'short' })}`]: increment(1)
          });
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    processClick();
  }, [params.code]);

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!targetUrl) return <div className="text-center mt-20">Link Invalid</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={() => window.open(targetUrl, "_self")} className="bg-green-600 p-6 rounded-2xl font-black">CONTINUE</button>
    </div>
  );
}

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { redirect } from "next/navigation";

export default async function RedirectPage({ params }) {
  const { alias } = await params;
  let targetUrl = null;

  try {
    const urlRef = doc(db, "urls", alias);
    const urlSnap = await getDoc(urlRef);

    if (urlSnap.exists()) {
      const data = urlSnap.data();
      targetUrl = data.originalUrl;

      // 1. Click Update (Safe Mode)
      updateDoc(urlRef, { clicks: increment(1) }).catch(console.error);

      // 2. Global CPM Earning logic
      if (data.userId) {
          const settingsSnap = await getDoc(doc(db, "settings", "global"));
          const cpm = settingsSnap.exists() ? settingsSnap.data().cpm : 5.00;
          
          updateDoc(doc(db, "users", data.userId), { 
              walletBalance: increment(cpm / 1000) 
          }).catch(console.error);
      }
    }
  } catch (e) { console.error("Error:", e); }

  if (targetUrl) redirect(targetUrl);
  return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}><h1>Link Invalid or Error</h1></div>;
}

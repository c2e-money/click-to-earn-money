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

      // Click update logic
      await updateDoc(urlRef, { clicks: increment(1) });

      // CPM Earning logic
      const settingsSnap = await getDoc(doc(db, "settings", "global"));
      const cpm = settingsSnap.exists() ? settingsSnap.data().cpm : 5.00;
      
      if (data.userId) {
          await updateDoc(doc(db, "users", data.userId), { 
              walletBalance: increment(cpm / 1000) 
          });
      }
    }
  } catch (e) { console.error("Firebase Error:", e); }

  if (targetUrl) {
    redirect(targetUrl);
  } else {
    return <div style={{color:'white', textAlign:'center', marginTop:'50px'}}><h1>Link Invalid or Error</h1></div>;
  }
}

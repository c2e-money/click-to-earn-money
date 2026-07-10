import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { redirect } from "next/navigation";

export default async function RedirectPage({ params }) {
  const { alias } = await params;
  
  try {
    const urlRef = doc(db, "urls", alias);
    const urlSnap = await getDoc(urlRef);

    if (urlSnap.exists()) {
      const data = urlSnap.data();
      
      // Database update
      await updateDoc(urlRef, { clicks: increment(1) });

      // Agar userId hai toh balance update karo
      if (data.userId) {
          const settingsSnap = await getDoc(doc(db, "settings", "global"));
          const cpm = settingsSnap.exists() ? settingsSnap.data().cpm : 5.00;
          await updateDoc(doc(db, "users", data.userId), { 
              walletBalance: increment(cpm / 1000) 
          });
      }

      // Redirect yahan se karo
      redirect(data.originalUrl);
    }
  } catch (e) {
    console.error("Error:", e);
  }

  return (
    <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>
      <h1>Link Invalid or Error</h1>
    </div>
  );
}

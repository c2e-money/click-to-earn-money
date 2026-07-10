import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { permanentRedirect } from "next/navigation";

export default async function RedirectPage({ params }) {
  const { alias } = await params;
  
  // 1. Data fetch karo
  const urlRef = doc(db, "urls", alias);
  const urlSnap = await getDoc(urlRef);

  // 2. Agar document mil gaya toh redirect karo
  if (urlSnap.exists()) {
    const data = urlSnap.data();
    
    // Clicks update karo (optional, agar error de toh is line ko comment kar dena)
    try {
        await updateDoc(urlRef, { clicks: increment(1) });
    } catch(e) {}

    // Redirect
    permanentRedirect(data.originalUrl);
  }

  // 3. Agar nahi mila toh 404
  return (
    <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>
      <h1>404 - Link Not Found</h1>
    </div>
  );
}

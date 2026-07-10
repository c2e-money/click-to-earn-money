import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { permanentRedirect } from "next/navigation";

export default async function RedirectPage({ params }) {
  const { alias } = await params;
  
  const urlRef = doc(db, "urls", alias);
  const urlSnap = await getDoc(urlRef);

  if (urlSnap.exists()) {
    const data = urlSnap.data(); // Isme 'userId' hona chahiye (jaise: userId: "user123")
    
    // 1. Clicks aur CPM update ka logic
    try {
        // Global CPM fetch karo
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        const cpm = settingsSnap.exists() ? settingsSnap.data().cpm : 5.00; // Default 5
        
        // Earning calculation (Per click earning = CPM / 1000)
        const perClickEarning = cpm / 1000;

        // URL clicks increment karo
        await updateDoc(urlRef, { clicks: increment(1) });

        // User ka balance increment karo (Agar userId exist karti hai)
        if (data.userId) {
            await updateDoc(doc(db, "users", data.userId), { 
                walletBalance: increment(perClickEarning) 
            });
        }
    } catch(e) {
        console.log("Error updating stats", e);
    }

    permanentRedirect(data.originalUrl);
  }

  return (
    <div style={{color: 'white', textAlign: 'center', marginTop: '50px'}}>
      <h1>404 - Link Not Found</h1>
    </div>
  );
    }

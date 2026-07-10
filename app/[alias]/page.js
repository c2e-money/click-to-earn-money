export default async function RedirectPage({ params }) {
  const { alias } = await params;
  const urlRef = doc(db, "urls", alias);
  const urlSnap = await getDoc(urlRef);

  if (urlSnap.exists()) {
    const data = urlSnap.data();
    
    // --- YAHAN FIX HAI ---
    // 1. Pehle database update ka kaam pura hone do
    try {
        await updateDoc(urlRef, { clicks: increment(1) });
        
        // Agar user ka balance bhi badhana hai:
        const settingsSnap = await getDoc(doc(db, "settings", "global"));
        const cpm = settingsSnap.exists() ? settingsSnap.data().cpm : 5.00;
        
        if (data.userId) {
            await updateDoc(doc(db, "users", data.userId), { 
                walletBalance: increment(cpm / 1000) 
            });
        }
    } catch(e) {
        console.error("Update failed:", e);
    }
    // --- FIX END ---

    // 2. Database update hone ke baad hi redirect hoga
    permanentRedirect(data.originalUrl);
  }

  return <h1>404 - Link Not Found</h1>;
}

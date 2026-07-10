import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function RedirectPage({ params }) {
  const { code } = params;
  
  // 1. User ka IP Address nikalna
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") || "unknown_ip";
  
  // 2. Aaj ki Date nikalna (YYYY-MM-DD format). Raat 12 baje ye apne aap change hogi.
  const today = new Date().toISOString().split("T")[0];

  const q = query(collection(db, "urls"), where("code", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const urlDoc = querySnapshot.docs[0];
    const urlData = urlDoc.data();
    const userId = urlData.userId; // Jis user ka yeh link hai

    if (userId && userId !== "guest_user") {
      // 3. IP aur Date ke hisaab se check karna ki aaj kitne clicks hue
      const logId = `${userId}_${ip}_${today}`;
      const logRef = doc(db, "ip_logs", logId);
      const logSnap = await getDoc(logRef);

      let clicksToday = 0;
      if (logSnap.exists()) {
        clicksToday = logSnap.data().count;
      }

      // 4. Sirf tabhi paise do jab limit 2 se kam ho
      if (clicksToday < 2) {
        // IP log mein +1 kar do
        await setDoc(logRef, { count: increment(1) }, { merge: true });
        
        // Link par total click +1 kar do
        await updateDoc(doc(db, "urls", urlDoc.id), { clicks: increment(1) });

        // User ka actual account check karo aur paise add karo
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          const userCPM = userData.cpm || 5.00;
          const moneyPerClick = userCPM / 1000; // Formula: CPM divided by 1000

          await updateDoc(userRef, {
            totalClicks: increment(1),
            totalEarnings: increment(moneyPerClick),
            walletBalance: increment(moneyPerClick)
          });
        }
      }
    }
    
    // IP limit cross ho ya na ho, user ko original link par bhejna hi hai
    redirect(urlData.originalUrl);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-extrabold text-slate-800 mb-2">404</h1>
      <p className="text-slate-500 mb-4">Link Not Found in LG Network.</p>
    </div>
  );
}

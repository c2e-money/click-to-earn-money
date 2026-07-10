import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment, getDoc } from 'firebase/firestore';

export default async function RedirectPage({ params }) {
  const { code } = params;
  
  const q = query(collection(db, "urls"), where("shortCode", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const docData = docSnap.data();
    const userId = docData.userId;

    // Admin se current CPM fetch karo
    const settingsSnap = await getDoc(doc(db, "settings", "global"));
    const cpm = settingsSnap.exists() ? settingsSnap.data().cpm : 0;

    // Earning calculation: (CPM / 1000) per click
    const earningsPerClick = cpm / 1000;

    // Firebase update: Clicks aur Earnings dono ek saath
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      clicks: increment(1),
      earnings: increment(earningsPerClick)
    });

    redirect(docData.originalUrl);
  }

  return <div className="p-10 text-white">Invalid Link!</div>;
}

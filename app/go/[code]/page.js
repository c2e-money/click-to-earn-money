import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, increment } from 'firebase/firestore';

export default async function RedirectPage({ params }) {
  const { code } = params;
  
  // 1. Link dhoondo
  const q = query(collection(db, "urls"), where("shortCode", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    const docData = docSnap.data();
    
    // 2. Click count badhao (User ke collection mein)
    const userRef = doc(db, "users", docData.userId);
    await updateDoc(userRef, {
      clicks: increment(1)
    });

    // 3. Redirect
    redirect(docData.originalUrl);
  }

  return <div className="p-10 text-white">Invalid Link!</div>;
}

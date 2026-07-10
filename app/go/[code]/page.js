import { redirect } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default async function RedirectPage({ params }) {
  const { code } = params;
  
  const q = query(collection(db, "urls"), where("shortCode", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0].data();
    redirect(docData.originalUrl); // Link par redirect
  }

  return <div className="p-10 text-white">Link invalid ya expired hai!</div>;
}


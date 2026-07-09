import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { redirect } from "next/navigation";

export default async function RedirectPage({ params }) {
  const { code } = params;

  // Firestore mein short code search karna
  const q = query(collection(db, "urls"), where("code", "==", code));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const urlDoc = querySnapshot.docs[0];
    const targetData = urlDoc.data();

    // Click count ko database mein instantly +1 badhana
    const docRef = doc(db, "urls", urlDoc.id);
    await updateDoc(docRef, {
      clicks: increment(1)
    });

    // Original website par safely redirect karna
    redirect(targetData.originalUrl);
  }

  // Agar code valid nahi hai toh custom error page show karna
  return (
    <div class="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 class="text-4xl font-extrabold text-slate-800 mb-2">404 - Link Not Found</h1>
      <p class="text-slate-500 mb-4">The URL you are trying to access does not exist in our network.</p>
      <a href="/" class="text-blue-600 font-bold hover:underline">Back to Home</a>
    </div>
  );
}


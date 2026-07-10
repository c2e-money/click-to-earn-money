import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { redirect } from "next/navigation";

export default async function RedirectPage({ params }) {
  const { alias } = params; // Yahan [alias] folder ke naam se match kiya

  try {
    const urlRef = doc(db, "urls", alias);
    const urlSnap = await getDoc(urlRef);

    if (urlSnap.exists()) {
      const data = urlSnap.data();
      await updateDoc(urlRef, { clicks: increment(1) });
      redirect(data.originalUrl);
    }
  } catch (error) {
    console.error("Redirect Error:", error);
  }

  return (
    <div className="h-screen flex items-center justify-center bg-[#0b0e14] text-white font-black">
      404 - Link Not Found
    </div>
  );
}

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { redirect } from "next/navigation";

export default async function RedirectPage({ params }) {
  // Folder ka naam [alias] hai, toh alias hi use karna hoga
  const { alias } = params; 
  
  try {
    if (!alias) return <div className="text-white text-center">Invalid Alias</div>;

    const urlRef = doc(db, "urls", alias); // Yahan code ki jagah alias use kiya
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

import { db } from "@/lib/firebase";
import { collectionGroup, getDocs } from "firebase/firestore";
import { redirect } from "next/navigation";

export default async function AliasRedirect({ params }) {
  const { alias } = params;
  const snapshot = await getDocs(collectionGroup(db, "users"));
  let targetUrl = null;

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.links) {
      const link = data.links.find(l => l.alias === alias);
      if (link) targetUrl = link.url;
    }
  });

  if (targetUrl) redirect(targetUrl);
  return <div className="h-screen flex items-center justify-center bg-[#0b0e14] text-white">404 - Link Not Found</div>;
}

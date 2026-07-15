"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function Redirector() {
  const { code } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (code) {
      // User ko seedha Step 1 par bhej do
      router.replace(`/go/${code}/1`);
    }
  }, [code, router]);

  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center text-white">
      <p>Redirecting to first step...</p>
    </div>
  );
}

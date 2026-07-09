"use client";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export default function LinksHistory() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      if (auth.currentUser) {
        const q = query(
          collection(db, "urls"), 
          where("userId", "==", auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const linksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by newest first manually since we don't have complex indexes yet
        linksData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setLinks(linksData);
      }
      setLoading(false);
    };
    fetchLinks();
  }, []);

  if (loading) return <div className="text-center mt-10 text-emerald-500 font-bold">Loading links...</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-black text-white mb-6">Link History</h2>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg">
        {links.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 font-medium">No links created yet.</div>
        ) : (
          <ul className="divide-y divide-neutral-800">
            {links.map((link) => {
              const shortUrl = `${window.location.origin}/${link.code}`;
              return (
                <li key={link.id} className="p-5 hover:bg-neutral-800/50 transition flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-emerald-400 text-lg">{link.code}</p>
                      <span className="bg-neutral-800 text-neutral-400 text-[10px] px-2 py-0.5 rounded font-bold uppercase">{link.clicks || 0} Clicks</span>
                    </div>
                    <p className="text-neutral-500 text-xs truncate break-all">{link.originalUrl}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <button 
                      onClick={() => {navigator.clipboard.writeText(shortUrl); alert("Copied!")}}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white p-3 rounded-xl transition flex items-center gap-2 border border-neutral-700"
                    >
                      <span className="text-sm">📋 Copy</span>
                    </button>
                    <a 
                      href={shortUrl} target="_blank"
                      className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 p-3 rounded-xl transition flex items-center gap-2 border border-emerald-500/20"
                    >
                      <span className="text-sm">↗</span>
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
                                  }
          

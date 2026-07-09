"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function Dashboard() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    const fetchLinks = async () => {
      const q = query(collection(db, "urls"), where("userId", "==", "guest_user"));
      const querySnapshot = await getDocs(q);
      const linksData = [];
      querySnapshot.forEach((doc) => {
        linksData.push({ id: doc.id, ...doc.data() });
      });
      setLinks(linksData);
    };

    fetchLinks();
  }, []);

  return (
    <div class="max-w-6xl mx-auto mt-12 p-6">
      <h2 class="text-2xl font-bold text-slate-800 mb-6">My Links Network & Analytics</h2>
      <div class="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-blue-600 text-white">
              <th class="p-4 font-semibold">Original URL</th>
              <th class="p-4 font-semibold">Shortened URL</th>
              <th class="p-4 font-semibold text-center">Clicks</th>
            </tr>
          </thead>
          <tbody>
            {links.length === 0 ? (
              <tr>
                <td colspan="3" class="p-6 text-center text-slate-500">No links generated yet.</td>
              </tr>
            ) : (
              links.map((link) => (
                <tr key={link.id} class="border-b border-slate-100 hover:bg-slate-50">
                  <td class="p-4 text-sm max-w-xs truncate text-slate-600">{link.originalUrl}</td>
                  <td class="p-4 font-medium text-blue-600">
                    <a href={`/${link.code}`} target="_blank" class="hover:underline">
                      {window.location.origin}/{link.code}
                    </a>
                  </td>
                  <td class="p-4 text-center font-bold text-slate-800">{link.clicks}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
    }
  

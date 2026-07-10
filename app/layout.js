// app/layout.js
import "./globals.css";
import { Home, Link2, Wallet } from "lucide-react";
import Link from "next/link";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0e14] text-white h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto pb-20">{children}</div>
        
        {/* Fixed Navigation Bar - Har page par same rahega */}
        <nav className="fixed bottom-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around z-50">
          <Link href="/dashboard" className="flex flex-col items-center"><Home size={20} /><span className="text-[9px] font-black uppercase mt-1">Home</span></Link>
          <Link href="/dashboard/links" className="flex flex-col items-center"><Link2 size={20} /><span className="text-[9px] font-black uppercase mt-1">Links</span></Link>
          <Link href="/dashboard/withdraw" className="flex flex-col items-center"><Wallet size={20} /><span className="text-[9px] font-black uppercase mt-1">Withdraw</span></Link>
        </nav>
      </body>
    </html>
  );
}

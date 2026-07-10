// app/components/Navbar.js
import { Home, Link2, Wallet } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed bottom-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-3 flex justify-around z-50">
      <Link href="/dashboard" className="flex flex-col items-center text-gray-500">
        <Home size={20} /><span className="text-[9px] font-black uppercase mt-1">Home</span>
      </Link>
      <Link href="/dashboard/links" className="flex flex-col items-center text-purple-400">
        <Link2 size={20} /><span className="text-[9px] font-black uppercase mt-1">Links</span>
      </Link>
      <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-500">
        <Wallet size={20} /><span className="text-[9px] font-black uppercase mt-1">Withdraw</span>
      </Link>
    </nav>
  );
}

import Link from "next/link";
import { Home, Link2, Wallet, Settings } from "lucide-react";

export default function Navbar({ active }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-4 flex justify-around z-50">
      <Link href="/dashboard" className={`flex flex-col items-center ${active === 'home' ? 'text-purple-500' : 'text-gray-600'}`}>
        <Home size={20} /><span className="text-[10px] font-black uppercase mt-1">Home</span>
      </Link>
      <Link href="/dashboard/links" className={`flex flex-col items-center ${active === 'links' ? 'text-purple-500' : 'text-gray-600'}`}>
        <Link2 size={20} /><span className="text-[10px] font-black uppercase mt-1">Links</span>
      </Link>
      <Link href="/dashboard/withdraw" className={`flex flex-col items-center ${active === 'withdraw' ? 'text-purple-500' : 'text-gray-600'}`}>
        <Wallet size={20} /><span className="text-[10px] font-black uppercase mt-1">Withdraw</span>
      </Link>
      <Link href="/dashboard/settings" className={`flex flex-col items-center ${active === 'settings' ? 'text-purple-500' : 'text-gray-600'}`}>
        <Settings size={20} /><span className="text-[10px] font-black uppercase mt-1">Settings</span>
      </Link>
    </nav>
  );
}

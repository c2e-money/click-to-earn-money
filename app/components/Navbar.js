// Dashboard ke bottom nav mein ye update karo
<nav className="fixed bottom-0 left-0 w-full bg-[#0b0e14] border-t border-[#1f2937] p-4 flex justify-around z-50">
  <Link href="/dashboard" className="flex flex-col items-center text-purple-500">
    <Home size={20} /><span className="text-[10px] font-black uppercase mt-1">Home</span>
  </Link>
  <Link href="/dashboard/links" className="flex flex-col items-center text-gray-600">
    <Link2 size={20} /><span className="text-[10px] font-black uppercase mt-1">Links</span>
  </Link>
  <Link href="/dashboard/withdraw" className="flex flex-col items-center text-gray-600">
    <Wallet size={20} /><span className="text-[10px] font-black uppercase mt-1">Withdraw</span>
  </Link>
  {/* Naya Settings Option */}
  <Link href="/dashboard/settings" className="flex flex-col items-center text-gray-600">
    <Settings size={20} /><span className="text-[10px] font-black uppercase mt-1">Settings</span>
  </Link>
</nav>

import "./globals.css";

export const metadata = {
  title: "LG Network | Shorten & Earn",
  description: "Best URL Shortener Network",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased pb-20">
        
        {/* Mobile Top Bar */}
        <nav className="bg-blue-700 text-white px-5 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
          <div className="text-xl font-black tracking-widest">🔗 LG NETWORK</div>
          <a href="/login" className="bg-white text-blue-700 px-4 py-1.5 rounded-full text-sm font-extrabold shadow-sm">Login</a>
        </nav>

        {/* Main Content Area */}
        <main className="min-h-screen px-4">{children}</main>

        {/* Mobile Bottom App Navigation */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 flex justify-around py-3 text-xs font-bold text-slate-500 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] z-50">
          <a href="/" className="flex flex-col items-center hover:text-blue-600 transition">
            <span className="text-xl mb-1">🏠</span> Home
          </a>
          <a href="/dashboard" className="flex flex-col items-center hover:text-blue-600 transition">
            <span className="text-xl mb-1">📊</span> Dashboard
          </a>
          <a href="/dashboard/withdraw" className="flex flex-col items-center hover:text-blue-600 transition">
            <span className="text-xl mb-1">💰</span> Withdraw
          </a>
        </div>

      </body>
    </html>
  );
}

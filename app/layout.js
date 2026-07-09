import "./globals.css";

export const metadata = {
  title: "Click To Earn | Professional URL Shortener",
  description: "Shorten, track, and monetize your links.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body class="bg-slate-50 text-slate-900 font-sans antialiased">
        <nav class="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow-md">
          <div class="text-2xl font-bold tracking-wide">🔗 LG Links</div>
          <div class="space-x-6 font-medium">
            <a href="/" class="hover:text-blue-200 transition">Home</a>
            <a href="/dashboard" class="hover:text-blue-200 transition">Dashboard</a>
            <a href="/admin" class="hover:text-blue-200 transition">Admin Panel</a>
          </div>
        </nav>
        <main class="min-h-screen">{children}</main>
      </body>
    </html>
  );
    }

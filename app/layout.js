// app/layout.js
import "./globals.css";
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0e14] text-white h-screen">{children}</body>
    </html>
  );
}

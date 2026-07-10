import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0b0e14]">
        {children}
      </body>
    </html>
  );
}

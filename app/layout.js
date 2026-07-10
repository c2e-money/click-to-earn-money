import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0e14] text-gray-200 antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

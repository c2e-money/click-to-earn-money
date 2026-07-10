export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* Poori website ka background #0b0e14 set kar rahe hain */}
      <body className="bg-[#0b0e14] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}

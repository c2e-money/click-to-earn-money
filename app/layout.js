import "./globals.css";

export const metadata = {
  title: "Click To Earn | URL Shortener",
  description: "Highest paying URL shortener",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0b0e14] text-white h-screen font-sans">
        {children}
      </body>
    </html>
  );
}

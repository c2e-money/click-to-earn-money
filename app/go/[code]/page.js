"use client";
import { useEffect } from "react";

export default function AdPage() {
  
  // Adsterra Native Banner Loading Logic
  useEffect(() => {
    if (!document.querySelector('script[src*="invoke.js"]')) {
      const script = document.createElement("script");
      script.src = "https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js"; // Apne Adsterra script se replace karo
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div>
      {/* 1. Popunder/Social Bar (Anti-Adblock bypass) */}
      <script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js"></script>

      {/* 2. Banner/Native Unit */}
      <div id="container-b594fd33ac3477b8549752f47e5a4e56"></div>

      {/* 3. Smart Link (Continue Button par lagao) */}
      <button onClick={() => window.open("https://adsterra-smart-link-url", "_blank")}>
        CONTINUE
      </button>
    </div>
  );
}

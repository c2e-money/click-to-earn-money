"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Script from "next/script";

export default function StepPage() {
  const { code, step } = useParams();
  const currentStep = parseInt(step);
  const router = useRouter();
  
  const [showModal, setShowModal] = useState(true);
  const [showContinue, setShowContinue] = useState(false);
  const [timer, setTimer] = useState(currentStep === 4 ? 5 : 20);

  useEffect(() => {
    // 15 seconds me popup auto close hoga
    const modalTimer = setTimeout(() => setShowModal(false), 15000);
    // 10 seconds me "Continue" button reveal hoga
    const revealTimer = setTimeout(() => setShowContinue(true), 10000);
    
    const countdown = setInterval(() => {
      setTimer((prev) => (prev <= 1 ? (clearInterval(countdown), 0) : prev - 1));
    }, 1000);

    return () => { clearTimeout(modalTimer); clearTimeout(revealTimer); clearInterval(countdown); };
  }, []);

  const handleContinue = () => {
    if (currentStep < 4) {
      window.open(`/go/${code}/${currentStep + 1}`, "_blank");
    } else {
      window.location.href = "/final-url"; 
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f1f1] text-gray-800 font-sans">
      
      {/* 1. EXACT SCREENSHOT WALA POPUP (WITH FAKE CLOSE BUTTON) */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-5 w-full max-w-[340px] text-center shadow-lg relative">
            
            {/* FAKE CLOSE BUTTON: Ispe click karne se popup close nahi hoga */}
            <button 
              onClick={() => {
                // Yahan se close logic hata diya hai taaki ye popup par hi click maane
                console.log("Fake close clicked");
              }} 
              className="absolute -top-3 -right-1 bg-white border border-gray-300 rounded-full w-8 h-8 flex items-center justify-center text-gray-600 shadow-md font-bold text-lg hover:bg-gray-100"
            >
              ×
            </button>

            <h3 className="text-[#0a3d62] font-bold text-lg mb-2">
              👇👇 CLICK BANNER WAIT & BACK 👇👇
            </h3>
            <p className="text-black text-sm font-semibold mb-4 leading-relaxed">
              👇 Click Image & Wait 10 seconds & Come back this page to <span className="text-red-600">Get Link - Download</span>.
            </p>
            
            <div className="w-[300px] h-[250px] mx-auto bg-gray-200 border border-gray-300 flex items-center justify-center">
              <iframe 
                srcDoc={`
                  <html>
                    <head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #e5e7eb; }</style></head>
                    <body>
                      <script type="text/javascript">
                        atOptions = {
                          'key' : 'de5e912a7a8c5518645029951b957f5f',
                          'format' : 'iframe',
                          'height' : 250,
                          'width' : 300,
                          'params' : {}
                        };
                      </script>
                      <script type="text/javascript" src="https://rightyrely.com/de5e912a7a8c5518645029951b957f5f/invoke.js"></script>
                    </body>
                  </html>
                `}
                width="300"
                height="250"
                frameBorder="0"
                scrolling="no"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. SIMPLE NAVIGATION */}
      <nav className="bg-[#0f172a] text-white p-4 shadow-md flex justify-between items-center">
        <div className="font-bold text-xl tracking-wide">EARNLINKS</div>
        <button className="border border-gray-500 rounded px-3 py-1 bg-gray-800 text-sm">
          ☰
        </button>
      </nav>

      {/* 3. MAIN CONTENT */}
      <main className="max-w-3xl mx-auto mt-6 px-4 pb-10 space-y-6">
        
        {/* Step Alert Box */}
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded shadow-sm text-center">
          <p className="font-bold">Step {currentStep} of 4</p>
          <p className="text-sm">Please complete all steps to get your destination link.</p>
        </div>

        {/* ACTION BUTTON (MOVED TO TOP) */}
        {showContinue && (
          <div className="text-center mt-4 mb-8">
            <p className="text-red-600 font-bold mb-3 animate-bounce">Scroll Down & Click Continue</p>
            <button 
              disabled={timer > 0}
              onClick={handleContinue}
              className={`w-full md:w-1/2 py-3 px-4 rounded font-bold text-white shadow-md transition-all ${
                timer > 0 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#0275d8] hover:bg-[#025aa5]"
              }`}
            >
              {timer > 0 ? `Please Wait... ${timer}s` : "CONTINUE"}
            </button>
          </div>
        )}

        {/* Ad Container Middle */}
        <div className="bg-white p-2 rounded shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 mb-1">ADVERTISEMENT</span>
          <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] w-full bg-gray-50 flex items-center justify-center">
            <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
          </div>
        </div>

      </main>

      {/* Social Bar background ad */}
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="afterInteractive" />
    </div>
  );
          }

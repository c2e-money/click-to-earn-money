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
    const modalTimer = setTimeout(() => setShowModal(false), 15000);
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
      
      {/* --- PROFESSIONAL POPUP --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/80 z-[999] flex items-center justify-center p-4 backdrop-blur-sm transition-opacity">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <div className="mb-4">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase">Sponsored Ad</span>
            </div>
            <h3 className="text-slate-900 font-extrabold text-lg mb-2">Please View to Continue</h3>
            <p className="text-slate-500 text-sm mb-6 font-medium">Wait 10 seconds to unlock the next step.</p>
            
            <div className="w-[300px] h-[250px] mx-auto bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200">
              <iframe 
                srcDoc={`
                  <html>
                    <head><style>body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f1f5f9; }</style></head>
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

      {/* --- HEADER --- */}
      <header className="bg-white border-b border-slate-200 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            E
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">Earn<span className="text-indigo-600">Links</span></span>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md">
          Secure Connection
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-grow w-full max-w-2xl mx-auto p-4 flex flex-col items-center py-8">
        
        {/* Visual Progress Bar */}
        <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-bold text-slate-500 uppercase">Verification Progress</span>
            <span className="text-sm font-black text-indigo-600">{currentStep} of 4</span>
          </div>
          <div className="flex gap-2 h-2">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`flex-1 rounded-full transition-all duration-500 ${i <= currentStep ? 'bg-indigo-600' : 'bg-slate-100'}`}
              ></div>
            ))}
          </div>
        </div>

        {/* Middle Ad Container */}
        <div className="w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col items-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Advertisement</span>
          <div id="container-b594fd33ac3477b8549752f47e5a4e56" className="min-h-[250px] w-full bg-slate-50 rounded-xl flex items-center justify-center">
            <Script src="https://rightyrely.com/b594fd33ac3477b8549752f47e5a4e56/invoke.js" strategy="lazyOnload" />
          </div>
        </div>

        {/* Action Button Section */}
        <div className="w-full max-w-sm mt-4 text-center min-h-[120px] flex flex-col items-center justify-center">
          {showContinue ? (
            <div className="w-full animate-fade-in">
              <p className="text-slate-500 font-bold mb-3 text-sm uppercase tracking-wide">Scroll down to proceed</p>
              <button 
                disabled={timer > 0}
                onClick={handleContinue}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all duration-300 shadow-lg ${
                  timer > 0 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none" 
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30 hover:-translate-y-1"
                }`}
              >
                {timer > 0 ? `Please Wait ${timer}s` : "Continue to Next Step"}
              </button>
            </div>
          ) : (
             <div className="flex items-center gap-2 text-slate-400 font-medium">
                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Evaluating verification...
             </div>
          )}
        </div>
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center mt-auto">
        <p className="text-slate-400 text-xs font-semibold">© {new Date().getFullYear()} EarnLinks Platform. All rights reserved.</p>
      </footer>

      {/* Social Bar Script (Runs in background) */}
      <Script src="https://rightyrely.com/6c/3d/5e/6c3d5e71fdaab0f2fcbd03525c305b33.js" strategy="afterInteractive" />
    </div>
  );
                                                                              }
          

import React, { useState, useEffect } from 'react';
import { ArrowDown, AlertCircle, CheckCircle } from 'lucide-react';
import { AdSection, LargeSpacer, ContinueSection } from './GateComponents';

interface GatePageProps {
  shortCode: string;
  step: 'p1' | 'p2' | 'p3' | 'p4';
  onNavigate: (path: string) => void;
}

export default function GatePage({ shortCode, step, onNavigate }: GatePageProps) {
  const [countdown, setCountdown] = useState(10);
  const [isCompleted, setIsCompleted] = useState(false);
  const [linkInfo, setLinkInfo] = useState<{ id: string; originalUrl: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch target URL details initially to confirm code validity
    setError('');
    fetch(`/api/gate/link-info/${shortCode}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.link) {
          setLinkInfo(data.link);
        } else {
          setError('Invalid or expired shortened link.');
        }
      })
      .catch(err => {
        setError('Connection issue reading short URL metadata.');
      });
  }, [shortCode]);

  useEffect(() => {
    // Reset timer on step change
    setCountdown(10);
    setIsCompleted(false);
  }, [step]);

  useEffect(() => {
    if (countdown <= 0) {
      setIsCompleted(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleScrollToBottom = () => {
    const finalDestBtn = document.getElementById('final-destination-btn');
    if (finalDestBtn) {
      finalDestBtn.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  const handleNextStep = async () => {
    if (!linkInfo) return;

    if (step === 'p1') {
      onNavigate(`/gate/${shortCode}/p2`);
    } else if (step === 'p2') {
      onNavigate(`/gate/${shortCode}/p3`);
    } else if (step === 'p3') {
      onNavigate(`/gate/${shortCode}/p4`);
    } else if (step === 'p4') {
      // Completed last page! Register the click and credit the owner
      setLoading(true);
      try {
        const response = await fetch('/api/gate/complete-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shortCode })
        });
        const data = await response.json();
        if (data.success && data.originalUrl) {
          // Open target or redirect current tab
          window.location.href = data.originalUrl;
        } else {
          setError('Failed to process redirection.');
        }
      } catch (err) {
        setError('Failed to authorize payout click. Please reload and try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const getStepNumber = () => {
    if (step === 'p1') return 1;
    if (step === 'p2') return 2;
    if (step === 'p3') return 3;
    return 4;
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-12 px-4 relative flex flex-col items-center overflow-x-hidden" id="gate-page-root">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#090d16_1px,transparent_1px),linear-gradient(to_bottom,#090d16_1px,transparent_1px)] bg-[size:5rem_5rem] pointer-events-none opacity-40"></div>
      
      <div className="relative max-w-4xl w-full z-10 flex-1 flex flex-col" id="gate-container">
        
        {/* Top Header Card */}
        <div className="p-8 rounded-2xl bg-slate-900/95 border border-slate-800 text-center mb-8 shadow-2xl backdrop-blur-md">
          <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400 uppercase tracking-widest block mb-2">
            VERIFICATION SYSTEM SECURED
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">Your Link is Almost Ready</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
            Complete a simple 4-step security verification process to unlock the target destination.
          </p>

          {/* Progress Indicators */}
          <div className="flex justify-center items-center gap-2 mt-8" id="gate-progress-bullets">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border transition-all duration-300 ${
                  idx === getStepNumber() 
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.6)] scale-110 font-bold' 
                    : idx < getStepNumber()
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-950 text-slate-500 border-slate-800'
                }`}>
                  {idx}
                </div>
                {idx < 4 && <div className={`w-8 md:w-12 h-0.5 ${idx < getStepNumber() ? 'bg-emerald-500/30' : 'bg-slate-800'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Countdown or Action Button */}
        <div className="p-10 rounded-2xl bg-slate-900/90 border border-slate-800 text-center shadow-2xl mb-8 relative overflow-hidden" id="gate-interactive-box">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-emerald-500"></div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isCompleted ? (
            <div className="py-8" id="gate-timer-section">
              <span className="text-slate-400 text-xs uppercase tracking-wider block font-bold mb-4">
                Checking secure browser environment...
              </span>
              <div className="w-28 h-28 rounded-full border-4 border-slate-800 border-t-cyan-500 flex items-center justify-center mx-auto animate-spin mb-6 relative shadow-[0_0_25px_rgba(6,182,212,0.15)]">
                <span className="text-3xl font-black text-white absolute animate-none font-mono tracking-tight">
                  {countdown}s
                </span>
              </div>
              <p className="text-xs text-slate-500">Please wait. Do not close this tab or navigate away.</p>
            </div>
          ) : (
            <div className="py-6 animate-fadeIn" id="gate-completed-section">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Step {getStepNumber()} of 4 Completed!</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
                Security check successfully completed for this page loop. Please use the button below to scroll down and proceed.
              </p>
              
              <button
                onClick={handleScrollToBottom}
                className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black px-8 py-4 rounded-xl shadow-[0_4px_25px_rgba(6,182,212,0.4)] hover:shadow-[0_4px_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center space-x-3 mx-auto cursor-pointer"
                id="scroll-to-dest-btn"
              >
                <span>Scroll Down for Next Step</span>
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </button>
            </div>
          )}
        </div>

        {/* VIRAL MARKETING UTILITY BLOCK */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/20 to-slate-950 border border-cyan-500/25 text-center mb-12 shadow-xl shadow-cyan-500/5" id="viral-marketing-cta-box">
          <span className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest block mb-2">PROFIT CORNER</span>
          <a 
            href="/register" 
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/register');
            }}
            className="inline-flex flex-col items-center group decoration-none"
          >
            <div className="bg-cyan-500 text-slate-950 font-black px-8 py-3 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] group-hover:brightness-110 transition cursor-pointer text-sm tracking-wider uppercase">
              Create Your Own Link
            </div>
            <span className="text-xs text-slate-300 font-semibold mt-2.5 group-hover:text-cyan-400 transition">
              and earn money 🤑
            </span>
          </a>
        </div>

        {/* 
          MASSIVE HIGH-HEIGHT AD ADVERTISEMENT SLOTS (10 TO 12 CONTAINERS) 
          Laid out sequentially down the page with large spacing and custom wrappers.
        */}
        <div id="massive-advertisements-wrapper" className="flex flex-col">
          
          {/* Ad Block 1 (Slots 1 & 2) */}
          <AdSection title="Sponsored Verification Partners (1 & 2)" slots={[1, 2]} />
          
          <LargeSpacer size="md" />

          {/* Ad Block 2 (Slot 3 - Wide banner) */}
          <AdSection title="Featured Sponsored Content (3)" slots={[3]} />

          <LargeSpacer size="md" />

          {/* Ad Block 3 (Slots 4 & 5) */}
          <AdSection title="Recommended Web Utilities (4 & 5)" slots={[4, 5]} />

          <LargeSpacer size="md" />

          {/* Ad Block 4 (Slot 6 - Wide banner) */}
          <AdSection title="Exclusive Digital Promos (6)" slots={[6]} />

          <LargeSpacer size="lg" />

          {/* Ad Block 5 (Slots 7 & 8) */}
          <AdSection title="Fast Revenue Networks (7 & 8)" slots={[7, 8]} />

          <LargeSpacer size="md" />

          {/* Ad Block 6 (Slot 9 - Wide banner) */}
          <AdSection title="Top Tier Sponsoring Channels (9)" slots={[9]} />

          <LargeSpacer size="md" />

          {/* Ad Block 7 (Slots 10 & 11) */}
          <AdSection title="Instant Reward Programs (10 & 11)" slots={[10, 11]} />

          <LargeSpacer size="lg" />

          {/* Ad Block 8 (Slot 12 - Wide banner) */}
          <AdSection title="Redirection Service Sponsor (12)" slots={[12]} />

        </div>

        {/* Large spacing to separate ads from the final action */}
        <LargeSpacer size="xl" />

        {/* ABSOLUTE BOTTOM CONTINUE NAVIGATION SECTION */}
        <div className="pt-8 pb-16 border-t border-slate-900/80 text-center" id="footer-navigation-section">
          <ContinueSection 
            isCompleted={isCompleted}
            loading={loading}
            linkInfo={linkInfo}
            step={step}
            handleNextStep={handleNextStep}
          />
        </div>

      </div>
    </div>
  );
}

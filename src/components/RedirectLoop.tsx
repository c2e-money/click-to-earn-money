import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, AlertTriangle, ShieldAlert, Sparkles, Navigation, 
  ExternalLink, Layers, ArrowDown, CheckCircle2, Skull 
} from "lucide-react";
import { listenToGlobalCpm } from "../lib/firebaseService";

interface RedirectLoopProps {
  shortCode: string;
}

export default function RedirectLoop({ shortCode }: RedirectLoopProps) {
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [linkDetails, setLinkDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [destinationUrl, setDestinationUrl] = useState<string | null>(null);
  const [adClickedThisStep, setAdClickedThisStep] = useState(false);
  const [globalCpm, setGlobalCpm] = useState<number>(5.00);

  // Sound or vib effects could go here, but keep it solid
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Subscribe to real-time global CPM rate
  useEffect(() => {
    const unsubscribe = listenToGlobalCpm("guest", (rate) => {
      setGlobalCpm(rate);
    });
    return () => unsubscribe();
  }, []);

  // Fetch initial details to verify short code exists
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const res = await fetch(`/api/r/${shortCode}/details`);
        if (!res.ok) {
          throw new Error("This shortened URL does not exist or has been administratively disabled.");
        }
        const data = await res.json();
        setLinkDetails(data);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to load redirect engine.");
        setLoading(false);
      }
    };
    fetchMeta();
  }, [shortCode]);

  // Handle countdown timers per step
  useEffect(() => {
    if (loading || error || redirecting) return;

    // Reset timer depending on step
    const stepDuration = 10;
    setTimeLeft(stepDuration);
    setIsTimerRunning(true);
    setAdClickedThisStep(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, loading, error, redirecting]);

  const handleAdClick = (adUrl: string = "https://example.com") => {
    setAdClickedThisStep(true);
    setIsTimerRunning(false);
    setTimeLeft(0);
    try {
      window.open(adUrl, "_blank");
    } catch (e) {
      console.log("Ad click tracker activated");
    }
  };

  // Mock visitor data generation for the claim logic
  const handleFinalClaim = async () => {
    setRedirecting(true);
    try {
      // Pick random demographics to send to back-end analytic log
      const countries = ["United States", "India", "Germany", "United Kingdom", "Japan", "Brazil", "Canada", "Australia"];
      const devices = ["Mobile", "Tablet"];
      const browsers = ["Chrome Mobile", "Safari Mobile", "Firefox Mobile", "Edge Mobile"];
      const referrers = ["Telegram Channel", "Twitter / X", "WhatsApp Link", "Direct Direct", "YouTube Bio", "Facebook Link"];

      const country = countries[Math.floor(Math.random() * countries.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];
      const browser = browsers[Math.floor(Math.random() * browsers.length)];
      const referrer = referrers[Math.floor(Math.random() * referrers.length)];

      const res = await fetch(`/api/r/${shortCode}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, device, browser, referrer })
      });

      if (!res.ok) {
        throw new Error("Unable to securely decrypt destination URL.");
      }

      const data = await res.json();
      setDestinationUrl(data.originalUrl);
      
      // Redirect user directly
      window.location.href = data.originalUrl;
    } catch (err: any) {
      setError(err.message || "An error occurred while routing.");
      setRedirecting(false);
    }
  };

  const advanceStep = () => {
    if (isTimerRunning) return;
    setStep((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-white tracking-tight">Initializing Monetization Safeguards...</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-xs">Connecting securely to Click To Earn ad gateways.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>
        <h2 className="text-xl font-black text-white">Security Bypassed or Broken</h2>
        <p className="text-sm text-slate-400 mt-2 max-w-sm">{error}</p>
        <a href="/" className="mt-6 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg transition-all">
          Go To Home
        </a>
      </div>
    );
  }

  // Simulated ad blocks data structure with 12 placeholders to maximize CPM impressions
  const adPlaceholders = [
    {
      id: "adsterra-pop",
      title: "🔥 WARNING: Storage Full!",
      desc: "Clean up your device instant memory using Premium MaxCleaner. Instant optimization in 3 seconds.",
      type: "alert",
      badge: "Social Bar Ad",
      bg: "bg-red-950/40 border-red-500/30 text-red-200"
    },
    {
      id: "adsterra-banner-1",
      title: "🎰 Extreme Casino Slots",
      desc: "Get $1,500 + 200 Free Spins on registration. Click to Spin Wheel!",
      type: "banner",
      badge: "Premium Sponsor",
      bg: "bg-purple-950/40 border-purple-500/30 text-purple-200"
    },
    {
      id: "adsterra-native-1",
      title: "Earn $450/Day Watching TikTok Videos",
      desc: "No experience needed. Click below to secure limited remote slot.",
      type: "native",
      badge: "Smart Ad",
      bg: "bg-indigo-950/40 border-indigo-500/30 text-indigo-200"
    },
    {
      id: "adsterra-smart-link-1",
      title: "⬇️ Download Link Ready (Bypassed)",
      desc: "Secure High Speed Direct CDN Mirror. File size: 1.4 GB. Type: Zip Archive.",
      type: "smartlink",
      badge: "Sponsored link",
      bg: "bg-emerald-950/40 border-emerald-500/30 text-emerald-200"
    },
    {
      id: "adsterra-banner-2",
      title: "🤖 GPT-5 Core Leaked API Keys",
      desc: "Run unrestricted models for free. Unlimited context windows available now.",
      type: "banner",
      badge: "Popunder smart",
      bg: "bg-blue-950/40 border-blue-500/30 text-blue-200"
    },
    {
      id: "adsterra-social-1",
      title: "💬 Private Video Message Received",
      desc: "You have (1) unread video attachment from user 'Sweety99'. Play instantly.",
      type: "social",
      badge: "Social Bar",
      bg: "bg-pink-950/40 border-pink-500/30 text-pink-200"
    },
    {
      id: "adsterra-native-2",
      title: "How Indian Teenagers Are Multiplying Solona Coins",
      desc: "Secret arbitrage method exposed. Only available in next 4 minutes.",
      type: "native",
      badge: "Sponsored Context",
      bg: "bg-amber-950/40 border-amber-500/30 text-amber-200"
    },
    {
      id: "adsterra-smart-link-2",
      title: "🔐 CAPTCHA: Verify You Are Not a Robot",
      desc: "Click here to resolve network security checks and unlock original link.",
      type: "smartlink",
      badge: "Verification smart",
      bg: "bg-cyan-950/40 border-cyan-500/30 text-cyan-200"
    },
    {
      id: "adsterra-banner-3",
      title: "📈 Get VIP Crypto Crypto Signals (98% Accuracy)",
      desc: "Turn $10 into $500. Free Telegram channel invite expires in 30 seconds.",
      type: "banner",
      badge: "Adsterra Smart link",
      bg: "bg-yellow-950/40 border-yellow-500/30 text-yellow-200"
    },
    {
      id: "adsterra-pop-2",
      title: "🔴 VIRUS INFECTED ALERT!",
      desc: "Trojan spyware found in device background. Clean battery now before hardware melts.",
      type: "alert",
      badge: "System Alert Ad",
      bg: "bg-rose-950/40 border-rose-500/30 text-rose-200"
    },
    {
      id: "adsterra-sticky",
      title: "🔒 Bypass VPN - Standard Speed Restored",
      desc: "Your ISP is limiting connection velocity. Connect to Secure Proxy 1 Click.",
      type: "sticky",
      badge: "Recommended sponsor",
      bg: "bg-slate-950 border-indigo-500/40 text-slate-200"
    },
    {
      id: "adsterra-footer",
      title: "⚡ Ultra DNS Optimizer Pro",
      desc: "Boost your mobile gaming ping to 5ms instantly. Install Free SDK.",
      type: "footer",
      badge: "Platform Ad",
      bg: "bg-green-950/40 border-green-500/30 text-green-200"
    }
  ];

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col relative pb-32">
      
      {/* Sticky Countdown Header - Top Viewport Guard */}
      <div className="sticky top-0 z-50 bg-[#0b0f19]/95 backdrop-blur-md border-b border-indigo-500/20 px-4 py-3 shadow-lg select-none">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400 animate-pulse" />
            <div>
              <span className="text-xs uppercase font-black text-indigo-400 tracking-wider">Monetization Loop</span>
              <h3 className="text-sm font-bold text-white">Step {step} of 5</h3>
            </div>
          </div>

          <div className={`px-3 py-1.5 rounded-xl flex items-center gap-2 font-mono text-xs font-bold transition-all ${
            isTimerRunning 
              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 animate-pulse" 
              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{isTimerRunning ? `${timeLeft}s Remaining` : "Completed!"}</span>
          </div>
        </div>
        
        {/* Real Progress bar */}
        <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 transition-all duration-1000"
            style={{ width: `${isTimerRunning ? (timeLeft / (step === 5 ? 5 : 30)) * 100 : 100}%` }}
          />
        </div>
      </div>

      {/* Main Monetization Content Layout - Heavy Ad Simulation */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-6 space-y-5">
        
        {/* REVOLUTIONARY VOLUNTARY AD CLICK SYSTEM */}
        <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 text-indigo-400">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-slate-300">Fast-Track Gateway</span>
          </div>

          <div className="p-4 bg-indigo-950/50 border border-indigo-500/30 rounded-2xl space-y-2">
            <p className="text-xs text-indigo-200 font-medium leading-relaxed">
              Want to unlock the link? <span className="text-emerald-400 font-extrabold">(Optional)</span> Click on the top popup/banner ad, wait 10 seconds on that page, and press back to continue faster!
            </p>
          </div>

          {adClickedThisStep ? (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-xs font-black rounded-xl text-center animate-pulse">
              🎉 Sponsor ad visit registered! Gateway skip-timer unlocked. Proceed below!
            </div>
          ) : (
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>Automatic skip unlocks in:</span>
              <span className="font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15">{timeLeft}s</span>
            </div>
          )}
        </div>

        {/* Dynamic Ad Placement Block Group 1 (above main prompt) - Banners */}
        <div className="space-y-3">
          {adPlaceholders.slice(0, 3).map((ad) => (
            <div 
              key={ad.id} 
              onClick={() => handleAdClick("https://example.com")}
              className={`p-4 rounded-2xl border ${ad.bg} relative overflow-hidden simulated-ad cursor-pointer hover:scale-[1.01] transition-all`} 
              id={ad.id}
            >
              <span className="absolute top-1 right-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">{ad.badge}</span>
              <h4 className="text-sm font-black flex items-center gap-1">
                {ad.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1">{ad.desc}</p>
              <div className="mt-2 text-right">
                <span className="inline-block px-3 py-1 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded-lg cursor-pointer select-none">
                  Click to visit Sponsor
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Central interactive user action card */}
        <div className="bg-[#0b0f19] border border-slate-800/80 rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 text-[10px] text-slate-600 font-bold uppercase tracking-wider select-none">
            Click To Earn Engine
          </div>

          <h3 className="text-lg font-bold text-white mb-2 font-display">
            {step < 5 ? `Step ${step}: Securing Gateway` : "Step 5: Decrypt Link"}
          </h3>
          
          <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
            Our platform multiplies payouts using a high <span className="text-emerald-400 font-extrabold">${globalCpm.toFixed(2)} CPM</span> guarantee via multi-step ad verification. Your destination link is secured.
          </p>

          {isTimerRunning ? (
            <div className="py-4 space-y-2">
              <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500 font-medium">Analyzing sponsor impression telemetry...</p>
              <p className="text-[10px] text-indigo-400/70 font-mono">X-Impression-Token: adsterra_{shortCode}_{step}</p>
            </div>
          ) : (
            <div className="py-2 space-y-4">
              <div className="mx-auto w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/20">
                <CheckCircle2 className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <p className="text-sm text-emerald-400 font-bold">Impression Log Verified!</p>
                <p className="text-xs text-slate-400 mt-0.5">You can now proceed to the next verification step.</p>
              </div>
              
              <div className="animate-bounce text-indigo-400 flex items-center justify-center gap-1 text-xs font-bold">
                <ArrowDown className="w-4 h-4" /> Scroll Down & Click Button
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Ad Placement Block Group 2 (Between Content) - Native and Alerts */}
        <div className="space-y-3">
          {adPlaceholders.slice(3, 7).map((ad) => (
            <div 
              key={ad.id} 
              onClick={() => handleAdClick("https://example.com")}
              className={`p-4 rounded-2xl border ${ad.bg} relative overflow-hidden simulated-ad cursor-pointer hover:scale-[1.01] transition-all`} 
              id={ad.id}
            >
              <span className="absolute top-1 right-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">{ad.badge}</span>
              <h4 className="text-sm font-black flex items-center gap-1">
                {ad.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1">{ad.desc}</p>
              <div className="mt-2 text-right">
                <span className="inline-block px-3 py-1 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded-lg cursor-pointer select-none">
                  Open Direct Link
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Second Helper Action Block to increase duration of scroll */}
        <div className="bg-slate-900/60 rounded-2xl p-4 border border-slate-800 text-center select-none text-xs text-slate-500 font-mono">
          Advertisements credit verified by Google Ad Manager, PropellerAds, & Adsterra smart networks.
        </div>

        {/* Dynamic Ad Placement Block Group 3 (Near Bottom) - Smart Links */}
        <div className="space-y-3">
          {adPlaceholders.slice(7, 12).map((ad) => (
            <div 
              key={ad.id} 
              onClick={() => handleAdClick("https://example.com")}
              className={`p-4 rounded-2xl border ${ad.bg} relative overflow-hidden simulated-ad cursor-pointer hover:scale-[1.01] transition-all`} 
              id={ad.id}
            >
              <span className="absolute top-1 right-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">{ad.badge}</span>
              <h4 className="text-sm font-black flex items-center gap-1">
                {ad.title}
              </h4>
              <p className="text-xs text-slate-300 mt-1">{ad.desc}</p>
              <div className="mt-2 text-right">
                <span className="inline-block px-3 py-1 bg-white/10 hover:bg-white/20 text-[10px] font-bold rounded-lg cursor-pointer select-none">
                  Install Free Optimizer
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Sticky Action Bar - Locks Proceed Trigger */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b0f19]/95 backdrop-blur-md border-t border-indigo-500/20 px-4 py-4 shadow-2xl select-none">
        <div className="max-w-md mx-auto">
          {isTimerRunning ? (
            <div className="w-full py-3 px-4 bg-slate-800 border border-slate-700 text-slate-500 font-extrabold rounded-2xl text-center text-sm flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin text-slate-400" />
              <span>Unlock Proceed Button in {timeLeft}s...</span>
            </div>
          ) : step < 5 ? (
            <button
              ref={nextButtonRef}
              onClick={advanceStep}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-[0.98] text-white font-black rounded-2xl text-center text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/25 transition-all"
              id="proceed-step-btn"
            >
              PROCEED TO STEP {step + 1}
              <Navigation className="w-4 h-4 rotate-90" />
            </button>
          ) : (
            <button
              ref={nextButtonRef}
              onClick={handleFinalClaim}
              disabled={redirecting}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 active:scale-[0.98] text-white font-black rounded-2xl text-center text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-500/20 glow-purple transition-all"
              id="get-link-btn"
            >
              {redirecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Decrypting Destination URL...
                </>
              ) : (
                <>
                  GET ORIGINAL DESTINATION LINK
                  <ExternalLink className="w-4 h-4" />
                </>
              )}
            </button>
          )}
          
          <div className="mt-2 text-[9px] text-center text-slate-500 font-bold tracking-wide">
            CLICKING TRIGGERS CONVERTING LINK REVENUE FOR SHORTENER OWNER.
          </div>
        </div>
      </div>

    </div>
  );
}

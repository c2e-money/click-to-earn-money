import React from 'react';
import { ExternalLink, ShieldCheck, Play } from 'lucide-react';

interface AdPlaceholderProps {
  slotId: number;
  key?: any;
}

export function AdPlaceholder({ slotId }: AdPlaceholderProps) {
  return (
    <div 
      className="w-full rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300 min-h-[320px] md:min-h-[380px] flex flex-col items-center justify-center p-6 relative overflow-hidden group"
      id={`ad-placeholder-slot-${slotId}`}
    >
      {/* Background soft radial accent to give premium look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_0%,transparent_70%)] pointer-events-none"></div>
      
      {/* Corner slot label */}
      <div className="absolute top-3 left-3 text-[10px] text-slate-600 font-mono font-bold">
        SLOT_{slotId.toString().padStart(2, '0')}
      </div>
      
      {/* Bottom badge */}
      <div className="absolute bottom-3 right-3 flex items-center space-x-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
        <span className="text-[9px] text-slate-500 font-mono tracking-wider font-semibold">SPONSOR_CAMPAIGN</span>
      </div>

      {/* 
        ===================================================================
        PASTE YOUR IFRAME OR SCRIPT CODE FOR ADVERTISEMENT SLOT {slotId} BELOW
        ===================================================================
      */}
      <div className="text-center max-w-sm z-10 flex flex-col items-center">
        <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <ExternalLink className="w-5 h-5 text-cyan-500/80" />
        </div>
        <span className="text-xs font-extrabold tracking-widest text-slate-500 uppercase block mb-1">
          Advertisement Slot {slotId}
        </span>
        <h4 className="text-sm font-bold text-slate-300 mb-2">Premium Partner Campaign</h4>
        <p className="text-xs text-slate-400 leading-relaxed mb-5">
          This premium advertising container supports the instant link redirection engine. High conversion payouts are credited on click verification.
        </p>
        <div className="inline-flex items-center space-x-1.5 bg-slate-950/60 border border-slate-800/80 px-3 py-1 rounded-full text-[10px] text-slate-500 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Safe Ad Delivery Network</span>
        </div>
      </div>
      {/* 
        ===================================================================
        END OF ADVERTISEMENT SLOT {slotId} INSERTION
        ===================================================================
      */}
    </div>
  );
}

interface AdSectionProps {
  title?: string;
  slots: number[];
}

export function AdSection({ title, slots }: AdSectionProps) {
  return (
    <div className="w-full flex flex-col space-y-6" id={`ad-section-container-${slots.join('-')}`}>
      {title && (
        <div className="flex items-center space-x-4 mb-2">
          <div className="h-px bg-slate-800 flex-1"></div>
          <span className="text-[10px] font-black tracking-widest text-cyan-400 uppercase font-mono px-4 py-1 rounded-full bg-slate-900 border border-slate-800 shadow-sm">
            {title}
          </span>
          <div className="h-px bg-slate-800 flex-1"></div>
        </div>
      )}
      
      {/* We render slots nicely: if slots has length 1, full-width; otherwise multi-column grid */}
      <div className={slots.length === 1 ? "grid grid-cols-1" : "grid grid-cols-1 md:grid-cols-2 gap-8"}>
        {slots.map(slotId => (
          <AdPlaceholder key={slotId} slotId={slotId} />
        ))}
      </div>
    </div>
  );
}

interface LargeSpacerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function LargeSpacer({ size = 'md' }: LargeSpacerProps) {
  const heightClass = {
    sm: 'my-12 md:my-16',
    md: 'my-20 md:my-28',
    lg: 'my-28 md:my-36',
    xl: 'my-36 md:my-48'
  }[size];

  return (
    <div className={`w-full ${heightClass} flex items-center justify-center relative`} id="large-spacer-line">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-dashed border-slate-800/60"></div>
      </div>
      <span className="relative bg-slate-950 px-3 text-[10px] text-slate-700 font-mono tracking-widest uppercase">
        SCROLL DOWN
      </span>
    </div>
  );
}

interface ContinueSectionProps {
  isCompleted: boolean;
  loading: boolean;
  linkInfo: any;
  step: 'p1' | 'p2' | 'p3' | 'p4';
  handleNextStep: () => void;
}

export function ContinueSection({
  isCompleted,
  loading,
  linkInfo,
  step,
  handleNextStep
}: ContinueSectionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto text-center" id="continue-section-root">
      <p className="text-[10px] text-slate-500 mb-4 tracking-wider uppercase font-mono">
        Verification complete? Click the final button below to proceed.
      </p>
      
      <button
        id="final-destination-btn"
        disabled={!isCompleted || loading || !linkInfo}
        onClick={handleNextStep}
        className={`w-full py-5 rounded-2xl font-black text-sm tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-3 border cursor-pointer ${
          isCompleted && linkInfo
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-400 shadow-[0_6px_30px_rgba(16,185,129,0.35)] hover:shadow-[0_6px_40px_rgba(16,185,129,0.5)] hover:scale-[1.01] hover:brightness-110 active:scale-95'
            : 'bg-slate-900/60 text-slate-600 border-slate-800/80 cursor-not-allowed shadow-none'
        }`}
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <span>{step === 'p4' ? 'UNLOCK TARGET DESTINATION' : 'CONTINUE TO NEXT PAGE'}</span>
            <Play className="w-4 h-4 fill-current animate-pulse" />
          </>
        )}
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Smartphone,
  X,
  RefreshCw,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  ShieldCheck,
  Zap,
  Globe,
  Activity,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const MobilePreviewSimulator: React.FC = () => {
  const { currentLang, t } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [deviceModel, setDeviceModel] = useState<'iphone' | 'pixel'>('iphone');
  const [isSimulatedDark, setIsSimulatedDark] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  const handleReload = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 500);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      {/* Minimized Floating Trigger Button */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#121622] text-white border border-[#1e2638] hover:border-emerald-500/50 shadow-2xl hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all cursor-pointer backdrop-blur-md active:scale-95"
          title="Canlı Mobil Önizleme (Katlama Üstü) Simülatörünü Aç"
        >
          <div className="relative">
            <Smartphone className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-semibold tracking-tight">
            Canlı Önizleme <span className="text-emerald-400">(Katlama Üstü)</span>
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#161b26] text-neutral-400 border border-[#1e2638]">
            390px
          </span>
        </button>
      ) : (
        /* Expanded Mobile Device Mockup Frame */
        <div className="relative w-[320px] sm:w-[350px] bg-[#0c0e14] rounded-[42px] p-3 shadow-2xl border-4 border-[#1e2638] ring-1 ring-white/10 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Top Chassis Control Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 text-xs text-neutral-400 border-b border-[#1e2638] mb-2">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setDeviceModel(deviceModel === 'iphone' ? 'pixel' : 'iphone')}
                className="text-[11px] font-mono font-semibold hover:text-white transition-colors cursor-pointer"
              >
                {deviceModel === 'iphone' ? 'iPhone 16 Pro' : 'Pixel 9'}
              </button>
              <span className="text-neutral-600">·</span>
              <span className="text-[10px] text-emerald-400 font-mono">DPR 3.0</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleReload}
                className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Yeniden Yükle"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setIsSimulatedDark(!isSimulatedDark)}
                className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Koyu / Açık Tema Değiştir"
              >
                {isSimulatedDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-amber-400" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title="Küçült"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Smartphone Screen Enclosure */}
          <div
            className={`relative rounded-[32px] overflow-hidden border border-[#1e2638] transition-colors ${
              isSimulatedDark ? 'bg-[#0a0c12] text-neutral-100' : 'bg-white text-neutral-900'
            }`}
            style={{ height: '480px' }}
          >
            {/* Dynamic Island / Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
              <div className="w-24 h-4.5 bg-black rounded-full flex items-center justify-between px-2 shadow-inner border border-white/5">
                <div className="w-2 h-2 rounded-full bg-neutral-900" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>
            </div>

            {/* Mobile Status Bar (09:41, WiFi, Battery) */}
            <div className="h-9 px-6 pt-2 flex items-center justify-between text-[10px] font-mono font-semibold text-neutral-400 shrink-0">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <span>5G</span>
                <div className="w-4 h-2 border border-current rounded-xs p-0.5">
                  <div className="h-full bg-current rounded-2xs" />
                </div>
              </div>
            </div>

            {/* Scrollable Viewport (Katlama Üstü - Above the Fold Simulation) */}
            <div className="h-[calc(480px-36px)] overflow-y-auto p-4 space-y-4">
              {/* Simulated Mobile Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1e2638]/50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold font-display tracking-tight">
                    Vanguard Studio
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  GEO: 96/100
                </span>
              </div>

              {/* Katlama Üstü Hero Banner */}
              <div className="space-y-3 pt-1">
                <div className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-500 uppercase tracking-wider">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>48 Saatte Canlıda Teslim</span>
                </div>

                <h3 className="text-base font-extrabold leading-snug font-display tracking-tight">
                  Prestijli Hazır Web Siteleri & AI/GEO Mimarisi
                </h3>

                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Büyük ajans bütçeleri olmadan; 10.000 TL – 20.000 TL aralığında, Perplexity ve Google AI uyumlu dijital çözümler.
                </p>

                {/* Primary CTA button on mobile */}
                <div className="pt-1 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('portfolio-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
                  >
                    <span>Hazır Siteleri İncele</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono">
                    <div className="p-2 rounded-lg bg-[#121622] border border-[#1e2638]">
                      <div className="text-white font-bold">0.72s</div>
                      <div className="text-neutral-500">LCP Hızı</div>
                    </div>
                    <div className="p-2 rounded-lg bg-[#121622] border border-[#1e2638]">
                      <div className="text-emerald-400 font-bold">100%</div>
                      <div className="text-neutral-500">Schema JSON-LD</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Technical Diagnostic badge */}
              <div className="p-3 rounded-xl bg-[#121622] border border-[#1e2638] space-y-1.5 text-[10px] font-mono">
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Katlama Üstü Render:</span>
                  <span className="text-emerald-400 font-bold">0.48 saniye</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Mobil CLS (Kayma):</span>
                  <span className="text-emerald-400 font-bold">0.00 (Mükemmel)</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400">
                  <span>Touch Targets:</span>
                  <span className="text-emerald-400 font-bold">≥ 48px Uyumlu</span>
                </div>
              </div>
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-neutral-600/60 rounded-full pointer-events-none" />
          </div>

          {/* Bottom Caption */}
          <div className="pt-2 px-1 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
            <span>Katlama Üstü (Above-the-Fold) Canlı Test</span>
            <span className="text-emerald-400 font-bold">Mobil OK</span>
          </div>
        </div>
      )}
    </div>
  );
};

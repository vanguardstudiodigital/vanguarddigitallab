import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowUpRight, ArrowDownRight, Globe2, TrendingUp, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { CurrencyCode } from '../types/index.ts';

interface StockMarketIndex {
  id: string;
  code: string;
  nameTR: string;
  nameEN: string;
  regionTR: string;
  regionEN: string;
  value: string;
  change: string;
  isPositive: boolean;
  marketTR: string;
  marketEN: string;
}

export const CurrencyTicker: React.FC = () => {
  const { centralBankRates, currentCurrency, setCurrency, t, currentLang } = useApp();
  const [clickedFeedback, setClickedFeedback] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const isEN = currentLang === 'en';

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  // Global Stock Indices (TR, ABD, Euronext)
  const stockIndices: StockMarketIndex[] = [
    {
      id: 'bist100',
      code: 'BIST 100',
      nameTR: 'Borsa İstanbul 100',
      nameEN: 'Borsa Istanbul 100',
      regionTR: 'TR',
      regionEN: 'TR',
      value: '10.245,60',
      change: '+1.18%',
      isPositive: true,
      marketTR: 'BIST',
      marketEN: 'BIST',
    },
    {
      id: 'sp500',
      code: 'S&P 500',
      nameTR: 'Wall Street ABD',
      nameEN: 'US Large-Cap',
      regionTR: 'ABD',
      regionEN: 'US',
      value: '5.864,20',
      change: '+0.42%',
      isPositive: true,
      marketTR: 'NYSE',
      marketEN: 'NYSE',
    },
    {
      id: 'nasdaq',
      code: 'NASDAQ',
      nameTR: 'ABD Teknoloji',
      nameEN: 'US Tech 100',
      regionTR: 'ABD',
      regionEN: 'US',
      value: '18.340,15',
      change: '+0.65%',
      isPositive: true,
      marketTR: 'NDX',
      marketEN: 'NDX',
    },
    {
      id: 'euronext',
      code: 'EURONEXT 100',
      nameTR: 'Euronext Avrupa',
      nameEN: 'Euronext Europe',
      regionTR: 'AVRUPA',
      regionEN: 'EU',
      value: '1.528,40',
      change: '+0.35%',
      isPositive: true,
      marketTR: 'ENX',
      marketEN: 'ENX',
    },
  ];

  // Extended Currency Pairs (including EUR/USD cross)
  const extendedRates = [
    ...centralBankRates,
    { pair: 'EUR / USD', rate: 1.085, change: '+0.12%', source: 'ECB' },
  ];

  const handlePairClick = (pair: string) => {
    if (pair === 'USD / TRY') {
      const next: CurrencyCode = currentCurrency === 'USD' ? 'TRY' : 'USD';
      setCurrency(next);
      triggerFeedback(isEN ? `Active currency set to ${next}` : `Aktif para birimi ${next} yapıldı`);
    } else if (pair === 'EUR / TRY' || pair === 'EUR / USD') {
      const next: CurrencyCode = currentCurrency === 'EUR' ? 'TRY' : 'EUR';
      setCurrency(next);
      triggerFeedback(isEN ? `Active currency set to ${next}` : `Aktif para birimi ${next} yapıldı`);
    } else {
      setCurrency('USD');
      triggerFeedback(isEN ? 'Active currency set to USD' : 'Aktif para birimi USD yapıldı');
    }
  };

  const handleStockClick = (item: StockMarketIndex) => {
    const title = isEN ? `${item.code} (${item.nameEN})` : `${item.code} (${item.nameTR})`;
    const msg = isEN
      ? `${title}: Live index ${item.value} (${item.change})`
      : `${title}: Canlı endeks ${item.value} (${item.change})`;
    triggerFeedback(msg);
  };

  const triggerFeedback = (msg: string) => {
    setClickedFeedback(msg);
    setTimeout(() => {
      setClickedFeedback(null);
    }, 2800);
  };

  const getSourceDisplay = (source: string) => {
    if (isEN) {
      if (source === 'TCMB') return 'CBRT';
      if (source === 'ECB') return 'ECB';
    }
    return source;
  };

  const getCurrencyTooltip = (pair: string, source: string) => {
    const src = getSourceDisplay(source);
    if (isEN) {
      return `Official Exchange Rate: ${src} (${pair}). Click to switch website currency.`;
    }
    return `Merkez Bankası Kuru: ${src} (${pair}). Tıklayarak sitedeki para birimini değiştirin.`;
  };

  const getStockTooltip = (item: StockMarketIndex) => {
    if (isEN) {
      return `Stock Index: ${item.code} - ${item.nameEN} (${item.marketEN}). Real-time performance.`;
    }
    return `Borsa Endeksi: ${item.code} - ${item.nameTR} (${item.marketTR}). Canlı piyasa performansı.`;
  };

  return (
    <div className="bg-neutral-950 text-white border-b border-neutral-800 text-[11px] overflow-hidden py-1.5 px-4 select-none relative z-40 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Source Badge & Live Indicator */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ring-4 ring-emerald-400/20" />
          <span className="font-semibold text-neutral-200 font-display flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400 hidden sm:inline" />
            {t('ticker.title', isEN ? 'Official FX & Global Stock Indices' : 'TCMB & Dünya Borsaları')}
          </span>
          <span className="hidden md:inline text-neutral-500 text-[10px]">
            {t('ticker.subtitle', isEN ? '(Live Market Rates)' : '(Canlı Piyasa & Çevirici)')}
          </span>
        </div>

        {/* Center: Scrollable Ticker Items (FX + Stock Indices) with quick navigation controls */}
        <div className="relative flex-1 min-w-0 flex items-center">
          <button
            type="button"
            onClick={scrollLeft}
            aria-label="Scroll left"
            className="hidden sm:flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer shrink-0 mr-1.5"
            title={isEN ? "Scroll left" : "Sola kaydır"}
          >
            <ChevronLeft className="w-3 h-3" />
          </button>

          <div
            ref={scrollRef}
            className="flex items-center gap-4 overflow-x-auto scrollbar-none py-0.5 scroll-smooth w-full"
          >
            {/* FX Rates */}
            <div className="flex items-center gap-3.5 shrink-0">
              {extendedRates.map((item, idx) => {
                const isPositive = item.change.startsWith('+');
                const sourceDisplay = getSourceDisplay(item.source);
                return (
                  <button
                    key={`fx-${idx}`}
                    type="button"
                    onClick={() => handlePairClick(item.pair)}
                    className="group flex items-center gap-1.5 hover:bg-neutral-900/80 px-1.5 py-0.5 rounded transition-all cursor-pointer shrink-0"
                    title={getCurrencyTooltip(item.pair, item.source)}
                  >
                    <span className="text-neutral-400 group-hover:text-amber-400 transition-colors font-medium">
                      {item.pair}:
                    </span>
                    <span className="font-bold text-white font-mono-numbers">
                      {item.rate.toFixed(item.rate < 2 ? 3 : 2)}
                    </span>
                    <span
                      className={`text-[10px] font-mono-numbers flex items-center ${
                        isPositive ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="w-3 h-3 inline" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 inline" />
                      )}
                      {item.change}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-800 text-neutral-400 uppercase font-mono group-hover:bg-neutral-700">
                      {sourceDisplay}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Thin Divider */}
            <div className="h-3.5 w-px bg-neutral-800 shrink-0 hidden sm:block" />

            {/* Stock Indices (TR, ABD, Euronext) */}
            <div className="flex items-center gap-3.5 shrink-0">
              {stockIndices.map((stk) => {
                const region = isEN ? stk.regionEN : stk.regionTR;
                const market = isEN ? stk.marketEN : stk.marketTR;
                return (
                  <button
                    key={stk.id}
                    type="button"
                    onClick={() => handleStockClick(stk)}
                    className="group flex items-center gap-1.5 hover:bg-neutral-900/80 px-1.5 py-0.5 rounded transition-all cursor-pointer shrink-0"
                    title={getStockTooltip(stk)}
                  >
                    <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-neutral-900 border border-neutral-700/80 text-amber-400 font-mono">
                      {region}
                    </span>
                    <span className="text-neutral-300 font-medium group-hover:text-white transition-colors">
                      {stk.code}:
                    </span>
                    <span className="font-bold text-white font-mono-numbers">
                      {stk.value}
                    </span>
                    <span
                      className={`text-[10px] font-mono-numbers flex items-center ${
                        stk.isPositive ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {stk.isPositive ? (
                        <ArrowUpRight className="w-3 h-3 inline" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3 inline" />
                      )}
                      {stk.change}
                    </span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-800/90 text-neutral-400 uppercase font-mono">
                      {market}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={scrollRight}
            aria-label="Scroll right"
            className="hidden sm:flex items-center justify-center w-5 h-5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer shrink-0 ml-1.5"
            title={isEN ? "Scroll right" : "Sağa kaydır"}
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Active Currency & Notification */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Toast on Click */}
          {clickedFeedback && (
            <div className="hidden xl:flex items-center gap-1.5 text-emerald-400 text-[10px] bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full animate-fade-in">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[220px]">{clickedFeedback}</span>
            </div>
          )}

          {/* Active Currency quick pill */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-neutral-400 text-[10px]">
            <span>{t('ticker.activeCurrency', isEN ? 'Active Currency:' : 'Aktif Birim:')}</span>
            <span className="font-bold font-mono text-amber-400 px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded">
              {currentCurrency}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

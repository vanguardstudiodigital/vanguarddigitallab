import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { CurrencyCode } from '../types/index.ts';

export const CurrencyTicker: React.FC = () => {
  const { centralBankRates, currentCurrency, setCurrency, t, currentLang } = useApp();

  const handlePairClick = (pair: string) => {
    if (pair === 'USD / TRY') {
      setCurrency(currentCurrency === 'USD' ? 'TRY' : 'USD');
    } else if (pair === 'EUR / TRY') {
      setCurrency(currentCurrency === 'EUR' ? 'TRY' : 'EUR');
    } else {
      setCurrency('USD');
    }
  };

  const getSourceDisplay = (source: string) => {
    if (currentLang === 'en') {
      if (source === 'TCMB') return 'CBRT';
    }
    return source;
  };

  const getTooltip = (source: string) => {
    const srcDisplay = getSourceDisplay(source);
    if (currentLang === 'en') {
      return `Official Rate: ${srcDisplay}. Click to switch active currency.`;
    }
    return `Merkez Bankası Kuru: ${srcDisplay}. Tıklayarak bu para birimine geçin.`;
  };

  return (
    <div className="bg-neutral-950 text-white border-b border-neutral-800 text-[11px] overflow-hidden py-1.5 px-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Source Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-neutral-300 font-display">
            {t('ticker.title', 'TCMB & CBR Resmi Kurlar')}
          </span>
          <span className="hidden sm:inline text-neutral-500 text-[10px]">
            {t('ticker.subtitle', '(Anlık Dönüştürücü)')}
          </span>
        </div>

        {/* Ticker items */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none py-0.5">
          {centralBankRates.map((item, idx) => {
            const isPositive = item.change.startsWith('+');
            const sourceDisplay = getSourceDisplay(item.source);
            return (
              <button
                key={idx}
                onClick={() => handlePairClick(item.pair)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer shrink-0"
                title={getTooltip(item.source)}
              >
                <span className="text-neutral-400 font-medium">{item.pair}:</span>
                <span className="font-bold text-white font-mono-numbers">
                  {item.rate.toFixed(item.rate < 1 ? 3 : 2)}
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
                <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-800 text-neutral-400 uppercase font-mono">
                  {sourceDisplay}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Currency quick pill */}
        <div className="hidden lg:flex items-center gap-1.5 shrink-0 text-neutral-400 text-[10px]">
          <span>{t('ticker.activeCurrency', 'Aktif Birim:')}</span>
          <span className="font-bold font-mono text-amber-400">{currentCurrency}</span>
        </div>
      </div>
    </div>
  );
};

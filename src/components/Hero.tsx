import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, Zap, Play } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t, formatPrice, openVideoModal, settings, languages } = useApp();

  const defaultActiveLanguagesStr = languages.filter(l => l.active).map(l => l.code.toUpperCase()).join(' · ');
  const primaryUrl = t('hero.ctaPrimaryUrl', '') || '#portfolio-section';
  const secondaryUrl = t('hero.ctaSecondaryUrl', '') || '#pricing-models';
  const bgImageUrl =
    t('hero.bgImage', '') ||
    settings.heroBgImage ||
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=65&fm=webp';

  const handlePrimaryClick = () => {
    if (primaryUrl.startsWith('#')) {
      const el = document.querySelector(primaryUrl);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const portEl = document.getElementById('portfolio-section');
        portEl?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = primaryUrl;
    }
  };

  const handleSecondaryClick = () => {
    if (secondaryUrl.startsWith('#')) {
      const el = document.querySelector(secondaryUrl);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const modelsEl = document.getElementById('pricing-models');
        modelsEl?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = secondaryUrl;
    }
  };

  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
      {/* Cyber Network & Tech Wireframe Background Architecture */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src={bgImageUrl}
          srcSet={`${bgImageUrl} 600w, ${bgImageUrl} 1000w`}
          sizes="100vw"
          alt=""
          loading="eager"
          decoding="async"
          fetchPriority="low"
          width="1000"
          height="600"
          className="w-full h-full object-cover object-center opacity-[0.06] dark:opacity-[0.07] mix-blend-overlay filter contrast-125 brightness-95 scale-105"
        />
        {/* Degrade Maske Entegrasyonu (Scrim Overlay) - Seamless melting into #0a0c12 */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c12] via-transparent to-[#0a0c12]" />
        {/* Subtle radial scrim to melt side borders */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0a0c12_92%)]" />
      </div>

      {/* Subtle architectural ambient background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-amber-500/10 via-neutral-500/5 to-transparent blur-3xl rounded-full dark:from-amber-400/5 dark:via-neutral-800/10 z-0"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          {/* Subtle Editorial Kicker */}
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>{t('hero.badge', 'Küçük İşletmelere Özel · 48 Saatte Canlıda')}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white font-display text-balance leading-[1.12]">
            {t('hero.title', 'Bütçenizi Zorlamayan, Prestijli Hazır Web Siteleri.')}
          </h1>

          {/* Value Proposition Subtitle */}
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl mx-auto text-justify sm:text-center">
            {t(
              'hero.subtitle',
              'Büyük ajanslara servet ödemeden; {{PRICE_10000}} – {{PRICE_20000}} aralığında, sektörünüze özel tasarlanmış, satış odaklı ve hemen teslim dijital varlıklar.'
            )}
          </p>

          {/* Primary, Secondary, & Video Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handlePrimaryClick}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('hero.ctaPrimary', 'Hazır Siteleri Keşfet')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSecondaryClick}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-xl transition-all border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-center cursor-pointer"
            >
              <span>{t('hero.ctaSecondary', 'Hangi Paket Size Uygun?')}</span>
            </button>

            <button
              onClick={() => openVideoModal()}
              className="w-full sm:w-auto px-5 py-3.5 text-sm font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs whitespace-nowrap"
              title="Vanguard Studio Stüdyo & Çalışma Modeli Tanıtım Videosu"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t('hero.watchVideo', 'Nasıl Çalışıyoruz? (Video)')}</span>
            </button>
          </div>
        </div>

        {/* Quantified Proof Metrics Bar (Adjacent to claim) */}
        <div className="mt-16 pt-8 border-t border-neutral-200/70 dark:border-neutral-800/70 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/40 dark:border-neutral-800/40">
            <div className="text-2xl font-bold font-display text-neutral-950 dark:text-white font-mono-numbers">
              {t('hero.stat1.val', '48 Saat')}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {t('hero.stat1.label', 'Ortalama Teslimat Süresi')}
            </div>
          </div>

          <div className="text-center p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/40 dark:border-neutral-800/40">
            <div className="text-2xl font-bold font-display text-neutral-950 dark:text-white font-mono-numbers">
              {t('hero.stat2.val', '{{PRICE_10000}}’den')}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {t('hero.stat2.label', 'Başlayan Şeffaf Fiyatlar')}
            </div>
          </div>

          <div className="text-center p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/40 dark:border-neutral-800/40">
            <div className="text-2xl font-bold font-display text-neutral-950 dark:text-white uppercase tracking-wider">
              {t('hero.stat3.val', defaultActiveLanguagesStr || 'TR · EN')}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              {t('hero.stat3.label', 'Çok Dilli & Pazar Odaklı')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

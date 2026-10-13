import React from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  ArrowRight,
  ExternalLink,
  Briefcase,
  Grid,
  Check,
  Eye,
  Download
} from 'lucide-react';
import { TurnkeyProduct } from '../../types/index.ts';

export const PortfolioSection: React.FC = () => {
  const {
    products,
    formatPrice,
    openDemo,
    openDetail,
    openCustomerPanel,
    openStandaloneSite,
    openDeployModal,
    openPageModal,
    currentLang,
    t
  } = useApp();

  return (
    <section
      id="portfolio-section"
      aria-labelledby="portfolio-section-title"
      className="py-16 md:py-24 border-t border-neutral-200/70 dark:border-neutral-800/70 w-full overflow-hidden bg-neutral-50/30 dark:bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 w-full">
          <div>
            <div className="text-xs font-semibold tracking-wider uppercase text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-2">
              <Grid className="w-3.5 h-3.5" />
              <span>{t('products.sectionNumber', '01. Vitrin & Portföy')}</span>
            </div>
            <h2
              id="portfolio-section-title"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white font-display"
            >
              {t('products.sectionTitle', currentLang === 'en' ? 'Ready-to-Deploy Turnkey Sites' : 'Satışa Hazır Sektörel Siteler')}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl leading-relaxed">
              {t('products.sectionSubtitle', currentLang === 'en' ? 'Carefully engineered, battle-tested, and ready for 48-hour turnkey deployment.' : 'Özenle seçilmiş, test edilmiş ve anahtar teslim devreye alınmaya hazır özel çözümler.')}
            </p>
          </div>

          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 shrink-0 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800/80">
            <span className="font-mono-numbers font-bold text-neutral-900 dark:text-white">
              {Math.min(6, products.filter(prod => (prod as any).isActive !== false && prod.active !== false).length)} / {products.filter(prod => (prod as any).isActive !== false && prod.active !== false).length}
            </span>
            <span>{currentLang === 'en' ? 'Sites Displayed (Max 6)' : 'Site Gösteriliyor (Maks 6)'}</span>
          </div>
        </div>

        {/* ============================================================================
            KORUMALI 6 ÜRÜN LİMİTLİ GRİD SİSTEMİ (Vite & Netlify Canlı Ortam Nizamı)
            ============================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Veritabanından gelen siteleri strictly ilk 6 adet ile kesip ekrana basıyoruz */}
          {[...products]
            .filter(prod => (prod as any).isActive !== false && prod.active !== false) // Sadece aktif ürünleri süz
            .slice(0, 6) // Anayasa Maddesi: Maksimum 6 ürünü filtrele
            .map((product) => {
              const displayTitle = product.translations?.[currentLang]?.title || product.title;
              const displayDesc = product.translations?.[currentLang]?.description || product.description;
              const displayBadge = product.translations?.[currentLang]?.badge || product.badge;
              const displaySector = product.translations?.[currentLang]?.sector || product.sector;

              return (
                <div
                  key={product.id}
                  className="group flex flex-col bg-white dark:bg-[#10141d] rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800/80 hover:border-amber-500/50 dark:hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl"
                >
                  {/* Görsel Katmanı */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <img
                      src={product.coverImage}
                      alt={displayTitle}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=70';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-neutral-900 dark:text-neutral-100 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs">
                        {displaySector}
                      </span>
                      {displayBadge && (
                        <span className="text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 font-sans shadow-xs">
                          {displayBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* İçerik ve Detaylar */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-950 dark:text-white group-hover:text-amber-500 transition-colors">
                        {displayTitle}
                      </h3>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                        {displayDesc}
                      </p>

                      {/* Özellik Listesi */}
                      {product.features && product.features.length > 0 && (
                        <ul className="mt-4 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                          {product.features.slice(0, 3).map((feat, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      {/* Fiyat Bilgisi */}
                      <div className="flex items-baseline justify-between mb-4">
                        <span className="text-xs text-neutral-500">
                          {currentLang === 'en' ? 'Starting from' : 'Başlangıç Fiyatı'}
                        </span>
                        <span className="text-base font-bold text-neutral-950 dark:text-white font-mono-numbers">
                          {formatPrice(product.priceEconomicTRY)}
                        </span>
                      </div>

                      {/* Buton Grubu */}
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => openDetail(product)}
                          className="py-2 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-900 dark:text-white transition-colors cursor-pointer text-center"
                        >
                          {currentLang === 'en' ? 'Details' : 'İncele'}
                        </button>
                        <button
                          type="button"
                          onClick={() => openDemo(product)}
                          className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-xs font-bold text-neutral-950 transition-colors cursor-pointer text-center whitespace-nowrap"
                        >
                          Demo
                        </button>
                      </div>

                      {/* İkincil Araçlar */}
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => openStandaloneSite(product)}
                          className="py-1.5 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{currentLang === 'en' ? 'Live Site' : 'Canlı Site'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openCustomerPanel(product.id)}
                          className="py-1.5 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer truncate"
                        >
                          <Briefcase className="w-3 h-3 shrink-0" />
                          <span className="truncate">{currentLang === 'en' ? 'Client' : 'Müşteri'}</span>
                        </button>
                      </div>

                      {/* Deploy Butonu */}
                      {openDeployModal && (
                        <button
                          type="button"
                          onClick={() => openDeployModal(product)}
                          className="w-full mt-2 py-1.5 px-2 rounded-lg bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-700/60 dark:border-neutral-700 text-neutral-300 dark:text-neutral-200 text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer min-w-0"
                        >
                          <Download className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">
                            {currentLang === 'en' ? 'Deploy Turnkey Site (48h)' : 'Talep Halinde Canlıya Al & Bağla'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* ============================================================================
            NARİN "HEPSİNİ GÖR" BUTON ALANI (Vitrin Asaletini Koruyan Merkez Konum)
            ============================================================================ */}
        {products.filter(prod => (prod as any).isActive !== false && prod.active !== false).length > 6 && (
          <div className="mt-16 text-center animate-fadeIn">
            <button
              type="button"
              onClick={() => openPageModal('tum-portfolyo')} // Hepsini gör sayfası modal veya slugs köprüsü
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-black uppercase tracking-widest text-neutral-950 dark:text-white hover:text-amber-500 dark:hover:text-amber-400 bg-white dark:bg-[#121620] hover:bg-neutral-50 dark:hover:bg-[#161b27] rounded-xl border border-neutral-200 dark:border-neutral-800 transition-all shadow-xs active:scale-95 cursor-pointer shrink-0"
            >
              <span>{currentLang === 'en' ? 'View All Portfolio' : 'Tüm Hazır Siteleri Gör'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

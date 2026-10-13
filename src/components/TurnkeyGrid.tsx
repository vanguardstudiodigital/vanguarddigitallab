import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Eye,
  Check,
  Video,
  ArrowRight,
  Briefcase,
  ExternalLink,
  Download,
  Grid,
} from 'lucide-react';
import { TurnkeyProduct } from '../types/index.ts';

interface SectorTab {
  id: string;
  label: string;
}

const optimizeUnsplashUrl = (url: string, width = 600): string => {
  if (!url || !url.includes('://unsplash.com')) return url;
  try {
    const base = url.split('?')[0];
    return `${base}?auto=format&fit=crop&w=${width}&q=70&fm=webp`;
  } catch {
    return url;
  }
};

const getProductSectorId = (product: TurnkeyProduct): string => {
  const raw = (product.sector || '').toLowerCase().trim();
  const enSector = (product.translations?.en?.sector || '').toLowerCase().trim();

  if (raw.includes('portf') || enSector.includes('portf')) {
    return 'portfolio';
  }
  if (raw.includes('sağlık') || raw.includes('klinik') || enSector.includes('health') || enSector.includes('clinic')) {
    return 'health';
  }
  if (raw.includes('hukuk') || raw.includes('müşavir') || raw.includes('danışman') || enSector.includes('law') || enSector.includes('legal')) {
    return 'law';
  }
  if (raw.includes('restoran') || raw.includes('kafe') || raw.includes('bistro') || raw.includes('gastronomi') || enSector.includes('restaurant') || enSector.includes('cafe')) {
    return 'restaurant';
  }
  if (raw.includes('mimar') || raw.includes('inşaat') || enSector.includes('architect') || enSector.includes('interior')) {
    return 'architecture';
  }
  if (raw.includes('lojistik') || raw.includes('taşımacılık') || enSector.includes('logistic') || enSector.includes('cargo') || enSector.includes('freight')) {
    return 'logistics';
  }
  if (raw.includes('e-ticaret') || raw.includes('eticaret') || raw.includes('butik') || enSector.includes('commerce') || enSector.includes('store') || enSector.includes('boutique')) {
    return 'ecommerce';
  }
  if (raw.includes('emlak') || raw.includes('gayrimenkul') || enSector.includes('estate') || enSector.includes('realty')) {
    return 'realestate';
  }
  if (raw.includes('spor') || raw.includes('fitness') || raw.includes('sağlıklı yaşam') || enSector.includes('fitness') || enSector.includes('gym')) {
    return 'fitness';
  }

  return raw.replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-\$/g, '') || 'custom';
};

export const TurnkeyGrid: React.FC = () => {
  const {
    products,
    formatPrice,
    openDemo,
    openDetail,
    openCustomerPanel,
    openStandaloneSite,
    openDeployModal,
    openViewAll,
    getLocalizedProduct,
    t,
    currentLang,
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('all');
  const localizedProducts = products.map(p => getLocalizedProduct(p));
  const sectorMap = new Map<string, string>();
  
  localizedProducts.forEach(p => {
    if (p.active) {
      const sId = getProductSectorId(p);
      if (!sectorMap.has(sId)) {
        sectorMap.set(sId, p.sector);
      }
    }
  });

  const getSectorLabelKey = (sectorId: string): string => {
    switch (sectorId) {
      case 'health': return 'products.tab.health';
      case 'law': return 'products.tab.law';
      case 'restaurant': return 'products.tab.restaurant';
      case 'architecture': return 'products.tab.architecture';
      case 'logistics': return 'products.tab.logistics';
      case 'ecommerce': return 'products.tab.ecommerce';
      case 'realestate': return 'products.tab.realestate';
      case 'fitness': return 'products.tab.fitness';
      case 'portfolio': return 'products.tab.portfolio';
      default: return `products.tab.${sectorId}`;
    }
  };

  const allTab: SectorTab = {
    id: 'all',
    label: t('products.tab.all', t('products.all', currentLang === 'en' ? 'All Sectors' : 'Tüm Sektörler')),
  };

  const middleTabs: SectorTab[] = [];
  sectorMap.forEach((label, id) => {
    if (id !== 'portfolio') {
      const key = getSectorLabelKey(id);
      middleTabs.push({ id, label: t(key, label) });
    }
  });

  const portfolioLabelKey = getSectorLabelKey('portfolio');
  const defaultPortfolioLabel = currentLang === 'en' ? 'Portfolio' : 'Portfolyo';
  const portfolioLabel = t(portfolioLabelKey, sectorMap.get('portfolio') || defaultPortfolioLabel);
  const portfolioTab: SectorTab = { id: 'portfolio', label: portfolioLabel };

  const tabs: SectorTab[] = [allTab, ...middleTabs, portfolioTab];

  const filteredProducts = localizedProducts.filter(p => {
    if (!p.active) return false;
    if (activeTab === 'all') return true;
    return getProductSectorId(p) === activeTab;
  });

  // FRONTEND CONSTRAINT: Ana sayfadaki vitrinde MAKSİMUM 6 adet gösterilir. Kalanlar "Tümünü Gör" ile açılır.
  const MAX_HOMEPAGE_ITEMS = 6;
  const displayedProducts = filteredProducts.slice(0, MAX_HOMEPAGE_ITEMS);
  const hasMoreThanMax = filteredProducts.length > MAX_HOMEPAGE_ITEMS;

  return (
    <section
      id="portfolio-section"
      aria-labelledby="portfolio-section-title"
      className="py-12 md:py-24 border-t border-neutral-200/70 dark:border-neutral-800/70 w-full overflow-hidden bg-neutral-50/30 dark:bg-transparent"
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
              {t('products.sectionSubtitle', currentLang === 'en' ? 'Carefully engineered, battle-tested, and ready for 48-hour turnkey deployment.' : 'Özenle seçilmiş, test edilmiş ve anahtar teslim devreye alınmaya hazır maksimum 10 özel çözüm.')}
            </p>
          </div>

          <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 shrink-0 bg-neutral-100 dark:bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800/80">
            <span className="font-mono-numbers font-bold text-neutral-900 dark:text-white">
              {displayedProducts.length} / {filteredProducts.length}
            </span>
            <span>{t('products.listingCount', currentLang === 'en' ? 'Sites Displayed (Max 6 on Showcase)' : 'Site Gösteriliyor (Vitrinde Maks 6)')}</span>
          </div>
        </div>

        {/* Sector Tabs Bar */}
        <div className="relative mb-10 w-full">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pb-3 pt-1 w-full" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md scale-102'
                    : 'bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200/70 dark:border-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white dark:bg-neutral-900/40 rounded-2xl border border-neutral-200 dark:border-neutral-800 w-full shadow-xs">
            <p className="text-neutral-500 text-sm">
              {t('products.emptyCategory', currentLang === 'en' ? 'No turnkey sites currently listed in this category.' : 'Bu kategoride şu anda listelenen hazır site bulunmuyor.')}
            </p>
            <button
              onClick={() => setActiveTab('all')}
              className="mt-4 px-4 py-2 text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
            >
              {t('products.viewAll', currentLang === 'en' ? 'View All Sectors' : 'Tüm Hazır Siteleri Gör')}
            </button>
          </div>
        ) : (
          /* Cards Grid (Max 6 Items on Homepage) */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center justify-items-center items-stretch w-full mx-auto">
              {displayedProducts.map((product: TurnkeyProduct, index: number) => {
                const isFirstScreen = index < 2;
                return (
                  <article
                    key={product.id}
                    className="group flex flex-col bg-white dark:bg-[#10141d] rounded-2xl overflow-hidden border border-neutral-200/90 dark:border-neutral-800/90 hover:border-amber-500/50 dark:hover:border-amber-500/40 transition-all duration-300 hover:shadow-xl w-full max-w-[380px] sm:max-w-full"
                  >
                    {/* Media Cover Image */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                      <img
                        src={optimizeUnsplashUrl(product.coverImage, 600)}
                        srcSet={`${optimizeUnsplashUrl(product.coverImage, 400)} 400w, ${optimizeUnsplashUrl(product.coverImage, 600)} 600w, ${optimizeUnsplashUrl(product.coverImage, 800)} 800w`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        alt={product.title}
                        loading={isFirstScreen ? 'eager' : 'lazy'}
                        fetchPriority={isFirstScreen ? 'high' : 'low'}
                        decoding="async"
                        width="600"
                        height="375"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=70';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                      
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-neutral-900 dark:text-neutral-100 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-2.5 py-1 rounded-md shadow-xs">
                          {product.sector}
                        </span>
                        {product.badge && (
                          <span
                            lang={currentLang}
                            className="text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 font-sans shadow-xs"
                          >
                            {currentLang === 'en' ? product.badge.replace(/İ/g, 'I').replace(/ı/g, 'i') : product.badge}
                          </span>
                        )}
                      </div>

                      {product.videoUrl && (
                        <div className="absolute top-3 right-3 p-1.5 rounded-md bg-black/60 backdrop-blur-md text-white" title={t('products.videoAvailable', currentLang === 'en' ? 'Video Walkthrough Available' : 'Video Tanıtım Mevcut')}>
                          <Video className="w-3.5 h-3.5" />
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 text-[11px] text-white/90 font-medium">
                        {t('products.readyIn', currentLang === 'en' ? 'Turnkey: 48 Hours' : 'Teslimat: 48 Saat')}
                      </div>
                    </div>

                    {/* Card Content & Features */}
                    <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between w-full min-w-0">
                      <div className="w-full min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-neutral-950 dark:text-white font-display group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                          {product.title}
                        </h3>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {product.tagline}
                        </p>
                        
                        <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2 w-full">
                          {product.features.slice(0, 3).map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 w-full min-w-0">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span className="truncate w-full">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pricing Tiers & Actions */}
                      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 w-full">
                        <div className="grid grid-cols-2 gap-1.5 p-2 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/50 mb-4 w-full">
                          <div className="min-w-0 overflow-hidden">
                            <div className="text-[10px] font-medium tracking-wide text-neutral-500 dark:text-neutral-400 truncate">
                              {t('products.economicBadge', currentLang === 'en' ? 'Managed Setup' : 'Yönetim Bizde')}
                            </div>
                            <div className="text-xs sm:text-sm font-bold font-mono-numbers text-neutral-950 dark:text-white truncate tracking-tight">
                              {formatPrice(product.priceEconomicTRY)}
                            </div>
                          </div>
                          <div className="border-l border-neutral-200 dark:border-neutral-800 pl-2 overflow-hidden min-w-0">
                            <div className="text-[10px] font-semibold tracking-wide text-amber-600 dark:text-amber-400 truncate">
                              {t('products.proBadge', currentLang === 'en' ? 'Professional CMS' : 'Profesyonel CMS')}
                            </div>
                            <div className="text-xs sm:text-sm font-bold font-mono-numbers text-neutral-950 dark:text-white truncate tracking-tight">
                              {formatPrice(product.priceProfessionalTRY)}
                            </div>
                          </div>
                        </div>

                        {/* Primary Buttons */}
                        <div className="grid grid-cols-2 gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => openDemo(product)}
                            className="px-2 py-2.5 text-[11px] sm:text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer min-w-0"
                          >
                            <Eye className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{t('products.viewDemo', currentLang === 'en' ? 'Live Preview' : 'Canlı Önizleme')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openDetail(product)}
                            className="px-2 py-2.5 text-[11px] sm:text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer min-w-0 shadow-xs"
                          >
                            <span className="truncate">{t('products.viewDetails', currentLang === 'en' ? 'Details & Buy' : 'Detay & Satın Al')}</span>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          </button>
                        </div>

                        {/* Secondary Utility Actions */}
                        <div className="grid grid-cols-2 gap-2 mt-2 w-full">
                          <button
                            type="button"
                            onClick={() => openStandaloneSite(product)}
                            className="py-1.5 px-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer min-w-0"
                          >
                            <ExternalLink className="w-3 h-3 text-amber-500 shrink-0" />
                            <span className="truncate">{t('products.liveSite', currentLang === 'en' ? 'Live Site' : 'Bağımsız Canlı Site')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openCustomerPanel(product.id)}
                            className="py-1.5 px-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] sm:text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer min-w-0"
                          >
                            <Briefcase className="w-3 h-3 text-emerald-500 shrink-0" />
                            <span className="truncate">{t('products.manageWithCustomerPanel', currentLang === 'en' ? 'Client Panel' : 'Müşteri Paneli')}</span>
                          </button>
                        </div>

                        {/* Deploy Button */}
                        <button
                          type="button"
                          onClick={() => openDeployModal(product)}
                          className="w-full mt-2 py-1.5 px-2 rounded-lg bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 border border-neutral-700/60 dark:border-neutral-700 text-neutral-300 dark:text-neutral-200 text-[10px] sm:text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer min-w-0"
                        >
                          <Download className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate">{t('products.deployButton', currentLang === 'en' ? 'Deploy Turnkey Site (48h)' : 'Talep Halinde Canlıya Al & Bağla')}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* FRONTEND CONSTRAINT: "View All" Button trigger to display all portfolio items in modal */}
            {hasMoreThanMax && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => openViewAll('products')}
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 text-xs sm:text-sm font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md hover:shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  <Grid className="w-4 h-4" />
                  <span>{t('products.viewAllCatalog', currentLang === 'en' ? 'View All Showcase Sites' : 'Tüm Hazır Vitrin Sitelerini Gör')} ({filteredProducts.length})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

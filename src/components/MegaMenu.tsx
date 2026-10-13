import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Briefcase,
  HelpCircle,
  ShieldCheck,
  Compass,
  FileText,
  CreditCard,
  BookOpen,
  Award,
  Clock,
  Layers,
  Send,
  Lock,
  Grid,
} from 'lucide-react';
import { TurnkeyProduct, ServiceItem, ReferenceItem } from '../types/index.ts';
import { VANGUARD_LOGO_PATH, VANGUARD_LOGO_DATA_URI } from '../data/logoData.ts';

interface MegaMenuProps {
  type: 'products' | 'corporate' | 'support' | 'services' | 'references';
  isOpen: boolean;
  onClose: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  type,
  isOpen,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const {
    products,
    services,
    references,
    formatPrice,
    openDemo,
    openDetail,
    openViewAll,
    openPageModal,
    openPaymentModal,
    getLocalizedProduct,
    getLocalizedService,
    getLocalizedReference,
    t,
    currentLang,
  } = useApp();

  if (!isOpen) return null;

  // Max 4 items rule strictly followed with active language localization
  const featuredProducts = products.filter(p => p.active).slice(0, 4).map(p => getLocalizedProduct(p));
  const featuredServices = services.slice(0, 4).map(s => getLocalizedService(s));
  const featuredReferences = references.slice(0, 4).map(r => getLocalizedReference(r));

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave || onClose}
      className="absolute top-full left-0 right-0 w-full z-[90] bg-white dark:bg-[#0c0e14] border-b border-neutral-200 dark:border-neutral-800 shadow-2xl transition-all duration-200 animate-fadeIn text-neutral-900 dark:text-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* 1. Products Mega Menu (Hazır Siteler - 5-Col Grid with Left Showcase Hero + 4 Products) */}
        {type === 'products' && (
          <div>
            <div className="flex flex-wrap items-center justify-between pb-5 border-b border-neutral-200 dark:border-neutral-800/80 mb-6 gap-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Grid className="w-4 h-4 text-amber-500" />
                  <span>{t('products.sectionTitle', 'Satışa Hazır Sektörel Siteler')}</span>
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  {t('megaMenu.productsSub', 'Maksimum 10 hazır site portföyümüzden öne çıkan 4 anahtar teslim vitrin')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openViewAll('products');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700/80 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer hover:border-amber-500/40"
              >
                <span>{t('nav.viewAllSites', 'Tüm Hazır Siteleri İncele')} ({products.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
              {/* Left Showcase Hero Card for Products (Visible on lg+) */}
              <div
                onClick={() => {
                  onClose();
                  openViewAll('products');
                }}
                className="hidden lg:flex lg:col-span-1 relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800/90 bg-neutral-950 p-5 flex-col justify-between group cursor-pointer shadow-xl hover:border-amber-500/50 transition-all min-h-[290px]"
              >
                {/* Background Showcase Image */}
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80&fm=webp"
                  alt="Vanguard Studio Ready Showcase Sites"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/85 to-transparent z-0 group-hover:opacity-90 transition-opacity" />

                {/* Top Content */}
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>48 Saatte Canlıda</span>
                  </div>

                  <div className="mt-3 text-xs font-extrabold text-white leading-snug">
                    %100 Satışa Hazır Sektörel Vitrinler
                  </div>

                  <p className="text-[11px] text-neutral-300 mt-2 text-justify leading-relaxed">
                    {currentLang === 'en'
                      ? 'Production-ready turnkey site showcases delivered in 48 hours.'
                      : 'Bütçenizi zorlamayan, 48 saatte teslime hazır sektörel web siteleri.'}
                  </p>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 pt-4 border-t border-white/10 mt-4">
                  <div className="text-[11px] font-semibold text-amber-400 flex items-center justify-between group-hover:text-amber-300 transition-colors">
                    <span>Tüm Kataloğu İncele</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Right Grid (4 Product Cards) */}
              <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {featuredProducts.map((product: TurnkeyProduct) => {
                  const imageUrl = product.coverImage?.startsWith('http')
                    ? `${product.coverImage.split('?')[0]}?auto=format&fit=crop&w=360&q=70&fm=webp`
                    : (product.coverImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=360&q=70&fm=webp');

                  return (
                    <div
                      key={product.id}
                      className="group relative flex flex-col bg-neutral-50 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-neutral-200 dark:bg-neutral-950">
                        <img
                          src={imageUrl}
                          alt={product.title}
                          loading="lazy"
                          decoding="async"
                          width="360"
                          height="200"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=360&q=70&fm=webp';
                          }}
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5 text-[10px] font-bold text-neutral-900 dark:text-white bg-white/90 dark:bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-neutral-200 dark:border-white/10">
                          <span>{product.sector}</span>
                        </div>
                        {product.badge && (
                          <div className="absolute top-2 right-2 text-[10px] font-bold tracking-wide px-2 py-0.5 rounded-md bg-emerald-500/90 text-white shadow-xs">
                            {product.badge}
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-1">
                            {product.title}
                          </h4>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2 text-justify leading-relaxed">
                            {product.tagline}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-neutral-500 font-medium tracking-wider uppercase">
                              {t('megaMenu.startingPrice', 'Başlangıç Fiyatı')}
                            </div>
                            <div className="text-xs font-bold font-mono-numbers text-amber-600 dark:text-amber-400">
                              {formatPrice(product.priceEconomicTRY)}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                openDemo(product);
                              }}
                              className="px-2.5 py-1 text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white bg-neutral-200/80 dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                            >
                              Demo
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                openDetail(product);
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                            >
                              {t('megaMenu.examine', 'İncele')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. Corporate Mega Menu (Kurumsal - Hero Showcase Card + 4 SaaS Cards) */}
        {type === 'corporate' && (
          <div>
            <div className="flex flex-wrap items-center justify-between pb-5 border-b border-neutral-200 dark:border-neutral-800/80 mb-6 gap-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span>{t('megaMenu.corporateTitle', 'Kurumsal Ekosistem & Vizyon')}</span>
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  {t('megaMenu.corporateSub', 'Vanguard Studio hikayesi, üretim felsefemiz ve açık pozisyonlarımız')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openPageModal('hakkimizda');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700/80 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer hover:border-blue-500/40"
              >
                <span>{t('nav.about', 'Hakkımızda')} & {t('corporate.vision', 'Vizyonumuz')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
              {/* Left Showcase Hero Card (Visible on lg+) */}
              <div
                onClick={() => {
                  onClose();
                  openPageModal('hakkimizda');
                }}
                className="hidden lg:flex lg:col-span-1 relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800/90 bg-neutral-950 p-5 flex-col justify-between group cursor-pointer shadow-xl hover:border-amber-500/50 transition-all min-h-[290px] text-white"
              >
                {/* Background Cyber Architecture Image */}
                <img
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80&fm=webp"
                  alt="Vanguard Studio Headquarters & Tech Architecture"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/85 to-transparent z-0 group-hover:opacity-90 transition-opacity" />

                {/* Top Content */}
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <img
                      src={VANGUARD_LOGO_PATH}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = VANGUARD_LOGO_DATA_URI;
                      }}
                      alt="Vanguard Studio"
                      className="h-8 w-auto object-contain drop-shadow-md"
                    />
                  </div>
                  <div className="text-[11px] font-extrabold text-amber-400 tracking-wider uppercase font-mono">
                    Vanguard Studio
                  </div>
                  <div className="text-xs font-bold text-white mt-0.5">
                    Global Digital Craft
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-2 text-justify leading-relaxed">
                    {currentLang === 'en'
                      ? 'Official web development studio & digital software agency.'
                      : 'Resmi web yazılım ve dijital mimari ajansı.'}
                  </p>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 pt-4 border-t border-white/10 mt-4">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>48-Hour Turnaround</span>
                  </div>
                  <div className="text-[11px] font-semibold text-neutral-300 mt-1 flex items-center justify-between group-hover:text-white transition-colors">
                    <span>{t('nav.about', 'Hakkımızda')}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Right Grid (4 SaaS Cards) */}
              <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Hakkımızda */}
                <div
                  onClick={() => {
                    onClose();
                    openPageModal('hakkimizda');
                  }}
                  className="group relative bg-neutral-50 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-800/90 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t('megaMenu.aboutTitle', 'Hakkımızda')}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 text-justify leading-relaxed">
                      {t('megaMenu.aboutDesc', "Vanguard Studio'nun kuruluş hikayesi, dijital üretim felsefesi ve tutkulu ekip kültürü.")}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                    <span>Detayları Oku</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Card 2: Vizyonumuz */}
                <div
                  onClick={() => {
                    onClose();
                    openPageModal('vizyon');
                  }}
                  className="group relative bg-neutral-50 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-800/90 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <Compass className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {t('megaMenu.visionTitle', 'Vizyonumuz')}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 text-justify leading-relaxed">
                      {t('megaMenu.visionDesc', 'Bürokrasisiz 48 saatlik hızlı teslimat ve kusursuz React & Tailwind yazılım altyapısı.')}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>Vizyon Belgesi</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Card 3: Misyonumuz */}
                <div
                  onClick={() => {
                    onClose();
                    openPageModal('misyon');
                  }}
                  className="group relative bg-neutral-50 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-800/90 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {t('megaMenu.missionTitle', 'Misyonumuz')}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 text-justify leading-relaxed">
                      {t('megaMenu.missionDesc', 'KOBİ ve iştiraklerin fahiş ajans bütçelerinden ve kronik gecikmelerden kurtarılması.')}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                    <span>Misyonumuz</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Card 4: Kariyer & Uzaktan Başvuru */}
                <div
                  onClick={() => {
                    onClose();
                    openPageModal('kariyer');
                  }}
                  className="group relative bg-amber-500/10 hover:bg-amber-500/15 rounded-2xl p-5 border border-amber-500/30 hover:border-amber-400/60 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md bg-amber-400 text-black shadow-xs">
                        İlan
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                      {t('megaMenu.careerTitle', 'Kariyer & Uzaktan Başvuru')}
                    </h4>
                    <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-2 text-justify leading-relaxed">
                      {t('megaMenu.careerDesc', 'Açık Performans Pazarlama & Media Buyer pozisyonları ve uzaktan çalışma olanakları.')}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <span>Hemen Başvur</span>
                    <Send className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Support Mega Menu (Destek & Bilgi - Hero Matrix Card + 4 SaaS Cards) */}
        {type === 'support' && (
          <div>
            <div className="flex flex-wrap items-center justify-between pb-5 border-b border-neutral-200 dark:border-neutral-800/80 mb-6 gap-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
                  <span>{t('megaMenu.supportTitle', 'Destek, Müşteri Rehberi & Ödeme')}</span>
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                  {t('megaMenu.supportSub', 'Sıkça sorulan sorular, yardım rehberleri, IBAN hesapları ve hizmet garantisi')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openPageModal('sss');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700/80 px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer hover:border-cyan-500/40"
              >
                <span>SSS & Sıkça Sorulan Sorular</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
              {/* Left Cyber Tech / Matrix Showcase Hero Card (Visible on lg+) */}
              <div
                onClick={() => {
                  onClose();
                  openPageModal('sss');
                }}
                className="hidden lg:flex lg:col-span-1 relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800/90 bg-neutral-950 p-5 flex-col justify-between group cursor-pointer shadow-xl hover:border-cyan-500/50 transition-all min-h-[290px] text-white"
              >
                {/* Background Tech / Coding Matrix Security Image */}
                <img
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80&fm=webp"
                  alt="Cyber Security & 256-Bit SSL Tech Infrastructure"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-45"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090b10] via-[#090b10]/85 to-transparent z-0 group-hover:opacity-90 transition-opacity" />

                {/* Top Content */}
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md">
                    <Lock className="w-3 h-3 text-cyan-400" />
                    <span>256-Bit SSL Protective</span>
                  </div>

                  <div className="mt-3 text-xs font-extrabold text-white leading-snug">
                    7/24 Proje Destek Masası Aktif
                  </div>

                  <div className="mt-1 text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>SLA Response &lt; 15 Min</span>
                  </div>

                  <p className="text-[11px] text-neutral-300 mt-2 text-justify leading-relaxed">
                    {currentLang === 'en'
                      ? '24/7 active infrastructure desk, SSL encryption and priority response.'
                      : 'Kesintisiz canlı sunucu altyapısı, SSL güvenliği ve öncelikli destek masası.'}
                  </p>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 pt-4 border-t border-white/10 mt-4">
                  <div className="text-[11px] font-semibold text-cyan-400 flex items-center justify-between group-hover:text-cyan-300 transition-colors">
                    <span>Müşteri Dökümantasyonu</span>
                    <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              {/* Right Grid (4 SaaS Cards) */}
              <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: FAQ / SSS */}
                <div
                  onClick={() => {
                    onClose();
                    openPageModal('sss');
                  }}
                  className="group relative bg-neutral-50 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-800/90 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {t('megaMenu.faqTitle', 'Sıkça Sorulan Sorular (FAQ)')}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 text-justify leading-relaxed">
                      {t('megaMenu.faqDesc', 'Müşterilerimizin en çok merak ettiği sorular ve akordeon yapıda şeffaf yanıt havuzu.')}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                    <span>Soruları İncele</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Card 2: Help Desk */}
                <div
                  onClick={() => {
                    onClose();
                    openPageModal('yardim-merkezi');
                  }}
                  className="group relative bg-neutral-50 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-800/90 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-teal-500/10 text-teal-500 dark:text-teal-400 border border-teal-500/20 group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-teal-500 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {t('megaMenu.helpTitle', 'Yardım Merkezi (Help Desk)')}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 text-justify leading-relaxed">
                      {t('megaMenu.helpDesc', 'Teknik dokümantasyon, kurumsal e-posta kurulum kılavuzları ve canlı destek hattı.')}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-semibold text-teal-600 dark:text-teal-400">
                    <span>Kılavuzları Gör</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Card 3: Payment & IBAN */}
                <div
                  onClick={() => {
                    onClose();
                    openPaymentModal(null, 'economic');
                  }}
                  className="group relative bg-neutral-50 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-800/90 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-500 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {t('megaMenu.paymentTitle', 'Güvenli Ödeme & IBAN')}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 text-justify leading-relaxed">
                      {t('megaMenu.paymentDesc', 'Stripe altyapısı, Garanti BBVA / İş Bankası ve SBP resmi transfer kanalları.')}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span>Banka Hesapları & Stripe</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Card 4: Service Guarantee */}
                <div
                  onClick={() => {
                    onClose();
                    openPaymentModal(null, 'economic');
                  }}
                  className="group relative bg-neutral-50 dark:bg-neutral-900/70 hover:bg-neutral-100 dark:hover:bg-neutral-800/90 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 transition-all cursor-pointer flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        48 Saat
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {t('megaMenu.guaranteeTitle', 'Hizmet Garantisi')}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2 text-justify leading-relaxed">
                      {t('megaMenu.guaranteeDesc', '48 saatlik sayaç kuralları, %100 canlıya alma taahhüdü ve 7 günlük ücretsiz revizyon.')}
                    </p>
                  </div>
                  <div className="mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800/80 flex items-center justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    <span>Taahhütname & Şartlar</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legacy fallback support for Services */}
        {type === 'services' && (
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {t('services.sectionTitle', 'Ajans Hizmetleri')}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                  {t('megaMenu.servicesSub', 'Özel yazılım, tasarım ve büyüme odaklı ajans servislerimiz')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openViewAll('services');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>{t('nav.viewAllServices', 'Tüm Hizmetleri Gör')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredServices.map((service: ServiceItem) => (
                <div
                  key={service.id}
                  className="p-5 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                        {service.number}
                      </span>
                      <Sparkles className="w-4 h-4 text-neutral-400 dark:text-neutral-500" />
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
                      {service.title}
                    </h4>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                      {service.subtitle}
                    </p>
                    <ul className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300">
                      {service.deliverables.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      openViewAll('services');
                    }}
                    className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-900 dark:text-white flex items-center gap-1 hover:gap-1.5 transition-all cursor-pointer"
                  >
                    <span>{t('megaMenu.viewDetails', 'Detayları İncele')}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legacy fallback support for References */}
        {type === 'references' && (
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 mb-6">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  {t('references.sectionTitle', 'Referanslar & Sonuçlar')}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                  {t('megaMenu.referencesSub', 'KOBİ’ler ve kurumsal müşterilerimizle ulaştığımız somut sonuçlar')}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openViewAll('references');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-3.5 py-2 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
              >
                <span>{t('nav.viewAllReferences', 'Tüm Referansları Gör')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredReferences.map((ref: ReferenceItem) => (
                <div
                  key={ref.id}
                  className="p-5 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                      {ref.sector}
                    </div>
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">
                      {ref.clientName}
                    </h4>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-3 font-mono-numbers">
                      {ref.metric}
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 italic line-clamp-3">
                      "{ref.quote}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <span className="font-medium text-neutral-700 dark:text-neutral-200">{ref.author}</span>
                    <span>{ref.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

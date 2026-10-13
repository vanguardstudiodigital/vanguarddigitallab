import React, { useEffect } from 'react';
import {
  X,
  FileText,
  Shield,
  Info,
  Printer,
  ChevronRight,
  MessageCircle,
  Building2,
  Eye,
  Target,
  Briefcase,
  HelpCircle,
  LifeBuoy,
  CreditCard,
} from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { ContactPageView } from './ContactPageView.tsx';
import { CareerApplicationForm } from './CareerApplicationForm.tsx';
import { RichContentRenderer } from './common/RichContentRenderer.tsx';
import { FaqSection } from './FaqSection.tsx';
import { CustomPage } from '../types/index.ts';

export const PageViewModal: React.FC = () => {
  const {
    activePageSlug,
    closePageModal,
    customPages,
    openPageModal,
    openPaymentModal,
    currentLang,
    formatPrice,
    t,
  } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePageModal();
    };
    if (activePageSlug) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePageSlug, closePageModal]);

  if (!activePageSlug) return null;

  const page = customPages.find(p => p.slug === activePageSlug) || customPages[0];

  // Grouping pages for vertical sidebar
  const corporatePages = customPages.filter(p =>
    ['hakkimizda', 'vizyonumuz', 'misyonumuz', 'kariyer'].includes(p.slug) ||
    p.category === 'corporate' ||
    p.locations?.includes('corporate') ||
    p.locations?.includes('mega_corporate') ||
    p.locations?.includes('footer_corporate')
  );

  const supportPages = customPages.filter(p =>
    ['sss', 'faq', 'yardim-merkezi', 'iletisim'].includes(p.slug) ||
    p.category === 'support' ||
    p.category === 'info' ||
    p.locations?.includes('support') ||
    p.locations?.includes('info') ||
    p.locations?.includes('mega_support')
  );

  const legalPages = customPages.filter(p =>
    p.category === 'legal' ||
    p.locations?.includes('legal') ||
    p.locations?.includes('footer_legal') ||
    ['gizlilik-sozlesmesi', 'kullanim-kosullari', 'cerez-politikasi', 'kvkk'].includes(p.slug)
  );

  // Other pages not captured in main categories
  const mappedSlugs = new Set([
    ...corporatePages.map(p => p.slug),
    ...supportPages.map(p => p.slug),
    ...legalPages.map(p => p.slug),
  ]);
  const otherPages = customPages.filter(p => !mappedSlugs.has(p.slug));

  // Helper for icons
  const getPageIcon = (slug: string, category?: string) => {
    switch (slug) {
      case 'hakkimizda':
        return <Building2 className="w-4 h-4 shrink-0" />;
      case 'vizyonumuz':
        return <Eye className="w-4 h-4 shrink-0" />;
      case 'misyonumuz':
        return <Target className="w-4 h-4 shrink-0" />;
      case 'kariyer':
        return <Briefcase className="w-4 h-4 shrink-0" />;
      case 'sss':
      case 'faq':
        return <HelpCircle className="w-4 h-4 shrink-0" />;
      case 'yardim-merkezi':
        return <LifeBuoy className="w-4 h-4 shrink-0" />;
      case 'iletisim':
        return <MessageCircle className="w-4 h-4 shrink-0" />;
      default:
        if (category === 'legal') return <Shield className="w-4 h-4 shrink-0" />;
        return <FileText className="w-4 h-4 shrink-0" />;
    }
  };

  // Localized texts
  const trans = page?.translations?.[currentLang];
  const rawPageTitle = trans?.title || page?.title || 'Bilgi Sayfası';
  const rawPageSummary = trans?.summary || page?.summary || '';
  const rawPageContent = trans?.content || page?.content || '';

  const interpolatePrice = (text: string) => {
    if (!text) return '';
    return text.replace(/\{\{PRICE_([0-9]+)\}\}/g, (_, num) => {
      const n = Number(num);
      return !isNaN(n) ? formatPrice(n) : _;
    });
  };

  const pageTitle = interpolatePrice(rawPageTitle);
  const pageSummary = interpolatePrice(rawPageSummary);
  const pageContent = interpolatePrice(rawPageContent);

  const renderSidebarItem = (p: CustomPage, idx: number) => {
    const locTitle = p.translations?.[currentLang]?.title || p.title;
    const isActive = p.slug === activePageSlug;
    const isCareer = p.slug === 'kariyer';

    return (
      <button
        key={`${p.id || p.slug}-${idx}`}
        onClick={() => openPageModal(p.slug)}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
          isActive
            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border-l-2 border-amber-500 shadow-xs'
            : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className={isActive ? 'text-amber-500' : 'text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'}>
            {getPageIcon(p.slug, p.category)}
          </span>
          <span className="truncate">{locTitle}</span>
        </div>
        {isCareer && (
          <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/15 rounded-md border border-amber-500/20 shrink-0 ml-1">
            {currentLang === 'en' ? 'Hiring'  : 'İlan'}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) closePageModal();
      }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-7xl max-h-[92vh] flex flex-col bg-white dark:bg-[#0e111a] text-neutral-900 dark:text-neutral-100 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden my-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 shrink-0 flex items-center justify-between px-5 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#0e111a]/95 backdrop-blur-md">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`p-2.5 rounded-xl shrink-0 ${page.slug === 'iletisim' ? 'bg-emerald-500/10 text-emerald-500' : page.category === 'legal' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-blue-500/10 text-blue-500'}`}>
              {getPageIcon(page.slug, page.category)}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-bold font-display leading-tight truncate">
                {pageTitle}
              </h2>
              <span className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 block truncate">
                {page.slug === 'iletisim'
                  ? (currentLang === 'en' ? 'Official Inquiries Desk · 2-Hour Response SLA' : 'Resmi Proje & Başvuru Masası · 2 Saatte Yanıt Garantisi')
                  : page.category === 'legal'
                  ? (currentLang === 'en' ? 'Legal Notice & Compliance' : 'Yasal Bildirim & Uyumluluk')
                  : (currentLang === 'en' ? 'Corporate Information' : 'Kurumsal Bilgilendirme')} · {currentLang === 'en' ? 'Last Updated: October 2026' : 'Son Güncelleme: Ekim 2026'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 rounded-xl transition-colors cursor-pointer"
              title={currentLang === 'en' ? 'Print'  : 'Yazdır'}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'Print'  : 'Yazdır'}</span>
            </button>

            <button
              type="button"
              onClick={closePageModal}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-950 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-all cursor-pointer border border-neutral-200/80 dark:border-neutral-700/80"
              title={t('common.close', 'Kapat')}
            >
              <X className="w-4 h-4" />
              <span>{t('common.close', 'Kapat')}</span>
            </button>
          </div>
        </div>

        {/* Modal Main Body: Flex Sidebar + Content Area */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Vertical Sidebar Navigation */}
          <aside className="w-full md:w-64 lg:w-72 shrink-0 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 p-4 overflow-y-auto space-y-5 max-h-[35vh] md:max-h-none">
            {/* Corporate Section */}
            {corporatePages.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3">
                  {currentLang === 'en' ? 'Corporate'  : 'Kurumsal'}
                </span>
                <div className="space-y-0.5">
                  {corporatePages.map(renderSidebarItem)}
                </div>
              </div>
            )}

            {/* Support Section */}
            {supportPages.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3">
                  {currentLang === 'en' ? 'Support & Help'  : 'Destek & Bilgi'}
                </span>
                <div className="space-y-0.5">
                  {supportPages.map(renderSidebarItem)}
                </div>
              </div>
            )}

            {/* Legal Section */}
            {legalPages.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3">
                  {currentLang === 'en' ? 'Legal & Policy'  : 'Yasal Bildirimler'}
                </span>
                <div className="space-y-0.5">
                  {legalPages.map(renderSidebarItem)}
                </div>
              </div>
            )}

            {/* Other Pages Section */}
            {otherPages.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 px-3">
                  {currentLang === 'en' ? 'Other Pages'  : 'Diğer Sayfalar'}
                </span>
                <div className="space-y-0.5">
                  {otherPages.map(renderSidebarItem)}
                </div>
              </div>
            )}

            {/* Quick Action Card: Payment & IBAN */}
            <div className="pt-2">
              <button
                onClick={() => {
                  closePageModal();
                  openPaymentModal();
                }}
                className="w-full flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all cursor-pointer group"
              >
                <CreditCard className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                <div className="text-left min-w-0 flex-1">
                  <div className="font-bold truncate">{t('nav.payment', 'Ödeme & IBAN Bilgileri')}</div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-normal truncate">
                    {currentLang === 'en' ? 'Wire & Payment Details'  : 'Banka Hesapları & FAST'}
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </aside>

          {/* Right Main Content Panel */}
          <main className="flex-1 min-w-0 overflow-y-auto p-6 sm:p-8 lg:p-10 space-y-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 page-content">
            {page.slug === 'iletisim' ? (
              <ContactPageView />
            ) : page.slug === 'sss' || page.slug === 'faq' ? (
              <div className="space-y-6">
                {pageSummary && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-neutral-800 dark:text-amber-200/90 text-xs sm:text-sm font-medium text-justify">
                    {pageSummary}
                  </div>
                )}
                <FaqSection />
              </div>
            ) : (
              <>
                {pageSummary && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-neutral-800 dark:text-amber-200/90 text-xs sm:text-sm font-medium text-justify">
                    {pageSummary}
                  </div>
                )}

                <RichContentRenderer content={pageContent} className="text-justify space-y-4" />

                {page.slug === 'kariyer' && (
                  <CareerApplicationForm />
                )}
              </>
            )}
          </main>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <FileText className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="truncate">
              {currentLang === 'en' ? 'Official Legal & Corporate Documentation of Vanguard Studio'  : 'Vanguard Studio Resmi Hukuk & Kurumsal Belgesi'}
            </span>
          </div>

          <button
            type="button"
            onClick={closePageModal}
            className="w-full sm:w-auto px-5 py-2 text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors cursor-pointer shadow-sm"
          >
            {t('common.close', 'Pencereyi Kapat')}
          </button>
        </div>
      </div>
    </div>
  );
};


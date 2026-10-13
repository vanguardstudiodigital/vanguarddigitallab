import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Sun,
  Moon,
  ChevronDown,
  ChevronRight,
  Lock,
  ArrowRight,
  Menu,
  X,
  Briefcase,
  Building2,
  HelpCircle,
  ShieldCheck,
  FileText,
  CreditCard,
  Grid,
  Send,
  Compass,
  Award,
  BookOpen,
  Cpu,
} from 'lucide-react';
import { MegaMenu } from './MegaMenu.tsx';
import { CurrencyCode } from '../types/index.ts';
import { VANGUARD_LOGO_PATH, VANGUARD_LOGO_DATA_URI } from '../data/logoData.ts';

export const Header: React.FC = () => {
  const {
    theme,
    toggleTheme,
    currentLang,
    setLanguage,
    languages,
    currentCurrency,
    setCurrency,
    currencies,
    openPaymentModal,
    openPageModal,
    navigationItems,
    setIsAdminOpen,
    openCustomerPanel,
    t,
  } = useApp();

  const [activeMegaMenu, setActiveMegaMenu] = useState<'products' | 'corporate' | 'support' | null>(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const megaMenuTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnterMenu = (menu: 'products' | 'corporate' | 'support') => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
    setActiveMegaMenu(menu);
  };

  const handleMouseLeaveMenu = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    megaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 180);
  };

  const clearMegaMenuTimeout = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
      megaMenuTimeoutRef.current = null;
    }
  };

  const [mobileAcc, setMobileAcc] = useState<{
    readySites: boolean;
    corporate: boolean;
    support: boolean;
  }>({
    readySites: false,
    corporate: false,
    support: false,
  });
  const toggleMobileAcc = (key: 'readySites' | 'corporate' | 'support') => {
    setMobileAcc(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getLocalizedNavTitle = (targetUrl: string, targetId?: string, fallbackKey?: string, defaultFallback?: string) => {
    const found = navigationItems.find(n => (targetId && n.id === targetId) || (targetUrl && n.url === targetUrl));
    if (found) {
      if (found.translations?.[currentLang]?.title) {
        return found.translations[currentLang].title;
      }
      if (currentLang === 'tr') {
        return found.title;
      }
    }
    if (fallbackKey) {
      return t(fallbackKey, defaultFallback);
    }
    return defaultFallback || '';
  };

  const handleNavClick = (url: string, pageSlug?: string) => {
    setMobileMenuOpen(false);
    clearMegaMenuTimeout();
    setActiveMegaMenu(null);

    if (pageSlug) {
      openPageModal(pageSlug);
      return;
    }
    if (url === '#contact' || url === '#iletisim' || url === '#page-iletisim') {
      openPageModal('iletisim');
      return;
    }
    if (url === '#payment') {
      openPaymentModal(null, 'economic');
      return;
    }
    if (url === '#hero' || url === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (url.startsWith('#')) {
      const el = document.querySelector(url);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.location.href = url;
  };

  const currentLangObj = languages.find(l => l.code === currentLang) || languages[0];
  return (
    <header
      onMouseLeave={handleMouseLeaveMenu}
      className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0a0c10]/95 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors shadow-xs dark:shadow-none"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 sm:h-18 flex justify-between items-center gap-3 sm:gap-4 relative z-50">
        
        {/* LOGO */}
        <div className="flex items-center shrink-0">
          <a
            href="#"
            onMouseEnter={() => {
              clearMegaMenuTimeout();
              setActiveMegaMenu(null);
            }}
            onClick={(e) => {
              e.preventDefault();
              clearMegaMenuTimeout();
              setActiveMegaMenu(null);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center hover:opacity-90 transition-opacity"
          >
            <img
              src={VANGUARD_LOGO_PATH}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = VANGUARD_LOGO_DATA_URI;
              }}
              alt="Vanguard Studio"
              className="h-8 sm:h-10 w-auto object-contain transition-all"
            />
          </a>
        </div>

        {/* DESKTOP NAVİGASYON BARI */}
                {/* DESKTOP NAVİGASYON BARI (Paneldeki 1-2-3-4 Sıralamasına %100 Uyumlu Dinamik Alan) */}
                <nav className="hidden xl:flex items-center justify-start flex-1 min-w-0 px-4 gap-1 xl:gap-2 text-[11px] 2xl:text-xs font-bold text-neutral-600 dark:text-neutral-300 overflow-hidden">
          
          {/* 1. Ana Sayfa (Her Zaman Sabit Kök) */}
          <button
            type="button"
            onClick={() => handleNavClick('#hero')}
            onMouseEnter={() => {
              clearMegaMenuTimeout();
              setActiveMegaMenu(null);
            }}
            className="hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 font-black shrink-0"
          >
            {getLocalizedNavTitle('#hero', 'nav-h-home', 'nav.home', currentLang === 'en' ? 'Home' : 'Ana Sayfa')}
          </button>

          {/* 2. Panelden Gelen Diğer Başlıkları Sıralı Çeken Dinamik Döngü */}
          {[...navigationItems]
            .filter(item => !(item as any).parentId && (item as any).location === 'header' && item.url !== '#hero')
            .sort((a, b) => (a.order || 0) - (b.order || 0))
            .map((item) => {
              const localizedTitle = item.translations?.[currentLang]?.title || item.title;
              
              const isProducts = item.url.includes('portfolio') || item.id === 'nav-h-turnkey';
              const isCorporate = item.url.includes('corporate') || item.id === 'nav-h-about';
              const isSupport = item.url.includes('support') || item.id === 'nav-h-services';
              const isAdvisory = item.url.includes('advisory') || item.id === 'nav-h-advisory';

              // Sıkışmayı ve üst üste binmeyi imkansız kılan premium koruyucu zırh sınıfları
              const baseBtnClass = "flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap px-2.5 py-1.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 font-black shrink-0 text-ellipsis overflow-hidden";

              if (isProducts) {
                return (
                  <div key={item.id} className="relative shrink-0" onMouseEnter={() => handleMouseEnterMenu('products')} onMouseLeave={handleMouseLeaveMenu}>
                    <button
                      type="button"
                      onClick={() => {
                        clearMegaMenuTimeout();
                        setActiveMegaMenu(prev => (prev === 'products' ? null : 'products'));
                      }}
                      className={`${baseBtnClass} ${activeMegaMenu === 'products' ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20' : ''}`}
                    >
                      <Grid className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span className="truncate">{localizedTitle}</span>
                      <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                    </button>
                  </div>
                );
              }

              if (isAdvisory) {
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      clearMegaMenuTimeout();
                      setActiveMegaMenu(null);
                      handleNavClick(item.url, item.pageSlug);
                    }}
                    onMouseEnter={() => {
                      clearMegaMenuTimeout();
                      setActiveMegaMenu(null);
                    }}
                    className={`${baseBtnClass} text-neutral-700 dark:text-neutral-200 hover:text-amber-600 dark:hover:text-amber-400 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10`}
                  >
                    <Cpu className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{localizedTitle}</span>
                  </button>
                );
              }

              if (isCorporate) {
                return (
                  <div key={item.id} className="relative shrink-0" onMouseEnter={() => handleMouseEnterMenu('corporate')} onMouseLeave={handleMouseLeaveMenu}>
                    <button
                      type="button"
                      onClick={() => {
                        clearMegaMenuTimeout();
                        setActiveMegaMenu(prev => (prev === 'corporate' ? null : 'corporate'));
                      }}
                      className={`${baseBtnClass} ${activeMegaMenu === 'corporate' ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border border-blue-500/20' : ''}`}
                    >
                      <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="truncate">{localizedTitle}</span>
                      <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                    </button>
                  </div>
                );
              }

              if (isSupport) {
                return (
                  <div key={item.id} className="relative shrink-0" onMouseEnter={() => handleMouseEnterMenu('support')} onMouseLeave={handleMouseLeaveMenu}>
                    <button
                      type="button"
                      onClick={() => {
                        clearMegaMenuTimeout();
                        setActiveMegaMenu(prev => (prev === 'support' ? null : 'support'));
                      }}
                      className={`${baseBtnClass} ${activeMegaMenu === 'support' ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' : ''}`}
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span className="truncate">{localizedTitle}</span>
                      <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
                    </button>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.url, item.pageSlug)}
                  onMouseEnter={() => {
                    clearMegaMenuTimeout();
                    setActiveMegaMenu(null);
                  }}
                  className={baseBtnClass}
                >
                  <span className="truncate">{localizedTitle}</span>
                </button>
              );
            })}
        </nav>

      


        {/* SAĞ AKSİYON PANELİ */}
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 shrink-0 relative z-50">
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                setIsLangDropdownOpen(false);
              }}
              className="flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors shrink-0 cursor-pointer"
            >
              <span className="font-mono-numbers font-bold">{currentCurrency}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isCurrencyDropdownOpen && (
              <div onMouseLeave={() => setIsCurrencyDropdownOpen(false)} className="absolute right-0 mt-1.5 w-36 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-50">
                {currencies.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setCurrency(c.code as CurrencyCode);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left cursor-pointer ${
                      currentCurrency === c.code ? 'bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <span>{c.code} ({c.symbol})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsLangDropdownOpen(!isLangDropdownOpen);
                setIsCurrencyDropdownOpen(false);
              }}
              className="hidden xl:flex items-center gap-1 px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors shrink-0 cursor-pointer"
            >
              <span>{currentLangObj.flag}</span>
              <span className="uppercase font-bold tracking-wider text-[11px] sm:text-xs">{currentLangObj.code}</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isLangDropdownOpen && (
              <div onMouseLeave={() => setIsLangDropdownOpen(false)} className="absolute right-0 mt-1.5 w-40 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-50">
                {languages.filter(l => l.active).map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left cursor-pointer ${
                      currentLang === lang.code ? 'bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="button" onClick={toggleTheme} className="p-1.5 sm:p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors shrink-0 cursor-pointer">
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          <button type="button" onClick={() => openCustomerPanel()} className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/30 transition-colors shrink-0 cursor-pointer">
            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-[11px]">{t('header.customerPanel', 'Müşteri Paneli')}</span>
          </button>

          <button type="button" onClick={() => setIsAdminOpen(true)} className="hidden xl:flex p-2 text-neutral-500 hover:text-neutral-950 dark:hover:text-white rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors shrink-0 cursor-pointer">
            <Lock className="w-4 h-4" />
          </button>

          <button type="button" onClick={() => openPageModal('iletisim')} className="hidden xl:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 active:scale-95 cursor-pointer shrink-0 ml-1">
            <span>{t('nav.contact', 'Hemen Başla')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="xl:hidden flex items-center justify-center p-2 text-neutral-800 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800/90 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl border border-neutral-300 dark:border-neutral-700 transition-all shrink-0 cursor-pointer shadow-xs">
            {mobileMenuOpen ? <X className="w-5 h-5 text-amber-500" /> : <Menu className="w-5 h-5 text-neutral-900 dark:text-white" />}
          </button>
        </div>
      </div>

      {activeMegaMenu && (
        <div className="fixed inset-0 top-16 sm:top-18 bg-black/10 dark:bg-black/25 z-30 cursor-pointer" onClick={() => { clearMegaMenuTimeout(); setActiveMegaMenu(null); }} />
      )}

      {activeMegaMenu && (
        <MegaMenu type={activeMegaMenu} isOpen={true} onClose={() => { clearMegaMenuTimeout(); setActiveMegaMenu(null); }} onMouseEnter={clearMegaMenuTimeout} onMouseLeave={handleMouseLeaveMenu} />
      )}

      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/98 dark:bg-[#0a0c10]/98 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-5 sm:px-8 py-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto z-30 relative">
          <div className="space-y-2 text-sm font-medium">
            <button type="button" onClick={() => handleNavClick('#hero')} className="block w-full text-left py-2.5 px-3.5 rounded-xl font-bold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800/60">
              {getLocalizedNavTitle('#hero', 'nav-h-home', 'nav.home', 'Ana Sayfa')}
            </button>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/40">
              <button type="button" onClick={() => toggleMobileAcc('readySites')} className="w-full flex items-center justify-between p-3.5 text-left font-bold text-neutral-900 dark:text-white">
                <div className="flex items-center gap-2"><Grid className="w-4 h-4 text-amber-500" /><span>Hazır Siteler</span></div>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAcc.readySites ? 'rotate-180' : ''}`} />
              </button>
              {mobileAcc.readySites && (
                <div className="p-3 pt-0 space-y-1.5 border-t border-neutral-200 dark:border-neutral-800/60 bg-white dark:bg-neutral-950">
                  <button type="button" onClick={() => handleNavClick('#portfolio-section')} className="w-full text-left p-2.5 rounded-lg text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center justify-between">
                    <span>Tüm Vitrin Demolarını Gör (10 Sektör)</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <button type="button" onClick={() => { setMobileMenuOpen(false); handleNavClick('#tech-advisory'); }} className="w-full flex items-center justify-between p-3.5 rounded-xl border border-amber-500/25 bg-amber-500/5 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-xs">
              <div className="flex items-center gap-2"><Cpu className="w-4 h-4 text-amber-500" /><span>Teknik Danışmanlık</span></div>
              <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 text-black font-extrabold rounded">VIP 50K+</span>
            </button>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/40">
              <button type="button" onClick={() => toggleMobileAcc('corporate')} className="w-full flex items-center justify-between p-3.5 text-left font-bold text-neutral-900 dark:text-white">
                <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-500" /><span>Kurumsal</span></div>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAcc.corporate ? 'rotate-180' : ''}`} />
              </button>
              {mobileAcc.corporate && (
                <div className="p-2 space-y-1 border-t border-neutral-200 dark:border-neutral-800/60 bg-white dark:bg-neutral-950 text-xs">
                  <button type="button" onClick={() => handleNavClick('#', 'hakkimizda')} className="w-full text-left p-2.5 rounded-lg text-neutral-700 flex items-center gap-2 font-semibold"><FileText className="w-3.5 h-3.5 text-blue-500" /><span>Hakkımızda</span></button>
                  <button type="button" onClick={() => handleNavClick('#', 'vizyon')} className="w-full text-left p-2.5 rounded-lg text-neutral-700 flex items-center gap-2 font-semibold"><Compass className="w-3.5 h-3.5 text-emerald-500" /><span>Vizyonumuz</span></button>
                  <button type="button" onClick={() => handleNavClick('#', 'misyon')} className="w-full text-left p-2.5 rounded-lg text-neutral-700 flex items-center gap-2 font-semibold"><ShieldCheck className="w-3.5 h-3.5 text-purple-500" /><span>Misyonumuz</span></button>
                  <button type="button" onClick={() => handleNavClick('#', 'kariyer')} className="w-full text-left p-2.5 rounded-lg text-amber-600 font-bold bg-amber-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-amber-500" /><span>Kariyer</span></div>
                    <span className="px-1.5 py-0.5 text-[9px] bg-amber-500 text-black font-extrabold rounded">İlan</span>
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/40">
              <button type="button" onClick={() => toggleMobileAcc('support')} className="w-full flex items-center justify-between p-3.5 text-left font-bold text-neutral-900 dark:text-white">
                <div className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-cyan-500" /><span>Destek & Bilgi</span></div>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAcc.support ? 'rotate-180' : ''}`} />
              </button>
              {mobileAcc.support && (
                <div className="p-2 space-y-1 border-t border-neutral-200 dark:border-neutral-800/60 bg-white dark:bg-neutral-950 text-xs">
                  <button type="button" onClick={() => handleNavClick('#', 'sss')} className="w-full text-left p-2.5 rounded-lg text-neutral-700 font-semibold flex items-center gap-2"><HelpCircle className="w-3.5 h-3.5 text-cyan-500" /><span>Sıkça Sorulan Sorular</span></button>
                  <button type="button" onClick={() => handleNavClick('#', 'yardim-merkezi')} className="w-full text-left p-2.5 rounded-lg text-neutral-700 font-semibold flex items-center gap-2"><BookOpen className="w-3.5 h-3.5 text-teal-500" /><span>Yardım Merkezi</span></button>
                  <button type="button" onClick={() => { setMobileMenuOpen(false); openPaymentModal(null, 'economic'); }} className="w-full text-left p-2.5 rounded-lg text-neutral-700 font-semibold flex items-center gap-2"><CreditCard className="w-3.5 h-3.5 text-emerald-500" /><span>Güvenli Ödeme & IBAN</span></button>
                  <button type="button" onClick={() => { setMobileMenuOpen(false); openPaymentModal(null, 'economic'); }} className="w-full text-left p-2.5 rounded-lg text-amber-600 font-bold bg-amber-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-2"><Award className="w-3.5 h-3.5 text-amber-500" /><span>Hizmet Garantisi</span></div>
                    <span className="px-1.5 py-0.5 text-[9px] bg-amber-500/20 text-amber-400 font-extrabold rounded">48h</span>
                  </button>
                </div>
              )}
            </div>
          </div>

                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500">{t('header.currency', 'Para Birimi')}:</span>
              <div className="flex gap-1">
                {currencies.map(c => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setCurrency(c.code as CurrencyCode)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      currentCurrency === c.code
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-500">{t('header.language', 'Dil')}:</span>
              <div className="flex gap-1">
                {languages.filter(l => l.active).map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2 py-1 text-xs rounded flex items-center gap-1 transition-colors ${
                      currentLang === lang.code
                        ? 'bg-neutral-900 text-white font-bold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span className="uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openCustomerPanel();
                }}
                className="py-2.5 px-3 text-center text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{t('header.customerPanel', 'Müşteri Paneli')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAdminOpen(true);
                }}
                className="py-2.5 px-3 text-center text-xs font-semibold text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>

                        <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                openPageModal('iletisim');
              }}
              className="w-full py-3 text-center text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('nav.contact', 'Hemen Başla')}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


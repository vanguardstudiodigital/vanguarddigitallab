import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { 
  Menu, X, ChevronDown, Lock, Sun, Moon, 
  Grid, Building2, HelpCircle, Cpu, Briefcase, ArrowRight,
  Layers, Award
} from 'lucide-react';
import { CurrencyCode } from '../types/index.ts';
import { MegaMenu } from './MegaMenu.tsx';
import { VANGUARD_LOGO_PATH, VANGUARD_LOGO_DATA_URI } from '../data/logoData.ts';

export const Header: React.FC = () => {
  const {
    navigationItems, currentLang, setLanguage, activeLanguages,
    currentCurrency, setCurrency, currencies, theme, toggleTheme,
    setIsAdminOpen, openCustomerPanel, openPageModal, t
  } = useApp();

  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [megaMenuTimeout, setMegaMenuTimeout] = useState<any>(null);

  const clearMegaMenuTimeout = () => {
    if (megaMenuTimeout) {
      clearTimeout(megaMenuTimeout);
      setMegaMenuTimeout(null);
    }
  };

  const handleMouseEnterMenu = (menuKey: string) => {
    clearMegaMenuTimeout();
    setActiveMegaMenu(menuKey);
  };

  const handleMouseLeaveMenu = () => {
    clearMegaMenuTimeout();
    const timeout = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 280);
    setMegaMenuTimeout(timeout);
  };

  const currentLangObj = (activeLanguages || []).find(l => l.code === currentLang);

  const handleNavClick = (url: string, pageSlug?: string) => {
    clearMegaMenuTimeout();
    setActiveMegaMenu(null);
    setIsMobileMenuOpen(false);
    if (pageSlug) {
      openPageModal(pageSlug);
    } else if (url.startsWith('#')) {
      const el = document.querySelector(url);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Dinamik olarak eklenmiş özel menü öğeleri (Sektör alt linkleri ve dahili mega linkler filtrelenir)
  const customHeaderItems = (navigationItems || []).filter(item => {
    const isSector = item.url?.includes('portfolio') || 
      item.pageSlug?.includes('clinic') || 
      item.pageSlug?.includes('law') || 
      item.pageSlug?.includes('bistro') || 
      item.pageSlug?.includes('studio') || 
      item.pageSlug?.includes('logistics') || 
      item.pageSlug?.includes('store') || 
      item.pageSlug?.includes('realestate') || 
      item.pageSlug?.includes('fitness') || 
      item.pageSlug?.includes('portal');
    const isInternalDefault = item.location?.startsWith('mega_') || 
      item.id?.startsWith('nav-m-') || 
      item.id?.startsWith('nav-h-');
    return item.location === 'header' && !isSector && !isInternalDefault && item.url !== '#hero';
  });

  const baseBtnClass = "flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all cursor-pointer whitespace-nowrap px-3 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 shrink-0";

  return (
    <header className="sticky top-0 z-100 w-full border-b border-neutral-200/60 dark:border-neutral-800/60 bg-white/95 dark:bg-[#0a0c10]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Sol Alan: Logo */}
        <div className="flex shrink-0 items-center cursor-pointer" onClick={() => handleNavClick('#hero')}>
          <div className="flex items-center">
            <img
              src={VANGUARD_LOGO_PATH}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = VANGUARD_LOGO_DATA_URI;
              }}
              alt="Vanguard Studio"
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>

        {/* Masaüstü Navigasyon: Temiz, Şık ve Kategorize */}
        <nav className="hidden xl:flex items-center gap-1">
          {/* 1. Home */}
          <button
            type="button"
            onClick={() => handleNavClick("#hero")}
            className={`${baseBtnClass} hover:text-neutral-950 dark:hover:text-white`}
          >
            {t("nav.home", "Home")}
          </button>

          {/* 2. About (Mega Menü) */}
          <div 
            className="relative shrink-0" 
            onMouseEnter={() => handleMouseEnterMenu("corporate")} 
            onMouseLeave={handleMouseLeaveMenu}
          >
            <button 
              type="button" 
              onClick={() => {
                clearMegaMenuTimeout();
                setActiveMegaMenu(prev => prev === "corporate" ? null : "corporate");
              }} 
              className={`${baseBtnClass} ${activeMegaMenu === "corporate" ? "text-blue-500 dark:text-blue-400 bg-blue-500/10" : ""}`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{t("nav.about", "About")}</span>
              <ChevronDown className={`w-3 h-3 opacity-60 shrink-0 transition-transform ${activeMegaMenu === "corporate" ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* 3. Services (Mega Menü) */}
          <div 
            className="relative shrink-0" 
            onMouseEnter={() => handleMouseEnterMenu("services")} 
            onMouseLeave={handleMouseLeaveMenu}
          >
            <button 
              type="button" 
              onClick={() => {
                clearMegaMenuTimeout();
                setActiveMegaMenu(prev => prev === "services" ? null : "services");
              }} 
              className={`${baseBtnClass} ${activeMegaMenu === "services" ? "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10" : ""}`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{t("nav.services", "Services")}</span>
              <ChevronDown className={`w-3 h-3 opacity-60 shrink-0 transition-transform ${activeMegaMenu === "services" ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* 4. Turnkey Sites (Mega Menü) */}
          <div 
            className="relative shrink-0" 
            onMouseEnter={() => handleMouseEnterMenu("products")} 
            onMouseLeave={handleMouseLeaveMenu}
          >
            <button 
              type="button" 
              onClick={() => {
                clearMegaMenuTimeout();
                setActiveMegaMenu(prev => prev === "products" ? null : "products");
              }} 
              className={`${baseBtnClass} ${activeMegaMenu === "products" ? "text-amber-500 dark:text-amber-400 bg-amber-500/10" : ""}`}
            >
              <Grid className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{t("nav.turnkeySites", "Turnkey Sites")}</span>
              <ChevronDown className={`w-3 h-3 opacity-60 shrink-0 transition-transform ${activeMegaMenu === "products" ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* 5. Support & FAQ (Mega Menü) */}
          <div 
            className="relative shrink-0" 
            onMouseEnter={() => handleMouseEnterMenu("support")} 
            onMouseLeave={handleMouseLeaveMenu}
          >
            <button 
              type="button" 
              onClick={() => {
                clearMegaMenuTimeout();
                setActiveMegaMenu(prev => prev === "support" ? null : "support");
              }} 
              className={`${baseBtnClass} ${activeMegaMenu === "support" ? "text-cyan-500 dark:text-cyan-400 bg-cyan-500/10" : ""}`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
              <span>{t("nav.support", "Support & FAQ")}</span>
              <ChevronDown className={`w-3 h-3 opacity-60 shrink-0 transition-transform ${activeMegaMenu === "support" ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* 6. Tech Advisory */}
          <button 
            type="button" 
            onClick={() => handleNavClick("#services-section")} 
            className={`${baseBtnClass} text-amber-500 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{t("nav.techAdvisory", "Tech Advisory")}</span>
          </button>

          {/* Varsa Özel Eklenmiş Sayfalar */}
          {customHeaderItems.map(item => {
            const localizedTitle = item.translations?.[currentLang]?.title || item.title;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.url, item.pageSlug)}
                className={baseBtnClass}
              >
                <span>{localizedTitle}</span>
              </button>
            );
          })}
        </nav>

        {/* Sağ Aksiyon Buton Grubu */}
        <div className="flex items-center gap-2">
          {/* Para Birimi Dropdown */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => { setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen); setIsLangDropdownOpen(false); }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <span>{currentCurrency}</span>
              <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
            </button>
            {isCurrencyDropdownOpen && (
              <div 
                onMouseLeave={() => setIsCurrencyDropdownOpen(false)} 
                className="absolute right-0 mt-1.5 w-28 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-60 animate-fadeIn"
              >
                {currencies.map(c => (
                  <button 
                    key={c.code} 
                    type="button" 
                    onClick={() => { setCurrency(c.code as CurrencyCode); setIsCurrencyDropdownOpen(false); }} 
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left cursor-pointer transition-colors ${currentCurrency === c.code ? 'bg-neutral-100 dark:bg-neutral-800 font-black text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'}`}
                  >
                    <span>{c.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dil Seçici Dropdown */}
          <div className="relative shrink-0">
            <button 
              type="button" 
              onClick={() => { setIsLangDropdownOpen(!isLangDropdownOpen); setIsCurrencyDropdownOpen(false); }} 
              className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              <span>{currentLangObj?.flag}</span>
              <span className="uppercase tracking-wider font-black text-[11px]">{currentLangObj?.code}</span>
              <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
            </button>
            {isLangDropdownOpen && (
              <div 
                onMouseLeave={() => setIsLangDropdownOpen(false)} 
                className="absolute right-0 mt-1.5 w-36 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl z-60 animate-fadeIn"
              >
                {(activeLanguages || []).map(lang => (
                  <button 
                    key={lang.code} 
                    type="button" 
                    onClick={() => { setLanguage(lang.code); setIsLangDropdownOpen(false); }} 
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left cursor-pointer transition-colors ${currentLang === lang.code ? 'bg-neutral-100 dark:bg-neutral-800 font-black text-neutral-950 dark:text-white' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tema Değiştirici */}
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors shrink-0 cursor-pointer shadow-xs"
            title="Temayı Değiştir"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* Müşteri Paneli */}
          <button 
            type="button" 
            onClick={() => openCustomerPanel()} 
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/30 transition-colors shrink-0 cursor-pointer shadow-xs"
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
            <span>{t('header.customerPanel', 'Müşteri Paneli')}</span>
          </button>

          {/* Admin Kilit Girişi */}
          <button 
            type="button" 
            onClick={() => setIsAdminOpen(true)} 
            className="hidden xl:flex p-2 text-neutral-500 hover:text-neutral-950 dark:hover:text-white rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors shrink-0 cursor-pointer shadow-xs"
            title="Admin Paneli Girişi"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Get Started CTA */}
          <button 
            type="button" 
            onClick={() => openPageModal('iletisim')} 
            className="hidden xl:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
          >
            <span>{t('nav.contact', 'Get Started')}</span>
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>

          {/* Mobil Menü Butonu (Hamburger) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-colors xl:hidden cursor-pointer"
            aria-label="Menüyü Aç / Kapat"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mega Menü Açılır Gövdesi */}
      {activeMegaMenu && (
        <MegaMenu
          type={activeMegaMenu as any}
          isOpen={true}
          onClose={() => { clearMegaMenuTimeout(); setActiveMegaMenu(null); }}
          onMouseEnter={clearMegaMenuTimeout}
          onMouseLeave={handleMouseLeaveMenu}
        />
      )}

      {/* Mobil Açılır Menü Navigasyon Bloğu */}
      {isMobileMenuOpen && (
        <div className="border-t border-neutral-200/60 dark:border-neutral-800/60 bg-white dark:bg-[#0a0c10] xl:hidden animate-fadeIn">
          <div className="space-y-1 px-4 py-4 text-sm font-bold">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => handleNavClick("#hero")}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white transition-colors"
            >
              {t("nav.home", "Home")}
            </button>

            {/* 2. About */}
            <button
              type="button"
              onClick={() => handleNavClick("#hero", "hakkimizda")}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white flex items-center gap-2 transition-colors"
            >
              <Building2 className="w-4 h-4 text-blue-500" />
              <span>{t("nav.about", "About")}</span>
            </button>

            {/* 3. Services */}
            <button
              type="button"
              onClick={() => handleNavClick("#services-section")}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white flex items-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-indigo-500" />
              <span>{t("nav.services", "Services")}</span>
            </button>

            {/* 4. Turnkey Sites */}
            <button
              type="button"
              onClick={() => handleNavClick("#portfolio-section")}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Grid className="w-4 h-4 text-amber-500" />
                <span>{t("nav.turnkeySites", "Turnkey Sites")}</span>
              </div>
              <span className="text-[10px] text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md">Portföy</span>
            </button>

            {/* 5. Support & FAQ */}
            <button
              type="button"
              onClick={() => handleNavClick("#faq-section", "sss")}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white flex items-center gap-2 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-cyan-500" />
              <span>{t("nav.support", "Support & FAQ")}</span>
            </button>

            {/* 6. Tech Advisory */}
            <button
              type="button"
              onClick={() => handleNavClick("#services-section")}
              className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-amber-500 flex items-center gap-2 transition-colors"
            >
              <Cpu className="w-4 h-4 text-amber-500" />
              <span>{t("nav.techAdvisory", "Tech Advisory")}</span>
            </button>

            {/* Varsa Özel Eklenmiş Linkler */}
            {customHeaderItems.map(item => {
              const localizedTitle = item.translations?.[currentLang]?.title || item.title;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.url, item.pageSlug)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-900 text-black dark:text-white transition-colors"
                >
                  {localizedTitle}
                </button>
              );
            })}

            {/* Mobil Dil Seçici Hızlı Bar */}
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-1">
              <span className="text-xs text-neutral-500 font-medium">Dil / Language:</span>
              <div className="flex items-center gap-1.5">
                {(activeLanguages || []).map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-bold flex items-center gap-1 transition-colors ${currentLang === lang.code ? 'bg-amber-400 text-black shadow-xs' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}
                  >
                    <span>{lang.flag}</span>
                    <span className="uppercase">{lang.code}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobil Ekstra Aksiyon Buton Döngüleri */}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => { openCustomerPanel(); setIsMobileMenuOpen(false); }}
                className="w-full text-center py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black"
              >
                {t('header.customerPanel', 'Müşteri Paneli')}
              </button>
              <button
                type="button"
                onClick={() => { setIsAdminOpen(true); setIsMobileMenuOpen(false); }}
                className="w-full text-center py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-300 text-xs font-black"
              >
                Admin Giriş
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleNavClick('#contact', 'iletisim')}
              className="w-full text-center py-3 mt-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 active:scale-95 transition-all"
            >
              <span>{t('nav.contact', 'Get Started')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

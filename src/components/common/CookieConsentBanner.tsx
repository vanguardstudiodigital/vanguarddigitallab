import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Cookie, Shield, Check, X, Settings, ChevronRight, Lock } from 'lucide-react';

export interface CookiePreferences {
  necessary: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'vanguard_cookie_consent_v1';

// Language Dictionary for KVKK & GDPR Compliance
const COOKIE_I18N = {
  tr: {
    bannerTitle: 'Çerez (Cookie) & Gizlilik Tercihleriniz',
    noticeText: 'Vanguard Studio olarak, kullanıcı deneyiminizi geliştirmek, site trafiğini analiz etmek ve güvenliği sağlamak amacıyla zorunlu ve analitik çerezler kullanmaktayız. Detaylı bilgi için ',
    cookiePolicyLink: 'Çerez Politikası',
    noticeTextEnd: ' sayfamızı inceleyebilirsiniz.',
    acceptAll: 'Hepsini Kabul Et',
    rejectAll: 'Hepsini Reddet',
    managePreferences: 'Ayarları Yönet',
    preferenceTitle: 'Çerez Tercihlerini Özelleştir',
    preferenceSubtitle: 'KVKK ve GDPR mevzuatları uyarınca çerez kullanım tercihlerinizi dilediğiniz gibi yapılandırabilirsiniz.',
    savePreferences: 'Seçimlerimi Kaydet',
    close: 'Kapat',
    floatingTooltip: 'Çerez Tercihlerini Değiştir',
    categories: {
      necessary: {
        title: 'Zorunlu / Gerekli Çerezler',
        status: 'Her Zaman Etkin',
        description: 'Sitenin temel işlevlerini (oturum yönetimi, dil ve tema tercihleri, form güvenliği) çalıştırmak için zorunludur. Devre dışı bırakılamaz.',
      },
      analytics: {
        title: 'Analitik ve Performans Çerezleri',
        description: 'Ziyaretçilerin siteyi nasıl kullandığını, en çok incelenen sayfaları anonim istatistiksel verilerle analiz etmemize yardımcı olur.',
      },
      marketing: {
        title: 'Pazarlama ve Hedefleme Çerezleri',
        description: 'İlgi alanlarınıza uygun kişiselleştirilmiş hizmet ve kampanya sunmamızı sağlar.',
      },
    },
    statusNotice: 'Tercihleriniz KVKK / GDPR standartlarında kaydedilmiştir.',
  },
  en: {
    bannerTitle: 'Cookie & Privacy Preferences',
    noticeText: 'At Vanguard Studio, we use essential and analytical cookies to enhance your user experience, analyze site traffic, and ensure security. For detailed information, please review our ',
    cookiePolicyLink: 'Cookie Policy',
    noticeTextEnd: '.',
    acceptAll: 'Accept All',
    rejectAll: 'Reject All',
    managePreferences: 'Manage Settings',
    preferenceTitle: 'Customize Cookie Preferences',
    preferenceSubtitle: 'Under GDPR and privacy regulations, you can configure your cookie preferences at any time.',
    savePreferences: 'Save Preferences',
    close: 'Close',
    floatingTooltip: 'Cookie Preferences',
    categories: {
      necessary: {
        title: 'Essential / Necessary Cookies',
        status: 'Always Active',
        description: 'Required for core website functionality (session management, security, language & theme preferences). Cannot be disabled.',
      },
      analytics: {
        title: 'Analytics & Performance Cookies',
        description: 'Helps us anonymously understand how visitors interact with the site and improve performance metrics.',
      },
      marketing: {
        title: 'Marketing & Targeting Cookies',
        description: 'Allows us to deliver personalized content and relevant updates tailored to your interests.',
      },
    },
    statusNotice: 'Your preferences have been saved according to GDPR standards.',
  },
};

export function getStoredCookieConsent(): CookiePreferences | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

export const CookieConsentBanner: React.FC = () => {
  const { currentLang, openPageModal } = useApp();
  const langKey = (currentLang === 'en' ? 'en' : 'tr') as 'tr' | 'en';
  const t = COOKIE_I18N[langKey] || COOKIE_I18N.tr;

  const [isVisible, setIsVisible] = useState(false);
  const [isPreferenceOpen, setIsPreferenceOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [hasDecided, setHasDecided] = useState(false);

  useEffect(() => {
    const consent = getStoredCookieConsent();
    if (consent) {
      setHasDecided(true);
      setIsVisible(false);
      setAnalytics(consent.analytics);
      setMarketing(consent.marketing);
    } else {
      setIsVisible(true);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      // ignore errors
    }
    setHasDecided(true);
    setIsVisible(false);
    setIsPreferenceOpen(false);

    // Trigger window custom event so third-party pixels or analytics scripts can respond
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('vanguard_cookie_consent_updated', { detail: prefs }));
    }
  };

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
  };

  const handleSaveCustomPreferences = () => {
    saveConsent({
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    });
  };

  const handleOpenCookiePolicy = (e: React.MouseEvent) => {
    e.preventDefault();
    openPageModal('cerez-politikasi');
  };

  return (
    <>
      {/* 1. Main Bottom Cookie Consent Banner */}
      {isVisible && !isPreferenceOpen && (
        <div
          role="dialog"
          aria-label={t.bannerTitle}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 max-w-2xl z-[9990] bg-[#0d1017]/95 border border-neutral-800/90 backdrop-blur-xl shadow-2xl rounded-2xl p-5 sm:p-6 text-neutral-200 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
          <div className="flex flex-col gap-4">
            {/* Header / Title */}
            <div className="flex items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Cookie className="w-5 h-5 shrink-0" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display tracking-wide">
                    {t.bannerTitle}
                  </h3>
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    <span>KVKK & GDPR Compliant</span>
                  </span>
                </div>
              </div>

              <button
                onClick={handleRejectAll}
                className="text-neutral-500 hover:text-neutral-300 p-1.5 rounded-lg hover:bg-neutral-800/50 transition-colors cursor-pointer"
                title={t.close}
                aria-label={t.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Layered Notice Text (Katmanlı Aydınlatma Metni) */}
            <p className="text-xs text-neutral-300 leading-relaxed">
              {t.noticeText}
              <a
                href="#cerez-politikasi"
                onClick={handleOpenCookiePolicy}
                className="text-amber-400 hover:text-amber-300 underline font-semibold transition-colors"
              >
                {t.cookiePolicyLink}
              </a>
              {t.noticeTextEnd}
            </p>

            {/* Action Buttons: 3 Main Buttons with Equal Prominence for Accept & Reject */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              {/* Accept All (Primary) */}
              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t.acceptAll}</span>
              </button>

              {/* Reject All (Equal width & prominence) */}
              <button
                type="button"
                onClick={handleRejectAll}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold px-4 py-2.5 rounded-xl text-xs border border-neutral-700 hover:border-neutral-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
                <span>{t.rejectAll}</span>
              </button>

              {/* Manage Preferences */}
              <button
                type="button"
                onClick={() => setIsPreferenceOpen(true)}
                className="sm:w-auto bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white font-medium px-3.5 py-2.5 rounded-xl text-xs border border-neutral-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{t.managePreferences}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal View for Customizing Preferences ("Ayarları Yönet") */}
      {isPreferenceOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#0f121a] border border-neutral-800 rounded-2xl max-w-lg w-full p-6 text-neutral-200 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {t.preferenceTitle}
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {t.preferenceSubtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPreferenceOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Toggles */}
            <div className="space-y-3">
              {/* Category 1: Necessary / Mandatory */}
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-white">
                      {t.categories.necessary.title}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {t.categories.necessary.status}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {t.categories.necessary.description}
                </p>
              </div>

              {/* Category 2: Analytics */}
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {t.categories.analytics.title}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={analytics}
                      onChange={(e) => setAnalytics(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {t.categories.analytics.description}
                </p>
              </div>

              {/* Category 3: Marketing */}
              <div className="p-4 rounded-xl bg-neutral-900/80 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {t.categories.marketing.title}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={marketing}
                      onChange={(e) => setMarketing(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                  </label>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  {t.categories.marketing.description}
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleSaveCustomPreferences}
                className="w-full sm:flex-1 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t.savePreferences}</span>
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs border border-neutral-700 transition-colors cursor-pointer"
              >
                {t.acceptAll}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Re-access Floating Widget Button (Bottom-Left) */}
      {hasDecided && !isVisible && !isPreferenceOpen && (
        <button
          type="button"
          onClick={() => {
            setIsVisible(true);
            setIsPreferenceOpen(true);
          }}
          className="fixed bottom-5 left-5 z-[9980] bg-[#0e1118]/90 hover:bg-neutral-800 text-amber-400 border border-neutral-800 p-3 rounded-full shadow-2xl backdrop-blur-md transition-all cursor-pointer group hover:scale-105 active:scale-95"
          title={t.floatingTooltip}
          aria-label={t.floatingTooltip}
        >
          <div className="relative">
            <Cookie className="w-5 h-5 text-amber-400 transition-transform group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0e1118]" />
          </div>

          {/* Hover Tooltip */}
          <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-neutral-900 text-neutral-200 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-neutral-800 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg">
            {t.floatingTooltip}
          </span>
        </button>
      )}
    </>
  );
};

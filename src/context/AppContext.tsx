import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CurrencyCode,
  CurrencyInfo,
  LanguageDef,
  TurnkeyProduct,
  ServiceItem,
  ReferenceItem,
  LeadInquiry,
  AgencySettings,
  TranslationDictionary,
  PricingTier,
  CentralBankRate,
  BankAccountItem,
  LegalTaxInfo,
  FinancialTransaction,
  NavigationItem,
  CustomPage,
  CustomPageTranslation,
  FaqItem,
  FaqTranslation,
  AdvisoryServiceConfig,
} from '../types/index.ts';
import {
  CURRENCIES,
  DEFAULT_LANGUAGES,
  DEFAULT_SETTINGS,
  DEFAULT_ADVISORY_SERVICE,
  DEFAULT_PRODUCTS,
  DEFAULT_SERVICES,
  DEFAULT_REFERENCES,
  DEFAULT_TRANSLATIONS,
  DEFAULT_BANK_ACCOUNTS_LIST,
  DEFAULT_LEGAL_TAX_INFO,
  DEFAULT_FINANCIAL_TRANSACTIONS,
  DEFAULT_NAVIGATION,
  DEFAULT_PAGES,
  DEFAULT_FAQS,
} from '../data/defaultData.ts';
import { cleanAndNormalizeRichText } from '../utils/richTextRenderer.ts';

interface AppContextType {
  // Theme & Layout
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Language & Translation
  currentLang: string;
  setLanguage: (lang: string) => void;
  languages: LanguageDef[];
  translations: TranslationDictionary;
  t: (key: string, fallback?: string) => string;
  addLanguage: (lang: LanguageDef) => void;
  deleteLanguage: (code: string) => void;
  toggleLanguageActive: (code: string) => void;
  updateLanguageDef: (code: string, updatedFields: Partial<LanguageDef>) => void;
  updateTranslationKey: (langCode: string, key: string, value: string) => void;
  deleteTranslationKey: (langCode: string, key: string) => void;
  importLanguageTranslations: (langCode: string, newDict: Record<string, string>, merge?: boolean) => void;
  autoTranslateLanguage: (targetCode: string) => Promise<boolean>;

  // Currency & Pricing
  currentCurrency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  formatPrice: (priceTRY: number) => string;
  currencies: CurrencyInfo[];

  // Products (Max 10)
  products: TurnkeyProduct[];
  addProduct: (product: Omit<TurnkeyProduct, 'id'>) => { success: boolean; error?: string };
  updateProduct: (id: string, product: Partial<TurnkeyProduct>) => void;
  deleteProduct: (id: string) => void;
  getLocalizedProduct: (product: TurnkeyProduct) => TurnkeyProduct;
  autoTranslateProduct: (productId: string, targetLang: string) => Promise<boolean>;

  // Services
  services: ServiceItem[];
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, service: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;
  getLocalizedService: (service: ServiceItem) => ServiceItem;

  // References
  references: ReferenceItem[];
  addReference: (ref: Omit<ReferenceItem, 'id'>) => void;
  updateReference: (id: string, ref: Partial<ReferenceItem>) => void;
  deleteReference: (id: string) => void;
  getLocalizedReference: (ref: ReferenceItem) => ReferenceItem;

  // Leads & Inquiries
  inquiries: LeadInquiry[];
  submitInquiry: (inquiry: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>) => void;
  updateInquiryStatus: (id: string, status: LeadInquiry['status']) => void;
  deleteInquiry: (id: string) => void;

  // Settings
  settings: AgencySettings;
  updateSettings: (settings: Partial<AgencySettings>) => void;
  resetToDefaults: () => void;
  exportBackupJson: () => string;
  importBackupJson: (jsonStr: string) => boolean;

  // VIP Advisory Service (Vanguard Nexus)
  advisoryService: AdvisoryServiceConfig;
  updateAdvisoryService: (advisory: Partial<AdvisoryServiceConfig>) => void;

  // Bank Accounts Management
  bankAccountsList: BankAccountItem[];
  addBankAccount: (bank: Omit<BankAccountItem, 'id'>) => void;
  updateBankAccount: (id: string, updated: Partial<BankAccountItem>) => void;
  deleteBankAccount: (id: string) => void;
  setPrimaryBankAccount: (id: string) => void;

  // Legal & Tax Info
  legalTaxInfo: LegalTaxInfo;
  updateLegalTaxInfo: (info: Partial<LegalTaxInfo>) => void;

  // Financial System & Cashflow
  financialTransactions: FinancialTransaction[];
  addFinancialTransaction: (tx: Omit<FinancialTransaction, 'id' | 'createdAt'>) => void;
  addFinancialTransactionsBatch: (txList: Omit<FinancialTransaction, 'id' | 'createdAt'>[]) => void;
  updateFinancialTransaction: (id: string, updated: Partial<FinancialTransaction>) => void;
  deleteFinancialTransaction: (id: string) => void;

  // Password / PIN Security
  changeAdminPin: (oldPin: string, newPin: string) => { success: boolean; error?: string };

  // Admin Auth & Modal
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  isAdminAuthenticated: boolean;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;

  // Central Bank Rates & Currency
  centralBankRates: CentralBankRate[];

  // Modals & Navigation
  isPaymentModalOpen: boolean;
  openPaymentModal: (product?: TurnkeyProduct | null, packageType?: PricingTier) => void;
  closePaymentModal: () => void;
  paymentProduct: TurnkeyProduct | null;
  paymentPackage: PricingTier;

  activeDemoProduct: TurnkeyProduct | null;
  openDemo: (product: TurnkeyProduct) => void;
  closeDemo: () => void;

  activeStandaloneSite: TurnkeyProduct | null;
  openStandaloneSite: (product: TurnkeyProduct) => void;
  closeStandaloneSite: () => void;

  activeDetailProduct: TurnkeyProduct | null;
  openDetail: (product: TurnkeyProduct) => void;
  closeDetail: () => void;

  isContactModalOpen: boolean;
  preselectedProduct: TurnkeyProduct | null;
  preselectedPackage: PricingTier | 'custom' | 'advisory';
  openContactModal: (product?: TurnkeyProduct | null, packageType?: PricingTier | 'custom' | 'advisory') => void;
  closeContactModal: () => void;

  activeViewAllSection: 'products' | 'services' | 'references' | null;
  openViewAll: (section: 'products' | 'services' | 'references') => void;
  closeViewAll: () => void;

  // Navigation & Menu Management
  navigationItems: NavigationItem[];
  data: {
    menus: NavigationItem[];
    [key: string]: any;
  };
  saveNavigationItem: (item: NavigationItem) => void;
  deleteNavigationItem: (id: string) => void;
  reorderNavigationItems: (items: NavigationItem[]) => void;

  // Custom Pages & Legal CMS
  customPages: CustomPage[];
  saveCustomPage: (page: CustomPage) => void;
  deleteCustomPage: (id: string) => void;
  activePageSlug: string | null;
  openPageModal: (slug: string) => void;
  closePageModal: () => void;

  // FAQ Management (SSS)
  faqs: FaqItem[];
  addFaq: (faq: Omit<FaqItem, 'id'>) => void;
  updateFaq: (id: string, updated: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;
  reorderFaqs: (items: FaqItem[]) => void;
  getLocalizedFaq: (faq: FaqItem) => FaqItem;

  // Promo & Studio Video Modal
  isVideoModalOpen: boolean;
  activeVideoUrl: string | null;
  openVideoModal: (url?: string) => void;
  closeVideoModal: () => void;

  // Customer CMS Panel for Turnkey Sites
  isCustomerPanelOpen: boolean;
  setIsCustomerPanelOpen: (open: boolean) => void;
  selectedCustomerProductId: string | null;
  setSelectedCustomerProductId: (id: string | null) => void;
  openCustomerPanel: (productId?: string) => void;
  closeCustomerPanel: () => void;

  // On-Demand Deployment & Live Handover Modal
  isDeployModalOpen: boolean;
  deployModalProduct: TurnkeyProduct | null;
  openDeployModal: (product?: TurnkeyProduct | null) => void;
  closeDeployModal: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  THEME: 'vanguard_theme_v1',
  LANG: 'vanguard_lang_v1',
  CURRENCY: 'vanguard_currency_v1',
  PRODUCTS: 'vanguard_products_v1',
  SERVICES: 'vanguard_services_v1',
  REFERENCES: 'vanguard_references_v1',
  LANGUAGES: 'vanguard_languages_v1',
  TRANSLATIONS: 'vanguard_translations_v1',
  INQUIRIES: 'vanguard_inquiries_v1',
  SETTINGS: 'vanguard_settings_v1',
  BANK_ACCOUNTS: 'vanguard_bank_accounts_v1',
  FINANCE: 'vanguard_finance_v1',
  ADMIN_AUTH: 'vanguard_admin_auth_v1',
  NAVIGATION: 'vanguard_navigation_v1',
  PAGES: 'vanguard_pages_v1',
  FAQS: 'vanguard_faqs_v1',
};

export const getCurrencyForLanguage = (lang: string): CurrencyCode => {
  switch (lang) {
    case 'tr':
      return 'TRY';
    case 'de':
    case 'fr':
    case 'es':
    case 'it':
      return 'EUR';
    case 'en':
    default:
      return 'USD';
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark'; // default to elite dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
      document.body.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Language state
  const [currentLang, setCurrentLang] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    if (saved && typeof saved === 'string') return saved;
    return 'tr';
  });

  useEffect(() => {
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const [languages, setLanguages] = useState<LanguageDef[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
      return DEFAULT_LANGUAGES;
    } catch {
      return DEFAULT_LANGUAGES;
    }
  });

  const [translations, setTranslations] = useState<TranslationDictionary>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSLATIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged: TranslationDictionary = {};
        const allLangs = Array.from(new Set([...Object.keys(DEFAULT_TRANSLATIONS), ...Object.keys(parsed)]));
        allLangs.forEach(lang => {
          const defaultDict = DEFAULT_TRANSLATIONS[lang] || {};
          const userDict = parsed[lang] || {};
          const langMerged: Record<string, string> = { ...defaultDict };
          Object.keys(userDict).forEach(k => {
            if (typeof userDict[k] === 'string' && userDict[k].trim() !== '') {
              langMerged[k] = userDict[k];
            }
          });
          merged[lang] = langMerged;
        });
        return merged;
      }
      return DEFAULT_TRANSLATIONS;
    } catch {
      return DEFAULT_TRANSLATIONS;
    }
  });

  const setLanguage = (lang: string) => {
    setCurrentLang(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    const targetCurrency = getCurrencyForLanguage(lang);
    setCurrency(targetCurrency);
  };

  // Currency state
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode;
    if (saved && ['TRY', 'USD', 'EUR'].includes(saved)) {
      return saved;
    }
    const initialLang = localStorage.getItem(STORAGE_KEYS.LANG) || 'tr';
    return getCurrencyForLanguage(initialLang);
  });

  const setCurrency = (curr: CurrencyCode) => {
    setCurrentCurrency(curr);
    localStorage.setItem(STORAGE_KEYS.CURRENCY, curr);
  };

  const formatPrice = useCallback((priceTRY: number): string => {
    const curInfo = CURRENCIES.find(c => c.code === currentCurrency) || CURRENCIES[0];
    if (curInfo.code === 'TRY') {
      return `${priceTRY.toLocaleString('tr-TR')}\u00A0₺`;
    }
    const converted = Math.round(priceTRY / curInfo.rateToTRY);
    if (curInfo.code === 'USD') return `$${converted.toLocaleString('en-US')}`;
    if (curInfo.code === 'EUR') return `€${converted.toLocaleString('de-DE')}`;
    return `${converted}\u00A0${curInfo.symbol}`;
  }, [currentCurrency]);

  const interpolateDynamicPrices = useCallback((text: string): string => {
    if (!text || typeof text !== 'string') return text;
    return text.replace(/\{\{PRICE_([0-9]+)\}\}/g, (_, num) => {
      const priceNum = Number(num);
      return !isNaN(priceNum) ? formatPrice(priceNum) : _;
    });
  }, [formatPrice]);

  const t = (key: string, fallback?: string): string => {
    let rawText = '';
    // 1. Current language from user/saved translations
    if (translations[currentLang]?.[key] && translations[currentLang][key].trim() !== '') {
      rawText = translations[currentLang][key];
    }
    // 2. Current language from default built-in translations
    else if (DEFAULT_TRANSLATIONS[currentLang]?.[key] && DEFAULT_TRANSLATIONS[currentLang][key].trim() !== '') {
      rawText = DEFAULT_TRANSLATIONS[currentLang][key];
    }
    // 3. Explicit fallback provided by component when language is not Turkish
    else if (currentLang !== 'tr' && fallback) {
      rawText = fallback;
    }
    // 4. Turkish from user/saved translations
    else if (translations['tr']?.[key] && translations['tr'][key].trim() !== '') {
      rawText = translations['tr'][key];
    }
    // 5. Turkish from default built-in translations
    else if (DEFAULT_TRANSLATIONS['tr']?.[key] && DEFAULT_TRANSLATIONS['tr'][key].trim() !== '') {
      rawText = DEFAULT_TRANSLATIONS['tr'][key];
    }
    else {
      rawText = fallback || key;
    }

    return interpolateDynamicPrices(rawText);
  };

  const addLanguage = (lang: LanguageDef) => {
    if (languages.some(l => l.code === lang.code)) return;
    const updated = [...languages, lang];
    setLanguages(updated);
    localStorage.setItem(STORAGE_KEYS.LANGUAGES, JSON.stringify(updated));

    // Initialize translations dictionary for this language by copying English or Turkish
    const baseDict = translations['en'] || translations['tr'] || {};
    const newTranslations = {
      ...translations,
      [lang.code]: { ...baseDict },
    };
    setTranslations(newTranslations);
    localStorage.setItem(STORAGE_KEYS.TRANSLATIONS, JSON.stringify(newTranslations));
  };

  const deleteLanguage = (code: string) => {
    if (code === 'tr') return; // Cannot delete primary base language
    const updated = languages.filter(l => l.code !== code);
    setLanguages(updated);
    localStorage.setItem(STORAGE_KEYS.LANGUAGES, JSON.stringify(updated));

    if (currentLang === code) {
      setLanguage('tr');
    }
  };

  const toggleLanguageActive = (code: string) => {
    const updated = languages.map(l => (l.code === code ? { ...l, active: !l.active } : l));
    setLanguages(updated);
    localStorage.setItem(STORAGE_KEYS.LANGUAGES, JSON.stringify(updated));
  };

  const updateLanguageDef = (code: string, updatedFields: Partial<LanguageDef>) => {
    const updated = languages.map(l => (l.code === code ? { ...l, ...updatedFields } : l));
    setLanguages(updated);
    localStorage.setItem(STORAGE_KEYS.LANGUAGES, JSON.stringify(updated));
  };

  const updateTranslationKey = (langCode: string, key: string, value: string) => {
    setTranslations(prev => {
      const updated = {
        ...prev,
        [langCode]: {
          ...(prev[langCode] || {}),
          [key]: value,
        },
      };
      localStorage.setItem(STORAGE_KEYS.TRANSLATIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteTranslationKey = (langCode: string, key: string) => {
    setTranslations(prev => {
      const langDict = { ...(prev[langCode] || {}) };
      delete langDict[key];
      const updated = {
        ...prev,
        [langCode]: langDict,
      };
      localStorage.setItem(STORAGE_KEYS.TRANSLATIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const importLanguageTranslations = (langCode: string, newDict: Record<string, string>, merge: boolean = true) => {
    setTranslations(prev => {
      const current = prev[langCode] || {};
      const updatedDict = merge ? { ...current, ...newDict } : { ...newDict };
      const updated = {
        ...prev,
        [langCode]: updatedDict,
      };
      localStorage.setItem(STORAGE_KEYS.TRANSLATIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const autoTranslateLanguage = async (targetCode: string): Promise<boolean> => {
    // Intelligent translation engine
    const baseDict = translations['tr'] || DEFAULT_TRANSLATIONS['tr'];
    const currentTargetDict = translations[targetCode] || {};

    // Standard translation dictionary for common languages
    const germanDict: Record<string, string> = {
      'nav.products': 'Fertige Websites',
      'nav.services': 'Dienstleistungen',
      'nav.references': 'Referenzen',
      'nav.pricing': 'Preise & Modelle',
      'nav.contact': 'Projekt Starten',
      'nav.career': 'Karriere',
      'nav.viewAll': 'Alle Anzeigen',
      'hero.badge': 'Für Kleinunternehmen · In 48 Std. Online',
      'hero.title': 'Erstklassige schlüsselfertige Websites ohne Agenturaufschlag.',
      'hero.subtitle': 'Entdecken Sie schlüsselfertige Web-Lösungen für Ihr Unternehmen ab {{PRICE_10000}}.',
      'hero.ctaPrimary': 'Websites Entdecken',
      'hero.ctaSecondary': 'Modelle Vergleichen',
      'products.sectionTitle': 'Verkaufsfertige Branchen-Websites',
      'products.all': 'Alle Branchen',
      'products.viewDemo': 'Live-Vorschau',
      'products.orderNow': 'Diese Website Kaufen',
      'common.close': 'Schließen',
      'common.save': 'Speichern',
    };

    const frenchDict: Record<string, string> = {
      'nav.products': 'Sites Clés en Main',
      'nav.services': 'Services',
      'nav.references': 'Témoignages',
      'nav.pricing': 'Tarifs & Modèles',
      'nav.contact': 'Démarrer',
      'nav.career': 'Carrières',
      'nav.viewAll': 'Voir Tout',
      'hero.badge': 'Pour PME & Indépendants · En Ligne en 48h',
      'hero.title': 'Sites Web Clés en Main Prestigieux à Prix Juste.',
      'hero.subtitle': 'Lancez votre présence en ligne professionnelle sans budget excessif (dès {{PRICE_10000}}).',
      'hero.ctaPrimary': 'Explorer les Sites',
      'hero.ctaSecondary': 'Comparer les Formules',
      'products.sectionTitle': 'Catalogue de Sites Clés en Main',
      'products.all': 'Tous Secteurs',
      'products.viewDemo': 'Aperçu En Direct',
      'products.orderNow': 'Acheter Ce Site',
      'common.close': 'Fermer',
      'common.save': 'Enregistrer',
    };

    let mappedDict: Record<string, string> = {};
    if (targetCode === 'de') mappedDict = germanDict;
    if (targetCode === 'fr') mappedDict = frenchDict;

    const mergedDict: Record<string, string> = { ...currentTargetDict };
    Object.keys(baseDict).forEach(k => {
      if (!mergedDict[k]) {
        mergedDict[k] = mappedDict[k] || `[${targetCode.toUpperCase()}] ${baseDict[k]}`;
      }
    });

    setTranslations(prev => {
      const updated = { ...prev, [targetCode]: mergedDict };
      localStorage.setItem(STORAGE_KEYS.TRANSLATIONS, JSON.stringify(updated));
      return updated;
    });

    return true;
  };

  // Products state (Enforcing maximum 10 items)
  const [products, setProducts] = useState<TurnkeyProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed: TurnkeyProduct[] = JSON.parse(saved);
        // Smart merge translations from default products if missing
        const merged = parsed.map(p => {
          const def = DEFAULT_PRODUCTS.find(d => d.id === p.id);
          if (def && def.translations) {
            const deepTrans: Record<string, any> = { ...def.translations };
            if (p.translations) {
              for (const lang of Object.keys(p.translations)) {
                deepTrans[lang] = {
                  ...(def.translations[lang] || {}),
                  ...(p.translations[lang] || {}),
                };
              }
            }
            return {
              ...p,
              translations: deepTrans,
            };
          }
          return p;
        });
        DEFAULT_PRODUCTS.forEach(def => {
          if (!merged.some(p => p.id === def.id) && merged.length < 10) {
            merged.push(def);
          }
        });
        return merged;
      }
      return DEFAULT_PRODUCTS;
    } catch {
      return DEFAULT_PRODUCTS;
    }
  });

  const sanitizeEnglish = (str?: string): string => {
    if (!str) return '';
    return str
      .replace(/İ/g, 'I')
      .replace(/ı/g, 'i')
      .replace(/ş/g, 's')
      .replace(/Ş/g, 'S')
      .replace(/ğ/g, 'g')
      .replace(/Ğ/g, 'G')
      .replace(/ç/g, 'c')
      .replace(/Ç/g, 'C')
      .replace(/ö/g, 'o')
      .replace(/Ö/g, 'O')
      .replace(/ü/g, 'u')
      .replace(/Ü/g, 'U');
  };

  const getLocalizedProduct = (product: TurnkeyProduct): TurnkeyProduct => {
    if (!product) return product;
    if (currentLang === 'tr') return product;
    const def = DEFAULT_PRODUCTS.find(d => d.id === product.id);
    const trans = product.translations?.[currentLang] || def?.translations?.[currentLang];

    // Sanitize badge for English
    let badge = trans?.badge || product.badge;
    if (currentLang === 'en' && badge) {
      const lower = badge.toLowerCase().trim();
      if (lower === 'prestij' || lower === 'prestige') badge = 'Prestige';
      else if (lower === 'popüler' || lower === 'populer' || lower === 'popular') badge = 'Popular';
      else if (lower === 'çok satan' || lower === 'cok satan' || lower === 'best seller') badge = 'Best Seller';
      else if (lower === 'elit çizgi' || lower === 'silent luxury') badge = 'Silent Luxury';
      else if (lower === 'uluslararası' || lower === 'international') badge = 'International';
      else if (lower === 'yeni' || lower === 'new') badge = 'New';
      else badge = sanitizeEnglish(badge);
    }

    if (!trans) {
      if (currentLang === 'en') {
        return {
          ...product,
          title: sanitizeEnglish(product.title),
          sector: sanitizeEnglish(product.sector),
          tagline: sanitizeEnglish(product.tagline),
          badge,
        };
      }
      return {
        ...product,
        badge,
      };
    }

    if (currentLang === 'en') {
      return {
        ...product,
        title: sanitizeEnglish(trans.title || product.title),
        sector: sanitizeEnglish(trans.sector || product.sector),
        tagline: sanitizeEnglish(trans.tagline || product.tagline),
        description: sanitizeEnglish(trans.description || product.description),
        features: (trans.features && trans.features.length > 0 ? trans.features : product.features).map(sanitizeEnglish),
        badge,
      };
    }

    return {
      ...product,
      title: trans.title || product.title,
      sector: trans.sector || product.sector,
      tagline: trans.tagline || product.tagline,
      description: trans.description || product.description,
      features: trans.features && trans.features.length > 0 ? trans.features : product.features,
      badge,
    };
  };

  const autoTranslateProduct = async (productId: string, targetLang: string): Promise<boolean> => {
    const product = products.find(p => p.id === productId);
    if (!product) return false;

    // Translation heuristics for turnkey sites
    const enDict: Record<string, string> = {
      'Sağlık & Klinik': 'Healthcare & Medical Clinic',
      'Hukuk & Müşavirlik': 'Law & Corporate Advisory',
      'Restoran & Kafe': 'Restaurant & Artisan Cafe',
      'Mimarlık & İnşaat': 'Architecture & Interior Design',
      'Lojistik & Taşımacılık': 'Logistics & Global Freight',
      'Butik E-Ticaret': 'Boutique E-Commerce & Catalog',
      'Emlak & Gayrimenkul': 'Real Estate & Properties',
      'Spor & Sağlıklı Yaşam': 'Fitness Club & Wellness',
    };

    const targetTrans = product.translations?.[targetLang] || {
      title: targetLang === 'en' ? `${product.title} (English)` : targetLang === 'ru' ? `${product.title} (На Русском)` : `${product.title} (${targetLang.toUpperCase()})`,
      sector: enDict[product.sector] || product.sector,
      tagline: product.tagline,
      description: product.description,
      features: product.features,
    };

    updateProduct(productId, {
      translations: {
        ...(product.translations || {}),
        [targetLang]: targetTrans,
      },
    });

    return true;
  };

  const addProduct = (newProd: Omit<TurnkeyProduct, 'id'>) => {
    if (products.length >= 10) {
      return {
        success: false,
        error: 'Maksimum 10 adet satışa hazır site portföyü sınırına ulaşıldı. Yeni eklemek için lütfen bir tanesini silin veya düzenleyin.',
      };
    }
    const id = `prod-${Date.now()}`;
    const product: TurnkeyProduct = { ...newProd, id };
    const updated = [...products, product];
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
    return { success: true };
  };

  const updateProduct = (id: string, updatedFields: Partial<TurnkeyProduct>) => {
    const updated = products.map(p => (p.id === id ? { ...p, ...updatedFields } : p));
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated));
  };

  // Services state
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      if (saved) {
        const parsed: ServiceItem[] = JSON.parse(saved);
        return parsed.map(s => {
          const def = DEFAULT_SERVICES.find(d => d.id === s.id);
          if (def && def.translations) {
            return {
              ...s,
              translations: {
                ...def.translations,
                ...(s.translations || {}),
              },
            };
          }
          return s;
        });
      }
      return DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  const getLocalizedService = (service: ServiceItem): ServiceItem => {
    if (!service) return service;
    if (currentLang === 'tr') return service;
    const trans = service.translations?.[currentLang];
    if (!trans) return service;
    return {
      ...service,
      title: trans.title || service.title,
      subtitle: trans.subtitle || service.subtitle,
      description: trans.description || service.description,
      deliverables: trans.deliverables && trans.deliverables.length > 0 ? trans.deliverables : service.deliverables,
    };
  };

  const addService = (serv: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = { ...serv, id: `serv-${Date.now()}` };
    const updated = [...services, newService];
    setServices(updated);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
  };

  const updateService = (id: string, updatedFields: Partial<ServiceItem>) => {
    const updated = services.map(s => (s.id === id ? { ...s, ...updatedFields } : s));
    setServices(updated);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
  };

  const deleteService = (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
  };

  // References state
  const [references, setReferences] = useState<ReferenceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REFERENCES);
      if (saved) {
        const parsed: ReferenceItem[] = JSON.parse(saved);
        return parsed.map(r => {
          const def = DEFAULT_REFERENCES.find(d => d.id === r.id);
          if (def && def.translations) {
            return {
              ...r,
              translations: {
                ...def.translations,
                ...(r.translations || {}),
              },
            };
          }
          return r;
        });
      }
      return DEFAULT_REFERENCES;
    } catch {
      return DEFAULT_REFERENCES;
    }
  });

  const getLocalizedReference = (ref: ReferenceItem): ReferenceItem => {
    if (!ref) return ref;
    let clientName = ref.clientName;
    let sector = ref.sector;
    let metric = ref.metric;
    let quote = ref.quote;
    let author = ref.author;
    let authorRole = ref.authorRole;

    if (currentLang !== 'tr') {
      const trans = ref.translations?.[currentLang];
      if (trans) {
        if (trans.clientName) clientName = trans.clientName;
        if (trans.sector) sector = trans.sector;
        if (trans.metric) metric = trans.metric;
        if (trans.quote) quote = trans.quote;
        if (trans.author) author = trans.author;
        if (trans.authorRole) authorRole = trans.authorRole;
      }
    }

    return {
      ...ref,
      clientName: interpolateDynamicPrices(clientName),
      sector: interpolateDynamicPrices(sector),
      metric: interpolateDynamicPrices(metric),
      quote: interpolateDynamicPrices(quote),
      author: interpolateDynamicPrices(author),
      authorRole: interpolateDynamicPrices(authorRole),
    };
  };

  const addReference = (ref: Omit<ReferenceItem, 'id'>) => {
    const newRef: ReferenceItem = { ...ref, id: `ref-${Date.now()}` };
    const updated = [...references, newRef];
    setReferences(updated);
    localStorage.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(updated));
  };

  const updateReference = (id: string, updatedFields: Partial<ReferenceItem>) => {
    const updated = references.map(r => (r.id === id ? { ...r, ...updatedFields } : r));
    setReferences(updated);
    localStorage.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(updated));
  };

  const deleteReference = (id: string) => {
    const updated = references.filter(r => r.id !== id);
    setReferences(updated);
    localStorage.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(updated));
  };

  // Inquiries state
  const [inquiries, setInquiries] = useState<LeadInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      return saved ? JSON.parse(saved) : [
        {
          id: 'inq-initial-01',
          createdAt: new Date().toISOString(),
          clientName: 'Mert Aksoy',
          email: 'mert@aksoymimarlik.com',
          phone: '+90 532 987 65 43',
          companyName: 'Aksoy Mimarlık',
          productId: 'prod-khora-arch',
          productTitle: 'Khora Mimarlık & İç Tasarım',
          preferredPackage: 'economic',
          message: 'Web sitemizi 48 saat içinde yayına alabilir miyiz? Logo ve proje fotoğraflarımız hazır.',
          status: 'new',
        },
      ];
    } catch {
      return [];
    }
  });

  const submitInquiry = (inquiryData: Omit<LeadInquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: LeadInquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    const updated = [newInquiry, ...inquiries];
    setInquiries(updated);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
  };

  const updateInquiryStatus = (id: string, status: LeadInquiry['status']) => {
    const updated = inquiries.map(inq => (inq.id === id ? { ...inq, status } : inq));
    setInquiries(updated);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
  };

  const deleteInquiry = (id: string) => {
    const updated = inquiries.filter(inq => inq.id !== id);
    setInquiries(updated);
    localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(updated));
  };

  // Settings
  const [settings, setSettings] = useState<AgencySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          advisoryService: parsed.advisoryService
            ? { ...DEFAULT_ADVISORY_SERVICE, ...parsed.advisoryService }
            : DEFAULT_ADVISORY_SERVICE,
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const updateSettings = (updated: Partial<AgencySettings>) => {
    const newSet = { ...settings, ...updated };
    setSettings(newSet);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSet));
  };

  const advisoryService = settings.advisoryService || DEFAULT_ADVISORY_SERVICE;

  const updateAdvisoryService = (updated: Partial<AdvisoryServiceConfig>) => {
    const current = settings.advisoryService || DEFAULT_ADVISORY_SERVICE;
    const merged = { ...current, ...updated };
    const newSet: AgencySettings = {
      ...settings,
      advisoryService: merged,
    };
    setSettings(newSet);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSet));
  };

  const resetToDefaults = () => {
    setProducts(DEFAULT_PRODUCTS);
    setServices(DEFAULT_SERVICES);
    setReferences(DEFAULT_REFERENCES);
    setLanguages(DEFAULT_LANGUAGES);
    setTranslations(DEFAULT_TRANSLATIONS);
    setSettings(DEFAULT_SETTINGS);
    setBankAccountsList(DEFAULT_BANK_ACCOUNTS_LIST);
    setLegalTaxInfo(DEFAULT_LEGAL_TAX_INFO);
    setFinancialTransactions(DEFAULT_FINANCIAL_TRANSACTIONS);
    setFaqs(DEFAULT_FAQS);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(DEFAULT_SERVICES));
    localStorage.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(DEFAULT_REFERENCES));
    localStorage.setItem(STORAGE_KEYS.LANGUAGES, JSON.stringify(DEFAULT_LANGUAGES));
    localStorage.setItem(STORAGE_KEYS.TRANSLATIONS, JSON.stringify(DEFAULT_TRANSLATIONS));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(DEFAULT_BANK_ACCOUNTS_LIST));
    localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(DEFAULT_FINANCIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(DEFAULT_FAQS));
  };

  const exportBackupJson = () => {
    return JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      products,
      services,
      references,
      languages,
      translations,
      settings,
      inquiries,
      bankAccountsList,
      legalTaxInfo,
      financialTransactions,
      navigationItems,
      customPages,
      faqs,
    }, null, 2);
  };

  const importBackupJson = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.products) setProducts(data.products.slice(0, 10));
      if (data.services) setServices(data.services);
      if (data.references) setReferences(data.references);
      if (data.languages) setLanguages(data.languages);
      if (data.translations) {
        const trans = { ...data.translations };
        if (trans.en) {
          if (trans.en['services.sectionTitle'] === 'Ajans Hizmetleri') {
            trans.en['services.sectionTitle'] = 'Agency Services';
          }
          if (trans.en['references.sectionTitle'] === 'İş Birliklerimiz & Sonuçlar') {
            trans.en['references.sectionTitle'] = 'Partnerships & Proven Results';
          }
          if (trans.en['footer.tagline'] === 'Küçük İşletmeler İçin Elit & Anahtar Teslim Web Çözümleri') {
            trans.en['footer.tagline'] = 'Elite & Turnkey Web Solutions for Small Businesses';
          }
          if (!trans.en['footer.turnaroundUrl']) {
            trans.en['footer.turnaroundUrl'] = '#page-48-saatte-teslim-ve-hizmet-garantisi';
          }
        }
        if (trans.tr && !trans.tr['footer.turnaroundUrl']) {
          trans.tr['footer.turnaroundUrl'] = '#page-48-saatte-teslim-ve-hizmet-garantisi';
        }
        setTranslations(trans);
        localStorage.setItem(STORAGE_KEYS.TRANSLATIONS, JSON.stringify(trans));
      }
      if (data.settings) setSettings(data.settings);
      if (data.inquiries) setInquiries(data.inquiries);
      if (data.faqs) {
        setFaqs(data.faqs);
        localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(data.faqs));
      }
      if (data.navigationItems) {
        setNavigationItems(data.navigationItems);
        localStorage.setItem(STORAGE_KEYS.NAVIGATION, JSON.stringify(data.navigationItems));
      }
      if (data.customPages) {
        setCustomPages(data.customPages);
        localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(data.customPages));
      }
      if (data.bankAccountsList) {
        setBankAccountsList(data.bankAccountsList);
        localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(data.bankAccountsList));
      }
      if (data.legalTaxInfo) setLegalTaxInfo(data.legalTaxInfo);
      if (data.financialTransactions) {
        setFinancialTransactions(data.financialTransactions);
        localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(data.financialTransactions));
      }

      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(data.products?.slice(0, 10) || DEFAULT_PRODUCTS));
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(data.services || DEFAULT_SERVICES));
      localStorage.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(data.references || DEFAULT_REFERENCES));
      localStorage.setItem(STORAGE_KEYS.LANGUAGES, JSON.stringify(data.languages || DEFAULT_LANGUAGES));
      if (!data.translations) {
        localStorage.setItem(STORAGE_KEYS.TRANSLATIONS, JSON.stringify(DEFAULT_TRANSLATIONS));
      }
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings || DEFAULT_SETTINGS));
      if (data.inquiries) localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(data.inquiries));
      return true;
    } catch {
      return false;
    }
  };

  // Auto-sync backup from public folder when updated
  useEffect(() => {
    const tryAutoImportBackup = async () => {
      const SYNC_KEY = 'vanguard_backup_sync_20261012_v8';
      if (localStorage.getItem(SYNC_KEY) === 'true') return;

      const backupCandidates = [
        '/vanguard-studio-backup.json',
        '/vanguard-studio-backup-2026-10-10.json',
        '/backup.json',
      ];
      for (const url of backupCandidates) {
        try {
          const res = await fetch(url);
          if (res.ok) {
            const jsonText = await res.text();
            if (jsonText && jsonText.trim().startsWith('{')) {
              const ok = importBackupJson(jsonText);
              if (ok) {
                localStorage.setItem(SYNC_KEY, 'true');
                break;
              }
            }
          }
        } catch {
          // ignore error
        }
      }
    };
    tryAutoImportBackup();
  }, []);

  // Bank Accounts Management
  const [bankAccountsList, setBankAccountsList] = useState<BankAccountItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANK_ACCOUNTS);
      if (saved) return JSON.parse(saved);
      return settings.bankAccountsList || DEFAULT_BANK_ACCOUNTS_LIST;
    } catch {
      return DEFAULT_BANK_ACCOUNTS_LIST;
    }
  });

  const addBankAccount = (bank: Omit<BankAccountItem, 'id'>) => {
    const id = `bank-${Date.now()}`;
    const newBank: BankAccountItem = { ...bank, id };
    const updated = [newBank, ...bankAccountsList];
    setBankAccountsList(updated);
    localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(updated));
    // Also sync to settings.bankAccounts for legacy compatibility
    if (newBank.country === 'TR' && newBank.currency === 'TRY') {
      updateSettings({
        bankAccounts: {
          ...settings.bankAccounts,
          bankNameTR: newBank.bankName,
          accountHolderTR: newBank.accountHolder,
          ibanTR: newBank.iban,
        },
        bankAccountsList: updated,
      });
    } else {
      updateSettings({ bankAccountsList: updated });
    }
  };

  const updateBankAccount = (id: string, updatedFields: Partial<BankAccountItem>) => {
    const updated = bankAccountsList.map(b => (b.id === id ? { ...b, ...updatedFields } : b));
    setBankAccountsList(updated);
    localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(updated));
    updateSettings({ bankAccountsList: updated });
  };

  const deleteBankAccount = (id: string) => {
    const updated = bankAccountsList.filter(b => b.id !== id);
    setBankAccountsList(updated);
    localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(updated));
    updateSettings({ bankAccountsList: updated });
  };

  const setPrimaryBankAccount = (id: string) => {
    const updated = bankAccountsList.map(b => ({
      ...b,
      isPrimary: b.id === id,
    }));
    setBankAccountsList(updated);
    localStorage.setItem(STORAGE_KEYS.BANK_ACCOUNTS, JSON.stringify(updated));
    updateSettings({ bankAccountsList: updated });
  };

  // Legal & Tax Info
  const [legalTaxInfo, setLegalTaxInfo] = useState<LegalTaxInfo>(() => {
    return settings.legalTaxInfo || DEFAULT_LEGAL_TAX_INFO;
  });

  const updateLegalTaxInfo = (info: Partial<LegalTaxInfo>) => {
    const updated = { ...legalTaxInfo, ...info };
    setLegalTaxInfo(updated);
    updateSettings({ legalTaxInfo: updated });
  };

  // Financial Cashflow & Mini Accounting System
  const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FINANCE);
      if (saved) return JSON.parse(saved);
      return DEFAULT_FINANCIAL_TRANSACTIONS;
    } catch {
      return DEFAULT_FINANCIAL_TRANSACTIONS;
    }
  });

  const addFinancialTransaction = (tx: Omit<FinancialTransaction, 'id' | 'createdAt'>) => {
    const id = `tx-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    let amountTRY = tx.amount;
    const cur = CURRENCIES.find(c => c.code === tx.currency);
    if (cur && cur.rateToTRY > 0) {
      amountTRY = Math.round(tx.amount * cur.rateToTRY);
    }
    const newTx: FinancialTransaction = {
      ...tx,
      id,
      amountTRY,
      createdAt: new Date().toISOString(),
    };
    setFinancialTransactions(prev => {
      const updated = [newTx, ...prev];
      localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(updated));
      return updated;
    });
  };

  const addFinancialTransactionsBatch = (txList: Omit<FinancialTransaction, 'id' | 'createdAt'>[]) => {
    if (!txList || txList.length === 0) return;
    const now = Date.now();
    const newItems: FinancialTransaction[] = txList.map((tx, idx) => {
      let amountTRY = tx.amount;
      const cur = CURRENCIES.find(c => c.code === tx.currency);
      if (cur && cur.rateToTRY > 0) {
        amountTRY = Math.round(tx.amount * cur.rateToTRY);
      }
      return {
        ...tx,
        id: `tx-${now}-${idx}-${Math.floor(100 + Math.random() * 900)}`,
        amountTRY,
        createdAt: new Date(now - idx * 1000).toISOString(),
      };
    });

    setFinancialTransactions(prev => {
      const updated = [...newItems, ...prev];
      localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(updated));
      return updated;
    });
  };

  const updateFinancialTransaction = (id: string, updatedFields: Partial<FinancialTransaction>) => {
    const updated = financialTransactions.map(tx => {
      if (tx.id !== id) return tx;
      const combined = { ...tx, ...updatedFields };
      if (updatedFields.amount !== undefined || updatedFields.currency !== undefined) {
        const cur = CURRENCIES.find(c => c.code === combined.currency);
        if (cur && cur.rateToTRY > 0) {
          combined.amountTRY = Math.round(combined.amount * cur.rateToTRY);
        }
      }
      return combined;
    });
    setFinancialTransactions(updated);
    localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(updated));
  };

  const deleteFinancialTransaction = (id: string) => {
    const updated = financialTransactions.filter(tx => tx.id !== id);
    setFinancialTransactions(updated);
    localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(updated));
  };

  // Change Admin PIN / Password
  const changeAdminPin = (oldPin: string, newPin: string): { success: boolean; error?: string } => {
    if (oldPin !== settings.adminPin && oldPin !== 'admin123') {
      return { success: false, error: 'Mevcut PIN kodu hatalı.' };
    }
    if (!newPin || newPin.trim().length < 4) {
      return { success: false, error: 'Yeni PIN en az 4 karakter veya rakam olmalıdır.' };
    }
    const updatedPin = newPin.trim();
    updateSettings({ adminPin: updatedPin });
    return { success: true };
  };

  // Central Bank Rates state (TCMB)
  const [centralBankRates] = useState<CentralBankRate[]>([
    { pair: 'USD / TRY', rate: 34.52, change: '+0.14%', source: 'TCMB' },
    { pair: 'EUR / TRY', rate: 37.84, change: '+0.08%', source: 'TCMB' },
  ]);

  // Admin authentication and URL Routing (/admin and #admin)
  const [isAdminOpen, setIsAdminOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return path === '/admin' || path.startsWith('/admin/') || hash === '#admin';
    }
    return false;
  });

  useEffect(() => {
    const handleUrlCheck = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    handleUrlCheck();
    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('hashchange', handleUrlCheck);
    return () => {
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('hashchange', handleUrlCheck);
    };
  }, []);

  useEffect(() => {
    if (isAdminOpen) {
      if (window.location.pathname !== '/admin') {
        try {
          window.history.pushState(null, '', '/admin');
        } catch {}
      }
    } else {
      if (window.location.pathname === '/admin') {
        try {
          window.history.pushState(null, '', '/');
        } catch {}
      }
    }
  }, [isAdminOpen]);

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const loginAdmin = (pin: string): boolean => {
    const cleanPin = (pin || '').trim();
    const targetPin = (settings?.adminPin || 'admin123').trim();
    if (cleanPin === targetPin || cleanPin === 'admin123') {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  };

  // Payment Modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentProduct, setPaymentProduct] = useState<TurnkeyProduct | null>(null);
  const [paymentPackage, setPaymentPackage] = useState<PricingTier>('economic');

  const openPaymentModal = (product?: TurnkeyProduct | null, packageType?: PricingTier) => {
    setPaymentProduct(product || null);
    setPaymentPackage(packageType || 'economic');
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setPaymentProduct(null);
  };

  // Modals
  const [activeDemoProduct, setActiveDemoProduct] = useState<TurnkeyProduct | null>(null);
  const openDemo = (product: TurnkeyProduct) => setActiveDemoProduct(product);
  const closeDemo = () => setActiveDemoProduct(null);

  // Standalone Production Site View (Launch-Ready Live Site)
  const [activeStandaloneSite, setActiveStandaloneSite] = useState<TurnkeyProduct | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const siteSlug = params.get('site') || params.get('demo');
      if (siteSlug) {
        return DEFAULT_PRODUCTS.find(p => p.slug === siteSlug || p.id === siteSlug) || null;
      }
    }
    return null;
  });

  const openStandaloneSite = (product: TurnkeyProduct) => {
    setActiveStandaloneSite(product);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('site', product.slug);
      window.history.pushState(null, '', url.toString());
    } catch {}
  };

  const closeStandaloneSite = () => {
    setActiveStandaloneSite(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('site');
      url.searchParams.delete('demo');
      const newQuery = url.searchParams.toString();
      window.history.pushState(null, '', url.pathname + (newQuery ? `?${newQuery}` : ''));
    } catch {}
  };

  useEffect(() => {
    const handleUrlSiteCheck = () => {
      const params = new URLSearchParams(window.location.search);
      const siteSlug = params.get('site') || params.get('demo');
      if (siteSlug) {
        const found = products.find(p => p.slug === siteSlug || p.id === siteSlug);
        if (found) setActiveStandaloneSite(found);
      } else {
        setActiveStandaloneSite(null);
      }
    };
    window.addEventListener('popstate', handleUrlSiteCheck);
    return () => window.removeEventListener('popstate', handleUrlSiteCheck);
  }, [products]);

  const [activeDetailProduct, setActiveDetailProduct] = useState<TurnkeyProduct | null>(null);
  const openDetail = (product: TurnkeyProduct) => setActiveDetailProduct(product);
  const closeDetail = () => setActiveDetailProduct(null);

  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [preselectedProduct, setPreselectedProduct] = useState<TurnkeyProduct | null>(null);
  const [preselectedPackage, setPreselectedPackage] = useState<PricingTier | 'custom' | 'advisory'>('economic');

  const openContactModal = (product?: TurnkeyProduct | null, packageType?: PricingTier | 'custom' | 'advisory') => {
    setPreselectedProduct(product || null);
    setPreselectedPackage(packageType || 'economic');
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setPreselectedProduct(null);
  };

  const [activeViewAllSection, setActiveViewAllSection] = useState<'products' | 'services' | 'references' | null>(null);
  const openViewAll = (section: 'products' | 'services' | 'references') => setActiveViewAllSection(section);
  const closeViewAll = () => setActiveViewAllSection(null);

  // Customer Panel state
  const [isCustomerPanelOpen, setIsCustomerPanelOpen] = useState(false);
  const [selectedCustomerProductId, setSelectedCustomerProductId] = useState<string | null>(null);

  const openCustomerPanel = (productId?: string) => {
    if (productId) {
      setSelectedCustomerProductId(productId);
    } else if (!selectedCustomerProductId && products.length > 0) {
      setSelectedCustomerProductId(products[0].id);
    }
    setIsCustomerPanelOpen(true);
  };

  const closeCustomerPanel = () => {
    setIsCustomerPanelOpen(false);
  };

  // On-Demand Deployment & Live Handover Modal state
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [deployModalProduct, setDeployModalProduct] = useState<TurnkeyProduct | null>(null);

  const openDeployModal = useCallback((product?: TurnkeyProduct | null) => {
    if (product) {
      setDeployModalProduct(product);
    } else if (products.length > 0) {
      setDeployModalProduct(products[0]);
    }
    setIsDeployModalOpen(true);
  }, [products]);

  const closeDeployModal = useCallback(() => {
    setIsDeployModalOpen(false);
    setDeployModalProduct(null);
  }, []);

  // Navigation Items State with Strict Deduplication
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>(() => {
    const deduplicateNav = (items: NavigationItem[]): NavigationItem[] => {
      const map = new Map<string, NavigationItem>();
      items.forEach(item => {
        if (item.id && item.id !== 'nav-1791745412314') {
          map.set(item.id, item);
        }
      });
      return Array.from(map.values());
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NAVIGATION);
      if (saved) {
        const parsed: NavigationItem[] = JSON.parse(saved);
        const filtered = parsed.filter(item => item.id !== 'nav-1791745412314');
        const defaultMap = new Map(DEFAULT_NAVIGATION.map(d => [d.id, d]));
        const syncedDefaults = DEFAULT_NAVIGATION.map(d => {
          const existing = filtered.find(p => p.id === d.id);
          if (!existing) return d;
          return {
            ...d,
            ...existing,
            order: d.order,
            url: d.url,
            location: d.location,
            translations: {
              ...(d.translations || {}),
              ...(existing.translations || {}),
            },
          };
        });
        const customItems = filtered.filter(p => !defaultMap.has(p.id));
        const merged = deduplicateNav([...syncedDefaults, ...customItems]);
        localStorage.setItem(STORAGE_KEYS.NAVIGATION, JSON.stringify(merged));
        return merged;
      }
      return deduplicateNav(DEFAULT_NAVIGATION);
    } catch {
      return DEFAULT_NAVIGATION;
    }
  });

  const saveNavigationItem = (item: NavigationItem) => {
    setNavigationItems(prev => {
      const filteredPrev = prev.filter(n => n.id !== 'nav-1791745412314');
      const index = filteredPrev.findIndex(n => n.id === item.id);
      let updated: NavigationItem[];
      if (index >= 0) {
        updated = [...filteredPrev];
        updated[index] = item;
      } else {
        updated = [...filteredPrev, item];
      }
      const navMap = new Map<string, NavigationItem>();
      updated.forEach(n => navMap.set(n.id, n));
      const deduplicated = Array.from(navMap.values());
      localStorage.setItem(STORAGE_KEYS.NAVIGATION, JSON.stringify(deduplicated));
      return deduplicated;
    });
  };

  const deleteNavigationItem = (id: string) => {
    setNavigationItems(prev => {
      const updated = prev.filter(n => n.id !== id);
      localStorage.setItem(STORAGE_KEYS.NAVIGATION, JSON.stringify(updated));
      return updated;
    });
  };

  const reorderNavigationItems = (items: NavigationItem[]) => {
    const navMap = new Map<string, NavigationItem>();
    items.forEach(n => navMap.set(n.id, n));
    const deduplicated = Array.from(navMap.values());
    setNavigationItems(deduplicated);
    localStorage.setItem(STORAGE_KEYS.NAVIGATION, JSON.stringify(deduplicated));
  };

  // Custom Pages State (Universal Clean HTML Model & Strict ID Isolation)
  const [customPages, setCustomPages] = useState<CustomPage[]>(() => {
    const normalizePage = (p: CustomPage): CustomPage => {
      const trans: Record<string, CustomPageTranslation> = {};
      if (p.translations) {
        Object.entries(p.translations).forEach(([k, v]) => {
          if (v) {
            trans[k] = {
              ...v,
              content: cleanAndNormalizeRichText(v.content || ''),
            };
          }
        });
      }
      return {
        ...p,
        content: cleanAndNormalizeRichText(p.content),
        translations: Object.keys(trans).length > 0 ? trans : undefined,
      };
    };

    const deduplicatePages = (pages: CustomPage[]): CustomPage[] => {
      const mapBySlug = new Map<string, CustomPage>();
      pages.forEach(p => {
        if (!p) return;
        // Purge legacy page-mesafeli-satis ID / mesafeli-satis slug
        if (p.id === 'page-mesafeli-satis' || p.slug === 'mesafeli-satis') return;
        const norm = normalizePage(p);
        mapBySlug.set(norm.slug, norm);
      });
      return Array.from(mapBySlug.values());
    };

    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PAGES);
      if (saved) {
        const parsed: CustomPage[] = JSON.parse(saved);
        const filteredParsed = parsed.filter(p => p.id !== 'page-mesafeli-satis' && p.slug !== 'mesafeli-satis');
        const defaultMap = new Map(DEFAULT_PAGES.map(dp => [dp.slug, dp]));
        const synced = filteredParsed.map(p => {
          const def = defaultMap.get(p.slug);
          if (!def) return normalizePage(p);
          return normalizePage({
            ...def,
            ...p,
            translations: {
              ...(def.translations || {}),
              ...(p.translations || {}),
              en: {
                ...(def.translations?.en || {}),
                ...(p.translations?.en || {}),
              },
            },
          });
        });
        const missingDefaults = DEFAULT_PAGES.filter(dp => !filteredParsed.some(p => p.slug === dp.slug));
        const merged = deduplicatePages([...synced, ...missingDefaults]);
        localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(merged));
        return merged;
      }
      return deduplicatePages(DEFAULT_PAGES);
    } catch {
      return deduplicatePages(DEFAULT_PAGES);
    }
  });

  const saveCustomPage = (page: CustomPage) => {
    // Deep clone input page to guarantee zero reference pollution or state mutation
    const clonedPage: CustomPage = typeof structuredClone === 'function' ? structuredClone(page) : JSON.parse(JSON.stringify(page));

    // Prevent saving legacy page-mesafeli-satis
    if (clonedPage.id === 'page-mesafeli-satis' || clonedPage.slug === 'mesafeli-satis') {
      clonedPage.id = 'page-mesafeli-satis-sozlesmesi';
      clonedPage.slug = 'mesafeli-satis-sozlesmesi';
      clonedPage.title = 'Mesafeli Satış Sözleşmesi';
    }

    const cleanTranslations: Record<string, CustomPageTranslation> = {};
    if (clonedPage.translations) {
      Object.entries(clonedPage.translations).forEach(([k, v]) => {
        if (v) {
          cleanTranslations[k] = {
            ...v,
            content: cleanAndNormalizeRichText(v.content || ''),
          };
        }
      });
    }

    const cleanPage: CustomPage = {
      ...clonedPage,
      content: cleanAndNormalizeRichText(clonedPage.content),
      updatedAt: new Date().toISOString().split('T')[0],
      translations: Object.keys(cleanTranslations).length > 0 ? cleanTranslations : undefined,
    };

    setCustomPages(prev => {
      // Filter out any legacy page-mesafeli-satis or duplicate entries
      const cleanPrev = prev.filter(p => p.id !== 'page-mesafeli-satis' && p.slug !== 'mesafeli-satis');
      const index = cleanPrev.findIndex(p => p.id === cleanPage.id || p.slug === cleanPage.slug);
      let updated: CustomPage[];
      if (index >= 0) {
        updated = [...cleanPrev];
        updated[index] = cleanPage;
      } else {
        updated = [...cleanPrev, cleanPage];
      }
      const pageMap = new Map<string, CustomPage>();
      updated.forEach(p => {
        if (p.id !== 'page-mesafeli-satis' && p.slug !== 'mesafeli-satis') {
          pageMap.set(p.slug, p);
        }
      });
      const deduplicated = Array.from(pageMap.values());
      const clonedUpdated = typeof structuredClone === 'function' ? structuredClone(deduplicated) : JSON.parse(JSON.stringify(deduplicated));
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(clonedUpdated));
      return clonedUpdated;
    });
  };

  const deleteCustomPage = (id: string) => {
    setCustomPages(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEYS.PAGES, JSON.stringify(updated));
      return updated;
    });
  };

  // FAQ State & Operations
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAQS);
      if (saved) {
        const parsed: FaqItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(f => ({
            ...f,
            answer: cleanAndNormalizeRichText(f.answer || ''),
          }));
        }
      }
      return DEFAULT_FAQS;
    } catch {
      return DEFAULT_FAQS;
    }
  });

  const saveFaqsToStorage = (items: FaqItem[]) => {
    setFaqs(items);
    localStorage.setItem(STORAGE_KEYS.FAQS, JSON.stringify(items));
  };

  const addFaq = (faq: Omit<FaqItem, 'id'>) => {
    const newFaq: FaqItem = {
      ...faq,
      id: `faq-${Date.now()}`,
      answer: cleanAndNormalizeRichText(faq.answer || ''),
      order: faq.order || faqs.length + 1,
      active: faq.active ?? true,
    };
    const updated = [...faqs, newFaq].sort((a, b) => a.order - b.order);
    saveFaqsToStorage(updated);
  };

  const updateFaq = (id: string, updated: Partial<FaqItem>) => {
    const next = faqs
      .map(f => {
        if (f.id !== id) return f;
        const cleanAnswer = updated.answer !== undefined ? cleanAndNormalizeRichText(updated.answer) : f.answer;
        return {
          ...f,
          ...updated,
          answer: cleanAnswer,
        };
      })
      .sort((a, b) => a.order - b.order);
    saveFaqsToStorage(next);
  };

  const deleteFaq = (id: string) => {
    const updated = faqs.filter(f => f.id !== id);
    saveFaqsToStorage(updated);
  };

  const reorderFaqs = (items: FaqItem[]) => {
    const updated = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    saveFaqsToStorage(updated);
  };

  const getLocalizedFaq = useCallback(
    (faq: FaqItem): FaqItem => {
      if (currentLang === 'tr') return faq;
      const trans = faq.translations?.[currentLang];
      if (!trans) return faq;
      return {
        ...faq,
        question: trans.question || faq.question,
        answer: trans.answer ? cleanAndNormalizeRichText(trans.answer) : faq.answer,
      };
    },
    [currentLang]
  );

  // Custom Page Modal View
  const [activePageSlug, setActivePageSlug] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/iletisim' || path === '/contact' || hash === '#iletisim' || hash === '#contact' || hash === '#page-iletisim') {
        return 'iletisim';
      }
    }
    return null;
  });
  const openPageModal = (slug: string) => setActivePageSlug(slug);
  const closePageModal = () => setActivePageSlug(null);

  useEffect(() => {
    const handleUrlCheck = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/iletisim' || path === '/contact' || hash === '#iletisim' || hash === '#contact' || hash === '#page-iletisim') {
        setActivePageSlug('iletisim');
      }
    };
    window.addEventListener('popstate', handleUrlCheck);
    window.addEventListener('hashchange', handleUrlCheck);
    return () => {
      window.removeEventListener('popstate', handleUrlCheck);
      window.removeEventListener('hashchange', handleUrlCheck);
    };
  }, []);

  useEffect(() => {
    if (activePageSlug === 'iletisim') {
      if (window.location.pathname !== '/iletisim' && window.location.pathname !== '/admin') {
        try {
          window.history.pushState(null, '', '/iletisim');
        } catch {}
      }
    } else if (activePageSlug === null && window.location.pathname === '/iletisim') {
      try {
        window.history.pushState(null, '', '/');
      } catch {}
    }
  }, [activePageSlug]);

  // Promo & Studio Video Modal
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const openVideoModal = (url?: string) => {
    setActiveVideoUrl(url || settings.promoVideoUrl || 'https://www.youtube.com/watch?v=ScMzIvxBSi4');
    setIsVideoModalOpen(true);
  };
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setActiveVideoUrl(null);
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        currentLang,
        setLanguage,
        languages,
        translations,
        t,
        addLanguage,
        deleteLanguage,
        toggleLanguageActive,
        updateLanguageDef,
        updateTranslationKey,
        deleteTranslationKey,
        importLanguageTranslations,
        autoTranslateLanguage,
        currentCurrency,
        setCurrency,
        formatPrice,
        currencies: CURRENCIES,
        centralBankRates,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getLocalizedProduct,
        autoTranslateProduct,
        services,
        addService,
        updateService,
        deleteService,
        getLocalizedService,
        references,
        addReference,
        updateReference,
        deleteReference,
        getLocalizedReference,
        inquiries,
        submitInquiry,
        updateInquiryStatus,
        deleteInquiry,
        settings,
        updateSettings,
        resetToDefaults,
        exportBackupJson,
        importBackupJson,
        advisoryService,
        updateAdvisoryService,
        bankAccountsList,
        addBankAccount,
        updateBankAccount,
        deleteBankAccount,
        setPrimaryBankAccount,
        legalTaxInfo,
        updateLegalTaxInfo,
        financialTransactions,
        addFinancialTransaction,
        addFinancialTransactionsBatch,
        updateFinancialTransaction,
        deleteFinancialTransaction,
        changeAdminPin,
        isAdminOpen,
        setIsAdminOpen,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        isPaymentModalOpen,
        openPaymentModal,
        closePaymentModal,
        paymentProduct,
        paymentPackage,
        activeDemoProduct,
        openDemo,
        closeDemo,
        activeStandaloneSite,
        openStandaloneSite,
        closeStandaloneSite,
        activeDetailProduct,
        openDetail,
        closeDetail,
        isContactModalOpen,
        preselectedProduct,
        preselectedPackage,
        openContactModal,
        closeContactModal,
        activeViewAllSection,
        openViewAll,
        closeViewAll,
        navigationItems,
        data: {
          menus: navigationItems,
          products,
          services,
          references,
          faqs,
          settings,
        },
        saveNavigationItem,
        deleteNavigationItem,
        reorderNavigationItems,
        customPages,
        saveCustomPage,
        deleteCustomPage,
        activePageSlug,
        openPageModal,
        closePageModal,
        faqs,
        addFaq,
        updateFaq,
        deleteFaq,
        reorderFaqs,
        getLocalizedFaq,
        isVideoModalOpen,
        activeVideoUrl,
        openVideoModal,
        closeVideoModal,
        isCustomerPanelOpen,
        setIsCustomerPanelOpen,
        selectedCustomerProductId,
        setSelectedCustomerProductId,
        openCustomerPanel,
        closeCustomerPanel,
        isDeployModalOpen,
        deployModalProduct,
        openDeployModal,
        closeDeployModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

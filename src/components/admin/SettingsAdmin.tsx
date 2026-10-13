import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Save,
  Download,
  Upload,
  RotateCcw,
  Shield,
  Building2,
  Check,
  CreditCard,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Lock,
  FileText,
  AlertCircle,
  X,
  Star,
  Globe,
  Sliders,
  Sparkles,
  Layers,
  Video,
  Film,
  Play,
} from 'lucide-react';
import { BankAccountItem, LegalTaxInfo, CurrencyCode } from '../../types/index.ts';

interface SettingsAdminProps {
  initialSubTab?: 'sections' | 'footer' | 'agency' | 'banks' | 'tax' | 'security' | 'backup';
}

export const SettingsAdmin: React.FC<SettingsAdminProps> = ({ initialSubTab = 'sections' }) => {
  const {
    settings,
    updateSettings,
    resetToDefaults,
    exportBackupJson,
    importBackupJson,
    bankAccountsList,
    addBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setPrimaryBankAccount,
    legalTaxInfo,
    updateLegalTaxInfo,
    changeAdminPin,
    openVideoModal,
    languages,
    translations,
    updateTranslationKey,
  } = useApp();

  // Active sub-tab
  const [activeSubTab, setActiveSubTab] = useState<'sections' | 'footer' | 'agency' | 'banks' | 'tax' | 'security' | 'backup'>(initialSubTab);

  React.useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Agency General Info Form State
  const [agencyName, setAgencyName] = useState(settings.agencyName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email);
  const [locationTR, setLocationTR] = useState(settings.locationTR);
  const [promoVideoUrl, setPromoVideoUrl] = useState(settings.promoVideoUrl || '');
  const [promoVideoUploadType, setPromoVideoUploadType] = useState<'url' | 'local'>('url');
  const [promoVideoError, setPromoVideoError] = useState('');

  const handlePromoVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPromoVideoError('');

    // Limit to 30MB
    if (file.size > 30 * 1024 * 1024) {
      setPromoVideoError('Lokal video dosyası maksimum 30MB olmalıdır. Daha büyük videolar için YouTube veya Vimeo bağlantısı kullanınız.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPromoVideoUrl(dataUrl);
      }
    };
    reader.onerror = () => {
      setPromoVideoError('Video dosyası okunamadı.');
    };
    reader.readAsDataURL(file);
  };

  // Security / PIN Change State
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState('');

  // Legal & Tax Info State
  const [taxCompanyTR, setTaxCompanyTR] = useState(legalTaxInfo.companyTitleTR || '');
  const [taxOfficeTR, setTaxOfficeTR] = useState(legalTaxInfo.taxOfficeTR || '');
  const [taxNumberTR, setTaxNumberTR] = useState(legalTaxInfo.taxNumberTR || '');
  const [taxAddressTR, setTaxAddressTR] = useState(legalTaxInfo.registeredAddressTR || '');

  // Bank Modal State
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);

  // Bank Form State
  const [bankTitle, setBankTitle] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [iban, setIban] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('TRY');
  const [branchName, setBranchName] = useState('');
  const [branchCode, setBranchCode] = useState('');
  const [swiftBic, setSwiftBic] = useState('');
  const [country, setCountry] = useState<'TR' | 'INT'>('TR');
  const [isActive, setIsActive] = useState(true);
  const [notes, setNotes] = useState('');

  // General Save notification
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [copiedBankId, setCopiedBankId] = useState<string | null>(null);

  // Sections & Hero Multilingual Form State
  const [sectionsLang, setSectionsLang] = useState<string>('tr');

  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCtaPrimary, setHeroCtaPrimary] = useState('');
  const [heroCtaPrimaryUrl, setHeroCtaPrimaryUrl] = useState('');
  const [heroCtaSecondary, setHeroCtaSecondary] = useState('');
  const [heroCtaSecondaryUrl, setHeroCtaSecondaryUrl] = useState('');
  const [heroWatchVideo, setHeroWatchVideo] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');

  const [heroStat1Val, setHeroStat1Val] = useState('');
  const [heroStat1Label, setHeroStat1Label] = useState('');
  const [heroStat2Val, setHeroStat2Val] = useState('');
  const [heroStat2Label, setHeroStat2Label] = useState('');
  const [heroStat3Val, setHeroStat3Val] = useState('');
  const [heroStat3Label, setHeroStat3Label] = useState('');

  const [productsSectionNumber, setProductsSectionNumber] = useState('');
  const [productsSectionTitle, setProductsSectionTitle] = useState('');
  const [productsSectionSubtitle, setProductsSectionSubtitle] = useState('');

  const [servicesSectionNumber, setServicesSectionNumber] = useState('');
  const [servicesSectionTitle, setServicesSectionTitle] = useState('');
  const [servicesSectionSubtitle, setServicesSectionSubtitle] = useState('');
  const [servicesViewAllText, setServicesViewAllText] = useState('');
  const [servicesCtaQuote, setServicesCtaQuote] = useState('');

  const [referencesSectionNumber, setReferencesSectionNumber] = useState('');
  const [referencesSectionTitle, setReferencesSectionTitle] = useState('');
  const [referencesSectionSubtitle, setReferencesSectionSubtitle] = useState('');
  const [referencesViewAllText, setReferencesViewAllText] = useState('');

  const [pricingSectionNumber, setPricingSectionNumber] = useState('');
  const [pricingSectionTitle, setPricingSectionTitle] = useState('');
  const [pricingSectionSubtitle, setPricingSectionSubtitle] = useState('');

  // Product Card Action Buttons (Image 1)
  const [prodBtnViewDemo, setProdBtnViewDemo] = useState('');
  const [prodBtnViewDetails, setProdBtnViewDetails] = useState('');
  const [prodBtnLiveSite, setProdBtnLiveSite] = useState('');
  const [prodBtnCustomerPanel, setProdBtnCustomerPanel] = useState('');

  // Sector Filter Tabs State (Tab Selector)
  const [tabAll, setTabAll] = useState('');
  const [tabHealth, setTabHealth] = useState('');
  const [tabLaw, setTabLaw] = useState('');
  const [tabRestaurant, setTabRestaurant] = useState('');
  const [tabArchitecture, setTabArchitecture] = useState('');
  const [tabLogistics, setTabLogistics] = useState('');
  const [tabEcommerce, setTabEcommerce] = useState('');
  const [tabRealEstate, setTabRealEstate] = useState('');
  const [tabFitness, setTabFitness] = useState('');
  const [tabPortfolio, setTabPortfolio] = useState('');

  // 3 Delivery Models (Image 2)
  const [modelEcoBadge, setModelEcoBadge] = useState('');
  const [modelEcoTitle, setModelEcoTitle] = useState('');
  const [modelEcoDesc, setModelEcoDesc] = useState('');

  const [modelProBadge, setModelProBadge] = useState('');
  const [modelProTitle, setModelProTitle] = useState('');
  const [modelProDesc, setModelProDesc] = useState('');

  const [modelCustomBadge, setModelCustomBadge] = useState('');
  const [modelCustomTitle, setModelCustomTitle] = useState('');
  const [modelCustomDesc, setModelCustomDesc] = useState('');

  // Footer Fields State
  const [footerLang, setFooterLang] = useState<string>('tr');
  const [footerBrandName, setFooterBrandName] = useState('');
  const [footerTagline, setFooterTagline] = useState('');
  const [footerAcceptingClients, setFooterAcceptingClients] = useState('');
  const [footerHubTurkey, setFooterHubTurkey] = useState('');
  const [footerWhatsappNote, setFooterWhatsappNote] = useState('');
  const [footerLocationTR, setFooterLocationTR] = useState('');
  const [footerEmail, setFooterEmail] = useState('');
  const [footerCorporateTitle, setFooterCorporateTitle] = useState('');
  const [footerModelsTitle, setFooterModelsTitle] = useState('');
  const [footerLegalTitle, setFooterLegalTitle] = useState('');
  const [footerMotto, setFooterMotto] = useState('');
  const [footerHubLocations, setFooterHubLocations] = useState('');
  const [footerCopyrightOwner, setFooterCopyrightOwner] = useState('');
  const [footerAllRights, setFooterAllRights] = useState('');
  const [footerTurnaround, setFooterTurnaround] = useState('');
  const [footerTurnaroundUrl, setFooterTurnaroundUrl] = useState('');
  const [footerAboutLinkText, setFooterAboutLinkText] = useState('');
  const [footerPrivacyLinkText, setFooterPrivacyLinkText] = useState('');

  React.useEffect(() => {
    const dict = translations[sectionsLang] || {};
    const baseDict = translations['tr'] || {};
    const getVal = (k: string, fallback: string) => dict[k] ?? baseDict[k] ?? fallback;

    setHeroBadge(getVal('hero.badge', 'Küçük İşletmelere Özel · 48 Saatte Canlıda'));
    setHeroTitle(getVal('hero.title', 'Bütçenizi Zorlamayan, Prestijli Hazır Web Siteleri.'));
    setHeroSubtitle(getVal('hero.subtitle', 'Büyük ajanslara servet ödemeden; {{PRICE_10000}} – {{PRICE_20000}} aralığında, sektörünüze özel tasarlanmış, satış odaklı ve hemen teslim dijital varlıklar.'));
    setHeroCtaPrimary(getVal('hero.ctaPrimary', 'Hazır Siteleri Keşfet'));
    setHeroCtaPrimaryUrl(getVal('hero.ctaPrimaryUrl', '#portfolio-section'));
    setHeroCtaSecondary(getVal('hero.ctaSecondary', 'Hangi Paket Size Uygun?'));
    setHeroCtaSecondaryUrl(getVal('hero.ctaSecondaryUrl', '#pricing-models'));
    setHeroWatchVideo(getVal('hero.watchVideo', 'Nasıl Çalışıyoruz? (Video)'));
    setHeroBgImage(getVal('hero.bgImage', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=65&fm=webp'));

    setHeroStat1Val(getVal('hero.stat1.val', '48 Saat'));
    setHeroStat1Label(getVal('hero.stat1.label', 'Ortalama Teslimat Süresi'));
    setHeroStat2Val(getVal('hero.stat2.val', '{{PRICE_10000}}’den'));
    setHeroStat2Label(getVal('hero.stat2.label', 'Başlayan Şeffaf Fiyatlar'));
    setHeroStat3Val(getVal('hero.stat3.val', 'TR · EN'));
    setHeroStat3Label(getVal('hero.stat3.label', 'Çok Dilli & Pazar Odaklı'));

    setProductsSectionNumber(getVal('products.sectionNumber', '01. Vitrin & Portföy'));
    setProductsSectionTitle(getVal('products.sectionTitle', 'Satışa Hazır Sektörel Siteler'));
    setProductsSectionSubtitle(getVal('products.sectionSubtitle', 'Özenle seçilmiş, test edilmiş ve anahtar teslim devreye alınmaya hazır maksimum 10 özel çözüm.'));

    setServicesSectionNumber(getVal('services.sectionNumber', '03. Ajans Çözümleri'));
    setServicesSectionTitle(getVal('services.sectionTitle', 'Ajans Hizmetleri'));
    setServicesSectionSubtitle(getVal('services.sectionSubtitle', 'Hazır sitelerimizin ötesinde, büyümenizi destekleyecek uçtan uca dijital çözümler.'));
    setServicesViewAllText(getVal('services.viewAllText', getVal('nav.viewAll', 'Tümünü Gör')));
    setServicesCtaQuote(getVal('services.ctaQuote', getVal('models.ctaQuote', 'Bilgi & Teklif İste')));

    setReferencesSectionNumber(getVal('references.sectionNumber', '04. Kanıtlanmış Başarılar'));
    setReferencesSectionTitle(getVal('references.sectionTitle', 'İş Birliklerimiz & Sonuçlar'));
    setReferencesSectionSubtitle(getVal('references.sectionSubtitle', 'Türkiye ve global pazardaki küçük işletmelerin gerçek başarı deneyimleri.'));
    setReferencesViewAllText(getVal('references.viewAllText', getVal('nav.viewAll', 'Tümünü Gör')));

    setPricingSectionNumber(getVal('models.sectionNumber', sectionsLang === 'en' ? '02. Transparent Delivery Models' : '02. Şeffaf Teslimat Modelleri'));
    setPricingSectionTitle(getVal('models.sectionTitle', getVal('pricing.sectionTitle', sectionsLang === 'en' ? 'Transparent Delivery & Business Models' : 'Şeffaf Teslimat & İş Modelleri')));
    setPricingSectionSubtitle(getVal('models.sectionSubtitle', getVal('pricing.sectionSubtitle', sectionsLang === 'en' ? 'Whether you leave all technical updates to us and focus on your business, manage it yourself with a full-access panel, or let us architect a custom solution from scratch for your enterprise.' : 'İster tüm teknik güncellemeleri bize devredip işinize bakın, ister tam yetkili panelinizle yönetin, isterseniz firmanıza özel sıfırdan mimari kuralım.')));

    setProdBtnViewDemo(getVal('products.viewDemo', sectionsLang === 'en' ? 'Live Preview' : 'Canlı Önizleme'));
    setProdBtnViewDetails(getVal('products.viewDetails', sectionsLang === 'en' ? 'Details & Buy' : 'Detay & Satın Al'));
    setProdBtnLiveSite(getVal('products.liveSite', sectionsLang === 'en' ? 'Live Site' : 'Bağımsız Canlı Site'));
    setProdBtnCustomerPanel(getVal('products.manageWithCustomerPanel', sectionsLang === 'en' ? 'Client Panel' : 'Müşteri Paneli'));

    setTabAll(getVal('products.tab.all', sectionsLang === 'en' ? 'All Sectors' : 'Tüm Sektörler'));
    setTabHealth(getVal('products.tab.health', sectionsLang === 'en' ? 'Healthcare & Clinic' : 'Sağlık & Klinik'));
    setTabLaw(getVal('products.tab.law', sectionsLang === 'en' ? 'Law & Consulting' : 'Hukuk & Danışmanlık'));
    setTabRestaurant(getVal('products.tab.restaurant', sectionsLang === 'en' ? 'Restaurant & Cafe' : 'Restoran & Kafe'));
    setTabArchitecture(getVal('products.tab.architecture', sectionsLang === 'en' ? 'Architecture & Design' : 'Mimarlık & Tasarım'));
    setTabLogistics(getVal('products.tab.logistics', sectionsLang === 'en' ? 'Logistics & Cargo' : 'Lojistik & Taşımacılık'));
    setTabEcommerce(getVal('products.tab.ecommerce', sectionsLang === 'en' ? 'Boutique E-Commerce' : 'E-Ticaret & Butik'));
    setTabRealEstate(getVal('products.tab.realestate', sectionsLang === 'en' ? 'Real Estate & Assets' : 'Emlak & Gayrimenkul'));
    setTabFitness(getVal('products.tab.fitness', sectionsLang === 'en' ? 'Fitness & Sports' : 'Spor & Fitness'));
    setTabPortfolio(getVal('products.tab.portfolio', sectionsLang === 'en' ? 'Portfolio' : 'Portfolyo'));

    setModelEcoBadge(getVal('models.mostPopular', sectionsLang === 'en' ? 'Most Popular Model' : 'En Çok Tercih Edilen Model'));
    setModelEcoTitle(getVal('models.economic.title', sectionsLang === 'en' ? 'Economic Package (Managed by Us)' : 'Ekonomik Paket (Yönetim Bizde)'));
    setModelEcoDesc(getVal('models.economic.desc', sectionsLang === 'en' ? 'Ideal for small businesses that do not want to spend time learning admin panels or passwords. We set up your site, upload your content, and handle updates whenever needed.' : 'Web paneli öğrenmekle veya şifrelerle vakit kaybetmek istemeyen küçük işletmeler için idealdir. Sitenizi kurar, içeriklerinizi yükleriz. Değişiklik gerektiğinde bize iletirsiniz, biz yaparız.'));

    setModelProBadge(getVal('models.fullIndependence', sectionsLang === 'en' ? 'Full Independence & Control' : 'Tam Bağımsızlık & Kontrol'));
    setModelProTitle(getVal('models.pro.title', sectionsLang === 'en' ? 'Professional Package (Full CMS)' : 'Profesyonel Paket (Tam Yetkili CMS)'));
    setModelProDesc(getVal('models.pro.desc', sectionsLang === 'en' ? 'A full-access professional management panel for growing businesses with their own team, publishing regular content, or desiring total control over every detail.' : 'Kendi ekibi olan, sık içerik/ürün girişi yapan veya sitenin her detayını bağımsız yönetmek isteyen büyüyen firmalar için tam yetkili profesyonel yönetim paneli.'));

    setModelCustomBadge(getVal('models.custom.badge', getVal('models.customArchitecture', sectionsLang === 'en' ? 'Custom Architecture & Scale' : 'Özel Mimari & Büyüme')));
    setModelCustomTitle(getVal('models.custom.title', sectionsLang === 'en' ? 'Custom Enterprise Architecture' : 'Özel Mimari & Kurumsal Çözüm'));
    setModelCustomDesc(getVal('models.custom.desc', sectionsLang === 'en' ? 'Beyond standard templates: custom bespoke UI/UX, third-party API/ERP/CRM integrations, multi-branch or advanced e-commerce infrastructures.' : 'Standart şablonların ötesinde; markanıza özel sıfırdan UI/UX tasarımı, harici API/ERP/CRM entegrasyonları, çoklu şube veya e-ticaret altyapısı gerektiren ileri seviye projeler.'));
  }, [sectionsLang, translations]);

  // Load Footer translations
  React.useEffect(() => {
    const dict = translations[footerLang] || {};
    const baseDict = translations['tr'] || {};
    const getVal = (k: string, fallback: string) => dict[k] ?? baseDict[k] ?? fallback;

    setFooterBrandName(getVal('footer.brandName', settings.agencyName || 'Vanguard Studio'));
    setFooterTagline(getVal('footer.tagline', settings.tagline || 'Büyük ajanslara servet ödemeden; 48 saatte anahtar teslim, prestijli hazır web siteleri.'));
    setFooterAcceptingClients(getVal('footer.acceptingClients', 'Yeni Müşteri Kabulü Açık'));
    setFooterHubTurkey(getVal('footer.hubTurkey', 'Türkiye & Global'));
    setFooterWhatsappNote(getVal('footer.whatsappNote', getVal('contact.onlyWhatsapp', 'Sadece WhatsApp')));
    setFooterLocationTR(getVal('footer.locationTR', settings.locationTR || 'Antalya, Türkiye'));
    setFooterEmail(getVal('footer.email', settings.email || 'info@vanguardstudio.com'));

    setFooterCorporateTitle(getVal('footer.corporateTitle', 'KURUMSAL'));
    setFooterModelsTitle(getVal('footer.modelsTitle', 'HAZIR SİTELER & PAKETLER'));
    setFooterLegalTitle(getVal('footer.legalTitle', 'YASAL BİLDİRİMLER'));

    setFooterMotto(getVal('footer.motto', '“Kodla İnşa Ediyor, Pazarlamayla Büyütüyoruz. Sınırların Ötesinde Dijital Gelecek.”'));
    setFooterHubLocations(getVal('footer.hubLocations', '🇹🇷 TR Antalya & Global'));

    setFooterCopyrightOwner(getVal('footer.copyrightOwner', 'Vanguard Studio'));
    setFooterAllRights(getVal('footer.allRights', 'Tüm hakları saklıdır.'));
    setFooterTurnaround(getVal('footer.turnaround', '48 Saatte Anahtar Teslim'));
    setFooterTurnaroundUrl(getVal('footer.turnaroundUrl', '#page-48-saatte-teslim-ve-hizmet-garantisi'));
    setFooterAboutLinkText(getVal('footer.aboutLinkText', getVal('nav.about', 'Hakkımızda')));
    setFooterPrivacyLinkText(getVal('footer.privacyLinkText', 'Gizlilik & KVKK'));
  }, [footerLang, translations, settings]);

  const handleSaveSections = (e: React.FormEvent) => {
    e.preventDefault();
    updateTranslationKey(sectionsLang, 'hero.badge', heroBadge);
    updateTranslationKey(sectionsLang, 'hero.title', heroTitle);
    updateTranslationKey(sectionsLang, 'hero.subtitle', heroSubtitle);
    updateTranslationKey(sectionsLang, 'hero.ctaPrimary', heroCtaPrimary);
    updateTranslationKey(sectionsLang, 'hero.ctaPrimaryUrl', heroCtaPrimaryUrl);
    updateTranslationKey(sectionsLang, 'hero.ctaSecondary', heroCtaSecondary);
    updateTranslationKey(sectionsLang, 'hero.ctaSecondaryUrl', heroCtaSecondaryUrl);
    updateTranslationKey(sectionsLang, 'hero.watchVideo', heroWatchVideo);
    updateTranslationKey(sectionsLang, 'hero.bgImage', heroBgImage);

    updateTranslationKey(sectionsLang, 'hero.stat1.val', heroStat1Val);
    updateTranslationKey(sectionsLang, 'hero.stat1.label', heroStat1Label);
    updateTranslationKey(sectionsLang, 'hero.stat2.val', heroStat2Val);
    updateTranslationKey(sectionsLang, 'hero.stat2.label', heroStat2Label);
    updateTranslationKey(sectionsLang, 'hero.stat3.val', heroStat3Val);
    updateTranslationKey(sectionsLang, 'hero.stat3.label', heroStat3Label);

    updateTranslationKey(sectionsLang, 'products.sectionNumber', productsSectionNumber);
    updateTranslationKey(sectionsLang, 'products.sectionTitle', productsSectionTitle);
    updateTranslationKey(sectionsLang, 'products.sectionSubtitle', productsSectionSubtitle);

    updateTranslationKey(sectionsLang, 'services.sectionNumber', servicesSectionNumber);
    updateTranslationKey(sectionsLang, 'services.sectionTitle', servicesSectionTitle);
    updateTranslationKey(sectionsLang, 'services.sectionSubtitle', servicesSectionSubtitle);
    updateTranslationKey(sectionsLang, 'services.viewAllText', servicesViewAllText);
    updateTranslationKey(sectionsLang, 'services.ctaQuote', servicesCtaQuote);

    updateTranslationKey(sectionsLang, 'references.sectionNumber', referencesSectionNumber);
    updateTranslationKey(sectionsLang, 'references.sectionTitle', referencesSectionTitle);
    updateTranslationKey(sectionsLang, 'references.sectionSubtitle', referencesSectionSubtitle);
    updateTranslationKey(sectionsLang, 'references.viewAllText', referencesViewAllText);

    updateTranslationKey(sectionsLang, 'models.sectionNumber', pricingSectionNumber);
    updateTranslationKey(sectionsLang, 'models.sectionTitle', pricingSectionTitle);
    updateTranslationKey(sectionsLang, 'pricing.sectionTitle', pricingSectionTitle);
    updateTranslationKey(sectionsLang, 'models.sectionSubtitle', pricingSectionSubtitle);
    updateTranslationKey(sectionsLang, 'pricing.sectionSubtitle', pricingSectionSubtitle);

    updateTranslationKey(sectionsLang, 'products.viewDemo', prodBtnViewDemo);
    updateTranslationKey(sectionsLang, 'products.viewDetails', prodBtnViewDetails);
    updateTranslationKey(sectionsLang, 'products.liveSite', prodBtnLiveSite);
    updateTranslationKey(sectionsLang, 'products.manageWithCustomerPanel', prodBtnCustomerPanel);

    updateTranslationKey(sectionsLang, 'products.tab.all', tabAll);
    updateTranslationKey(sectionsLang, 'products.tab.health', tabHealth);
    updateTranslationKey(sectionsLang, 'products.tab.law', tabLaw);
    updateTranslationKey(sectionsLang, 'products.tab.restaurant', tabRestaurant);
    updateTranslationKey(sectionsLang, 'products.tab.architecture', tabArchitecture);
    updateTranslationKey(sectionsLang, 'products.tab.logistics', tabLogistics);
    updateTranslationKey(sectionsLang, 'products.tab.ecommerce', tabEcommerce);
    updateTranslationKey(sectionsLang, 'products.tab.realestate', tabRealEstate);
    updateTranslationKey(sectionsLang, 'products.tab.fitness', tabFitness);
    updateTranslationKey(sectionsLang, 'products.tab.portfolio', tabPortfolio);

    updateTranslationKey(sectionsLang, 'models.mostPopular', modelEcoBadge);
    updateTranslationKey(sectionsLang, 'models.economic.title', modelEcoTitle);
    updateTranslationKey(sectionsLang, 'models.economic.desc', modelEcoDesc);

    updateTranslationKey(sectionsLang, 'models.fullIndependence', modelProBadge);
    updateTranslationKey(sectionsLang, 'models.pro.title', modelProTitle);
    updateTranslationKey(sectionsLang, 'models.pro.desc', modelProDesc);

    updateTranslationKey(sectionsLang, 'models.custom.badge', modelCustomBadge);
    updateTranslationKey(sectionsLang, 'models.customArchitecture', modelCustomBadge);
    updateTranslationKey(sectionsLang, 'models.custom.title', modelCustomTitle);
    updateTranslationKey(sectionsLang, 'models.custom.desc', modelCustomDesc);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveFooter = (e: React.FormEvent) => {
    e.preventDefault();
    updateTranslationKey(footerLang, 'footer.brandName', footerBrandName);
    updateTranslationKey(footerLang, 'footer.tagline', footerTagline);
    updateTranslationKey(footerLang, 'footer.acceptingClients', footerAcceptingClients);
    updateTranslationKey(footerLang, 'footer.hubTurkey', footerHubTurkey);
    updateTranslationKey(footerLang, 'footer.whatsappNote', footerWhatsappNote);
    updateTranslationKey(footerLang, 'footer.locationTR', footerLocationTR);
    updateTranslationKey(footerLang, 'footer.email', footerEmail);

    updateTranslationKey(footerLang, 'footer.corporateTitle', footerCorporateTitle);
    updateTranslationKey(footerLang, 'footer.modelsTitle', footerModelsTitle);
    updateTranslationKey(footerLang, 'footer.legalTitle', footerLegalTitle);

    updateTranslationKey(footerLang, 'footer.motto', footerMotto);
    updateTranslationKey(footerLang, 'footer.hubLocations', footerHubLocations);

    updateTranslationKey(footerLang, 'footer.copyrightOwner', footerCopyrightOwner);
    updateTranslationKey(footerLang, 'footer.allRights', footerAllRights);
    updateTranslationKey(footerLang, 'footer.turnaround', footerTurnaround);
    updateTranslationKey(footerLang, 'footer.turnaroundUrl', footerTurnaroundUrl);
    updateTranslationKey(footerLang, 'footer.aboutLinkText', footerAboutLinkText);
    updateTranslationKey(footerLang, 'footer.privacyLinkText', footerPrivacyLinkText);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Save Agency General
  const handleSaveAgency = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      agencyName,
      tagline,
      phone,
      whatsapp,
      email,
      locationTR,
      promoVideoUrl: promoVideoUrl.trim() || undefined,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Save Tax Info
  const handleSaveTax = (e: React.FormEvent) => {
    e.preventDefault();
    updateLegalTaxInfo({
      companyTitleTR: taxCompanyTR,
      taxOfficeTR,
      taxNumberTR,
      registeredAddressTR: taxAddressTR,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Change PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinChangeError('');
    setPinChangeSuccess('');

    if (newPinInput !== confirmPinInput) {
      setPinChangeError('Yeni PIN ile tekrarı uyuşmuyor.');
      return;
    }

    const result = changeAdminPin(currentPinInput, newPinInput);
    if (!result.success) {
      setPinChangeError(result.error || 'PIN değiştirilemedi.');
    } else {
      setPinChangeSuccess('PIN kodu başarıyla güncellendi! Bir sonraki girişte yeni PIN geçerli olacaktır.');
      setCurrentPinInput('');
      setNewPinInput('');
      setConfirmPinInput('');
      setTimeout(() => setPinChangeSuccess(''), 4000);
    }
  };

  // Open Bank Modal for Create
  const handleOpenNewBank = () => {
    setEditingBankId(null);
    setBankTitle('');
    setBankName('');
    setAccountHolder(settings.bankAccounts?.accountHolderTR || 'Şeref Kaplan');
    setAccountNumber('');
    setIban('TR');
    setCurrency('TRY');
    setBranchName('');
    setBranchCode('');
    setSwiftBic('');
    setCountry('TR');
    setIsActive(true);
    setNotes('');
    setIsBankModalOpen(true);
  };

  // Open Bank Modal for Edit
  const handleOpenEditBank = (bank: BankAccountItem) => {
    setEditingBankId(bank.id);
    setBankTitle(bank.title);
    setBankName(bank.bankName);
    setAccountHolder(bank.accountHolder);
    setAccountNumber(bank.accountNumber || '');
    setIban(bank.iban);
    setCurrency(bank.currency);
    setBranchName(bank.branchName || '');
    setBranchCode(bank.branchCode || '');
    setSwiftBic(bank.swiftBic || '');
    setCountry(bank.country === 'TR' ? 'TR' : 'INT');
    setIsActive(bank.isActive);
    setNotes(bank.notes || '');
    setIsBankModalOpen(true);
  };

  // Submit Bank
  const handleSaveBank = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bankName.trim() || !accountHolder.trim() || !iban.trim()) return;

    if (editingBankId) {
      updateBankAccount(editingBankId, {
        title: bankTitle.trim() || `${bankName} (${currency})`,
        bankName: bankName.trim(),
        accountHolder: accountHolder.trim(),
        accountNumber: accountNumber.trim() || undefined,
        iban: iban.trim().toUpperCase(),
        currency,
        branchName: branchName.trim() || undefined,
        branchCode: branchCode.trim() || undefined,
        swiftBic: swiftBic.trim().toUpperCase() || undefined,
        country: country === 'TR' ? 'TR' : 'INT',
        isActive,
        notes: notes.trim() || undefined,
      });
    } else {
      addBankAccount({
        title: bankTitle.trim() || `${bankName} (${currency})`,
        bankName: bankName.trim(),
        accountHolder: accountHolder.trim(),
        accountNumber: accountNumber.trim() || undefined,
        iban: iban.trim().toUpperCase(),
        currency,
        branchName: branchName.trim() || undefined,
        branchCode: branchCode.trim() || undefined,
        swiftBic: swiftBic.trim().toUpperCase() || undefined,
        country: country === 'TR' ? 'TR' : 'INT',
        isActive,
        isPrimary: bankAccountsList.length === 0,
        notes: notes.trim() || undefined,
      });
    }

    setIsBankModalOpen(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBankId(id);
    setTimeout(() => setCopiedBankId(null), 2000);
  };

  // Export JSON
  const handleExport = () => {
    const jsonStr = exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vanguard-studio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importBackupJson(content);
      if (success) {
        setImportStatus('Yedek başarıyla içe aktarıldı ve tüm veriler güncellendi!');
      } else {
        setImportStatus('Hata: Geçersiz JSON yedek dosyası.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  // Load Public Backup JSON (1-click)
  const handleLoadDefaultPublicBackup = async () => {
    try {
      const res = await fetch('/vanguard-studio-backup-2026-10-10.json');
      if (res.ok) {
        const text = await res.text();
        const ok = importBackupJson(text);
        if (ok) {
          setImportStatus('vanguard-studio-backup-2026-10-10.json yedeği başarıyla yüklendi ve tüm veriler güncellendi!');
        } else {
          setImportStatus('Hata: Yedek dosyası ayrıştırılamadı.');
        }
      } else {
        setImportStatus('Hata: Sunucuda vanguard-studio-backup-2026-10-10.json bulunamadı.');
      }
    } catch {
      setImportStatus('Hata: Yedek yüklenirken bağlantı sorunu oluştu.');
    }
    setTimeout(() => setImportStatus(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation Tabs */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Sistem & Site Ayarları</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Banka hesapları, IBAN'lar, vergi/şirket bilgileri, güvenlik PIN kodu ve ajans kimliği.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              <Check className="w-3.5 h-3.5" />
              <span>Değişiklikler başarıyla kaydedildi!</span>
            </div>
          )}
        </div>

        {/* Tab Buttons */}
        <div className="mt-5 flex gap-2 border-b border-neutral-800 pb-2 overflow-x-auto scrollbar-none text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('sections')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'sections'
                ? 'bg-amber-400 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hero & Sayfa Bölümleri Yönetimi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('footer')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'footer'
                ? 'bg-amber-400 text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Footer (Alt Bilgi) Yönetimi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('banks')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'banks'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Banka Hesapları & IBAN ({bankAccountsList.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('tax')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'tax'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Vergi & Şirket Bilgileri</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('security')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'security'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Güvenlik & PIN Değiştirme</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('agency')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'agency'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Ajans & İletişim Bilgileri</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('backup')}
            className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'backup'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Yedekleme & Sıfırlama</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB: HERO & SITE SECTION MANAGEMENT */}
      {activeSubTab === 'sections' && (
        <div className="space-y-6">
          {/* Active Language Selector Bar */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Çok Dilli Sayfa & Hero Bölüm Editörü</span>
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Sitenin ana sayfasında yer alan Hero başlığı, spot metni, butonlar ve tüm bölüm başlıklarını seçilen dilde anında düzenleyin.
              </p>
            </div>

            {/* Language Tabs - RU Filtered Out */}
            <div className="flex items-center gap-2 flex-wrap">
              {languages.filter(l => l.code !== 'ru' && l.active).map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSectionsLang(lang.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    sectionsLang === lang.code
                      ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className="text-[10px] uppercase font-mono opacity-80">({lang.code})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form for Selected Language Sections */}
          <form onSubmit={handleSaveSections} className="space-y-6">
            {/* 1. HERO SECTION CARD */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>1. Hero (Giriş / Karşılama) Bölümü — [{sectionsLang.toUpperCase()}]</span>
                </h5>
                <span className="text-[11px] text-neutral-400">
                  Aktif Dil: {languages.find(l => l.code === sectionsLang)?.name}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Üst Rozet Metni (Kicker Badge)
                  </label>
                  <input
                    type="text"
                    value={heroBadge}
                    onChange={e => setHeroBadge(e.target.value)}
                    placeholder="Örn: Küçük İşletmelere Özel · 48 Saatte Canlıda"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Ana Manşet Başlığı (Main Title)
                  </label>
                  <textarea
                    rows={2}
                    value={heroTitle}
                    onChange={e => setHeroTitle(e.target.value)}
                    placeholder="Örn: Bütçenizi Zorlamayan, Prestijli Hazır Web Siteleri."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Spot Metni & Açıklama Paragrafı (Subtitle)
                  </label>
                  <textarea
                    rows={3}
                    value={heroSubtitle}
                    onChange={e => setHeroSubtitle(e.target.value)}
                    placeholder="Örn: Büyük ajanslara servet ödemeden..."
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    1. Buton Metni (Primary CTA)
                  </label>
                  <input
                    type="text"
                    value={heroCtaPrimary}
                    onChange={e => setHeroCtaPrimary(e.target.value)}
                    placeholder="Örn: Hazır Siteleri Keşfet"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    1. Buton Bağlantısı (Link / Anchor)
                  </label>
                  <input
                    type="text"
                    value={heroCtaPrimaryUrl}
                    onChange={e => setHeroCtaPrimaryUrl(e.target.value)}
                    placeholder="#portfolio-section"
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-neutral-700 bg-neutral-950 text-amber-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    2. Buton Metni (Secondary CTA)
                  </label>
                  <input
                    type="text"
                    value={heroCtaSecondary}
                    onChange={e => setHeroCtaSecondary(e.target.value)}
                    placeholder="Örn: Hangi Paket Size Uygun?"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    2. Buton Bağlantısı (Link / Anchor)
                  </label>
                  <input
                    type="text"
                    value={heroCtaSecondaryUrl}
                    onChange={e => setHeroCtaSecondaryUrl(e.target.value)}
                    placeholder="#pricing-models"
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-neutral-700 bg-neutral-950 text-amber-400 focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Video Butonu Metni
                  </label>
                  <input
                    type="text"
                    value={heroWatchVideo}
                    onChange={e => setHeroWatchVideo(e.target.value)}
                    placeholder="Nasıl Çalışıyoruz? (Video)"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Hero Arka Plan Görsel URL
                  </label>
                  <input
                    type="url"
                    value={heroBgImage}
                    onChange={e => setHeroBgImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-neutral-700 bg-neutral-950 text-neutral-200 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Stats Bar */}
              <div className="pt-4 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400">İstatistik 1</span>
                  <input
                    type="text"
                    value={heroStat1Val}
                    onChange={e => setHeroStat1Val(e.target.value)}
                    placeholder="48 Saat"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                  />
                  <input
                    type="text"
                    value={heroStat1Label}
                    onChange={e => setHeroStat1Label(e.target.value)}
                    placeholder="Ortalama Teslimat Süresi"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300"
                  />
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400">İstatistik 2</span>
                  <input
                    type="text"
                    value={heroStat2Val}
                    onChange={e => setHeroStat2Val(e.target.value)}
                    placeholder="10.000 ₺’den"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                  />
                  <input
                    type="text"
                    value={heroStat2Label}
                    onChange={e => setHeroStat2Label(e.target.value)}
                    placeholder="Başlayan Şeffaf Fiyatlar"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300"
                  />
                </div>

                <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400">İstatistik 3</span>
                  <input
                    type="text"
                    value={heroStat3Val}
                    onChange={e => setHeroStat3Val(e.target.value)}
                    placeholder="TR · EN"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                  />
                  <input
                    type="text"
                    value={heroStat3Label}
                    onChange={e => setHeroStat3Label(e.target.value)}
                    placeholder="Çok Dilli & Pazar Odaklı"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300"
                  />
                </div>
              </div>
            </div>

            {/* 2. PRODUCTS SECTION CARD */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  <span>2. Hazır Siteler (Turnkey Grid) Bölümü — [{sectionsLang.toUpperCase()}]</span>
                </h5>
                <span className="text-[11px] text-neutral-400">
                  Vitrin Portföy & 10 Sektörlük Katalog
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Bölüm Rozeti / Numarası (Kicker)
                  </label>
                  <input
                    type="text"
                    value={productsSectionNumber}
                    onChange={e => setProductsSectionNumber(e.target.value)}
                    placeholder="Örn: 01. Vitrin & Portföy"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Bölüm Ana Başlığı (Title)
                  </label>
                  <input
                    type="text"
                    value={productsSectionTitle}
                    onChange={e => setProductsSectionTitle(e.target.value)}
                    placeholder="Örn: Satışa Hazır Sektörel Siteler"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Bölüm Açıklaması & Spot Paragrafı (Subtitle)
                  </label>
                  <textarea
                    rows={2}
                    value={productsSectionSubtitle}
                    onChange={e => setProductsSectionSubtitle(e.target.value)}
                    placeholder="Örn: Özenle seçilmiş, test edilmiş ve anahtar teslim devreye alınmaya hazır maksimum 10 özel çözüm."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Product Card Action Buttons (Image 1) */}
                <div className="md:col-span-3 pt-3 border-t border-neutral-800">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-3">
                    Site Kartları Üzerindeki Buton Metinleri (Image 1)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                        "Canlı Önizleme" Butonu
                      </label>
                      <input
                        type="text"
                        value={prodBtnViewDemo}
                        onChange={e => setProdBtnViewDemo(e.target.value)}
                        placeholder="Örn: Canlı Önizleme"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                        "Detay & Satın Al" Butonu
                      </label>
                      <input
                        type="text"
                        value={prodBtnViewDetails}
                        onChange={e => setProdBtnViewDetails(e.target.value)}
                        placeholder="Örn: Detay & Satın Al"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                        "Bağımsız Canlı Site" Butonu
                      </label>
                      <input
                        type="text"
                        value={prodBtnLiveSite}
                        onChange={e => setProdBtnLiveSite(e.target.value)}
                        placeholder="Örn: Live Site"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">
                        "Müşteri Paneli" Butonu
                      </label>
                      <input
                        type="text"
                        value={prodBtnCustomerPanel}
                        onChange={e => setProdBtnCustomerPanel(e.target.value)}
                        placeholder="Örn: Müşteri Paneli"
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Sector Filter Tab Selector Labels */}
                <div className="md:col-span-3 pt-3 border-t border-neutral-800">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                    Sektör Filtre Sekmeleri (Tab Selector) Metinleri — [{sectionsLang.toUpperCase()}]
                  </span>
                  <p className="text-[11px] text-neutral-400 mb-3">
                    Turnkey Vitrin bölümünün üst kısmındaki yatay sektör filtre sekmelerinin metinlerini buradan dilediğiniz gibi özelleştirebilirsiniz.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">"Tüm Sektörler" Sekmesi</label>
                      <input type="text" value={tabAll} onChange={e => setTabAll(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">"Sağlık & Klinik"</label>
                      <input type="text" value={tabHealth} onChange={e => setTabHealth(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">"Hukuk & Danışmanlık"</label>
                      <input type="text" value={tabLaw} onChange={e => setTabLaw(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">"Restoran & Kafe"</label>
                      <input type="text" value={tabRestaurant} onChange={e => setTabRestaurant(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">"Mimarlık & Tasarım"</label>
                      <input type="text" value={tabArchitecture} onChange={e => setTabArchitecture(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">"Lojistik & Taşımacılık"</label>
                      <input type="text" value={tabLogistics} onChange={e => setTabLogistics(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">"E-Ticaret & Butik"</label>
                      <input type="text" value={tabEcommerce} onChange={e => setTabEcommerce(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">"Emlak & Gayrimenkul"</label>
                      <input type="text" value={tabRealEstate} onChange={e => setTabRealEstate(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">"Spor & Fitness"</label>
                      <input type="text" value={tabFitness} onChange={e => setTabFitness(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-400 mb-1">"Portfolyo"</label>
                      <input type="text" value={tabPortfolio} onChange={e => setTabPortfolio(e.target.value)} className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. AJANS ÇÖZÜMLERİ (SERVICES) SECTION CARD */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>3. 03. Ajans Çözümleri Bölümü — [{sectionsLang.toUpperCase()}]</span>
                </h5>
                <span className="text-[11px] text-neutral-400">
                  Ana Sayfadaki 03 Numaralı Hizmetler Bölümü
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Bölüm Rozeti / Numarası (Kicker)
                  </label>
                  <input
                    type="text"
                    value={servicesSectionNumber}
                    onChange={e => setServicesSectionNumber(e.target.value)}
                    placeholder="Örn: 03. Ajans Çözümleri"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Bölüm Ana Başlığı (Title)
                  </label>
                  <input
                    type="text"
                    value={servicesSectionTitle}
                    onChange={e => setServicesSectionTitle(e.target.value)}
                    placeholder="Örn: Ajans Hizmetleri"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Bölüm Açıklaması & Spot Paragrafı (Subtitle)
                  </label>
                  <textarea
                    rows={2}
                    value={servicesSectionSubtitle}
                    onChange={e => setServicesSectionSubtitle(e.target.value)}
                    placeholder="Örn: Hazır sitelerimizin ötesinde, büyümenizi destekleyecek uçtan uca dijital çözümler."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    "Tümünü Gör" Buton Metni
                  </label>
                  <input
                    type="text"
                    value={servicesViewAllText}
                    onChange={e => setServicesViewAllText(e.target.value)}
                    placeholder="Örn: Tümünü Gör"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    "Bilgi & Teklif İste" Kart Buton Metni
                  </label>
                  <input
                    type="text"
                    value={servicesCtaQuote}
                    onChange={e => setServicesCtaQuote(e.target.value)}
                    placeholder="Örn: Bilgi & Teklif İste"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 4. KANITLANMIŞ BAŞARILAR (REFERENCES) SECTION CARD */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>4. 04. Kanıtlanmış Başarılar Bölümü — [{sectionsLang.toUpperCase()}]</span>
                </h5>
                <span className="text-[11px] text-neutral-400">
                  Ana Sayfadaki 04 Numaralı Referanslar & Yorumlar Bölümü
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Bölüm Rozeti / Numarası (Kicker)
                  </label>
                  <input
                    type="text"
                    value={referencesSectionNumber}
                    onChange={e => setReferencesSectionNumber(e.target.value)}
                    placeholder="Örn: 04. Kanıtlanmış Başarılar"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Bölüm Ana Başlığı (Title)
                  </label>
                  <input
                    type="text"
                    value={referencesSectionTitle}
                    onChange={e => setReferencesSectionTitle(e.target.value)}
                    placeholder="Örn: İş Birliklerimiz & Sonuçlar"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Bölüm Açıklaması & Spot Paragrafı (Subtitle)
                  </label>
                  <textarea
                    rows={2}
                    value={referencesSectionSubtitle}
                    onChange={e => setReferencesSectionSubtitle(e.target.value)}
                    placeholder="Örn: Türkiye ve global pazardaki küçük işletmelerin gerçek başarı deneyimleri."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    "Tümünü Gör" Buton Metni
                  </label>
                  <input
                    type="text"
                    value={referencesViewAllText}
                    onChange={e => setReferencesViewAllText(e.target.value)}
                    placeholder="Örn: Tümünü Gör"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 5. PRICING & MODELS SECTION CARD */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  <span>5. Şeffaf Teslimat & Paketler Bölümü — [{sectionsLang.toUpperCase()}]</span>
                </h5>
                <span className="text-[11px] text-neutral-400">
                  Ana Sayfa Fiyatlandırma & Teslim Modelleri
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Bölüm Rozeti / Numarası (Kicker)
                  </label>
                  <input
                    type="text"
                    value={pricingSectionNumber}
                    onChange={e => setPricingSectionNumber(e.target.value)}
                    placeholder="Örn: 02. Şeffaf Teslimat Modelleri"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Paketler & Fiyatlandırma Başlığı
                  </label>
                  <input
                    type="text"
                    value={pricingSectionTitle}
                    onChange={e => setPricingSectionTitle(e.target.value)}
                    placeholder="Örn: Şeffaf Paket ve Fiyatlandırma Modelleri"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Alt Açıklama Metni (Subtitle)
                  </label>
                  <textarea
                    rows={2}
                    value={pricingSectionSubtitle}
                    onChange={e => setPricingSectionSubtitle(e.target.value)}
                    placeholder="Örn: Gizli maliyet yok. İşletmenizin ölçeğine uygun paketi seçin."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* 3 Model Cards Inputs (Image 2) */}
                <div className="md:col-span-3 pt-4 border-t border-neutral-800 space-y-4">
                  <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                    3 Teslimat & Paket Kartının Metinleri (Image 2)
                  </span>

                  {/* Card 1: Economic */}
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>1. Paket: Ekonomik (Yönetim Bizde)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Üst Rozet Metni</label>
                        <input
                          type="text"
                          value={modelEcoBadge}
                          onChange={e => setModelEcoBadge(e.target.value)}
                          placeholder="Örn: En Çok Tercih Edilen Model"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Paket Başlığı</label>
                        <input
                          type="text"
                          value={modelEcoTitle}
                          onChange={e => setModelEcoTitle(e.target.value)}
                          placeholder="Örn: Ekonomik Paket (Yönetim Bizde)"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-neutral-400 mb-1">Paket Açıklaması</label>
                        <textarea
                          rows={2}
                          value={modelEcoDesc}
                          onChange={e => setModelEcoDesc(e.target.value)}
                          placeholder="Örn: Web paneli öğrenmekle veya şifrelerle vakit kaybetmek istemeyen küçük işletmeler için idealdir..."
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Professional */}
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>2. Paket: Profesyonel (Tam Yetkili CMS)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Üst Rozet Metni</label>
                        <input
                          type="text"
                          value={modelProBadge}
                          onChange={e => setModelProBadge(e.target.value)}
                          placeholder="Örn: Tam Bağımsızlık & Kontrol"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Paket Başlığı</label>
                        <input
                          type="text"
                          value={modelProTitle}
                          onChange={e => setModelProTitle(e.target.value)}
                          placeholder="Örn: Profesyonel Paket (Tam Yetkili CMS)"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-neutral-400 mb-1">Paket Açıklaması</label>
                        <textarea
                          rows={2}
                          value={modelProDesc}
                          onChange={e => setModelProDesc(e.target.value)}
                          placeholder="Örn: Kendi ekibi olan, sık içerik/ürün girişi yapan veya sitenin her detayını bağımsız yönetmek isteyen büyüyen firmalar için..."
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Custom Architecture */}
                  <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-3">
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      <span>3. Paket: Özel Mimari & Kurumsal Çözüm</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Üst Rozet Metni</label>
                        <input
                          type="text"
                          value={modelCustomBadge}
                          onChange={e => setModelCustomBadge(e.target.value)}
                          placeholder="Örn: Özel Mimari & Büyüme"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-neutral-400 mb-1">Paket Başlığı</label>
                        <input
                          type="text"
                          value={modelCustomTitle}
                          onChange={e => setModelCustomTitle(e.target.value)}
                          placeholder="Örn: Özel Mimari & Kurumsal Çözüm"
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-neutral-400 mb-1">Paket Açıklaması</label>
                        <textarea
                          rows={2}
                          value={modelCustomDesc}
                          onChange={e => setModelCustomDesc(e.target.value)}
                          placeholder="Örn: Standart şablonların ötesinde; markanıza özel sıfırdan UI/UX tasarımı, harici API/ERP/CRM entegrasyonları..."
                          className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>[{sectionsLang.toUpperCase()}] Sayfa & Hero Değişikliklerini Kaydet</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB: FOOTER (ALT BİLGİ) MANAGEMENT */}
      {activeSubTab === 'footer' && (
        <div className="space-y-6">
          {/* Active Language Selector Bar */}
          <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Çok Dilli Footer (Alt Bilgi) Yönetimi</span>
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Sitenin en altındaki logo, marka spotu, WhatsApp notu, kolon başlıkları, alt slogan ve telif metinlerini seçilen dilde düzenleyin.
              </p>
            </div>

            {/* Language Tabs - RU Filtered Out */}
            <div className="flex items-center gap-2 flex-wrap">
              {languages.filter(l => l.code !== 'ru' && l.active).map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setFooterLang(lang.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    footerLang === lang.code
                      ? 'bg-amber-400 text-black border-amber-400 shadow-md'
                      : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                  <span className="text-[10px] uppercase font-mono opacity-80">({lang.code})</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveFooter} className="space-y-6">
            {/* 1. MARKA & DURUM ALANI (SOL KOLON) */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>1. Kolon: Marka & Hub İletişim Bilgileri — [{footerLang.toUpperCase()}]</span>
                </h5>
                <span className="text-[11px] text-neutral-400">
                  Footer Sol Blok
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Marka Adı / Logo Yazısı
                  </label>
                  <input
                    type="text"
                    value={footerBrandName}
                    onChange={e => setFooterBrandName(e.target.value)}
                    placeholder="Örn: Vanguard Studio"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    "Yeni Müşteri Kabulü Açık" Durum Rozeti
                  </label>
                  <input
                    type="text"
                    value={footerAcceptingClients}
                    onChange={e => setFooterAcceptingClients(e.target.value)}
                    placeholder="Örn: Yeni Müşteri Kabulü Açık"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Marka Tanıtım Spot Metni (Tagline)
                  </label>
                  <textarea
                    rows={2}
                    value={footerTagline}
                    onChange={e => setFooterTagline(e.target.value)}
                    placeholder="Örn: Büyük ajanslara servet ödemeden; 48 saatte anahtar teslim, prestijli hazır web siteleri."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Hub Başlığı (Örn: 🇹🇷 Türkiye & Genel)
                  </label>
                  <input
                    type="text"
                    value={footerHubTurkey}
                    onChange={e => setFooterHubTurkey(e.target.value)}
                    placeholder="Örn: Türkiye & Genel"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    WhatsApp Yanındaki Not
                  </label>
                  <input
                    type="text"
                    value={footerWhatsappNote}
                    onChange={e => setFooterWhatsappNote(e.target.value)}
                    placeholder="Örn: Sadece WhatsApp"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Lokasyon / Ofis Metni
                  </label>
                  <input
                    type="text"
                    value={footerLocationTR}
                    onChange={e => setFooterLocationTR(e.target.value)}
                    placeholder="Örn: Antalya, Türkiye"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    İletişim E-Posta Adresi
                  </label>
                  <input
                    type="email"
                    value={footerEmail}
                    onChange={e => setFooterEmail(e.target.value)}
                    placeholder="Örn: info@vanguardstudio.com"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 2. KOLON BAŞLIKLARI (2, 3, 4. KOLONLAR) */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4" />
                  <span>2, 3 ve 4. Kolon Başlıkları — [{footerLang.toUpperCase()}]</span>
                </h5>
                <span className="text-[11px] text-neutral-400">
                  Navigasyon ve Yasal Kolon İsimleri
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    2. Kolon Başlığı (Kurumsal)
                  </label>
                  <input
                    type="text"
                    value={footerCorporateTitle}
                    onChange={e => setFooterCorporateTitle(e.target.value)}
                    placeholder="Örn: KURUMSAL"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    3. Kolon Başlığı (Hazır Siteler)
                  </label>
                  <input
                    type="text"
                    value={footerModelsTitle}
                    onChange={e => setFooterModelsTitle(e.target.value)}
                    placeholder="Örn: HAZIR SİTELER & PAKETLER"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    4. Kolon Başlığı (Yasal)
                  </label>
                  <input
                    type="text"
                    value={footerLegalTitle}
                    onChange={e => setFooterLegalTitle(e.target.value)}
                    placeholder="Örn: YASAL BİLDİRİMLER"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-between">
                <span>Kolonların altındaki menü bağlantılarını düzenlemek, yeni link eklemek veya sıralamayı değiştirmek için Menü Yönetimi modülünü kullanabilirsiniz:</span>
                <button
                  type="button"
                  onClick={() => {
                    const navBtn = document.querySelector('button[title*="Menü"]') as HTMLButtonElement;
                    if (navBtn) navBtn.click();
                  }}
                  className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-400 font-semibold rounded-lg shrink-0 ml-3 cursor-pointer"
                >
                  Menü & Navigasyon'a Git →
                </button>
              </div>
            </div>

            {/* 3. ALT SLOGAN (MOTTO) & LOKASYON ŞERİDİ */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Alt Slogan (Motto) & Lokasyon Şeridi — [{footerLang.toUpperCase()}]</span>
                </h5>
                <span className="text-[11px] text-neutral-400">
                  Footer Çizgisi Üzerindeki Vurgu Alanı
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Alt Slogan Metni (Motto)
                  </label>
                  <input
                    type="text"
                    value={footerMotto}
                    onChange={e => setFooterMotto(e.target.value)}
                    placeholder="Örn: “Kodla İnşa Ediyor, Pazarlamayla Büyütüyoruz. Sınırların Ötesinde Dijital Gelecek.”"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none italic"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Merkez Şehir / Ülke İbareleri
                  </label>
                  <input
                    type="text"
                    value={footerHubLocations}
                    onChange={e => setFooterHubLocations(e.target.value)}
                    placeholder="Örn: 🇹🇷 TR Antalya & Global"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 4. TELİF & ALT BAR METİNLERİ */}
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>En Alt Telif & Yasal Şerit (Copyright Row) — [{footerLang.toUpperCase()}]</span>
                </h5>
                <span className="text-[11px] text-neutral-400">
                  Copyright ve Hızlı Alt Linkler
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Telif Sahibi Marka Adı
                  </label>
                  <input
                    type="text"
                    value={footerCopyrightOwner}
                    onChange={e => setFooterCopyrightOwner(e.target.value)}
                    placeholder="Örn: Vanguard Studio"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    "Tüm hakları saklıdır." İbaresi
                  </label>
                  <input
                    type="text"
                    value={footerAllRights}
                    onChange={e => setFooterAllRights(e.target.value)}
                    placeholder="Örn: Tüm hakları saklıdır."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    "48 Saatte Anahtar Teslim" Rozeti
                  </label>
                  <input
                    type="text"
                    value={footerTurnaround}
                    onChange={e => setFooterTurnaround(e.target.value)}
                    placeholder="Örn: 48 Saatte Anahtar Teslim"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    "48 Saatte Anahtar Teslim" Linki (URL / #sayfa-slug)
                  </label>
                  <input
                    type="text"
                    value={footerTurnaroundUrl}
                    onChange={e => setFooterTurnaroundUrl(e.target.value)}
                    placeholder="Örn: #page-48-saatte-teslim-ve-hizmet-garantisi"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Alt Link: "Hakkımızda"
                  </label>
                  <input
                    type="text"
                    value={footerAboutLinkText}
                    onChange={e => setFooterAboutLinkText(e.target.value)}
                    placeholder="Örn: Hakkımızda"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Alt Link: "Gizlilik & KVKK"
                  </label>
                  <input
                    type="text"
                    value={footerPrivacyLinkText}
                    onChange={e => setFooterPrivacyLinkText(e.target.value)}
                    placeholder="Örn: Gizlilik & KVKK"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-3 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>[{footerLang.toUpperCase()}] Footer Değişikliklerini Kaydet</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-TAB 1: BANK ACCOUNTS MANAGEMENT */}
      {activeSubTab === 'banks' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">
                Aktif Banka Hesapları ve Ödeme Kanalları
              </h4>
              <p className="text-xs text-neutral-400 mt-0.5">
                Müşterilerin sipariş/ödeme modalında göreceği IBAN ve banka hesap bilgilerini buradan ekleyip düzenleyebilirsiniz.
              </p>
            </div>

            <button
              onClick={handleOpenNewBank}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Banka Hesabı Ekle</span>
            </button>
          </div>

          {/* Bank Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bankAccountsList.map(bank => {
              const countryFlag = bank.country === 'TR' ? '🇹🇷' : '🌐';

              return (
                <div
                  key={bank.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    bank.isPrimary
                      ? 'bg-neutral-900 border-amber-500/40 shadow-sm'
                      : 'bg-neutral-900 border-neutral-800'
                  }`}
                >
                  <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{countryFlag}</span>
                        <span className="font-bold text-white text-sm">
                          {bank.title || bank.bankName}
                        </span>
                        {bank.isPrimary && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            Birincil
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-400 mt-0.5 font-medium">
                        {bank.bankName} · {bank.currency}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditBank(bank)}
                        className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                        title="Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`"${bank.title}" hesabını silmek istediğinize emin misiniz?`)) {
                            deleteBankAccount(bank.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase">Hesap Sahibi:</span>
                      <div className="font-semibold text-neutral-200">{bank.accountHolder}</div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-500 uppercase">IBAN:</span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(bank.iban, bank.id)}
                          className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <Copy className="w-2.5 h-2.5" />
                          <span>{copiedBankId === bank.id ? 'Kopyalandı' : 'Kopyala'}</span>
                        </button>
                      </div>
                      <div className="p-2 rounded-lg bg-neutral-950 font-mono text-[11px] text-neutral-300 break-all border border-neutral-800 mt-0.5">
                        {bank.iban}
                      </div>
                    </div>

                    {bank.accountNumber && (
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <span className="text-[10px] text-neutral-500 uppercase">Hesap No:</span>
                          <div className="font-mono text-neutral-300">{bank.accountNumber}</div>
                        </div>
                        {bank.branchName && (
                          <div>
                            <span className="text-[10px] text-neutral-500 uppercase">Şube:</span>
                            <div className="text-neutral-300">{bank.branchName}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {bank.swiftBic && (
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase">SWIFT / BIC:</span>
                        <div className="font-mono text-neutral-300">{bank.swiftBic}</div>
                      </div>
                    )}

                    {bank.notes && (
                      <div className="text-[11px] text-neutral-400 italic bg-neutral-950/50 p-2 rounded-lg border border-neutral-800/60">
                        {bank.notes}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bank.isActive}
                        onChange={e => updateBankAccount(bank.id, { isActive: e.target.checked })}
                        className="rounded border-neutral-700 bg-neutral-950 text-amber-500"
                      />
                      <span className="text-xs text-neutral-400">Sitede Göster</span>
                    </label>

                    {!bank.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setPrimaryBankAccount(bank.id)}
                        className="text-[11px] font-semibold text-neutral-400 hover:text-amber-400 transition-colors"
                      >
                        Birincil Yap
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: TAX & LEGAL INFO */}
      {activeSubTab === 'tax' && (
        <form onSubmit={handleSaveTax} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Resmi Şirket & Vergi Bilgileri</span>
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Fatura kesimi, müşteri sözleşmeleri ve resmi bildirimler için kayıtlı şirket numaraları.
            </p>
          </div>

          {/* Türkiye Vergi Bilgileri */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-800">
              <span className="text-base">🇹🇷</span>
              <span className="text-xs font-bold text-white">Türkiye Vergi & Ticari Kayıt</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  Resmi Ticari Unvan / Şahıs Şirketi Adı
                </label>
                <input
                  type="text"
                  value={taxCompanyTR}
                  onChange={e => setTaxCompanyTR(e.target.value)}
                  placeholder="Vanguard Dijital Stüdyo & Yazılım - Şeref Kaplan"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  Vergi Dairesi
                </label>
                <input
                  type="text"
                  value={taxOfficeTR}
                  onChange={e => setTaxOfficeTR(e.target.value)}
                  placeholder="Maslak Vergi Dairesi"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  Vergi Kimlik Numarası (VKN / T.C. Kimlik No)
                </label>
                <input
                  type="text"
                  value={taxNumberTR}
                  onChange={e => setTaxNumberTR(e.target.value)}
                  placeholder="4920184712"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  Kayıtlı Tebligat & Şirket Adresi
                </label>
                <input
                  type="text"
                  value={taxAddressTR}
                  onChange={e => setTaxAddressTR(e.target.value)}
                  placeholder="Maslak Mah. Büyükdere Cad. No:243 Sarıyer / İstanbul"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl shadow-md cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Vergi ve Şirket Bilgilerini Kaydet</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 3: SECURITY & PIN CHANGE */}
      {activeSubTab === 'security' && (
        <form onSubmit={handleChangePin} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5 max-w-lg">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Yönetici PIN Kodunu / Şifresini Değiştir</span>
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Admin terminaline girişte kullanılan güvenlik PIN kodunu güncelleyin.
            </p>
          </div>

          {pinChangeError && (
            <div className="p-3 text-xs text-red-400 bg-red-950/40 border border-red-800/80 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{pinChangeError}</span>
            </div>
          )}

          {pinChangeSuccess && (
            <div className="p-3 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/80 rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{pinChangeSuccess}</span>
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">
                Mevcut PIN Kodu *
              </label>
              <input
                type="password"
                required
                value={currentPinInput}
                onChange={e => setCurrentPinInput(e.target.value)}
                placeholder="Mevcut PIN (varsayılan: admin123)"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">
                Yeni PIN Kodu * (En az 4 karakter)
              </label>
              <input
                type="password"
                required
                value={newPinInput}
                onChange={e => setNewPinInput(e.target.value)}
                placeholder="Yeni güvenli PIN belirleyin"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">
                Yeni PIN Kodu (Tekrar) *
              </label>
              <input
                type="password"
                required
                value={confirmPinInput}
                onChange={e => setConfirmPinInput(e.target.value)}
                placeholder="Yeni PIN'i doğrulayın"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl shadow-md cursor-pointer transition-all"
          >
            PIN Kodunu Güncelle
          </button>
        </form>
      )}

      {/* SUB-TAB 4: AGENCY GENERAL INFO */}
      {activeSubTab === 'agency' && (
        <form onSubmit={handleSaveAgency} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Ajans Kimliği & İletişim Kanalları</span>
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Sitede gösterilen ajans adı, sloganı, WhatsApp numarası ve fiziksel ofis konumları.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-400 font-medium mb-1">
                Ajans Marka Adı
              </label>
              <input
                type="text"
                required
                value={agencyName}
                onChange={e => setAgencyName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">
                Slogan / Tagline
              </label>
              <input
                type="text"
                required
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">
                Telefon Hattı (Genel Arama / İletişim)
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">
                WhatsApp İletişim Hattı (Türkiye & Genel: +90 505 703 0194)
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">
                E-Posta Adresi
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-medium mb-1">
                Türkiye / Antalya Ofis Lokasyonu
              </label>
              <input
                type="text"
                value={locationTR}
                onChange={e => setLocationTR(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Vanguard Studio Site / Agency Promo Video */}
            <div className="md:col-span-2 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-neutral-200 font-bold text-xs flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-amber-400" />
                    <span>Site & Ajans Tanıtım Videosu (Hero Bölümü ve Tanıtım Butonu)</span>
                  </label>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Ana sayfada "Nasıl Çalışıyoruz? (Video)" butonuna basıldığında açılan tanıtım videosunu belirleyin.
                  </p>
                </div>

                <div className="flex bg-neutral-950 border border-neutral-800 rounded-lg p-0.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setPromoVideoUploadType('url')}
                    className={`px-2.5 py-1 rounded ${
                      promoVideoUploadType === 'url' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    YouTube / Vimeo / URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromoVideoUploadType('local')}
                    className={`px-2.5 py-1 rounded ${
                      promoVideoUploadType === 'local' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Lokal Video Yükle
                  </button>
                </div>
              </div>

              {promoVideoUploadType === 'url' ? (
                <div className="space-y-2">
                  <input
                    type="url"
                    value={promoVideoUrl.startsWith('data:') ? '' : promoVideoUrl}
                    onChange={e => setPromoVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... veya https://vimeo.com/... veya https://.../video.mp4"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs font-mono"
                  />
                  <p className="text-[10px] text-neutral-500">
                    YouTube izleme linkleri, shorts linkleri, Vimeo veya doğrudan .mp4 video linkleri tam desteklenir.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/ogg"
                    onChange={handlePromoVideoFileUpload}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-xl text-neutral-300 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-500 file:text-black hover:file:bg-amber-400 cursor-pointer"
                  />
                  <p className="text-[10px] text-neutral-500">
                    Maksimum 30MB boyutunda MP4 veya WebM formatında doğrudan video dosyası yükleyebilirsiniz.
                  </p>
                </div>
              )}

              {promoVideoError && (
                <p className="text-xs text-red-400 mt-1">{promoVideoError}</p>
              )}

              {promoVideoUrl && (
                <div className="mt-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-xs text-neutral-300 truncate font-mono">
                      {promoVideoUrl.startsWith('data:') ? 'Lokal Yüklenen Video (DataURL)' : promoVideoUrl}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openVideoModal(promoVideoUrl)}
                      className="px-2.5 py-1 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Videoyu Test Et</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPromoVideoUrl('')}
                      className="p-1 text-neutral-400 hover:text-red-400 rounded transition-colors"
                      title="Videoyu Kaldır"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl shadow-md cursor-pointer transition-all"
            >
              <Save className="w-4 h-4" />
              <span>İletişim & Video Ayarlarını Kaydet</span>
            </button>
          </div>
        </form>
      )}

      {/* SUB-TAB 5: BACKUP & RESTORE */}
      {activeSubTab === 'backup' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" />
              <span>Veri Yedekleme, Taşıma ve Fabrika Ayarları</span>
            </h4>
            <p className="text-xs text-neutral-400 mt-0.5">
              Tüm hazır siteleri, hizmetleri, referansları, banka hesaplarını ve mali kayıtları JSON olarak yedekleyin.
            </p>
          </div>

          {importStatus && (
            <div
              className={`p-3 text-xs rounded-xl flex items-center gap-2 ${
                importStatus.startsWith('Hata')
                  ? 'bg-red-950/40 text-red-400 border border-red-800'
                  : 'bg-emerald-950/40 text-emerald-400 border border-emerald-800'
              }`}
            >
              <span>{importStatus}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Sistem Yedeğini Yükle</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                `vanguard-studio-backup-2026-10-10.json` yedeğini tek tıkla yükleyin.
              </p>
              <button
                type="button"
                onClick={handleLoadDefaultPublicBackup}
                className="w-full py-2 px-3 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
              >
                <span>Yedeği Yükle (1-Tıkla)</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Yedek İndir (JSON)</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Tüm veritabanını bilgisayarınıza `.json` dosyası olarak kaydedin.
              </p>
              <button
                type="button"
                onClick={handleExport}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Yedeği İndir</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <Upload className="w-4 h-4 text-blue-400" />
                <span>Yedekten Geri Yükle</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Daha önce indirdiğiniz bir JSON yedeğini yükleyerek geri dönün.
              </p>
              <label className="w-full py-2 px-3 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer text-center">
                <span>Dosya Seç & Yükle</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-white font-semibold text-xs">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <span>Fabrika Ayarlarına Dön</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Tüm içerikleri ve hesapları ilk kurulumdaki orijinal durumuna sıfırlar.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Tüm veriler varsayılan haline sıfırlanacaktır. Bu işlem geri alınamaz. Onaylıyor musunuz?')) {
                    resetToDefaults();
                    alert('Sistem fabrika ayarlarına sıfırlandı.');
                  }
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-rose-400 hover:text-white bg-rose-950/20 hover:bg-rose-900/40 border border-rose-900/40 rounded-lg transition-colors cursor-pointer"
              >
                <span>Sıfırla & Başlat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT BANK ACCOUNT MODAL */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-white my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-display">
                    {editingBankId ? 'Banka Hesabını Düzenle' : 'Yeni Banka Hesabı Ekle'}
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Ödeme ve havale sayfasında görüntülenecek IBAN detayları.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBankModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBank} className="mt-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Ülke & Bölge *
                  </label>
                  <select
                    value={country}
                    onChange={e => setCountry(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="TR">🇹🇷 Türkiye (TL / FAST)</option>
                    <option value="INT">🌐 Uluslararası (USD / EUR / SWIFT)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Para Birimi *
                  </label>
                  <select
                    value={currency}
                    onChange={e => setCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400 font-semibold"
                  >
                    <option value="TRY">TRY - Türk Lirası (₺)</option>
                    <option value="USD">USD - US Dollar ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  Hesap Tanımı / Başlık *
                </label>
                <input
                  type="text"
                  required
                  value={bankTitle}
                  onChange={e => setBankTitle(e.target.value)}
                  placeholder="örn: Garanti BBVA - Ana Ticari Hesap (TL)"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Banka Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="örn: Garanti BBVA / İş Bankası / QNB"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Hesap Sahibi (Ad Soyad / Firma) *
                  </label>
                  <input
                    type="text"
                    required
                    value={accountHolder}
                    onChange={e => setAccountHolder(e.target.value)}
                    placeholder="örn: Şeref Kaplan / Vanguard Studio"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  IBAN Numarası *
                </label>
                <input
                  type="text"
                  required
                  value={iban}
                  onChange={e => setIban(e.target.value)}
                  placeholder="TR33 0006 2000 1234 5678 9012 34"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Hesap No (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    placeholder="6289012"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Şube Adı / Kodu
                  </label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={e => setBranchName(e.target.value)}
                    placeholder="Maslak Şube (1205)"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  SWIFT / BIC Kodu (Döviz transferi)
                </label>
                <input
                  type="text"
                  value={swiftBic}
                  onChange={e => setSwiftBic(e.target.value)}
                  placeholder="ISBKTRIS"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 font-mono uppercase focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  Müşteriye Gösterilecek Açıklama / Not
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="örn: 7/24 Anında FAST transfer geçerlidir. Açıklamaya adınızı yazınız."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-950 text-amber-500"
                  />
                  <span className="text-xs text-neutral-300">Hesabı hemen sitede aktif et</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBankModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 rounded-xl"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl shadow-md cursor-pointer"
                  >
                    {editingBankId ? 'Güncellemeyi Kaydet' : 'Hesabı Ekle'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

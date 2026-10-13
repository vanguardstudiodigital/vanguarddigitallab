import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Save,
  CheckCircle2,
  ExternalLink,
  Building2,
  Briefcase,
  Clock,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Plus,
  Trash2,
  Upload,
  Image,
  DollarSign,
  Layers,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Eye,
  Lock,
  Menu,
  ChevronDown,
} from 'lucide-react';
import { TurnkeyProduct, CustomerServiceItem } from '../../types/index.ts';
import { RichTextEditor } from '../common/RichTextEditor.tsx';

type CustomerTab = 'brand' | 'services' | 'pricing' | 'hours' | 'contact';

export const CustomerPanel: React.FC = () => {
  const {
    isCustomerPanelOpen,
    closeCustomerPanel,
    products,
    updateProduct,
    selectedCustomerProductId,
    setSelectedCustomerProductId,
    openDemo,
    setIsAdminOpen,
    currentLang,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<CustomerTab>('brand');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Active product selection
  const currentProduct =
    products.find(p => p.id === selectedCustomerProductId) || products[0];

  // Editable Form States
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Services list
  const [servicesList, setServicesList] = useState<CustomerServiceItem[]>([]);
  const [featuresList, setFeaturesList] = useState<string[]>([]);
  const [newFeatureText, setNewFeatureText] = useState('');

  // Pricing
  const [priceEconomicTRY, setPriceEconomicTRY] = useState<number>(0);
  const [priceProfessionalTRY, setPriceProfessionalTRY] = useState<number>(0);

  // Business Hours
  const [weekdaysHours, setWeekdaysHours] = useState('09:00 - 19:00');
  const [saturdayHours, setSaturdayHours] = useState('10:00 - 16:00');
  const [sundayHours, setSundayHours] = useState('Kapalı (Acil Randevulu)');
  const [acceptingOrders, setAcceptingOrders] = useState(true);

  // Contact Info
  const [businessPhone, setBusinessPhone] = useState('');
  const [businessWhatsapp, setBusinessWhatsapp] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');

  // Initialize state whenever selected product or language changes
  useEffect(() => {
    if (currentProduct) {
      const trans = currentProduct.translations?.[currentLang];
      setTitle(trans?.title || currentProduct.title || '');
      setTagline(trans?.tagline || currentProduct.tagline || '');
      setDescription(trans?.description || currentProduct.description || '');
      setCoverImage(currentProduct.coverImage || '');
      setPriceEconomicTRY(currentProduct.priceEconomicTRY || 0);
      setPriceProfessionalTRY(currentProduct.priceProfessionalTRY || 0);
      setFeaturesList(currentProduct.features ? [...currentProduct.features] : []);

      const info = currentProduct.customerBusinessInfo;
      setLogoUrl(info?.logoUrl || '');
      setBusinessPhone(info?.phone || '+90 (212) 890 42 10');
      setBusinessWhatsapp(info?.whatsapp || '+90 505 703 0194');
      setBusinessEmail(info?.email || 'bilgi@isletmeniz.com');
      setBusinessAddress(info?.address || 'Merkez Cad. No:12, Türkiye');

      if (info?.openingHours) {
        setWeekdaysHours(info.openingHours.weekdays || '09:00 - 19:00');
        setSaturdayHours(info.openingHours.saturday || '10:00 - 16:00');
        setSundayHours(info.openingHours.sunday || (currentLang === 'en' ? 'Closed (Emergency appointment only)' : 'Kapalı (Acil Randevulu)'));
        setAcceptingOrders(info.openingHours.acceptingOrders !== false);
      } else {
        setWeekdaysHours('09:00 - 19:00');
        setSaturdayHours('10:00 - 16:00');
        setSundayHours(currentLang === 'en' ? 'Closed' : 'Kapalı');
        setAcceptingOrders(true);
      }

      if (info?.servicesList && info.servicesList.length > 0) {
        setServicesList([...info.servicesList]);
      } else {
        // Derive initial services from product features or default
        const initialServices: CustomerServiceItem[] = (currentProduct.features || []).slice(0, 4).map((f, i) => ({
          id: `srv-${i + 1}`,
          title: f,
          price: currentLang === 'en' ? 'Ask for Quote' : 'Fiyat Sorun',
          description: currentLang === 'en' ? `Professional service details provided by our expert team for ${f}.` : `${f} hakkında uzman kadromuzla sunduğumuz profesyonel hizmet detayı.`,
        }));
        setServicesList(initialServices);
      }
    }
  }, [currentProduct?.id, currentLang]);

  if (!isCustomerPanelOpen || !currentProduct) return null;

  // Add new service item
  const handleAddService = () => {
    const newItem: CustomerServiceItem = {
      id: `srv-${Date.now()}`,
      title: currentLang === 'en' ? 'New Service Title' : 'Yeni Hizmet Başlığı',
      price: currentLang === 'en' ? 'Specify Price' : 'Fiyat Belirtin',
      description: currentLang === 'en' ? 'Write a brief description about your service.' : 'Hizmetinizle ilgili kısa açıklama yazın.',
    };
    setServicesList([...servicesList, newItem]);
  };

  // Update a single service
  const handleUpdateService = (id: string, field: keyof CustomerServiceItem, value: string) => {
    setServicesList(
      servicesList.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  // Remove service
  const handleRemoveService = (id: string) => {
    setServicesList(servicesList.filter(s => s.id !== id));
  };

  // Add feature bullet
  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    setFeaturesList([...featuresList, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeaturesList(featuresList.filter((_, i) => i !== idx));
  };

  // Save all customer changes to the product
  const handleSave = () => {
    const updatedProduct: Partial<TurnkeyProduct> = {
      title: currentLang === 'tr' ? title : currentProduct.title,
      tagline: currentLang === 'tr' ? tagline : currentProduct.tagline,
      description: currentLang === 'tr' ? description : currentProduct.description,
      coverImage,
      priceEconomicTRY: Number(priceEconomicTRY) || 0,
      priceProfessionalTRY: Number(priceProfessionalTRY) || 0,
      features: featuresList,
      translations: {
        ...(currentProduct.translations || {}),
        [currentLang]: {
          ...(currentProduct.translations?.[currentLang] || {}),
          title,
          tagline,
          description,
        },
      },
      customerBusinessInfo: {
        phone: businessPhone,
        whatsapp: businessWhatsapp,
        email: businessEmail,
        address: businessAddress,
        logoUrl: logoUrl,
        coverImageUrl: coverImage,
        openingHours: {
          weekdays: weekdaysHours,
          saturday: saturdayHours,
          sunday: sundayHours,
          acceptingOrders,
        },
        servicesList,
      },
    };

    updateProduct(currentProduct.id, updatedProduct);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // Local image file upload handler (converts to base64)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Görsel boyutu 5MB sınırını aşamaz.');
      return;
    }

    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) {
        if (type === 'logo') {
          setLogoUrl(ev.target.result as string);
        } else {
          setCoverImage(ev.target.result as string);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative w-full max-w-6xl h-full sm:h-[94vh] bg-[#0c0e14] text-neutral-100 rounded-none sm:rounded-2xl border-0 sm:border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="h-14 sm:h-16 px-2.5 sm:px-6 bg-[#090b10] border-b border-neutral-800 flex items-center justify-between shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Mobile & Tablet Dedicated Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              aria-label={t('customer.menu', 'Menü')}
            >
              <Menu className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="hidden xs:inline">{t('customer.menu', 'Menü')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold text-white font-display truncate">
                  {t('customer.title', 'Müşteri Paneli')}
                </span>
                <span className="hidden xs:inline px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  {t('customer.subtitle', 'Sadeleştirilmiş CMS')}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block truncate">
                {t('customer.desc', 'Hizmetlerinizi, fiyatlarınızı ve çalışma saatlerinizi yapay zekaya gerek kalmadan yönetin.')}
              </p>
            </div>
          </div>

          {/* Site Selector + Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Ready Site Selector */}
            <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1 sm:px-2.5 sm:py-1.5 text-xs max-w-[130px] sm:max-w-xs">
              <span className="text-neutral-400 text-[11px] hidden md:inline shrink-0">{t('customer.managedSite', 'Yönetilen:')}</span>
              <select
                value={currentProduct.id}
                onChange={e => setSelectedCustomerProductId(e.target.value)}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer text-xs truncate w-full"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id} className="bg-neutral-900 text-white">
                    {p.title} ({p.sector})
                  </option>
                ))}
              </select>
            </div>

            {/* Live Preview Button */}
            <button
              onClick={() => openDemo(currentProduct)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors cursor-pointer"
              title={t('customer.livePreview', 'Canlı Önizle')}
            >
              <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">{t('customer.livePreview', 'Canlı Önizle')}</span>
            </button>

            {/* Switch to Vanguard Admin */}
            <button
              onClick={() => {
                closeCustomerPanel();
                setIsAdminOpen(true);
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900/60 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors cursor-pointer"
              title="Vanguard Yönetici Terminali'ne Geç"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Vanguard Admin</span>
            </button>

            {/* Close Button */}
            <button
              onClick={closeCustomerPanel}
              className="p-1.5 sm:p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Full Navigation Drawer for Customer Panel */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-start animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="w-full max-w-lg max-h-[85vh] bg-[#0c0e16] border-b sm:border-r border-neutral-800 rounded-b-2xl sm:rounded-none p-4 sm:p-5 overflow-y-auto shadow-2xl flex flex-col space-y-3"
              onClick={e => e.stopPropagation()}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>Müşteri Paneli Menüsü</span>
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Düzenlemek istediğiniz alanı seçin
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  aria-label="Menüyü Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modules List Grid / Buttons */}
              <div className="space-y-1.5 pt-1">
                {[
                  {
                    id: 'brand' as CustomerTab,
                    label: t('customer.tabBrand', 'Firma & Görseller'),
                    desc: t('customer.tabBrandDesc', 'Firma adı, slogan, logo ve vitrin görseli'),
                    icon: <Building2 className="w-4 h-4 text-emerald-400" />,
                  },
                  {
                    id: 'services' as CustomerTab,
                    label: `${t('customer.tabServices', 'Hizmetler')} (${servicesList.length})`,
                    desc: t('customer.tabServicesDesc', 'Sunduğunuz hizmet listesi, açıklamalar ve fiyatlar'),
                    icon: <Layers className="w-4 h-4 text-amber-400" />,
                  },
                  {
                    id: 'pricing' as CustomerTab,
                    label: t('customer.tabPricing', 'Fiyatlandırma & Paketler'),
                    desc: t('customer.tabPricingDesc', 'Ekonomik ve Profesyonel paket ücretleri'),
                    icon: <DollarSign className="w-4 h-4 text-blue-400" />,
                  },
                  {
                    id: 'hours' as CustomerTab,
                    label: t('customer.tabHours', 'Çalışma Saatleri & Sipariş'),
                    desc: t('customer.tabHoursDesc', 'Haftaiçi, haftasonu çalışma ve sipariş kabul durumu'),
                    icon: <Clock className="w-4 h-4 text-cyan-400" />,
                  },
                  {
                    id: 'contact' as CustomerTab,
                    label: t('customer.tabContact', 'İletişim & WhatsApp'),
                    desc: t('customer.tabContactDesc', 'Telefon, doğrudan WhatsApp hattı, e-posta ve adres'),
                    icon: <Phone className="w-4 h-4 text-rose-400" />,
                  },
                ].map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500 text-black font-bold shadow-lg ring-2 ring-emerald-300'
                          : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-800/80 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`p-2 rounded-lg shrink-0 ${
                            isActive ? 'bg-black/15 text-black' : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{item.label}</div>
                          <div
                            className={`text-[10px] truncate ${
                              isActive ? 'text-black/80 font-medium' : 'text-neutral-400'
                            }`}
                          >
                            {item.desc}
                          </div>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-neutral-500'}`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    closeCustomerPanel();
                    setIsAdminOpen(true);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Vanguard Admin</span>
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openDemo(currentProduct);
                  }}
                  className="py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Canlı Önizle</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save Success Banner */}
        {saveSuccess && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-emerald-300 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold text-[11px] sm:text-xs">
                Değişiklikler başarıyla kaydedildi! Siteniz yeni bilgilerinizle güncellendi.
              </span>
            </div>
            <button
              onClick={() => openDemo(currentProduct)}
              className="underline hover:text-white font-bold cursor-pointer shrink-0 ml-2"
            >
              Hemen Gör →
            </button>
          </div>
        )}

        {/* Mobile Horizontal Tabs for Customer Panel (Direct quick-switch tabs) */}
        <div className="md:hidden flex items-center overflow-x-auto bg-[#090b10] border-b border-neutral-800 px-3 py-2 gap-1.5 shrink-0 no-scrollbar">
          <button
            onClick={() => setActiveTab('brand')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeTab === 'brand'
                ? 'bg-emerald-400 text-black font-bold shadow-md'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span>{t('customer.tabBrand', 'Firma & Görseller')}</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeTab === 'services'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>{t('customer.tabServices', 'Hizmetler')} ({servicesList.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeTab === 'pricing'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 shrink-0" />
            <span>{t('customer.tabPricing', 'Fiyatlandırma')}</span>
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeTab === 'hours'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{t('customer.tabHours', 'Çalışma Saatleri')}</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
              activeTab === 'contact'
                ? 'bg-white text-black font-bold shadow-md'
                : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
            }`}
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>{t('customer.tabContact', 'İletişim & WhatsApp')}</span>
          </button>
        </div>

        {/* Main Body: Tabs Sidebar + Editor Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Tabs Sidebar (Desktop only) */}
          <div className="hidden md:block w-56 bg-[#090b10]/60 border-r border-neutral-800/80 p-4 space-y-1.5 shrink-0 overflow-y-auto">
            <button
              onClick={() => setActiveTab('brand')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'brand'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>{t('customer.tabBrand', 'Firma & Görseller')}</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'services'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>{t('customer.tabServices', 'Hizmet Başlıkları')}</span>
              </div>
              <span className="text-[10px] font-mono opacity-80">{servicesList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'pricing'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>{t('customer.tabPricing', 'Fiyatlandırma')}</span>
            </button>

            <button
              onClick={() => setActiveTab('hours')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'hours'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>{t('customer.tabHours', 'Çalışma Saatleri')}</span>
            </button>

            <button
              onClick={() => setActiveTab('contact')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'contact'
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Phone className="w-4 h-4" />
              <span>{t('customer.tabContact', 'İletişim & WhatsApp')}</span>
            </button>

            <div className="pt-6 border-t border-neutral-800/60 mt-4 space-y-2">
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 space-y-1.5">
                <div className="text-amber-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sıfır Kodlama</span>
                </div>
                <p>
                  Tüm ayarlar doğrudan sitenize uygulanır. Yapay zeka veya teknik ekip beklemenize gerek yoktur.
                </p>
              </div>
            </div>
          </div>

          {/* Editor Workspace */}
          <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto bg-[#0a0c10] space-y-6 min-w-0">
            {/* Tab 1: Firma & Görseller */}
            {activeTab === 'brand' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {t('customer.brandHeading', currentLang === 'en' ? 'Business Information & Visual Identity' : 'Firma Bilgileri & Görsel Kimlik')}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {t('customer.brandSubtitle', currentLang === 'en' ? 'Set your business name, tagline, logo and cover photo.' : 'İşletmenizin adını, sloganını, logosunu ve kapak görselini belirleyin.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t('customer.businessName', currentLang === 'en' ? 'Business / Site Name *' : 'İşletme / Site Adı *')}
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder={currentLang === 'en' ? 'e.g. Aura Dental & Aesthetic Clinic' : 'Örn: Aura Dental & Estetik Klinik'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t('customer.taglineLabel', currentLang === 'en' ? 'Tagline & Value Proposition *' : 'Slogan & Ana Vurgu *')}
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={e => setTagline(e.target.value)}
                        placeholder={currentLang === 'en' ? 'e.g. Prestigious clinic website boosting patient flow' : 'Örn: Hasta randevu akışını artıran prestijli klinik web sitesi'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t('customer.logoLabel', currentLang === 'en' ? 'Company Logo (URL or Upload)' : 'Firma Logosu (URL veya Dosya)')}
                      </label>
                      <input
                        type="text"
                        value={logoUrl}
                        onChange={e => setLogoUrl(e.target.value)}
                        placeholder={currentLang === 'en' ? 'https://... logo image URL' : "https://... logo görsel URL'si"}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400 mb-2"
                      />
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('customer.uploadLogo', currentLang === 'en' ? 'Upload Logo from Device' : 'Logoyu Cihazdan Yükle')}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleImageUpload(e, 'logo')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Visual Preview */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t('customer.coverLabel', currentLang === 'en' ? 'Cover / Hero Image (URL or Upload)' : 'Kapak / Hero Görseli (URL veya Dosya)')}
                      </label>
                      <input
                        type="text"
                        value={coverImage}
                        onChange={e => setCoverImage(e.target.value)}
                        placeholder={currentLang === 'en' ? 'https://... cover image URL' : "https://... kapak fotoğrafı URL'si"}
                        className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400 mb-2"
                      />
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{t('customer.uploadCover', currentLang === 'en' ? 'Upload Cover Image' : 'Kapak Fotoğrafını Yükle')}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleImageUpload(e, 'cover')}
                        />
                      </label>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-neutral-500">
                        {currentLang === 'en' ? 'Live Visual Preview:' : 'Canlı Görsel Önizleme:'}
                      </span>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800">
                        {coverImage ? (
                          <img
                            src={coverImage}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                            {currentLang === 'en' ? 'No Image Specified' : 'Görsel Belirtilmedi'}
                          </div>
                        )}
                        {logoUrl && (
                          <div className="absolute top-2 left-2 p-1.5 rounded bg-black/75 backdrop-blur-sm border border-neutral-700">
                            <img
                              src={logoUrl}
                              alt="Logo"
                              className="h-6 w-auto object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rich Text Editor for About / Company Description */}
                  <div className="md:col-span-2 pt-4 border-t border-neutral-800 space-y-2">
                    <label className="block text-xs font-semibold text-neutral-300">
                      {t('customer.aboutLabel', currentLang === 'en' ? 'Business Introduction & About Us Text (Rich Text Editor)' : 'Firma Tanıtımı & Hakkımızda Metni (Zengin Metin Editörü & İki Yana Yaslama)')}
                    </label>
                    <RichTextEditor
                      value={description}
                      onChange={setDescription}
                      placeholder={currentLang === 'en' ? 'Write your corporate introduction, vision, and service approach here...' : 'İşletmenizin kurumsal tanıtımını, vizyonunu ve hizmet yaklaşımını buraya yazın...'}
                      minHeight="min-h-[180px]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Hizmet Başlıkları */}
            {activeTab === 'services' && (
              <div className="space-y-6 max-w-4xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      {t('customer.servicesHeading', currentLang === 'en' ? 'Services & Descriptions' : 'Hizmet Başlıkları & Açıklamaları')}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {t('customer.servicesSubtitle', currentLang === 'en' ? 'Manage the services and details your business offers to clients.' : 'İşletmenizin müşterilere sunduğu hizmetleri ve detaylarını düzenleyin.')}
                    </p>
                  </div>
                  <button
                    onClick={handleAddService}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('customer.addService', currentLang === 'en' ? 'Add New Service' : 'Yeni Hizmet Ekle')}</span>
                  </button>
                </div>

                {/* Services List */}
                <div className="space-y-3">
                  {servicesList.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500 rounded-xl border border-neutral-800 bg-neutral-900">
                      {currentLang === 'en' ? 'No services added yet. Click "Add New Service" to start.' : 'Henüz hizmet eklenmedi. "Yeni Hizmet Ekle" butonuna basarak ekleyebilirsiniz.'}
                    </div>
                  ) : (
                    servicesList.map((service, index) => (
                      <div
                        key={service.id}
                        className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-mono font-bold text-amber-400">
                            #{index + 1}
                          </span>
                          <button
                            onClick={() => handleRemoveService(service.id)}
                            className="p-1 text-neutral-500 hover:text-red-400 rounded hover:bg-neutral-800"
                            title={currentLang === 'en' ? 'Delete this Service' : 'Bu Hizmeti Sil'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2">
                            <label className="block text-[11px] text-neutral-400 mb-1">
                              {t('customer.serviceTitleLabel', currentLang === 'en' ? 'Service Name' : 'Hizmet Adı')}
                            </label>
                            <input
                              type="text"
                              value={service.title}
                              onChange={e =>
                                handleUpdateService(service.id, 'title', e.target.value)
                              }
                              placeholder={currentLang === 'en' ? 'e.g. Zirconium Crown' : 'Örn: Zirkonyum Diş Kaplama'}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] text-neutral-400 mb-1">
                              {t('customer.servicePriceLabel', currentLang === 'en' ? 'Service Price / Rate' : 'Hizmet Fiyatı / Tarifesi')}
                            </label>
                            <input
                              type="text"
                              value={service.price}
                              onChange={e =>
                                handleUpdateService(service.id, 'price', e.target.value)
                              }
                              placeholder={currentLang === 'en' ? 'e.g. $250 or Ask for Quote' : 'Örn: 2.500 TL veya Fiyat Alın'}
                              className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] text-neutral-400 mb-1">
                            {t('customer.serviceDescLabel', currentLang === 'en' ? 'Service Description (Rich Text & Justified)' : 'Hizmet Açıklaması (Zengin Metin & İki Yana Yaslama)')}
                          </label>
                          <RichTextEditor
                            value={service.description}
                            onChange={val => handleUpdateService(service.id, 'description', val)}
                            placeholder={currentLang === 'en' ? 'Describe the advantages and process for clients...' : 'Bu hizmet kapsamında müşterilerinize sunduğunuz avantajlar ve süreç...'}
                            minHeight="min-h-[120px]"
                            title={currentLang === 'en' ? 'Service Description' : 'Hizmet Açıklaması'}
                            compact={true}
                            showTemplates={false}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Features Bullets Section */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {t('customer.highlightsHeading', currentLang === 'en' ? 'Featured Service Points (Showcase List)' : 'Öne Çıkan Hizmet Maddeleri (Vitrin Listesi)')}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {t('customer.highlightsSubtitle', currentLang === 'en' ? 'Main features displayed on your website showcase card.' : 'Ana sayfada sitenizin kartında görünen ana özellikler.')}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={e => setNewFeatureText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder={currentLang === 'en' ? 'Enter feature bullet (e.g. 24/7 Appointment Hotline)' : 'Yeni özellik maddesi yazın (örn: 7/24 Randevu Hattı)'}
                      className="flex-1 px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
                    >
                      {currentLang === 'en' ? 'Add' : 'Ekle'}
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {featuresList.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-950 border border-neutral-700 text-xs text-neutral-200"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-neutral-500 hover:text-red-400 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Fiyatlandırma */}
            {activeTab === 'pricing' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {t('customer.pricingHeading', currentLang === 'en' ? 'Package Pricing & Rates' : 'Paket Fiyatlandırma & Tarifeler')}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {t('customer.pricingSubtitle', currentLang === 'en' ? 'Set base package rates and quotes for your website.' : 'Sitenizin başlangıç paket fiyatlarını ve müşterilerinize sunduğunuz teklifleri belirleyin.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        {t('customer.economicPrice', currentLang === 'en' ? 'Economic Package Price (TRY)' : 'Ekonomik Paket Fiyatı (TL)')}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-800 text-neutral-300 font-bold">
                        {currentLang === 'en' ? 'Standard' : 'Standart'}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={priceEconomicTRY}
                      onChange={e => setPriceEconomicTRY(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                    <p className="text-[11px] text-neutral-500">
                      {currentLang === 'en' ? 'Starting price visible to visitors on the website.' : 'Ziyaretçilerin ilk ekranda göreceği başlangıç fiyatı.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-neutral-950 border border-amber-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        {t('customer.proPrice', currentLang === 'en' ? 'Professional CMS Price (TRY)' : 'Profesyonel CMS Fiyatı (TL)')}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                        {currentLang === 'en' ? 'Full Control' : 'Tam Yetkili'}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={priceProfessionalTRY}
                      onChange={e => setPriceProfessionalTRY(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                    <p className="text-[11px] text-neutral-500">
                      {currentLang === 'en' ? 'Full CMS package with advanced tools and custom modules.' : 'Gelişmiş yönetim ve ek modüller içeren tam yetkili paket fiyatı.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Çalışma Saatleri */}
            {activeTab === 'hours' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {t('customer.hoursHeading', currentLang === 'en' ? 'Business & Operating Hours' : 'Çalışma & Mesai Saatleri')}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {t('customer.hoursSubtitle', currentLang === 'en' ? 'Set business hours and order/appointment acceptance status.' : 'İşletmenizin açık olduğu saatleri ve randevu kabul durumunu belirleyin.')}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t('customer.weekdays', currentLang === 'en' ? 'Weekdays (Monday – Friday)' : 'Hafta İçi (Pazartesi – Cuma)')}
                      </label>
                      <input
                        type="text"
                        value={weekdaysHours}
                        onChange={e => setWeekdaysHours(e.target.value)}
                        placeholder="Örn: 09:00 - 19:00"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t('customer.saturday', currentLang === 'en' ? 'Saturday Hours' : 'Cumartesi Mesaisi')}
                      </label>
                      <input
                        type="text"
                        value={saturdayHours}
                        onChange={e => setSaturdayHours(e.target.value)}
                        placeholder="Örn: 10:00 - 16:00"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                        {t('customer.sunday', currentLang === 'en' ? 'Sunday Status' : 'Pazar Günü Durumu')}
                      </label>
                      <input
                        type="text"
                        value={sundayHours}
                        onChange={e => setSundayHours(e.target.value)}
                        placeholder="Örn: Kapalı veya Randevulu"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {t('customer.acceptingStatus', currentLang === 'en' ? 'Online Appointments / Inquiries Acceptance' : 'Online Randevu / Sipariş Kabulü')}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {currentLang === 'en' ? 'When enabled, visitors can submit quote inquiries and appointment requests via form and WhatsApp.' : 'Bu özellik açıkken ziyaretçiler siteniz üzerinden doğrudan form ve WhatsApp ile talep gönderebilir.'}
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acceptingOrders}
                        onChange={e => setAcceptingOrders(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: İletişim & WhatsApp */}
            {activeTab === 'contact' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {t('customer.contactHeading', currentLang === 'en' ? 'Phone, WhatsApp & Address Details' : 'Telefon, WhatsApp & Adres Bilgileri')}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {t('customer.contactSubtitle', currentLang === 'en' ? 'Update contact channels for customers to reach your business in one click.' : 'Müşterilerinizin size tek tıkla ulaşacağı telefon ve WhatsApp iletişim kanallarını güncelleyin.')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{t('customer.phone', currentLang === 'en' ? 'Business Call Phone *' : 'İşletme Arama Telefonu *')}</span>
                    </label>
                    <input
                      type="text"
                      value={businessPhone}
                      onChange={e => setBusinessPhone(e.target.value)}
                      placeholder="+90 (212) 890 42 10"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t('customer.whatsapp', currentLang === 'en' ? 'WhatsApp Order & Inquiry Line *' : 'WhatsApp Sipariş & Danışma Hattı *')}</span>
                    </label>
                    <input
                      type="text"
                      value={businessWhatsapp}
                      onChange={e => setBusinessWhatsapp(e.target.value)}
                      placeholder="+90 505 703 0194"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                    />
                    <span className="text-[10px] text-neutral-500 mt-1 block">
                      {currentLang === 'en' ? 'Visitors clicking the WhatsApp button connect directly to this number.' : 'Ziyaretçiler WhatsApp ikonuna tıkladığında doğrudan bu numaraya bağlanır.'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{t('customer.email', currentLang === 'en' ? 'Business Email Address' : 'İşletme E-Posta Adresi')}</span>
                    </label>
                    <input
                      type="email"
                      value={businessEmail}
                      onChange={e => setBusinessEmail(e.target.value)}
                      placeholder="iletisim@isletmeniz.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{t('customer.address', currentLang === 'en' ? 'Business Physical Address' : 'İşletme Açık Adresi')}</span>
                    </label>
                    <input
                      type="text"
                      value={businessAddress}
                      onChange={e => setBusinessAddress(e.target.value)}
                      placeholder={currentLang === 'en' ? 'City, District, Full Address' : 'Şehir, İlçe, Açık Adres'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Action Footer Bar */}
        <div className="h-16 px-6 bg-[#090b10] border-t border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {currentLang === 'en'
                ? 'Customer CMS mode safely updates only your business records.'
                : 'Müşteri Paneli modunda sadece işletmenize ait veriler güncellenir.'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={closeCustomerPanel}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-xl transition-colors cursor-pointer"
            >
              {currentLang === 'en' ? 'Cancel' : 'Vazgeç'}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-xl shadow-lg transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t('customer.saveChanges', currentLang === 'en' ? 'Save Changes & Publish' : 'Değişiklikleri Kaydet & Sitemde Yayınla')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

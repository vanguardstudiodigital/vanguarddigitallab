import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  TurnkeyProduct,
  CustomerServiceItem,
} from '../../types/index.ts';
import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  Star,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Send,
  User,
  ShoppingBag,
  ExternalLink,
  Award,
  Sparkles,
  Layers,
  Heart,
  Plus,
  Minus,
  Trash2,
  Calculator,
  Compass,
  Building,
  Menu as MenuIcon,
  X,
  Briefcase,
  Download,
  Scale,
  Home as HomeIcon,
  Dumbbell,
  Palette,
  Check,
} from 'lucide-react';
import { TURNKEY_TEMPLATES } from '../../data/turnkeySiteTemplates.ts';
import { RichContentRenderer } from '../common/RichContentRenderer.tsx';
import { stripHtml } from '../../utils/richTextRenderer.ts';

interface TurnkeyLiveSiteProps {
  product: TurnkeyProduct;
  currentLang: string;
  isStandalone?: boolean;
  onOpenCustomerPanel?: () => void;
  onOpenOrderModal?: () => void;
  onCloseStandalone?: () => void;
  onOpenDeployModal?: () => void;
}

export const TurnkeyLiveSite: React.FC<TurnkeyLiveSiteProps> = ({
  product,
  currentLang,
  isStandalone = false,
  onOpenCustomerPanel,
  onOpenOrderModal,
  onCloseStandalone,
  onOpenDeployModal,
}) => {
  const { formatPrice } = useApp();
  const [activeTab, setActiveTab] = useState<'home' | 'services' | 'about' | 'booking' | 'contact'>('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // E-Commerce cart state (for ecommerce demoType)
  const [cart, setCart] = useState<{ id: string; title: string; price: number; qty: number }[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Logistics calculator state
  const [logOrigin, setLogOrigin] = useState(currentLang === 'en' ? 'Istanbul, TR' : 'İstanbul, TR');
  const [logDest, setLogDest] = useState(currentLang === 'en' ? 'London, UK' : 'Ankara, TR');
  const [logWeight, setLogWeight] = useState(1500); // kg
  const [logMode, setLogMode] = useState<'truck' | 'sea' | 'air'>('truck');

  // Architecture filter state
  const [archFilter, setArchFilter] = useState<'all' | 'residential' | 'interior' | 'commercial'>('all');

  // Customer Business Info (Editable via CustomerPanel)
  const info = product.customerBusinessInfo;
  const siteTitle = info?.logoUrl ? product.title : (product.title || 'Vanguard Live Site');
  const phone = info?.phone || '+90 (212) 890 42 10';
  const whatsapp = (info?.whatsapp || '+90 505 703 0194').replace(/[^0-9]/g, '');
  const email = info?.email || 'iletisim@' + (product.slug || 'isletme') + '.com';
  const address = info?.address || (currentLang === 'en' ? 'Bagdat Ave No: 142, Kadikoy / Istanbul' : 'Bağdat Caddesi No:142, Kadıköy / İstanbul');
  const coverImage = info?.coverImageUrl || product.coverImage;

  // Active Template definition
  const tplKey = product.demoType || 'medical';
  const tpl = (TURNKEY_TEMPLATES as any)[tplKey] || TURNKEY_TEMPLATES.medical;

  // Localized texts
  const heroHeading = tpl.heroHeading?.[currentLang] || tpl.heroHeading?.tr || product.tagline;
  const heroSub = tpl.heroSub?.[currentLang] || tpl.heroSub?.tr || product.description;
  const heroKicker = tpl.heroKicker?.[currentLang] || tpl.heroKicker?.tr || product.sector;
  const ctaBtnText = tpl.ctaButton?.[currentLang] || tpl.ctaButton?.tr || (currentLang === 'en' ? 'Get In Touch' : 'Hemen İletişime Geçin');

  // Calculate estimated freight price (logistics demo)
  const estimatedFreightUSD = useMemo(() => {
    let ratePerKg = 0.85;
    if (logMode === 'air') ratePerKg = 3.4;
    if (logMode === 'sea') ratePerKg = 0.45;
    return Math.round(logWeight * ratePerKg + 250);
  }, [logWeight, logMode]);

  // Handle Action Submissions with direct WhatsApp dispatch
  const handleBookingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues: Record<string, string> = {};
    formData.forEach((value, key) => {
      formValues[key] = value.toString();
    });

    const isRu = currentLang === 'ru';
    const isEn = currentLang === 'en';

    let msg = `*${isRu ? 'Новая заявка' : isEn ? 'New Booking Request' : 'Yeni Randevu / Talep'} (${siteTitle})*\n`;
    if (formValues.name) msg += `👤 ${isRu ? 'Имя' : isEn ? 'Name' : 'Ad Soyad'}: ${formValues.name}\n`;
    if (formValues.phone) msg += `📞 ${isRu ? 'Телефон' : isEn ? 'Phone' : 'Tel'}: ${formValues.phone}\n`;
    if (formValues.service) msg += `📌 ${isRu ? 'Услуга' : isEn ? 'Service' : 'Hizmet'}: ${formValues.service}\n`;
    if (formValues.date) msg += `📅 ${isRu ? 'Дата' : isEn ? 'Date' : 'Tarih'}: ${formValues.date}\n`;
    if (formValues.notes) msg += `📝 ${isRu ? 'Примечание' : isEn ? 'Notes' : 'Not'}: ${formValues.notes}\n`;

    const waLink = `https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank');

    setSubmissionSuccess(
      isRu
        ? '✓ Заявка успешно принята! Перенаправляем в WhatsApp для мгновенного подтверждения.'
        : isEn
        ? '✓ Booking successfully captured! Redirecting to WhatsApp for instant confirmation.'
        : '✓ Talebiniz başarıyla alındı! Anında onay için WhatsApp hattımıza yönlendiriliyorsunuz.'
    );
    e.currentTarget.reset();
  };

  // Add to cart helper
  const addToCart = (item: { id: string; title: string; price: number }) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setCartOpen(true);
  };

  const cartTotalTRY = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCartCheckoutWA = () => {
    const isRu = currentLang === 'ru';
    const isEn = currentLang === 'en';
    let msg = `*${isRu ? 'Онлайн-Заказ' : isEn ? 'Online Order' : 'Online Sipariş'} (${siteTitle})*\n`;
    cart.forEach(item => {
      msg += `• ${item.qty}x ${item.title} - ${formatPrice(item.price * item.qty)}\n`;
    });
    msg += `\n*${isRu ? 'Итого' : isEn ? 'Total' : 'Toplam Tutar'}:* ${formatPrice(cartTotalTRY)}\n${isRu ? 'Хочу подтвердить заказ и указать адрес доставки.' : isEn ? 'I would like to confirm my order and share shipping details.' : 'Siparişimi onaylamak ve kargo bilgilerimi iletmek istiyorum.'}`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="min-h-full flex flex-col bg-white dark:bg-[#0c0e14] text-neutral-900 dark:text-neutral-100 font-sans selection:bg-amber-400 selection:text-black">
      {/* 1. Live Site Top Announcement / Working Hours Bar */}
      <div className="bg-neutral-950 text-neutral-300 border-b border-neutral-800 text-[11px] py-2 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {currentLang === 'en' ? 'Open Now · Online Inquiries Active'  : 'Şu An Açık · Randevu & Sipariş Kabul Ediliyor'}
          </span>
          <span className="text-neutral-600 hidden md:inline">|</span>
          <span className="text-neutral-400 hidden md:flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            {info?.openingHours?.weekdays || (currentLang === 'en' ? '09:00 - 19:00 (Weekdays)' : '09:00 - 19:00 (Hafta İçi)')}
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <a
            href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
            className="flex items-center gap-1 text-white hover:text-amber-400 transition-colors"
          >
            <Phone className="w-3 h-3 text-amber-400" />
            <span>{phone}</span>
          </a>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-sans"
          >
            <MessageCircle className="w-3 h-3" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* 2. Standalone Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0c0e14]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('home')}
            className="text-left font-display font-extrabold text-base sm:text-lg tracking-tight text-neutral-950 dark:text-white flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 font-bold flex items-center justify-center text-sm shadow-sm">
              {siteTitle.charAt(0)}
            </div>
            <div>
              <span className="block leading-none">{siteTitle}</span>
              <span className="text-[10px] text-neutral-500 font-sans font-normal uppercase tracking-wider">
                {product.sector}
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-300">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors cursor-pointer ${activeTab === 'home' ? 'text-amber-500 font-bold' : 'hover:text-black dark:hover:text-white'}`}
          >
            {currentLang === 'en' ? 'Home'  : 'Ana Sayfa'}
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`transition-colors cursor-pointer ${activeTab === 'services' ? 'text-amber-500 font-bold' : 'hover:text-black dark:hover:text-white'}`}
          >
            {tplKey === 'restaurant'
              ? (currentLang === 'en' ? 'Food & Drink Menu' : 'Menü & Fiyatlar')
              : tplKey === 'ecommerce'
              ? (currentLang === 'en' ? 'Product Catalog' : 'Ürün Kataloğu')
              : tplKey === 'realestate'
              ? (currentLang === 'en' ? 'Properties' : 'Mülk Portföyü')
              : tplKey === 'architecture'
              ? (currentLang === 'en' ? 'Projects' : 'Projelerimiz')
              : tplKey === 'portfolio'
              ? (currentLang === 'en' ? 'Case Studies' : 'Seçkin Projeler')
              : (currentLang === 'en' ? 'Services & Pricing' : 'Hizmetler & Branşlar')}
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`transition-colors cursor-pointer ${activeTab === 'about' ? 'text-amber-500 font-bold' : 'hover:text-black dark:hover:text-white'}`}
          >
            {tplKey === 'medical'
              ? (currentLang === 'en' ? 'Specialists' : 'Hekim Kadromuz')
              : tplKey === 'law'
              ? (currentLang === 'en' ? 'Attorneys' : 'Avukatlarımız')
              : tplKey === 'fitness'
              ? (currentLang === 'en' ? 'Trainers & Plans' : 'Eğitmenler & Üyelik')
              : tplKey === 'portfolio'
              ? (currentLang === 'en' ? 'Design Team' : 'Kreatif Ekip')
              : (currentLang === 'en' ? 'About Us' : 'Hakkımızda')}
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`transition-colors cursor-pointer ${activeTab === 'contact' ? 'text-amber-500 font-bold' : 'hover:text-black dark:hover:text-white'}`}
          >
            {currentLang === 'en' ? 'Contact & Map'  : 'İletişim & Konum'}
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {tplKey === 'ecommerce' && (
            <button
              onClick={() => setCartOpen(!cartOpen)}
              className="relative p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:text-black transition-colors cursor-pointer"
              title={currentLang === 'en' ? 'Cart'  : 'Sepetim'}
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-neutral-950 font-bold text-[10px] flex items-center justify-center">
                  {cart.reduce((a, b) => a + b.qty, 0)}
                </span>
              )}
            </button>
          )}

          {onOpenDeployModal && (
            <button
              onClick={onOpenDeployModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
              title={currentLang === 'en' ? 'Deploy Turnkey Site'  : 'Yayına Al & Export'}
            >
              <Download className="w-3.5 h-3.5" />
              <span>{currentLang === 'en' ? 'Deploy Site'  : 'Yayına Al'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('booking')}
            className="px-3.5 py-2 text-xs font-bold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{ctaBtnText}</span>
          </button>

          {/* Mobile Nav Hamburger */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
          >
            {mobileNavOpen ? <X className="w-4 h-4" /> : <MenuIcon className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0c0e14] border-b border-neutral-200 dark:border-neutral-800 p-4 space-y-2 text-xs animate-fade-in">
          <button
            onClick={() => { setActiveTab('home'); setMobileNavOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {currentLang === 'en' ? 'Home'  : 'Ana Sayfa'}
          </button>
          <button
            onClick={() => { setActiveTab('services'); setMobileNavOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {currentLang === 'en' ? 'Services & Catalog'  : 'Hizmetler / Menü / Portföy'}
          </button>
          <button
            onClick={() => { setActiveTab('about'); setMobileNavOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {currentLang === 'en' ? 'About & Team'  : 'Hakkımızda & Kadro'}
          </button>
          <button
            onClick={() => { setActiveTab('contact'); setMobileNavOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            {currentLang === 'en' ? 'Contact & Map'  : 'İletişim & Konum'}
          </button>
        </div>
      )}

      {/* Success Banner */}
      {submissionSuccess && (
        <div className="bg-emerald-500/15 border-b border-emerald-500/30 px-6 py-3 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
          <span>{submissionSuccess}</span>
          <button onClick={() => setSubmissionSuccess(null)} className="underline cursor-pointer">
            {currentLang === 'en' ? 'Close'  : 'Kapat'}
          </button>
        </div>
      )}

      {/* MAIN VIEWPORT BODY */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            {/* HERO SECTION */}
            <section className="relative overflow-hidden bg-neutral-950 text-white py-16 sm:py-24 px-6 sm:px-12">
              <div className="absolute inset-0 z-0">
                <img
                  src={coverImage}
                  alt={siteTitle}
                  className="w-full h-full object-cover opacity-25 filter blur-xs scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
              </div>

              <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  {heroKicker}
                </span>

                <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
                  {heroHeading}
                </h1>

                <div className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed text-justify sm:text-center">
                  <RichContentRenderer content={heroSub} className="text-justify sm:text-center text-neutral-300" />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    onClick={() => setActiveTab('booking')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{ctaBtnText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`${currentLang === 'en' ? 'Hello' : 'Merhaba'} ${siteTitle}, ${currentLang === 'en' ? 'I would like to inquire via your website.' : 'web siteniz üzerinden detaylı bilgi almak istiyorum.'}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{currentLang === 'en' ? 'WhatsApp Fast Consultation'  : 'WhatsApp Hızlı Danışma'}</span>
                  </a>
                </div>

                {/* Trust Badges */}
                <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400 border-t border-neutral-800/80">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>{currentLang === 'en' ? '100% Verified Quality'  : '%100 Kurumsal Güvence'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{currentLang === 'en' ? '4.9/5.0 Client Rating (140+ Reviews'  : '4.9/5.0 Google Müşteri Puanı (140+ Değerlendirme)'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>{currentLang === 'en' ? 'Certified Expertise'  : 'Sertifikalı & Deneyimli Kadro'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTOR SPECIALIZED HIGHLIGHT SECTION */}
            {/* 1. MEDICAL TEMPLATE */}
            {tplKey === 'medical' && (
              <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                    {currentLang === 'en' ? 'Aura Dental Treatments'  : 'Aura Dental Tedavileri'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-2">
                    {currentLang === 'en' ? 'Specialized Clinical Treatments'  : 'Öne Çıkan Klinik Hizmetlerimiz'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-2 text-justify sm:text-center">
                    {currentLang === 'en' ? 'Advanced 3D oral scanning, digital smile architecture, and pain-free treatment protocols.'  : 'İleri teknoloji 3D ağız içi tarama ve ağrısız anestezi ile konforlu tedavi süreci.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tpl.treatments?.map((t: any) => (
                    <div key={t.id} className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-amber-400 transition-colors">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">{t.category}</span>
                        <h3 className="text-base font-bold mt-3 font-display">{t.title}</h3>
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed text-justify">{t.description}</p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                        <span className="text-neutral-400 font-mono">{t.duration}</span>
                        <button onClick={() => setActiveTab('booking')} className="font-bold text-amber-500 hover:underline">
                          {currentLang === 'en' ? 'Book Visit →'  : 'Randevu Al →'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 2. LAW TEMPLATE */}
            {tplKey === 'law' && (
              <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                    {currentLang === 'en' ? 'Legal Practice Areas'  : 'Hukuki Faaliyet Alanları'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-2">
                    {currentLang === 'en' ? 'Strategic Corporate & Civil Advisory'  : 'Kurumsal & Bireysel Hukuki Uzmanlık'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-2 text-justify sm:text-center">
                    {currentLang === 'en' ? 'Comprehensive counsel in litigation, cross-border transactions, and corporate defense.'  : 'Yüksek gizlilik ve ticari hedeflerinize uygun dava ve danışmanlık stratejileri.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tpl.practices?.map((p: any) => (
                    <div key={p.id} className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between hover:border-amber-400 transition-colors">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">{p.subtitle}</span>
                        <h3 className="text-base font-bold mt-3 font-display">{p.title}</h3>
                        <p className="text-xs text-neutral-500 mt-2 leading-relaxed text-justify">{p.description}</p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                        <span className="text-neutral-400 font-mono text-[11px]">{p.casesHandled}</span>
                        <button onClick={() => setActiveTab('booking')} className="font-bold text-amber-500 hover:underline">
                          {currentLang === 'en' ? 'Inquire →'  : 'Danışmanlık Al →'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 3. RESTAURANT TEMPLATE */}
            {tplKey === 'restaurant' && (
              <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                    {currentLang === 'en' ? 'Hearthside Gastronomy'  : 'Odun Ateşinde Gurme Lezzetler'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-2">
                    {currentLang === 'en' ? 'Chef Signature Menu'  : 'Şefin İmza Menüsü'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-2 text-justify sm:text-center">
                    {currentLang === 'en' ? 'Slow-fermented sourdough pizzas, handcrafted pastas, and artisanal desserts.'  : 'Günlük taze hamur, İtalyan unları ve soğuk fermantasyon ile eşsiz lezzet.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tpl.menu?.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col">
                      <div className="h-48 overflow-hidden bg-neutral-800">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold font-display">{item.title}</h3>
                            <span className="font-mono-numbers font-bold text-amber-500">{formatPrice(item.priceTRY)}</span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-2 line-clamp-2 text-justify">{item.description}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                          <span className="text-[10px] text-neutral-400">{item.dietaryTags?.join(' · ')}</span>
                          <button onClick={() => setActiveTab('booking')} className="text-xs font-bold text-amber-500 hover:underline">
                            {currentLang === 'en' ? 'Reserve'  : 'Masa Ayırt'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. ARCHITECTURE TEMPLATE */}
            {tplKey === 'architecture' && (
              <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                    {currentLang === 'en' ? 'Architectural Portfolio'  : 'Mimari Portföy & Projeler'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-2">
                    {currentLang === 'en' ? 'Featured Architectural Works'  : 'Seçkin Mimari & İç Mekan Çalışmaları'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-2 text-justify sm:text-center">
                    {currentLang === 'en' ? 'Bespoke coastal villas, boutique hospitality, and human-centric living spaces.'  : 'Doğal malzemeler, brüt beton ve ışığın mimari dengesiyle inşa edilen yapılar.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tpl.projects?.map((proj: any) => (
                    <div key={proj.id} className="rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col group">
                      <div className="h-56 overflow-hidden bg-neutral-800 relative">
                        <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-amber-400">
                          {proj.year} · {proj.area}
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{proj.category}</span>
                          <h3 className="text-base font-bold font-display mt-1">{proj.title}</h3>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-neutral-500" />
                            <span>{proj.location}</span>
                          </div>
                          <p className="text-xs text-neutral-500 mt-2 leading-relaxed text-justify">{proj.description}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                          <button onClick={() => setActiveTab('booking')} className="text-xs font-bold text-amber-500 hover:underline">
                            {currentLang === 'en' ? 'Discuss Project →'  : 'Proje Başlat →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. LOGISTICS TEMPLATE */}
            {tplKey === 'logistics' && (
              <section className="py-16 px-6 sm:px-12 max-w-5xl mx-auto">
                <div className="p-8 rounded-3xl bg-neutral-950 text-white border border-neutral-800 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Calculator className="w-6 h-6 text-amber-400" />
                    <div>
                      <h3 className="text-lg font-bold font-display">
                        {currentLang === 'en' ? 'Live Freight Cost Calculator'  : 'Canlı Navlun ve Taşıma Maliyeti Hesaplayıcı'}
                      </h3>
                      <p className="text-xs text-neutral-400">
                        {currentLang === 'en' ? 'Instant freight estimation for Turkey - Russia - Europe routes.'  : 'Türkiye - Rusya - Avrupa hattı için anlık tahmini navlun hesaplayın.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {currentLang === 'en' ? 'Origin City'  : 'Çıkış Noktası'}
                      </label>
                      <input
                        type="text"
                        value={logOrigin}
                        onChange={e => setLogOrigin(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {currentLang === 'en' ? 'Destination'  : 'Varış Noktası'}
                      </label>
                      <input
                        type="text"
                        value={logDest}
                        onChange={e => setLogDest(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-300 mb-1">
                        {currentLang === 'en' ? 'Weight (kg)'  : 'Tahmini Ağırlık (kg)'}
                      </label>
                      <input
                        type="number"
                        value={logWeight}
                        onChange={e => setLogWeight(Number(e.target.value))}
                        className="w-full p-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-neutral-400">
                        {currentLang === 'en' ? 'Estimated Freight Rate (excl. customs):' : 'Tahmini Navlun Bedeli (Gümrük Hariç):'}
                      </div>
                      <div className="text-2xl font-bold font-mono text-amber-400">${estimatedFreightUSD.toLocaleString()} USD</div>
                    </div>
                    <a
                      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Merhaba Nordic Global Lojistik, ${logOrigin} -> ${logDest} hattında ${logWeight} kg yüküm için $${estimatedFreightUSD} tutarındaki navlun teklifi hakkında görüşmek istiyorum.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{currentLang === 'en' ? 'Request Official Freight Quote'  : 'Bu Rota İçin Resmi Teklif İste'}</span>
                    </a>
                  </div>
                </div>
              </section>
            )}

            {/* 6. E-COMMERCE TEMPLATE */}
            {tplKey === 'ecommerce' && (
              <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                    {currentLang === 'en' ? 'Featured Collection'  : 'Velo Premium Seçkisi'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-2">
                    {currentLang === 'en' ? 'Featured Bikes & Urban Mobility'  : 'Öne Çıkan Bisiklet & Ekipmanlar'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-2">
                    {currentLang === 'en' ? 'Add products directly to cart or purchase via instant WhatsApp checkout.'  : 'Hemen sepetinize ekleyebilir veya tek tıkla WhatsApp üzerinden sipariş verebilirsiniz.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {tpl.products?.map((prod: any) => (
                    <div key={prod.id} className="rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col justify-between p-4">
                      <div className="aspect-square rounded-xl overflow-hidden bg-neutral-800 mb-4">
                        <img src={prod.image} alt={prod.title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-500 font-bold uppercase">{prod.category}</span>
                        <h4 className="text-sm font-bold mt-1 line-clamp-1">{prod.title}</h4>
                        <div className="mt-2 text-sm font-bold font-mono text-neutral-900 dark:text-white">
                          {formatPrice(prod.priceTRY)}
                        </div>
                      </div>
                      <button
                        onClick={() => addToCart({ id: prod.id, title: prod.title, price: prod.priceTRY })}
                        className="mt-4 w-full py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{currentLang === 'en' ? 'Add to Cart'  : 'Sepete Ekle'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. REAL ESTATE TEMPLATE */}
            {tplKey === 'realestate' && (
              <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                    {currentLang === 'en' ? 'Prime Real Estate'  : 'Veritas Portföyü'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-2">
                    {currentLang === 'en' ? 'Curated Luxury Residences'  : 'Seçkin Gayrimenkul Portföyü'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-2">
                    {currentLang === 'en' ? 'Seaside villas, penthouses and high-yield investment assets in prime Turkish locations.'  : 'Vatandaşlığa uygun, deniz manzaralı akıllı villalar ve Boğaz hattı rezidansları.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tpl.properties?.map((prop: any) => (
                    <div key={prop.id} className="rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col group">
                      <div className="h-56 overflow-hidden bg-neutral-800 relative">
                        <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-amber-400">
                          ${prop.priceUSD.toLocaleString()} USD
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{prop.type}</span>
                          <h3 className="text-base font-bold font-display mt-1">{prop.title}</h3>
                          <div className="text-[11px] text-neutral-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-neutral-500" />
                            <span>{prop.location}</span>
                          </div>
                          <div className="flex items-center gap-3 mt-3 text-xs text-neutral-400 font-mono">
                            <span>{prop.bedrooms} {currentLang === 'en' ? 'Beds'  : 'Oda'}</span>
                            <span>·</span>
                            <span>{prop.bathrooms} {currentLang === 'en' ? 'Baths'  : 'Banyo'}</span>
                            <span>·</span>
                            <span>{prop.areaM2} m²</span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                          <span className="text-xs font-bold font-mono text-neutral-950 dark:text-white">
                            {formatPrice(prop.priceTRY)}
                          </span>
                          <button onClick={() => setActiveTab('booking')} className="text-xs font-bold text-amber-500 hover:underline">
                            {currentLang === 'en' ? 'Book Tour →'  : 'VIP Tur İste →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 8. FITNESS TEMPLATE */}
            {tplKey === 'fitness' && (
              <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                    {currentLang === 'en' ? 'Membership Plans'  : 'Pulse Kulüp Üyelikleri'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-2">
                    {currentLang === 'en' ? 'Transform Your Athletic Potential'  : 'Hedeflerinize Uygun Üyelik Paketleri'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-2">
                    {currentLang === 'en' ? 'Unlimited gym access, reformer pilates, and tailored one-on-one personal training.'  : 'InBody vücut analizi, grup dersleri ve uzman eğitmenlerle birebir çalışma programları.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tpl.plans?.map((plan: any) => (
                    <div
                      key={plan.id}
                      className={`p-6 rounded-2xl flex flex-col justify-between border transition-all ${
                        plan.isPopular
                          ? 'bg-neutral-900 border-amber-500/60 shadow-xl shadow-amber-500/5'
                          : 'bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800'
                      }`}
                    >
                      <div>
                        {plan.isPopular && (
                          <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-neutral-950 uppercase mb-3">
                            {currentLang === 'en' ? 'Most Popular'  : 'En Çok Tercih Edilen'}
                          </span>
                        )}
                        <h3 className="text-base font-bold font-display">{plan.name}</h3>
                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-3xl font-black font-mono text-amber-500">{formatPrice(plan.monthlyTRY)}</span>
                          <span className="text-xs text-neutral-400">/{currentLang === 'en' ? 'mo'  : 'ay'}</span>
                        </div>
                        <div className="mt-6 space-y-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                          {plan.features.map((feat: string, i: number) => (
                            <div key={i} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('booking')}
                        className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          plan.isPopular
                            ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950'
                            : 'bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 text-white'
                        }`}
                      >
                        {currentLang === 'en' ? 'Select Plan'  : 'Hemen Başla'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 9. CREATIVE PORTFOLIO TEMPLATE */}
            {tplKey === 'portfolio' && (
              <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                    {currentLang === 'en' ? 'Selected Case Studies'  : 'Ödüllü Vaka Analizleri'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-2">
                    {currentLang === 'en' ? 'Work That Defines Category Leaders'  : 'Lider Markalar İçin Sıra Dışı Tasarımlar'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 mt-2">
                    {currentLang === 'en' ? 'Bespoke UI/UX architectures, WebGL interactions, and global brand ecosystems.'  : 'UI/UX stratejisi, WebGL deneyimleri ve yüksek dönüşümlü web uygulamaları.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {tpl.caseStudies?.map((cs: any) => {
                    const titleStr = typeof cs.title === 'object' ? (cs.title[currentLang] || cs.title.tr) : cs.title;
                    const descStr = typeof cs.description === 'object' ? (cs.description[currentLang] || cs.description.tr) : cs.description;
                    const clientStr = typeof cs.client === 'object' ? (cs.client[currentLang] || cs.client.tr) : cs.client;
                    const categoryStr = typeof cs.category === 'object' ? (cs.category[currentLang] || cs.category.tr) : cs.category;

                    return (
                      <div key={cs.id} className="rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col group">
                        <div className="h-64 overflow-hidden bg-neutral-800 relative">
                          <img src={cs.image} alt={titleStr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1 rounded text-[11px] font-mono text-emerald-400 font-bold">
                            {cs.metric}
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">{categoryStr}</span>
                            <h3 className="text-lg font-bold font-display mt-1">{titleStr}</h3>
                            <p className="text-xs text-neutral-400 mt-0.5">{clientStr}</p>
                            <p className="text-xs text-neutral-500 mt-3 leading-relaxed text-justify">{descStr}</p>
                          </div>
                          <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                            <button onClick={() => setActiveTab('booking')} className="text-xs font-bold text-amber-500 hover:underline cursor-pointer">
                              {currentLang === 'en' ? 'Start Project →'  : 'Proje Başlat →'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 10. UFO & COSMIC MEDIA PORTAL TEMPLATE */}
            {tplKey === 'custom' && (
              <section className="py-16 px-6 sm:px-12 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-12">
                  <span className="text-xs font-bold text-emerald-400 font-mono uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>
                      {currentLang === 'en' ? 'AI Telemetry & Deep Space Research'  : 'Yapay Zeka Telemetri & Kozmik Yayınlar'}
                    </span>
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display mt-2 text-neutral-900 dark:text-white">
                    {currentLang === 'en' ? 'Verified Anomaly Dossiers & Space Research'  : 'Doğrulanmış UFO İhbarları & Siber Anomali Dosyaları'}
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 text-justify sm:text-center">
                    {heroSub}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {tpl.caseStudies?.map((cs: any) => {
                    const titleStr = typeof cs.title === 'object' ? (cs.title[currentLang] || cs.title.tr) : cs.title;
                    const descStr = typeof cs.description === 'object' ? (cs.description[currentLang] || cs.description.tr) : cs.description;
                    const clientStr = typeof cs.client === 'object' ? (cs.client[currentLang] || cs.client.tr) : cs.client;
                    const categoryStr = typeof cs.category === 'object' ? (cs.category[currentLang] || cs.category.tr) : cs.category;

                    return (
                      <div key={cs.id} className="rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 flex flex-col group transition-all shadow-xl">
                        <div className="h-64 overflow-hidden bg-neutral-950 relative">
                          <img src={cs.image} alt={titleStr} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" />
                          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded text-[11px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                            {cs.metric}
                          </div>
                        </div>
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-wider">{categoryStr}</span>
                            <h3 className="text-lg font-bold font-display mt-1 text-white">{titleStr}</h3>
                            <p className="text-xs text-neutral-400 mt-0.5 font-mono">{clientStr}</p>
                            <p className="text-xs text-neutral-400 mt-3 leading-relaxed text-justify">{descStr}</p>
                          </div>
                          <div className="mt-5 pt-4 border-t border-neutral-800 flex items-center justify-between">
                            <button
                              onClick={() => setActiveTab('booking')}
                              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer"
                            >
                              <span>
                                {currentLang === 'en' ? 'Read Article / Review →'  : 'Makaleyi Oku / İncele →'}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* CUSTOMER PANEL CUSTOM SERVICES SECTION (Dynamically reflecting edits) */}
            {info?.servicesList && info.servicesList.length > 0 && (
              <section className="py-16 px-6 sm:px-12 bg-neutral-50 dark:bg-[#0e111a] border-t border-neutral-200 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center max-w-xl mx-auto mb-10">
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                      {currentLang === 'en' ? 'Custom Service Packages'  : 'Özel Hizmet Paketleri'}
                    </span>
                    <h2 className="text-2xl font-extrabold font-display mt-1">
                      {currentLang === 'en' ? 'Current Offerings'  : 'İşletmenizin Güncel Servisleri'}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {info.servicesList.map(srv => (
                      <div key={srv.id} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-sm text-neutral-950 dark:text-white">{srv.title}</h4>
                          <span className="text-xs font-mono font-bold text-amber-500">{srv.price}</span>
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed">{srv.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* 2. SERVICES TAB */}
        {activeTab === 'services' && (
          <section className="py-16 px-6 sm:px-12 max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{siteTitle}</span>
              <h2 className="text-3xl font-extrabold font-display">
                {currentLang === 'en' ? 'Complete Catalog of Services'  : 'Tüm Hizmet & Ürün Seçeneklerimiz'}
              </h2>
              <p className="text-xs text-neutral-500">
                {currentLang === 'en' ? 'Tailored solutions structured for premium quality and proven results.'  : 'Müşterilerimizin ihtiyaçlarına göre yapılandırılmış eksiksiz çözümler.'}
              </p>
            </div>

            <div className="space-y-4">
              {product.features.map((feat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold">{feat}</span>
                  </div>
                  <button onClick={() => setActiveTab('booking')} className="px-3 py-1.5 bg-amber-400 text-black rounded-lg text-xs font-bold hover:bg-amber-300">
                    {currentLang === 'en' ? 'Inquire'  : 'Talep Et'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. ABOUT / STAFF TAB */}
        {activeTab === 'about' && (
          <section className="py-16 px-6 sm:px-12 max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{tpl.staffTitle?.[currentLang] || (currentLang === 'en' ? 'About & Team'  : 'Kadro & Hakkımızda')}</span>
              <h2 className="text-3xl font-extrabold font-display">
                {currentLang === 'ru' ? `О компании ${siteTitle}` : currentLang === 'en' ? `About ${siteTitle}` : `${siteTitle} Hakkında`}
              </h2>
              <div className="text-xs sm:text-sm text-neutral-500 max-w-2xl mx-auto leading-relaxed text-justify sm:text-center">
                <RichContentRenderer content={product.description} className="text-justify sm:text-center text-neutral-500" />
              </div>
            </div>

            {/* Structured Corporate Blocks: Biz Kimiz, Neden Kurulduk, Çalışma İlkelerimiz */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between hover:border-amber-400 transition-colors">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-xs mb-3 font-mono">01</div>
                  <h3 className="text-base font-bold font-display text-neutral-950 dark:text-white">
                    {currentLang === 'en' ? 'Who We Are'  : 'Biz Kimiz?'}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2.5 text-justify">
                    {currentLang === 'ru'
                      ? `${siteTitle} — ведущее отраслевое предприятие в сегменте ${product.sector}. Мы объединяем сертифицированных специалистов с многолетним стажем, инновационные технологии и персональный сервис высочайшего класса.`
                      : currentLang === 'en'
                      ? `${siteTitle} is an established premium provider within the ${product.sector} sector. We bring together accredited industry professionals, modern methodologies, and client-centric excellence.`
                      : `${siteTitle}; ${product.sector} alanında yenilikçi, güvenilir ve yüksek kalite standartlarını benimseyen seçkin bir kuruluştur. Alanında uzman ekibimizle her müşterimize özel çözümler üretiyoruz.`}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between hover:border-emerald-400 transition-colors">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs mb-3 font-mono">02</div>
                  <h3 className="text-base font-bold font-display text-neutral-950 dark:text-white">
                    {currentLang === 'en' ? 'Why We Exist'  : 'Neden Kurulduk?'}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2.5 text-justify">
                    {currentLang === 'en' ? 'To deliver transparent, dependable, and high-impact services with zero hidden complexity, rapid turnaround, and uncompromising professional integrity.'  : 'Müşterilerimize bürokratik engellerden arındırılmış, şeffaf, hızlı ve garantili bir hizmet deneyimi sunmak amacıyla kurulduk. Güven ve memnuniyet temel önceliğimizdir.'}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 flex flex-col justify-between hover:border-cyan-400 transition-colors">
                <div>
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold text-xs mb-3 font-mono">03</div>
                  <h3 className="text-base font-bold font-display text-neutral-950 dark:text-white">
                    {currentLang === 'en' ? 'Working Principles'  : 'Çalışma İlkelerimiz'}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mt-2.5 text-justify">
                    {currentLang === 'en' ? '1. Flawless execution and uncompromising safety. 2. Absolute data confidentiality. 3. Continuous direct communication and WhatsApp support 7 days a week.'  : '1. Sıfır hata ve tavizsiz kalite güvencesi. 2. Tam gizlilik ve kurumsal şeffaflık. 3. Haftanın 7 günü WhatsApp üzerinden kesintisiz iletişim ve destek.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Doctors / Specialists Cards */}
            {tpl.doctors && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {tpl.doctors.map((doc: any, i: number) => (
                  <div key={i} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-3">
                    <img src={doc.image} alt={doc.name} className="w-24 h-24 rounded-full mx-auto object-cover ring-2 ring-amber-400" />
                    <div>
                      <h4 className="font-bold text-sm">{doc.name}</h4>
                      <p className="text-xs text-amber-500 font-medium">{doc.role}</p>
                      <p className="text-[11px] text-neutral-400 mt-1 text-justify sm:text-center">{doc.specialty}</p>
                      <p className="text-[10px] text-neutral-500 font-mono mt-1">{doc.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 4. ONLINE BOOKING / ORDER TAB */}
        {(activeTab === 'booking' || activeTab === 'contact') && (
          <section className="py-16 px-6 sm:px-12 max-w-4xl mx-auto">
            <div className="p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
                  {currentLang === 'en' ? 'Online Desk'  : 'Online İşlem Masası'}
                </span>
                <h2 className="text-2xl font-extrabold font-display">
                  {currentLang === 'en' ? 'Book Your Appointment / Request Quote'  : 'Hemen Randevu / Teklif Formu Doldurun'}
                </h2>
                <p className="text-xs text-neutral-500">
                  {currentLang === 'en' ? 'Inquiry is dispatched instantly to our verified WhatsApp and CRM console.'  : 'Talebiniz kaydedilir ve WhatsApp üzerinden yetkili danışmanımıza anında iletilir.'}
                </p>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {currentLang === 'en' ? 'Full Name *'  : 'Adınız Soyadınız *'}
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder={currentLang === 'en' ? 'e.g. Alex Smith' : 'Örn: Ahmet Yılmaz'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {currentLang === 'en' ? 'Phone Number *'  : 'Telefon Numaranız *'}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+90 532 000 0000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {currentLang === 'en' ? 'Service / Practice Area'  : 'İlgilendiğiniz Hizmet / Bölüm'}
                    </label>
                    <input
                      type="text"
                      name="service"
                      defaultValue={product.sector}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {currentLang === 'en' ? 'Preferred Date'  : 'Tercih Edilen Tarih'}
                    </label>
                    <input
                      type="date"
                      name="date"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {currentLang === 'en' ? 'Your Message / Inquiry Details'  : 'Talebiniz veya Özel Notunuz'}
                  </label>
                  <textarea
                    rows={3}
                    name="notes"
                    placeholder={currentLang === 'en' ? 'Write your questions or consultation details here...'  : 'Sormak istediğiniz soruları veya randevu detaylarınızı buraya yazabilirsiniz...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {currentLang === 'en' ? 'Submit Inquiry & Confirm via WhatsApp'  : 'Randevuyu / Talebi Gönder & WhatsApp Onayı Al'}
                  </span>
                </button>
              </form>
            </div>
          </section>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-neutral-950 text-neutral-400 border-t border-neutral-800 text-xs py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-8 border-b border-neutral-800/80">
          <div className="space-y-3">
            <h4 className="text-white font-bold font-display text-sm">{siteTitle}</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed">{product.tagline}</p>
            <div className="text-[10px] text-emerald-400 font-mono">
              {currentLang === 'en' ? '✓ SSL 256-Bit Security · Mobile Optimized'  : '✓ SSL 256-Bit Güvenlik · Mobil Uyumlu'}
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-semibold text-xs">
              {currentLang === 'en' ? 'Working Hours'  : 'Çalışma Saatleri'}
            </h5>
            <div className="text-[11px] space-y-1 text-neutral-400">
              <div>{currentLang === 'en' ? 'Weekdays'  : 'Hafta İçi'}: {info?.openingHours?.weekdays || '09:00 - 19:00'}</div>
              <div>{currentLang === 'en' ? 'Saturday'  : 'Cumartesi'}: {info?.openingHours?.saturday || '10:00 - 16:00'}</div>
              <div>{currentLang === 'en' ? 'Sunday'  : 'Pazar'}: {info?.openingHours?.sunday || (currentLang === 'en' ? 'Closed'  : 'Kapalı (Acil Randevulu')}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-semibold text-xs">
              {currentLang === 'en' ? 'Contact & Location'  : 'İletişim & Konum'}
            </h5>
            <div className="text-[11px] space-y-1.5 text-neutral-400">
              <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-amber-400" /><span>{phone}</span></div>
              <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-amber-400" /><span>{email}</span></div>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-amber-400" /><span>{address}</span></div>
            </div>
          </div>

          <div className="space-y-2">
            <h5 className="text-white font-semibold text-xs">
              {currentLang === 'en' ? 'Quick Contact'  : 'Hızlı Başvuru'}
            </h5>
            <p className="text-[11px] text-neutral-400">
              {currentLang === 'en' ? 'Online desk and WhatsApp line active 24/7.'  : 'Online ön başvuru veya WhatsApp danışma hattımız 7/24 aktiftir.'}
            </p>
            <button onClick={() => setActiveTab('booking')} className="px-3 py-1.5 bg-amber-400 text-black rounded-lg text-xs font-bold hover:bg-amber-300">
              {currentLang === 'en' ? 'Book Online'  : 'Online Randevu Al'}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>© {new Date().getFullYear()} {siteTitle}. {currentLang === 'en' ? 'All rights reserved.'  : 'Tüm hakları saklıdır.'}</div>
          <div className="text-amber-500/80 font-mono text-[10px]">
            ⚡ Vanguard Studio · Turnkey Architecture
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`${currentLang === 'en' ? 'Hello'  : 'Merhaba'} ${siteTitle}, ${currentLang === 'en' ? 'reaching out from your website.'  : 'web siteniz üzerinden ulaşıyorum.'}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105"
        title="WhatsApp"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="text-xs font-bold hidden sm:inline">WhatsApp</span>
      </a>

      {/* E-COMMERCE MINI CART SLIDE-OVER */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 p-6 flex flex-col h-full shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm">
                  {currentLang === 'en' ? 'Shopping Cart'  : 'Alışveriş Sepetiniz'} ({cart.reduce((a, b) => a + b.qty, 0)})
                </h3>
              </div>
              <button onClick={() => setCartOpen(false)} className="p-1 text-neutral-500 hover:text-black dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-neutral-400 text-xs">
                  {currentLang === 'en' ? 'Your cart is empty.'  : 'Sepetinizde ürün bulunmuyor.'}
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold">{item.title}</div>
                      <div className="text-xs text-amber-500 font-mono mt-0.5">{formatPrice(item.price)}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700">{item.qty} {currentLang === 'en' ? 'pcs'  : 'adet'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                <div className="flex items-center justify-between font-bold text-sm">
                  <span>{currentLang === 'en' ? 'Total Amount:' : 'Toplam Tutar:'}</span>
                  <span className="text-amber-500 font-mono">{formatPrice(cartTotalTRY)}</span>
                </div>
                <button
                  onClick={handleCartCheckoutWA}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{currentLang === 'en' ? 'Instant Buy via WhatsApp'  : 'WhatsApp ile Hızlı Satın Al'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

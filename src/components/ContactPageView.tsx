import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Send,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Paperclip,
  Trash2,
  FileText,
  Sparkles,
  ArrowRight,
  Zap,
  HelpCircle,
  ChevronDown,
  Building2,
  User,
  AlertCircle,
  Layers,
} from 'lucide-react';
import { PricingTier } from '../types/index.ts';

interface ContactPageViewProps {
  onSuccess?: () => void;
}

export const ContactPageView: React.FC<ContactPageViewProps> = () => {
  const {
    products,
    submitInquiry,
    settings,
    openPaymentModal,
    currentLang,
    openPageModal,
    formatPrice,
    t,
  } = useApp();

  // Form states
  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [hasSeparateWhatsapp, setHasSeparateWhatsapp] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<PricingTier | 'custom'>('economic');
  const [budgetRange, setBudgetRange] = useState<string>('10k-15k');
  const [deliveryTarget, setDeliveryTarget] = useState<string>('48h');
  const [message, setMessage] = useState('');
  const [kvkkAccepted, setKvkkAccepted] = useState(true);

  // File Attachment State (10MB limit)
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [attachmentSize, setAttachmentSize] = useState<number>(0);
  const [attachmentData, setAttachmentData] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');
  const [error, setError] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      setError(
        currentLang === 'en' ? 'File size cannot exceed 10MB.'  : 'Dosya boyutu 10MB sınırını aşamaz.'
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setError('');
    setAttachmentName(file.name);
    setAttachmentSize(file.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAttachmentData(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    setAttachmentName('');
    setAttachmentSize(0);
    setAttachmentData('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientName.trim()) {
      setError(
        currentLang === 'en' ? 'Please enter your full name.'  : 'Lütfen adınızı ve soyadınızı girin.'
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        currentLang === 'en' ? 'Please enter your phone number.'  : 'Lütfen telefon numaranızı girin.'
      );
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setError(
        currentLang === 'en' ? 'Please enter a valid email address.'  : 'Lütfen geçerli bir e-posta adresi girin.'
      );
      return;
    }

    if (!companyName.trim()) {
      setError(
        currentLang === 'en' ? 'Please enter your company or brand name.'  : 'Lütfen firma / işletme unvanınızı girin.'
      );
      return;
    }

    if (!kvkkAccepted) {
      setError(
        currentLang === 'en' ? 'You must accept the data privacy notice.'  : 'Lütfen KVKK & Gizlilik bilgilendirmesini onaylayın.'
      );
      return;
    }

    setError('');
    setIsSubmitting(true);

    const targetProduct = products.find((p) => p.id === selectedProductId);

    // Approximate numeric budget for database recording
    let approxBudgetTRY = 12500;
    if (budgetRange === '15k-25k') approxBudgetTRY = 20000;
    if (budgetRange === '25k-50k') approxBudgetTRY = 35000;
    if (budgetRange === '50k+') approxBudgetTRY = 60000;

    const notesSummary = [
      `[İletişim Masası Başvurusu]`,
      `Hedef Teslimat: ${deliveryTarget === '48h' ? '48 Saatte Acil' : deliveryTarget === '1week' ? '1 Hafta İçinde' : 'Esnek'}`,
      `Bütçe Aralığı: ${budgetRange}`,
      hasSeparateWhatsapp && whatsappNumber ? `WhatsApp: ${whatsappNumber}` : '',
      targetProduct ? `İlgilenilen Şablon: ${targetProduct.title} (${targetProduct.sector})` : 'Genel Proje Talebi',
    ]
      .filter(Boolean)
      .join(' · ');

    setTimeout(() => {
      submitInquiry({
        clientName: clientName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        whatsappNumber: hasSeparateWhatsapp ? whatsappNumber.trim() : phone.trim(),
        companyName: companyName.trim(),
        productId: selectedProductId || undefined,
        productTitle: targetProduct?.title || (selectedProductId ? 'Özel Kurumsal Proje' : undefined),
        preferredPackage: selectedPackage,
        budgetTRY: approxBudgetTRY,
        message: message.trim() ? `${message.trim()}\n\n---\n${notesSummary}` : notesSummary,
        notes: notesSummary,
        attachmentName: attachmentName || undefined,
        attachmentSize: attachmentSize || undefined,
        attachmentData: attachmentData || undefined,
      });

      const refCode = `VNG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedRef(refCode);
      setIsSubmitting(false);
      setSubmitted(true);
    }, 400);
  };

  const resetForm = () => {
    setClientName('');
    setEmail('');
    setPhone('');
    setCompanyName('');
    setHasSeparateWhatsapp(false);
    setWhatsappNumber('');
    setSelectedProductId('');
    setMessage('');
    removeAttachment();
    setSubmitted(false);
    setError('');
  };

  const getWhatsappUrl = () => {
    const cleanNumber = settings.whatsapp.replace(/[^0-9]/g, '');
    const prefilled = encodeURIComponent(
      `Merhaba Vanguard Studio! İletişim sayfasından yazıyorum. [Ref: ${submittedRef || 'Web-İletişim'}] İsmim ${clientName || 'İlgili'}, firma: ${companyName || 'Projemiz'}. 48 saatte anahtar teslim sitemiz için detayları görüşmek istiyorum.`
    );
    return `https://wa.me/${cleanNumber}?text=${prefilled}`;
  };

  const faqs = [
    {
      q:
        currentLang === 'en' ? 'When does the 48-hour delivery timer start?'  : '48 saatlik teslimat süreci ne zaman başlar?',
      a:
        currentLang === 'en' ? 'The 48-hour clock begins as soon as you confirm your chosen blueprint and deliver your brand logo, copy, and contact credentials.'  : 'Seçtiğiniz hazır şablon belirlenip firma logonuz, kurumsal bilgileriniz ve içerikleriniz tarafımıza iletildiği andan itibaren 48 saatlik sayaç başlar.',
    },
    {
      q:
        currentLang === 'en' ? 'What is the distinction between Economic & Pro tiers?'  : 'Ekonomik model ile Profesyonel CMS arasındaki fark nedir?',
      a:
        currentLang === 'en'
          ? 'In the Economic tier, Vanguard Studio manages cloud hosting and revisions without client CMS overhead. In the Pro tier, you receive full administrative CMS access.'
          : 'Ekonomik modelde yönetim paneli karmaşası olmadan tüm sunucu bakımı ve güncellemeler (yılda 12 revizyon) stüdyomuzca yapılır. Profesyonel pakette ise tam yetkili modern CMS paneli size teslim edilir.',
    },
    {
      q:
        currentLang === 'en' ? 'Can I connect my existing domain?'  : 'Kendi mevcut alan adımı (domain kullanabilir miyim?',
      a:
        currentLang === 'en' ? 'Absolutely. We will route Cloudflare DNS records to your existing domain or register a complimentary domain within the turnkey scope.'  : 'Kesinlikle evet. Mevcut alan adınızın DNS yönlendirmesini ücretsiz yapıyoruz veya dilerseniz paketinize dahil yeni alan adı tescil ediyoruz.',
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Top Banner: Response SLA & Live Status (Distinguishes from quiet footer */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#121622] via-[#10141e] to-[#0a0c12] border border-neutral-800 p-6 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {currentLang === 'en' ? 'Live Project Desk Active · SLA Response < 15 min'  : 'Canlı Proje Masası Aktif · Ortalama Yanıt < 15 dk'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-display">
              {currentLang === 'en' ? 'Launch Your Web Asset & Project Inquiry'  : 'İletişim & Proje Başvuru Masası'}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
              {currentLang === 'en' ? 'Submit your project specifications below. Our lead engineering desk will provide a definitive quotation and 48-hour onboarding plan within 2 hours.'  : 'Aşağıdaki formu doldurarak projenizin ihtiyaçlarını iletin. Başmühendisimiz en geç 2 saat içinde teknik şartname ve net bütçe teklifiyle tarafınıza dönüş yapsın.'}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-col items-start sm:items-end gap-2.5 shrink-0 pt-2 md:pt-0">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Merhaba Vanguard Studio! 48 saatte anahtar teslim hazır site projemiz için canlı danışmanlık almak istiyorum.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>
                {currentLang === 'en' ? 'Urgent WhatsApp'  : 'Hızlı WhatsApp Hattı'}
              </span>
            </a>
            <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {currentLang === 'en' ? 'Standard NDA & Data Protection'  : 'Standart Gizlilik Sözleşmesi (NDA'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form (Left) vs Project Desk Operations (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: The Interactive Form (Lg: 7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#121622] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-sm">
          {submitted ? (
            /* Success State */
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-mono-numbers text-xs font-bold">
                  {submittedRef}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-neutral-950 dark:text-white">
                  {currentLang === 'en' ? 'Project Inquiry Received!'  : 'Proje Başvurunuz Başarıyla Alındı!'}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
                  {currentLang === 'en' ? 'Thank you! Your requirements have been assigned to our lead engineer. Expect contact via phone or WhatsApp within 2 hours.'  : 'Teşekkürler! Talebiniz doğrudan başmühendisimize iletildi. 2 saat içinde telefon ve WhatsApp üzerinden sizinle iletişime geçilecektir.'}
                </p>
              </div>

              {/* Fast-track WhatsApp button */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#161b26] border border-neutral-200 dark:border-neutral-800 text-left space-y-3">
                <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {currentLang === 'en' ? 'Need an instant engineering response?'  : 'Süreci daha da hızlandırmak ister misiniz?'}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {currentLang === 'en' ? 'Message our project lead directly on WhatsApp with your inquiry reference for immediate dispatch.'  : 'Referans kodunuzla birlikte doğrudan WhatsApp üzerinden yazarak kuyrukta beklemeden canlı görüşebilirsiniz.'}
                </p>
                <a
                  href={getWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    {currentLang === 'en' ? 'Open Direct WhatsApp Chat'  : 'WhatsApp İle Hemen Konuş'}
                  </span>
                </a>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                >
                  {currentLang === 'en' ? 'Submit Another Inquiry'  : 'Yeni Bir Talep Gönder'}
                </button>
                <button
                  type="button"
                  onClick={() => openPaymentModal(null, selectedPackage === 'custom' ? 'economic' : selectedPackage)}
                  className="px-4 py-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                >
                  {currentLang === 'en' ? 'Proceed to Payment & Wire →'  : 'Ödeme & IBAN Bilgilerini Gör →'}
                </button>
              </div>
            </div>
          ) : (
            /* Contact Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                <h2 className="text-base sm:text-lg font-bold font-display text-neutral-950 dark:text-white">
                  {currentLang === 'en' ? 'Project Specifications & Contact Details'  : 'Proje Başvuru ve İletişim Bilgileri'}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {currentLang === 'en' ? 'Fields marked with (* are required for quotation.'  : '(*) ile işaretli alanlar teklif hazırlığı için zorunludur.'}
                </p>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 1. Contact Info (Name, Email, Phone, Company) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {currentLang === 'en' ? 'Full Name' : 'Ad Soyad'} *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder={currentLang === 'en' ? 'e.g. Seref Kaplan' : 'Örn: Şeref Kaplan'}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-[#161b26] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                    {currentLang === 'en'
                      ? 'Please specify your official full name so that your e-archive invoice can be legally issued in your name.'
                      : 'E-arşiv faturanızın adınıza yasal olarak düzenlenebilmesi için lütfen resmi adınızı ve soyadınızı belirtiniz.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {currentLang === 'en' ? 'Company / Business Name' : 'Firma / İşletme Adı'} *
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={currentLang === 'en' ? 'e.g. Acme Corporation' : 'Örn: Yılmaz Hukuk Bürosu'}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-[#161b26] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {currentLang === 'en' ? 'Email Address' : 'E-Posta Adresi'} *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={currentLang === 'en' ? 'e.g. company@gmail.com or info@company.com' : 'Örn: sirketiniz@gmail.com veya info@sirketiniz.com'}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-[#161b26] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                    {currentLang === 'en'
                      ? 'Your order confirmation and official invoice will be sent to this email address. You can safely enter your existing personal email address. If you do not have a corporate email yet, your professional email accounts will be completely set up and delivered free of charge during the 48-hour installation process.'
                      : 'Sipariş onayınız ve resmi faturanız bu adrese gönderilecektir. Mevcut kişisel e-posta adresinizi güvenle girebilirsiniz. Eğer henüz kurumsal bir e-postanız yoksa, 48 saatlik kurulum sürecinde profesyonel e-posta hesaplarınız firmamızca tamamen ücretsiz kurulup teslim edilecektir.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {currentLang === 'en' ? 'Phone & WhatsApp' : 'Telefon & WhatsApp'} *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Örn: +90 (505) 703 01 94"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-[#161b26] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                    {currentLang === 'en'
                      ? 'Please enter with your country code so that our engineering team can instantly coordinate with you during the 48-hour priority launch and for Stripe payment gateway verification.'
                      : '48 saatlik acil teslimat sürecinde mühendislik ekibimizin sizinle anında el sıkışabilmesi ve Stripe ödeme portalı doğrulaması için lütfen ülke koduyla birlikte giriniz.'}
                  </p>
                </div>
              </div>

              {/* WhatsApp checkbox toggle */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={hasSeparateWhatsapp}
                    onChange={(e) => setHasSeparateWhatsapp(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>
                    {currentLang === 'en' ? 'Provide a separate WhatsApp number'  : 'WhatsApp iletişim numaram telefonumdan farklı'}
                  </span>
                </label>
                {hasSeparateWhatsapp && (
                  <div className="relative pt-1">
                    <MessageCircle className="w-4 h-4 absolute left-3 top-3.5 text-emerald-500" />
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={e => setWhatsappNumber(e.target.value)}
                      placeholder="+90 (5XX) XXX XX XX"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-[#161b26] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* 2. Project Selection: Catalog Ready Site OR Custom */}
              <div className="space-y-1.5 pt-2">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {currentLang === 'en' ? 'Target Turnkey Blueprint or Service'  : 'İlgilendiğiniz Hazır Site Şablonu veya Hizmet'}
                </label>
                <div className="relative">
                  <Layers className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                  <select
                    value={selectedProductId}
                    onChange={e => setSelectedProductId(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-neutral-50 dark:bg-[#161b26] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-emerald-500 cursor-pointer appearance-none"
                  >
                    <option value="">
                      {currentLang === 'en' ? '--- Select a Turnkey Blueprint or General Inquiry ---'  : '--- Bir hazır site seçin veya genel talep belirtin ---'}
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.sector}) · 48h
                      </option>
                    ))}
                    <option value="custom-bespoke">
                      {currentLang === 'en' ? '★ Custom Bespoke Web Development'  : '★ Sıfırdan Özel Web Sitesi & Yazılım Mimarisi'}
                    </option>
                    <option value="seo-geo-audit">
                      {currentLang === 'en' ? '★ GEO (AI Search & Advanced SEO Audit'  : '★ GEO & Yapay Zeka Arama Motoru Optimizasyonu'}
                    </option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* 3. Package Tier Selection Cards */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {currentLang === 'en' ? 'Preferred Delivery Tier'  : 'Tercih Edilen Teslimat & Yönetim Modeli'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Economic */}
                  <button
                    type="button"
                    onClick={() => setSelectedPackage('economic')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPackage === 'economic'
                        ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/15 ring-1 ring-emerald-500'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#161b26] hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {currentLang === 'en' ? 'Economic'  : 'Ekonomik'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                        {currentLang === 'en' ? '48 Hours'  : '48 Saat'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      {currentLang === 'en' ? 'Managed by Studio, zero CMS overhead'  : 'Yönetim ajansımızda, zahmetsiz'}
                    </p>
                  </button>

                  {/* Professional */}
                  <button
                    type="button"
                    onClick={() => setSelectedPackage('professional')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPackage === 'professional'
                        ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/15 ring-1 ring-amber-500'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#161b26] hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {currentLang === 'en' ? 'Professional'  : 'Profesyonel'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                        {currentLang === 'en' ? 'Full CMS' : 'Tam CMS'}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      {currentLang === 'en' ? 'Full administrative CMS control' : 'Kullanıcı dostu yönetim paneli'}
                    </p>
                  </button>

                  {/* Custom */}
                  <button
                    type="button"
                    onClick={() => setSelectedPackage('custom')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPackage === 'custom'
                        ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/15 ring-1 ring-purple-500'
                        : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#161b26] hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {currentLang === 'en' ? 'Bespoke / Custom' : 'Özel Mimari'}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold">Bespoke</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight">
                      {currentLang === 'en' ? 'Tailored features & requirements' : 'Özel fonksiyonlar ve entegrasyon'}
                    </p>
                  </button>
                </div>
              </div>

              {/* 4. Budget Range Chips & Launch Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {currentLang === 'en' ? 'Budget Horizon' : 'Planlanan Bütçe Aralığı'}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: '10k-15k', label: `${formatPrice(10000)} – ${formatPrice(15000)}` },
                      { id: '15k-25k', label: `${formatPrice(15000)} – ${formatPrice(25000)}` },
                      { id: '25k-50k', label: `${formatPrice(25000)} – ${formatPrice(50000)}` },
                      { id: '50k+', label: `${formatPrice(50000)}+` },
                    ].map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setBudgetRange(b.id)}
                        className={`py-1.5 px-2 text-[11px] font-mono-numbers rounded-lg border text-center transition-colors cursor-pointer ${
                          budgetRange === b.id
                            ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                        }`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                    {currentLang === 'en' ? 'Target Deployment Timeline' : 'Hedef Canlıya Alış Süresi'}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      {
                        id: '48h',
                        label: currentLang === 'en' ? '48 Hours (Fast)' : '48 Saat (Acil)',
                      },
                      {
                        id: '1week',
                        label: currentLang === 'en' ? '1 Week' : '1 Hafta',
                      },
                      {
                        id: 'flexible',
                        label: currentLang === 'en' ? 'Flexible' : 'Esnek',
                      },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setDeliveryTarget(t.id)}
                        className={`py-1.5 px-1 text-[11px] rounded-lg border text-center transition-colors cursor-pointer ${
                          deliveryTarget === t.id
                            ? 'border-emerald-500 bg-emerald-500/15 text-emerald-400 font-bold'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Project Message / Notes */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  {currentLang === 'en' ? 'Project Scope & Specific Requirements'  : 'Proje Notları, Hedefler ve Beklentileriniz'}
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={
                    currentLang === 'en' ? 'Share your business goals, required pages, existing domain, or specific functional needs...'  : 'Hizmet alanınız, eklenmesini istediğiniz özel sayfalar veya mevcut alan adınız varsa lütfen belirtin...'
                  }
                  className="w-full p-3 text-xs rounded-xl bg-neutral-50 dark:bg-[#161b26] border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none transition-colors"
                />
              </div>

              {/* 6. File Attachment Module (Max 10MB */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-[#161b26] border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-neutral-500" />
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {currentLang === 'en'
                        ? 'Logo & Document Upload (.png, .jpg, .jpeg, .pdf, .zip, .docx)'
                        : 'Logo & Doküman Yükleme (.png, .jpg, .jpeg, .pdf, .zip, .docx)'}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Maks. 10MB</span>
                </div>

                {attachmentName ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-neutral-900 dark:text-neutral-100">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="truncate font-medium">{attachmentName}</span>
                      <span className="text-[10px] text-neutral-500 font-mono-numbers">
                        ({(attachmentSize / 1024).toFixed(0)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="p-1 text-rose-500 hover:text-rose-400 transition-colors cursor-pointer"
                      title="Dosyayı kaldır"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileChange}
                      accept=".png,.jpg,.jpeg,.pdf,.zip,.docx,image/png,image/jpeg,application/pdf,application/zip,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      id="contact-page-file-input"
                    />
                    <label
                      htmlFor="contact-page-file-input"
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-emerald-500 text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 text-xs font-medium cursor-pointer transition-colors"
                    >
                      <span>
                        {currentLang === 'en'
                          ? 'Browse logo or document file from device'
                          : 'Cihazınızdan logo veya doküman dosyası seçin'}
                      </span>
                    </label>
                  </div>
                )}
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                  {currentLang === 'en'
                    ? 'You can add your corporate logo or service text to take your site live in 48 hours. For files over 10MB, you can leave a Google Drive or WeTransfer link in the notes area.'
                    : 'Sitenizin 48 saatte canlıya alınması için kurumsal logonuzu veya hizmet metinlerinizi ekleyebilirsiniz. 10MB üzeri dosyalarınız için not alanına Google Drive veya WeTransfer linki bırakabilirsiniz.'}
                </p>
              </div>

              {/* 7. KVKK & Privacy Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal">
                  <input
                    type="checkbox"
                    checked={kvkkAccepted}
                    onChange={(e) => setKvkkAccepted(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
                    required
                  />
                  <span>
                    {currentLang === 'ru' ? (
                      <>
                        Я согласен с условиями{' '}
                        <button
                          type="button"
                          onClick={() => openPageModal('gizlilik-politikasi')}
                          className="text-emerald-400 underline hover:text-emerald-300"
                        >
                          Политики Конфиденциальности
                        </button>{' '}
                        и обработкой персональных данных.
                      </>
                    ) : currentLang === 'en' ? (
                      <>
                        I accept the{' '}
                        <button
                          type="button"
                          onClick={() => openPageModal('gizlilik-politikasi')}
                          className="text-emerald-400 underline hover:text-emerald-300"
                        >
                          Privacy Policy
                        </button>{' '}
                        and consent to processing of project inquiry data.
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => openPageModal('kvkk')}
                          className="text-emerald-500 dark:text-emerald-400 underline hover:text-emerald-300"
                        >
                          KVKK Aydınlatma Metni
                        </button>{' '}
                        ve Gizlilik Sözleşmesi kapsamında verilerimin teklif amacıyla işlenmesini onaylıyorum.
                      </>
                    )}
                  </span>
                </label>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>
                      {currentLang === 'en' ? 'Transmitting Inquiry...'  : 'Teklif Talebi İletiliyor...'}
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {currentLang === 'en' ? 'Submit Inquiry (Guaranteed 2h Response)'  : 'Talebi Gönder & 2 Saatte Teklif Al'}
                      </span>
                    </>
                  )}
                </button>
                <div className="text-center mt-2.5 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    {currentLang === 'en' ? '256-Bit SSL Secured · Zero spam, strict engineering privacy'  : '256-Bit SSL Korumalı · Sıfır spam, doğrudan teknik mühendis iletişimi'}
                  </span>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* RIGHT COLUMN: Project Operations & Fast Channels (Lg: 5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. 48-Hour Turnkey Deployment Roadmap */}
          <div className="bg-white dark:bg-[#121622] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                {currentLang === 'en' ? '48-Hour Deployment Roadmap'  : '48 Saatlik Devreye Alma Süreci'}
              </h3>
            </div>

            <div className="space-y-3 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#121622]" />
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  01. {currentLang === 'en' ? 'Brief & Scope Confirmation'  : 'Talep Analizi & Net Fiyat'}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {currentLang === 'en'
                    ? 'Hour 0 – 2: Requirements confirmed with fixed pricing.'
                    : '0 – 2. Saat: Şartname ve gizli masrafsız sabit bütçe onayı.'}
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white dark:ring-[#121622]" />
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  02. {currentLang === 'en' ? 'Content & Cloud Onboarding'  : 'İçerik, Logo & SSL Kurulumu'}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {currentLang === 'en'
                    ? 'Hour 2 – 24: Enterprise SSL, DNS routing, and imagery configured.'
                    : '2 – 24. Saat: Kurumsal kimlik, e-posta ve alan adı entegrasyonu.'}
                </div>
              </div>

              <div className="relative">
                <span className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-[#121622]" />
                <div className="text-xs font-bold text-neutral-900 dark:text-white">
                  03. {currentLang === 'en' ? 'Live Handover & 7-Day QA'  : 'Canlı Yayın & 7 Gün Destek'}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {currentLang === 'en'
                    ? 'Hour 24 – 48: Production launch with 7-day complimentary revisions.'
                    : '24 – 48. Saat: Canlı teslimat ve 7 gün boyunca ücretsiz revizyon.'}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Direct Studio Dispatch & Coordination Centers */}
          <div className="bg-white dark:bg-[#121622] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
            <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>
                {currentLang === 'en' ? 'Engineering & Project Hubs'  : 'Proje Koordinasyon & Ar-Ge Masaları'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Antalya HQ */}
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#161b26] border border-neutral-100 dark:border-neutral-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-950 dark:text-white">
                    {currentLang === 'en' ? '🇹🇷 Antalya Engineering Desk'  : '🇹🇷 Antalya Ar-Ge Masası'}
                  </span>
                  <span className="text-[10px] text-emerald-500 font-semibold">
                      {currentLang === 'en' ? 'Turkey & Global' : 'Türkiye & Genel'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {settings.locationTR || 'Antalya, Türkiye'}
                </p>
                <div className="pt-1 flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-mono-numbers">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    {settings.whatsappTR || settings.whatsapp || '+90 505 703 0194'}{' '}
                    <span className="text-[10px] text-neutral-400 font-sans">
                      ({t('contact.onlyWhatsapp', 'Sadece WhatsApp')})
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="pt-1">
              <a
                href={getWhatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-emerald-500" />
                  <span>
                    {currentLang === 'en' ? '24/7 Project Desk WhatsApp'  : '7/24 WhatsApp Proje Hattı'}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 3. Guarantees & Trust Badges */}
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121622] border border-neutral-200 dark:border-neutral-800 space-y-1">
              <div className="text-amber-500 font-bold text-xs flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {currentLang === 'en' ? '100% Transparency'  : '%100 Şeffaflık'}
                </span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
                {currentLang === 'en' ? 'Zero hidden fees, transparent turnkey flat rate.'  : 'Sıfır gizli masraf, net anahtar teslim fiyatlandırma.'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-[#121622] border border-neutral-200 dark:border-neutral-800 space-y-1">
              <div className="text-emerald-500 font-bold text-xs flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                <span>99+ Lighthouse</span>
              </div>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-tight">
                {currentLang === 'en' ? 'Maximum performance score and high-end technical SEO.'  : 'Maksimum açılış hızı ve üst düzey SEO uyumluluğu.'}
              </p>
            </div>
          </div>

          {/* 4. Mini FAQ Accordion */}
          <div className="bg-white dark:bg-[#121622] rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 space-y-3 shadow-sm">
            <div className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-neutral-400" />
              <span>
                {currentLang === 'en' ? 'Quick Q&A'  : 'Sıkça Sorulan Sorular'}
              </span>
            </div>

            <div className="space-y-2">
              {faqs.map((f, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-neutral-100 dark:border-neutral-800/80 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-2.5 text-left text-xs font-semibold text-neutral-800 dark:text-neutral-200 hover:text-emerald-500 dark:hover:text-emerald-400 flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        activeFaq === idx ? 'rotate-180 text-emerald-500' : 'text-neutral-400'
                      }`}
                    />
                  </button>
                  {activeFaq === idx && (
                    <div className="px-2.5 pb-2.5 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-2 text-justify">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

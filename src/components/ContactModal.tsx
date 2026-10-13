import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Send,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Clock,
  Sparkles,
  Paperclip,
  Upload,
  Trash2,
  FileText,
  Crown,
} from 'lucide-react';
import { PricingTier } from '../types/index.ts';

export const ContactModal: React.FC = () => {
  const {
    isContactModalOpen,
    closeContactModal,
    preselectedProduct,
    preselectedPackage,
    products,
    submitInquiry,
    settings,
    formatPrice,
    currentLang,
    t,
    advisoryService,
  } = useApp();

  const [clientName, setClientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [hasSeparateWhatsapp, setHasSeparateWhatsapp] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string>(
    preselectedProduct?.id || ''
  );
  const [selectedPackage, setSelectedPackage] = useState<PricingTier | 'custom' | 'advisory'>(
    preselectedPackage || 'economic'
  );

  React.useEffect(() => {
    if (preselectedPackage) {
      setSelectedPackage(preselectedPackage);
    }
  }, [preselectedPackage]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // File Attachment State (Max 10MB limit)
  const [attachmentName, setAttachmentName] = useState<string>('');
  const [attachmentSize, setAttachmentSize] = useState<number>(0);
  const [attachmentData, setAttachmentData] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isContactModalOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || preselectedProduct;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      setError(
        currentLang === 'en' ? 'File size cannot exceed 10MB. Please select a smaller file.'  : 'Dosya boyutu 10MB sınırını aşamaz. Lütfen daha küçük bir dosya seçin.'
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
      setError(currentLang === 'en' ? 'Please enter your full name.'  : 'Lütfen adınızı ve soyadınızı girin.');
      return;
    }
    if (!phone.trim()) {
      setError(currentLang === 'en' ? 'Please enter your phone number.'  : 'Lütfen telefon numaranızı girin.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(currentLang === 'en' ? 'Please enter a valid email address.'  : 'Lütfen geçerli bir e-posta adresi girin.');
      return;
    }
    if (!companyName.trim()) {
      setError(currentLang === 'en' ? 'Please enter your company or business name.'  : 'Lütfen firma / işletme adını girin.');
      return;
    }

    submitInquiry({
      clientName: clientName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      whatsappNumber: hasSeparateWhatsapp && whatsappNumber.trim() ? whatsappNumber.trim() : (phone.trim() || undefined),
      companyName: companyName.trim(),
      productId: currentProduct?.id,
      productTitle: currentProduct?.title,
      preferredPackage: selectedPackage,
      budgetTRY:
        selectedPackage === 'economic'
          ? currentProduct?.priceEconomicTRY || 12000
          : selectedPackage === 'professional'
          ? currentProduct?.priceProfessionalTRY || 20000
          : selectedPackage === 'advisory'
          ? advisoryService?.basePriceTRY || 50000
          : undefined,
      message,
      attachmentName: attachmentName || undefined,
      attachmentSize: attachmentSize || undefined,
      attachmentData: attachmentData || undefined,
    });

    setSubmitted(true);
  };

  const handleWhatsAppDirect = () => {
    const text = encodeURIComponent(
      currentLang === 'en'
        ? `Hello Vanguard Studio! I'm interested in ${selectedPackage === 'advisory' ? 'Vanguard Nexus VIP Web & AI Advisory (50k+ TRY)' : currentProduct ? `"${currentProduct.title}" turnkey site` : 'website project'} (${selectedPackage === 'advisory' ? 'Vanguard Nexus VIP' : selectedPackage === 'economic' ? 'Economic Tier' : selectedPackage === 'professional' ? 'Professional CMS' : 'Custom Request'}). My name is: ${clientName || 'Client'}`
        : `Merhaba Vanguard Studio! ${selectedPackage === 'advisory' ? 'Vanguard Nexus VIP Web & AI Advisory (50.000 TL+) danışmanlık hizmetiniz' : currentProduct ? `"${currentProduct.title}" hazır sitesi` : 'Web sitesi projemiz'} için ${selectedPackage === 'advisory' ? 'Vanguard Nexus VIP Danışmanlık' : selectedPackage === 'economic' ? 'Ekonomik Paket (Yönetim Sizde)' : selectedPackage === 'professional' ? 'Profesyonel CMS Paketi' : 'Özel Mimari'} hakkında strateji toplantısı ve bilgi almak istiyorum. İsmim: ${clientName || 'İlgilenen Müşteri'}`
    );
    window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#10141d] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div>
            <h3 className="text-base font-bold text-neutral-950 dark:text-white font-display">
              {t('form.title', 'Projeniz İçin Teklif & Bilgi Alın')}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {t('form.subtitle', '48 saatte anahtar teslim yayına alma garantisi')}
            </p>
          </div>

          <button
            onClick={closeContactModal}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-neutral-950 dark:text-white">
                {t('form.successTitle', 'Talebiniz Başarıyla Alındı!')}
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                {t(
                  'form.success',
                  'Talebiniz başarıyla alındı! En geç 2 saat içinde sizinle iletişime geçeceğiz.'
                )}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleWhatsAppDirect}
                  className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('form.whatsappDirect', "WhatsApp'tan Hemen Yaz")}</span>
                </button>
                <button
                  onClick={closeContactModal}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer"
                >
                  {t('common.close', 'Tamam')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-xs text-red-600 bg-red-50 dark:bg-red-950/40 rounded-lg border border-red-200 dark:border-red-900">
                  {error}
                </div>
              )}

              {/* Product Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t('form.productSelect', 'İlgilendiğiniz Hazır Site')}
                </label>
                <select
                  value={selectedProductId}
                  onChange={e => setSelectedProductId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="">{t('form.undecided', 'Genel Danışmanlık / Kararsızım')}</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.sector}) - {formatPrice(p.priceEconomicTRY)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Package Selection Tier (4 Options) */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                  {t('form.packageSelect', 'Tercih Ettiğiniz Model')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPackage('economic')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPackage === 'economic'
                        ? 'border-neutral-950 dark:border-white bg-neutral-100/80 dark:bg-neutral-800 ring-1 ring-neutral-950 dark:ring-white'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-950 dark:text-white">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{t('form.economicPackage', 'Ekonomik')}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {formatPrice(10000)} - {formatPrice(15000)} · {t('products.economicBadge', 'Yönetim Bizde')}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPackage('professional')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPackage === 'professional'
                        ? 'border-neutral-950 dark:border-white bg-neutral-100/80 dark:bg-neutral-800 ring-1 ring-neutral-950 dark:ring-white'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-950 dark:text-white">
                      <Cpu className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('form.proPackage', 'Profesyonel CMS')}</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {formatPrice(18000)} - {formatPrice(25000)}+ · {t('products.proBadge', 'Tam Yetkili Panel')}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPackage('custom')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPackage === 'custom'
                        ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-950 dark:text-white">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{t('models.custom.badge', 'Özel Mimari')}</span>
                    </div>
                    <div className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {t('models.custom.tagline', 'Özel Kapsam & Teklif')}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPackage('advisory')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPackage === 'advisory'
                        ? 'border-amber-500 bg-amber-500/15 dark:bg-amber-500/20 ring-1 ring-amber-500 shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-amber-400/50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Crown className="w-3.5 h-3.5 text-amber-500" />
                      <span>Vanguard Nexus (VIP)</span>
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {advisoryService?.priceText || "50.000 TL'den Başlayan"} · C-Level
                    </div>
                  </button>
                </div>
              </div>

              {/* Name & Phone (Both Mandatory) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t('form.name', 'Adınız Soyadınız')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    placeholder={currentLang === 'en' ? 'e.g. Seref Kaplan' : 'Örn: Şeref Kaplan'}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                    {currentLang === 'en'
                      ? 'Please specify your official full name so that your e-archive invoice can be legally issued in your name.'
                      : 'E-arşiv faturanızın adınıza yasal olarak düzenlenebilmesi için lütfen resmi adınızı ve soyadınızı belirtiniz.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t('form.phone', 'Telefon & WhatsApp')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Örn: +90 (505) 703 01 94"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                    {currentLang === 'en'
                      ? 'Please enter with your country code so that our engineering team can instantly coordinate with you during the 48-hour priority launch and for Stripe payment gateway verification.'
                      : '48 saatlik acil teslimat sürecinde mühendislik ekibimizin sizinle anında el sıkışabilmesi ve Stripe ödeme portalı doğrulaması için lütfen ülke koduyla birlikte giriniz.'}
                  </p>
                </div>
              </div>

              {/* Email & Company (Both Mandatory) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t('form.email', 'E-Posta Adresiniz')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={currentLang === 'en' ? 'e.g. company@gmail.com or info@company.com' : 'Örn: sirketiniz@gmail.com veya info@sirketiniz.com'}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                    {currentLang === 'en'
                      ? 'Your order confirmation and official invoice will be sent to this email address. You can safely enter your existing personal email address. If you do not have a corporate email yet, your professional email accounts will be completely set up and delivered free of charge during the 48-hour installation process.'
                      : 'Sipariş onayınız ve resmi faturanız bu adrese gönderilecektir. Mevcut kişisel e-posta adresinizi güvenle girebilirsiniz. Eğer henüz kurumsal bir e-postanız yoksa, 48 saatlik kurulum sürecinde profesyonel e-posta hesaplarınız firmamızca tamamen ücretsiz kurulup teslim edilecektir.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {t('form.company', 'Firma / İşletme Adı')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder={currentLang === 'en' ? 'e.g. Acme Corporation' : 'Örn: Yılmaz Hukuk Bürosu'}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* WhatsApp Toggle & Optional Input */}
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={hasSeparateWhatsapp}
                    onChange={e => setHasSeparateWhatsapp(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 bg-white dark:bg-neutral-950 border-neutral-300 dark:border-neutral-700"
                  />
                  <span>{t('form.hasWhatsapp', 'WhatsApp bu numaradan farklı veya ayrıca belirtmek istiyorum')}</span>
                </label>

                {hasSeparateWhatsapp && (
                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      {t('form.whatsappExtra', 'WhatsApp Numaranız (Opsiyonel)')}
                    </label>
                    <input
                      type="tel"
                      value={whatsappNumber}
                      onChange={e => setWhatsappNumber(e.target.value)}
                      placeholder={currentLang === 'ru' ? '+7 (927) ...' : '+90 532 ...'}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t('form.message', 'Notunuz veya İşletmeniz Hakkında Bilgi')}
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={currentLang === 'en' ? 'Domain preferences, special requirements, or questions...'  : 'İstediğiniz alan adı, özel istekleriniz veya sormak istedikleriniz...'}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              {/* File Attachment Upload (Max 10MB */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {t('form.attachmentLabel', 'Logo & Doküman Yükleme (Maksimum 10MB)')}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".png,.jpg,.jpeg,.pdf,.zip,.docx,image/png,image/jpeg,application/pdf,application/zip,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  id="contact-file-input"
                />

                {!attachmentName ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 px-3 border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-amber-400 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 hover:text-amber-500 transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>
                      {currentLang === 'en'
                        ? 'Upload Logo / Brief (PNG, JPG, PDF, DOCX, ZIP - Max 10MB)'
                        : 'Kurumsal logo veya doküman yükleyin (.png, .jpg, .pdf, .zip, .docx - Maks 10MB)'}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-400">
                    <div className="flex items-center gap-2 truncate">
                      <FileText className="w-4 h-4 shrink-0" />
                      <span className="truncate font-medium">{attachmentName}</span>
                      <span className="text-[10px] text-neutral-500 shrink-0">
                        ({(attachmentSize / (1024 * 1024)).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeAttachment}
                      className="p-1 hover:text-red-500 transition-colors cursor-pointer ml-2"
                      title={currentLang === 'en' ? 'Remove file' : 'Dosyayı Kaldır'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                  {currentLang === 'en'
                    ? 'You can add your corporate logo or service text to take your site live in 48 hours. For files over 10MB, you can leave a Google Drive or WeTransfer link in the notes area.'
                    : 'Sitenizin 48 saatte canlıya alınması için kurumsal logonuzu veya hizmet metinlerinizi ekleyebilirsiniz. 10MB üzeri dosyalarınız için not alanına Google Drive veya WeTransfer linki bırakabilirsiniz.'}
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('form.submit', 'Talebimi Gönder')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppDirect}
                  className="py-3 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                  title={currentLang === 'en' ? 'Direct WhatsApp Contact'  : 'Doğrudan WhatsApp İle İletişim'}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">WhatsApp</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

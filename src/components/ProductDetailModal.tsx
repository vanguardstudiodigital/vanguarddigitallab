import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Check,
  Eye,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Sparkles,
  Video,
  Image as ImageIcon,
  Download,
} from 'lucide-react';
import { getEmbedVideoUrl } from '../utils/videoUtils.ts';
import { RichContentRenderer } from './common/RichContentRenderer.tsx';

export const ProductDetailModal: React.FC = () => {
  const {
    activeDetailProduct,
    closeDetail,
    openDemo,
    openContactModal,
    openPaymentModal,
    openDeployModal,
    getLocalizedProduct,
    formatPrice,
    currentLang,
    t,
  } = useApp();

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  if (!activeDetailProduct) return null;

  const product = getLocalizedProduct(activeDetailProduct);
  const allImages = [product.coverImage, ...(product.galleryImages || [])];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#10141d] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-8">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
              {product.sector}
            </span>
            {product.badge && (
              <span
                lang={currentLang}
                className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500 text-neutral-950 tracking-wide"
              >
                {product.badge}
              </span>
            )}
            <span className="text-xs text-neutral-500 dark:text-neutral-400">
              · {t('products.readyIn', 'Teslimat: 48 Saat')}
            </span>
          </div>

          <button
            onClick={closeDetail}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {/* Media Showcase */}
          <div className="mb-8">
            <div className="relative aspect-[16/9] w-full bg-neutral-900 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
              {showVideo && product.videoUrl ? (
                (() => {
                  const parsed = getEmbedVideoUrl(product.videoUrl);
                  return parsed.type === 'video' ? (
                    <video
                      src={parsed.embedUrl}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    >
                      Tarayıcınız video oynatmayı desteklemiyor.
                    </video>
                  ) : (
                    <iframe
                      src={parsed.embedUrl}
                      title="Product Video"
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  );
                })()
              ) : (
                <img
                  src={allImages[activeMediaIndex] || product.coverImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              )}

              {/* Media Toggle Controls if video exists */}
              {product.videoUrl && (
                <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/70 backdrop-blur-md p-1 rounded-lg">
                  <button
                    onClick={() => setShowVideo(false)}
                    className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1 ${
                      !showVideo ? 'bg-white text-black' : 'text-white hover:text-amber-400'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? 'Photo' : 'Görsel'}</span>
                  </button>
                  <button
                    onClick={() => setShowVideo(true)}
                    className={`px-2.5 py-1 text-xs rounded font-medium flex items-center gap-1 ${
                      showVideo ? 'bg-amber-500 text-black font-bold' : 'text-white hover:text-amber-400'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Video</span>
                  </button>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && !showVideo && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveMediaIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeMediaIndex === idx
                        ? 'border-neutral-950 dark:border-white scale-102'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Tagline */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-950 dark:text-white font-display">
              {product.title}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 mt-2 text-justify">
              {product.tagline}
            </p>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60 mb-8 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed text-justify">
            <RichContentRenderer content={product.description} className="text-justify" />
          </div>

          {/* Features Grid */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white tracking-wider mb-4">
              {t('detail.featuresIncluded', 'Dahil Olan Özellikler & Fonksiyonlar')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/40 border border-neutral-200/40 dark:border-neutral-800/40 text-xs sm:text-sm text-neutral-800 dark:text-neutral-200"
                >
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 Package Delivery Models */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-neutral-950 dark:text-white tracking-wider mb-4">
              {t('detail.packageOptions', 'Bu Tasarım İçin Teslimat Seçenekleri (3 Model)')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Economic */}
              <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                      {t('detail.economicOption', 'Ekonomik Seçenek')}
                    </span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white leading-tight">
                    {t('detail.economicManaged', 'Yönetim Bizde (Sıfır Zahmet)')}
                  </h4>
                  <div className="text-base sm:text-lg font-bold font-mono-numbers text-neutral-950 dark:text-white mt-1.5 whitespace-nowrap">
                    {formatPrice(product.priceEconomicTRY)}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed text-justify">
                    {t('detail.economicDesc', "Sitenizi kurarız, güncellemeleri bize WhatsApp'tan iletirsiniz, biz yaparız.")}
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeDetail();
                    openContactModal(product, 'economic');
                  }}
                  className="mt-4 w-full py-2.5 text-xs font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  {t('detail.selectPackage', 'Bu Paketi Seç')}
                </button>
              </div>

              {/* Option 2: Professional CMS */}
              <div className="p-4 sm:p-5 rounded-xl border-2 border-neutral-900 dark:border-neutral-600 bg-white dark:bg-neutral-900 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                      {t('detail.proOption', 'Profesyonel Seçenek')}
                    </span>
                    <Cpu className="w-4 h-4 text-amber-500" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white leading-tight">
                    {t('detail.proTitle', 'Tam Yetkili Profesyonel CMS')}
                  </h4>
                  <div className="text-base sm:text-lg font-bold font-mono-numbers text-neutral-950 dark:text-white mt-1.5 whitespace-nowrap">
                    {formatPrice(product.priceProfessionalTRY)}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed text-justify">
                    {t('detail.proDesc', 'Kendi modern yönetim panelinizle sınırsız içerik, fotoğraf ve yazı girişi.')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeDetail();
                    openContactModal(product, 'professional');
                  }}
                  className="mt-4 w-full py-2.5 text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                >
                  {t('detail.selectPackage', 'Bu Paketi Seç')}
                </button>
              </div>

              {/* Option 3: Custom Architecture */}
              <div className="p-4 sm:p-5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {t('models.custom.badge', 'Özel Mimari & Talep')}
                    </span>
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                  </div>
                  <h4 className="text-sm font-bold text-neutral-950 dark:text-white leading-tight">
                    {t('models.custom.title', 'Özel Mimari & Kurumsal Çözüm')}
                  </h4>
                  <div className="text-base sm:text-lg font-bold font-display text-indigo-600 dark:text-indigo-400 mt-1.5 whitespace-nowrap">
                    {t('models.custom.price', 'Özel Fiyatlandırma')}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed text-justify">
                    {t('models.custom.desc', 'Standart şablonların ötesinde sıfırdan Figma tasarımı, harici API/ERP entegrasyonu ve kurumsal altyapı.')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeDetail();
                    openContactModal(product, 'custom');
                  }}
                  className="mt-4 w-full py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  {t('models.ctaQuote', 'Özel Teklif İste')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                closeDetail();
                openDemo(product);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>{t('products.viewDemo', 'İnteraktif Canlı Demo')}</span>
            </button>

            <button
              onClick={() => {
                closeDetail();
                openDeployModal(product);
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title={currentLang === 'en' ? 'Deploy turnkey site to live production' : 'Bu hazır siteyi talep halinde yayına al'}
            >
              <Download className="w-4 h-4" />
              <span>{currentLang === 'en' ? 'Deploy & Export' : 'Yayına Al & Export'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                closeDetail();
                openPaymentModal(product, 'economic');
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-neutral-900 dark:text-white bg-amber-400 hover:bg-amber-300 dark:bg-amber-500 dark:hover:bg-amber-400 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs text-black font-bold"
            >
              <span>{t('detail.buyStripeWire', 'Stripe / Havale İle Satın Al')}</span>
            </button>

            <button
              onClick={() => {
                closeDetail();
                openContactModal(product, 'economic');
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <span>{t('models.ctaQuote', 'Teklif İste')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

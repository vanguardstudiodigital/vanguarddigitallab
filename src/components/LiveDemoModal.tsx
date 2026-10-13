import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Check,
  Calendar,
  Phone,
  Film,
  Play,
  Sparkles,
  Edit3,
  Star,
  MessageSquare,
  Plus,
  Send,
  User,
  Briefcase,
  Download,
} from 'lucide-react';
import { getEmbedVideoUrl } from '../utils/videoUtils.ts';
import { TurnkeyLiveSite } from './turnkey/TurnkeyLiveSite.tsx';

export const LiveDemoModal: React.FC = () => {
  const {
    activeDemoProduct,
    closeDemo,
    openContactModal,
    openPaymentModal,
    getLocalizedProduct,
    formatPrice,
    updateProduct,
    openCustomerPanel,
    openStandaloneSite,
    openDeployModal,
    t,
    currentLang,
  } = useApp();

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [viewMode, setViewMode] = useState<'interactive' | 'video'>('interactive');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isEditingVideo, setIsEditingVideo] = useState(false);
  const [videoInput, setVideoInput] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    {
      sender: 'bot',
      text:
        currentLang === 'en'
          ? 'Hello! How can I help you with this turnkey website?'
          : 'Merhaba! Size bu web sitesi çözümü hakkında nasıl yardımcı olabilirim?',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSaveVideoUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeDemoProduct) {
      updateProduct(activeDemoProduct.id, {
        videoUrl: videoInput.trim(),
      });
      setIsEditingVideo(false);
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text:
            currentLang === 'en' ? 'Thank you! On your real site, this inquiry is instantly pushed to your WhatsApp and CRM.'  : 'Teşekkürler! Talebiniz alındı. Gerçek sitede bu mesaj anında WhatsApp ve CRM panelinize iletilir.',
        },
      ]);
    }, 800);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDemo();
    };
    if (activeDemoProduct) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDemoProduct, closeDemo]);

  if (!activeDemoProduct) return null;

  const product = getLocalizedProduct(activeDemoProduct);
  const videoParsed = getEmbedVideoUrl(product.videoUrl || '');

  const getContainerWidth = () => {
    if (device === 'mobile') return 'max-w-[390px]';
    if (device === 'tablet') return 'max-w-[768px]';
    return 'max-w-[1200px]';
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-neutral-950/95 backdrop-blur-md">
      {/* Top Simulator Control Bar */}
      <div className="h-14 px-4 sm:px-6 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={closeDemo}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{t('common.close', 'Kapat')}</span>
          </button>

          <div className="h-4 w-px bg-neutral-800" />

          {/* Active Product Title & Sector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white font-display truncate max-w-[140px] sm:max-w-xs">
              {product.title}
            </span>
            <span className="hidden md:inline text-[11px] text-neutral-400">
              · {product.sector}
            </span>
          </div>
        </div>

        {/* View Mode & Device Switcher */}
        <div className="flex items-center gap-2">
          {/* Interactive vs Video Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
            <button
              onClick={() => setViewMode('interactive')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                viewMode === 'interactive'
                  ? 'bg-neutral-800 text-white shadow-xs font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Canlı Simülatör</span>
            </button>

            <button
              onClick={() => setViewMode('video')}
              className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer relative ${
                viewMode === 'video'
                  ? 'bg-amber-400 text-black shadow-xs font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Video Tanıtım</span>
              {product.videoUrl && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>

          {/* Device Switcher (only in interactive mode) */}
          {viewMode === 'interactive' && (
            <div className="hidden sm:flex items-center gap-1 p-1 bg-neutral-950 rounded-lg border border-neutral-800">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  device === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title={t('demo.desktop', 'Masaüstü Görünüm')}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  device === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title={t('demo.tablet', 'Tablet Görünüm')}
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded text-xs transition-colors cursor-pointer ${
                  device === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title={t('demo.mobile', 'Mobil Görünüm')}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Purchase CTA */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:block text-right mr-1">
            <div className="text-[10px] text-neutral-400 uppercase">{t('products.economicBadge', 'Ekonomik Başlangıç')}</div>
            <div className="text-xs font-bold text-white font-mono-numbers">
              {formatPrice(product.priceEconomicTRY)}
            </div>
          </div>

          <button
            onClick={() => {
              const p = product;
              closeDemo();
              openStandaloneSite(p);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
            title={currentLang === 'en' ? 'Open live standalone website'  : 'Canlı siteyi tam ekran bağımsız aç'}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentLang === 'en' ? 'Live Site'  : 'Tam Ekran'}</span>
          </button>

          <button
            onClick={() => {
              const p = activeDemoProduct;
              closeDemo();
              openDeployModal(p);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-lg transition-colors cursor-pointer"
            title={currentLang === 'en' ? 'Deploy turnkey site to live production'  : 'Bu hazır siteyi talep halinde yayına al'}
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {currentLang === 'en' ? 'Deploy'  : 'Yayına Al'}
            </span>
          </button>

          <button
            onClick={() => {
              closeDemo();
              openCustomerPanel(product.id);
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 rounded-lg transition-colors cursor-pointer"
            title={t('demo.customerPanelTooltip', 'Müşteri Paneli ile Bu Siteyi Düzenleyin')}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t('header.customerPanel', 'Müşteri Paneli')}</span>
          </button>

          <button
            onClick={() => {
              closeDemo();
              openPaymentModal(product, 'economic');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            <span>{t('models.ctaStripe', 'Stripe / Havale')}</span>
          </button>

          <button
            onClick={() => {
              closeDemo();
              openContactModal(product, 'economic');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>{t('demo.orderProposal', 'Sipariş / Teklif')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Simulator Viewport Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 flex items-start justify-center">
        {viewMode === 'video' ? (
          /* VIDEO PREVIEW MODE */
          <div className="w-full max-w-4xl bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-700/80 overflow-hidden flex flex-col my-auto">
            <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-950">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  {product.title} · {currentLang === 'en' ? 'Showcase & Demo Video'  : 'Tanıtım & Arayüz Videosu'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setVideoInput(product.videoUrl || '');
                    setIsEditingVideo(!isEditingVideo);
                  }}
                  className="text-xs text-neutral-300 hover:text-white flex items-center gap-1.5 px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  <Edit3 className="w-3 h-3 text-amber-400" />
                  <span>{product.videoUrl ? (currentLang === 'en' ? 'Change Video' : 'Videoyu Değiştir') : (currentLang === 'en' ? 'Add Video' : 'Video Ekle')}</span>
                </button>
                <button
                  onClick={() => setViewMode('interactive')}
                  className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>{currentLang === 'en' ? 'Switch to Simulator'  : 'Canlı Simülatöre Geç'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Video Editor Bar */}
            {isEditingVideo && (
              <form onSubmit={handleSaveVideoUrl} className="p-3 bg-neutral-950 border-b border-neutral-800 flex gap-2 items-center">
                <input
                  type="text"
                  value={videoInput}
                  onChange={e => setVideoInput(e.target.value)}
                  placeholder={currentLang === 'en' ? 'Paste YouTube, Vimeo or direct MP4 link...'  : 'YouTube, Vimeo veya doğrudan MP4 linki yapıştırın...'}
                  className="flex-1 px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  {currentLang === 'en' ? 'Save & Play'  : 'Kaydet & Oynat'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingVideo(false)}
                  className="px-2 py-1.5 text-neutral-400 hover:text-white text-xs"
                >
                  {t('common.cancel', 'İptal')}
                </button>
              </form>
            )}

            <div className="relative w-full aspect-video bg-black flex items-center justify-center">
              {product.videoUrl && videoParsed.embedUrl ? (
                videoParsed.type === 'video' ? (
                  <video
                    src={videoParsed.embedUrl}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Tarayıcınız video oynatmayı desteklemiyor.
                  </video>
                ) : (
                  <iframe
                    src={videoParsed.embedUrl}
                    title={`${product.title} Demo Video`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              ) : (
                <div className="p-8 text-center text-neutral-400 space-y-4 max-w-md">
                  <div className="w-16 h-16 rounded-full bg-neutral-800/80 text-amber-400 flex items-center justify-center mx-auto">
                    <Play className="w-8 h-8 ml-1" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white font-display">
                      {currentLang === 'en' ? 'Video is being prepared'  : 'Bu Şablon İçin Video Hazırlanıyor'}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      {currentLang === 'en' ? 'You can immediately test the interactive simulator or link your YouTube/Vimeo demo video.'  : 'Bu sitenin etkileşimli çalışan arayüzünü "Canlı Simülatör" sekmesinden anında test edebilir veya Yönetici Terminalinden istediğiniz YouTube/Vimeo video bağlantısını ekleyebilirsiniz.'}
                    </p>
                  </div>
                  <button
                    onClick={() => setViewMode('interactive')}
                    className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer"
                  >
                    {currentLang === 'en' ? 'Launch Live Simulator'  : 'Canlı Simülatörü Başlat'}
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-neutral-800">
              <span className="text-neutral-400">
                {currentLang === 'en' ? 'This design can be launched turnkey for your business within 48 hours.'  : 'Bu tasarım 48 saat içinde firmanıza özel içeriklerle yayına alınır.'}
              </span>
              <button
                onClick={() => {
                  closeDemo();
                  openContactModal(product, 'economic');
                }}
                className="px-4 py-2 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-lg cursor-pointer"
              >
                {t('models.ctaQuote', 'Bu Tasarım İçin Teklif İste')}
              </button>
            </div>
          </div>
        ) : (
          /* INTERACTIVE SIMULATOR MODE */
          <div
            className={`w-full ${getContainerWidth()} bg-white dark:bg-[#0a0c10] rounded-2xl shadow-2xl border border-neutral-700/60 overflow-hidden transition-all duration-300 min-h-[650px] flex flex-col`}
          >
            {/* Simulated Browser Address Bar */}
            <div className="px-4 py-2.5 bg-neutral-100 dark:bg-[#121620] border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex gap-1.5 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex-1 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center justify-between truncate">
                  <span className="truncate">https://demo.vanguardstudio.digital/{product.slug}</span>
                  <span className="text-[10px] text-emerald-500 shrink-0 ml-2 hidden sm:inline">● {currentLang === 'en' ? 'SSL Active · 48h SLA'  : 'SSL Aktif · 48h SLA'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    closeDemo();
                    openStandaloneSite(product);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Tam ekran bağımsız canlı siteyi aç"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span className="hidden sm:inline">Tam Ekran Aç</span>
                </button>

                {product.videoUrl && (
                  <button
                    onClick={() => setViewMode('video')}
                    className="px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-md flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span className="hidden md:inline">{currentLang === 'en' ? 'Watch Video'  : 'Videoyu İzle'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Complete, production-grade interactive website */}
            <div className="flex-1 overflow-y-auto min-h-[550px]">
              <TurnkeyLiveSite
                product={product}
                currentLang={currentLang}
                onOpenCustomerPanel={() => {
                  closeDemo();
                  openCustomerPanel(product.id);
                }}
                onOpenOrderModal={() => {
                  closeDemo();
                  openContactModal(product, 'economic');
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

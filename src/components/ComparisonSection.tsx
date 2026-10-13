import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Check, ShieldCheck, Cpu, ArrowRight, Sparkles, MessageCircle, Crown } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const { t, openContactModal, openPaymentModal, formatPrice, settings, currentLang } = useApp();

  const secNumber = t('models.sectionNumber', currentLang === 'en' ? '02. Product Packages' : '02. Ürün Paketleri');
  const secTitle = t('pricing.sectionTitle', currentLang === 'en' ? 'Product Tiers & Packages' : 'Ürün Paketleri & İş Modelleri');
  const secSubtitle = t(
    'pricing.sectionSubtitle',
    currentLang === 'en'
      ? 'Whether you leave all technical updates to us and focus on your business, manage it yourself with a full-access panel, or let us architect a custom solution from scratch for your enterprise.'
      : 'İster tüm teknik güncellemeleri bize devredip işinize bakın, ister tam yetkili panelinizle yönetin, isterseniz firmanıza özel sıfırdan mimari kuralım.'
  );

  const cleanWhatsappPhone = (settings?.whatsappTR || settings?.whatsapp || '905057030194').replace(/[^0-9]/g, '');

  return (
    <section id="pricing-models" className="py-20 md:py-28 bg-neutral-50/70 dark:bg-[#0c0f16] border-t border-neutral-200/70 dark:border-neutral-800/70">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 mb-2">
            {secNumber}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white font-display text-balance">
            {secTitle}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-3 leading-relaxed">
            {secSubtitle}
          </p>
        </div>

        {/* 2 Üst, 2 Alt Simetrik Grid Sistemi (max-w-5xl ile mükemmel nizam sağlandı) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Kart 1: Ekonomik Paket (Yönetim Bizde) */}
          <div className="relative flex flex-col bg-white dark:bg-[#121620] rounded-2xl p-6 sm:p-7 border-2 border-emerald-500/30 dark:border-emerald-500/20 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all shadow-lg shadow-emerald-500/5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-[10px] sm:text-[11px] font-black tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                  {t('models.mostPopular', currentLang === 'en' ? 'Most Popular Model' : 'En Çok Tercih Edilen Model')}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white font-display mt-1">
                  {t('models.economic.title', currentLang === 'en' ? 'Economic Tier (Managed by Us)' : 'Ekonomik Paket (Yönetim Bizde)')}
                </h3>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="mb-5 pb-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-base sm:text-lg xl:text-xl font-extrabold font-mono-numbers text-neutral-950 dark:text-white tracking-tight text-emerald-500">
                  {formatPrice(10000)} – {formatPrice(15000)}
                </span>
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 shrink-0">
                  {t('models.turnkey', currentLang === 'en' ? '/ turnkey delivery' : '/ anahtar teslim')}
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed min-h-[50px] text-justify">
                {t(
                  'models.economic.desc',
                  currentLang === 'en'
                    ? 'Ideal for small businesses that do not want to spend time learning admin panels or passwords. We build your site and upload your content. When changes are needed, send them to us and we update it.'
                    : 'Web paneli öğrenmekle veya şifrelerle vakit kaybetmek istemeyen küçük işletmeler için idealdir. Sitenizi kurar, içeriklerinizi yükleriz. Değişiklik gerektiğinde bize iletirsiniz, biz yaparız.'
                )}
              </p>
            </div>

            <div className="space-y-3 mb-6 flex-1 text-xs text-neutral-700 dark:text-neutral-300">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.economic.feat1', currentLang === 'en' ? 'No complex CMS for client; full management handled by the agency' : 'Müşteriye karmaşık panel verilmez; tam yönetim desteği ajanstadır')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.economic.feat2', currentLang === 'en' ? 'Domain name, hosting, SSL, and corporate email setup included' : 'Alan adı, hosting, SSL ve kurumsal e-posta kurulumu dahil')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.economic.feat3', currentLang === 'en' ? '12 text, photo, and pricing updates included per year' : 'Yılda 12 kez metin, fotoğraf ve fiyat güncelleme hakkı')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.economic.feat4', currentLang === 'en' ? 'Instant WhatsApp and direct call buttons integration' : 'Hızlı WhatsApp ve doğrudan arama butonları entegrasyonu')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.economic.feat5', currentLang === 'en' ? 'Ultra-fast load speed and mobile perfection' : 'Süper hızlı açılış ve mobil kusursuzluk')}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => openPaymentModal(null, 'economic')} className="flex-1 py-2.5 px-2 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md">
                <span>{t('models.ctaStripe', currentLang === 'en' ? 'Stripe / Wire Transfer' : 'Stripe / Havale')}</span>
              </button>
              <button onClick={() => openContactModal(null, 'economic')} className="flex-1 py-2.5 px-2 text-xs font-semibold text-neutral-900 dark:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer">
                <span>{t('models.ctaQuote', currentLang === 'en' ? 'Request a Quote' : 'Teklif İste')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Kart 2: Profesyonel Paket (Tam Yetkili CMS) */}
          <div className="relative flex flex-col bg-white dark:bg-[#121620] rounded-2xl p-6 sm:p-7 border-2 border-amber-500/30 dark:border-amber-500/20 hover:border-amber-500 dark:hover:border-amber-400 transition-all shadow-xl shadow-amber-500/5">
            <div className="absolute -top-3 left-6 sm:left-8 px-3 py-0.5 bg-amber-500 text-neutral-950 text-[10px] font-black tracking-widest rounded-full uppercase">
              {t('models.fullIndependence', currentLang === 'en' ? 'Full Independence & Control' : 'Tam Bağımsızlık & Kontrol')}
            </div>

            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">
                  {t('models.advancedPanel', currentLang === 'en' ? 'Advanced CMS Solution' : 'Gelişmiş Panel Çözümü')}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white font-display mt-1">
                  {t('models.pro.title', currentLang === 'en' ? 'Professional Tier (Full-Access CMS)' : 'Profesyonel Paket (Tam Yetkili CMS)')}
                </h3>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="mb-5 pb-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-base sm:text-lg xl:text-xl font-extrabold font-mono-numbers text-neutral-950 dark:text-white tracking-tight text-amber-500">
                  {formatPrice(18000)} – {formatPrice(25000)}+
                </span>
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 shrink-0">
                  {t('models.turnkey', currentLang === 'en' ? '/ turnkey delivery' : '/ anahtar teslim')}
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed min-h-[50px] text-justify">
                {t(
                  'models.pro.desc',
                  currentLang === 'en'
                    ? 'A full-access professional management panel for growing businesses with their own team, publishing regular content, or desiring total control over every detail.'
                    : 'Kendi ekibi olan, sık içerik/ürün girişi yapan veya sitenin her detayını bağımsız yönetmek isteyen büyüyen firmalar için tam yetkili profesyonel yönetim paneli.'
                )}
              </p>
            </div>

            <div className="space-y-3 mb-6 flex-1 text-xs text-neutral-700 dark:text-neutral-300">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.pro.feat1', currentLang === 'en' ? 'Turnkey delivery of a full-access, clean professional CMS' : 'Müşteriye teslim edilen tam yetkili, sade profesyonel CMS')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.pro.feat2', currentLang === 'en' ? 'Unlimited products, blog posts, and media gallery items' : 'Sınırsız ürün, yazı ve galeri içeriği ekleme imkanı')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.pro.feat3', currentLang === 'en' ? 'Multilingual content management and automatic translation engine' : 'Çok dilli içerik yönetimi ve otomatik çeviri motoru')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.pro.feat4', currentLang === 'en' ? 'Advanced analytics and instant inquiry notifications' : 'Gelişmiş analitik ve form bildirimleri entegrasyonu')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.pro.feat5', currentLang === 'en' ? '1-hour live onboarding video session and guide for your team' : 'Ekibiniz için 1 saatlik canlı video eğitim ve rehber')}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => openPaymentModal(null, 'professional')} className="flex-1 py-2.5 px-2 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md">
                <span>{t('models.ctaStripe', currentLang === 'en' ? 'Stripe / Wire Transfer' : 'Stripe / Havale')}</span>
              </button>
              <button onClick={() => openContactModal(null, 'professional')} className="flex-1 py-2.5 px-2 text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md">
                <span>{t('models.ctaQuote', currentLang === 'en' ? 'Request a Quote' : 'Teklif İste')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Kart 3: Özel Mimari & Kurumsal Çözüm */}
          <div className="relative flex flex-col bg-white dark:bg-[#121620] rounded-2xl p-6 sm:p-7 border-2 border-indigo-500/30 dark:border-indigo-500/20 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all shadow-lg shadow-indigo-500/5">
            <div className="absolute -top-3 left-6 sm:left-8 px-3 py-0.5 bg-indigo-600 text-white text-[10px] font-black tracking-widest rounded-full uppercase">
              {t('models.customArchitecture', currentLang === 'en' ? 'Custom Architecture & Scale' : 'Özel Mimari & Büyüme')}
            </div>

            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">
                  {t('models.customScope', currentLang === 'en' ? 'Bespoke Scope & Custom Quote' : 'Özel Kapsam & Teklif Usulü')}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white font-display mt-1">
                  {t('models.custom.title', currentLang === 'en' ? 'Custom Architecture & Enterprise Solution' : 'Özel Mimari & Kurumsal Çözüm')}
                </h3>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="mb-5 pb-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-base sm:text-lg xl:text-xl font-extrabold font-display text-neutral-950 dark:text-white tracking-tight text-indigo-500">
                  {t('models.custom.priceTitle', currentLang === 'en' ? 'Custom Pricing' : 'Özel Fiyatlandırma')}
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 shrink-0">
                  {t('models.custom.priceSub', currentLang === 'en' ? '/ per project' : '/ projeye göre')}
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed min-h-[50px] text-justify">
                {t(
                  'models.custom.desc',
                  currentLang === 'en'
                    ? 'Beyond standard templates: custom bespoke UI/UX design, external API/ERP/CRM integrations, multi-branch, or enterprise e-commerce infrastructures.'
                    : 'Standart şablonların ötesinde; markanıza özel sıfırdan UI/UX tasarımı, harici API/ERP/CRM entegrasyonları, çoklu şube veya e-ticaret altyapısı gerektiren ileri seviye projeler.'
                )}
              </p>
            </div>

            <div className="space-y-3 mb-6 flex-1 text-xs text-neutral-700 dark:text-neutral-300">
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.custom.feat1', currentLang === 'en' ? 'Bespoke Figma UI/UX design tailored specifically to your brand' : 'Markanıza ve sektörünüze özel sıfırdan Figma UI/UX tasarımı')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.custom.feat2', currentLang === 'en' ? 'Custom backend architecture, API services, and ERP/CRM integrations' : 'Özel backend mimarisi, API servisleri ve ERP/CRM entegrasyonları')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.custom.feat3', currentLang === 'en' ? 'Multilingual, multi-currency, and international payment gateways' : 'Çoklu dil, çoklu para birimi ve global ödeme ağ geçitleri')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.custom.feat4', currentLang === 'en' ? 'High-traffic load balancing and dedicated cloud hosting deployment' : 'Yüksek trafik yük dengelemesi ve özel cloud sunucu kurulumu')}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{t('models.custom.feat5', currentLang === 'en' ? 'Priority 24/7 SLA support, full source code handover, and docs' : 'Öncelikli 7/24 SLA desteği, kaynak kod teslimi ve dokümantasyon')}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => openContactModal(null, 'custom')} className="flex-1 py-2.5 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md">
                <span>{t('models.ctaQuote', currentLang === 'en' ? 'Request a Quote' : 'Özel Teklif İste')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <a
                href={`https://wa.me/${cleanWhatsappPhone}?text=${encodeURIComponent(
                  currentLang === 'en'
                    ? 'Hello Vanguard Studio! I would like to request a quote for bespoke web development, custom software, or enterprise architecture.'
                    : 'Merhaba Vanguard Studio! Firmanızdan özel yazılım, sıfırdan tasarım veya kurumsal mimari projesi hakkında teklif almak istiyorum.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Kart 4: Vanguard Nexus (Premium Web & AI Advisory) */}
          <div className="relative flex flex-col bg-white dark:bg-[#121620] rounded-2xl p-6 sm:p-7 border-2 border-amber-500/40 dark:border-amber-500/20 hover:border-amber-500 dark:hover:border-amber-400 transition-all shadow-xl shadow-amber-500/10">
            <div className="absolute -top-3 left-6 sm:left-8 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-neutral-950 text-[10px] font-black tracking-widest rounded-full uppercase flex items-center gap-1 shadow-md">
              <Crown className="w-3 h-3" />
              <span>{currentLang === 'en' ? 'VIP Advisory' : 'VIP Danışmanlık'}</span>
            </div>

            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-amber-500 uppercase">
                  {currentLang === 'en' ? 'VIP C-Level Advisory' : 'VIP C-Level Danışmanlık'}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white font-display mt-1">
                  {currentLang === 'en' ? 'Vanguard Nexus (Premium Web & AI Advisory)' : 'Vanguard Nexus (Premium Web & AI Danışmanlığı)'}
                </h3>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              </div>
            </div>

            <div className="mb-5 pb-5 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="text-base sm:text-lg xl:text-xl font-extrabold font-mono-numbers text-amber-500 tracking-tight">
                  {currentLang === 'en' ? '$1,500+' : "50.000 TL'den"}
                </span>
                <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 shrink-0">
                  {currentLang === 'en' ? '/ starting rate' : '/ başlayan fiyatlarla'}
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-2.5 leading-relaxed min-h-[50px] text-justify">
                {currentLang === 'en' 
                  ? 'Direct C-Level technical advisory in digital transformation, custom LLM fine-tuning, and enterprise high-scale system architecture.' 
                  : 'C-Level doğrudan danışmanlık, özel yapay zekâ model orkestrasyonu, kurumsal cloud kümeleme ve ileri düzey dönüşüm mimarisi.'}
              </p>
            </div>

            <div className="space-y-3 mb-6 flex-1 text-xs text-neutral-700 dark:text-neutral-300">
              <div className="flex items-start gap-2.5"><Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /><span>{currentLang === 'en' ? 'Enterprise Web Infrastructure Transformation' : 'Kurumsal Web Altyapı ve Performans Dönüşümü'}</span></div>
              <div className="flex items-start gap-2.5"><Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /><span>{currentLang === 'en' ? 'Custom LLM & AI Agent Model Integration' : 'Özel LLM ve Yapay Zekâ Ajan Modelleri Entegrasyonu'}</span></div>
              <div className="flex items-start gap-2.5"><Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /><span>{currentLang === 'en' ? 'KVKK & GDPR Compliant System Architecture' : 'KVKK ve GDPR Uyumlu Uluslararası Güvenlik Mimarisi'}</span></div>
              <div className="flex items-start gap-2.5"><Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /><span>{currentLang === 'en' ? 'Google Lighthouse 99+ Speed & SEO Audits' : 'Google Lighthouse 99+ Hız ve GEO Denetimleri'}</span></div>
              <div className="flex items-start gap-2.5"><Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /><span>{currentLang === 'en' ? '24/7 Priority SLA & Dedicated Strategy Desk' : 'Öncelikli 7/24 SLA ve B2B Strateji Teknoloji Masası'}</span></div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => openContactModal(null, 'advisory')} className="flex-1 py-2.5 px-3 text-xs font-bold text-black bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"><span>{currentLang === 'en' ? 'Schedule Session' : 'Strateji Toplantısı Planla'}</span><ArrowRight className="w-3.5 h-3.5" /></button>
              <a
                href={`https://wa.me/${cleanWhatsappPhone}?text=${encodeURIComponent(
                  currentLang === 'en' ? 'Hello Vanguard Studio! I would like to request a C-Level strategy session for enterprise AI advisory.' : 'Merhaba Vanguard Studio! Firmamız için C-Level kurumsal yapay zekâ ve web danışmanlığı hakkında vip strateji seansı planlamak istiyorum.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-3 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

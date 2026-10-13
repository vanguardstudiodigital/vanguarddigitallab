import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Mail, Phone, MapPin, MessageCircle, Shield, FileText, ChevronRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const {
    settings,
    openPageModal,
    openContactModal,
    openPaymentModal,
    navigationItems,
    customPages,
    currentLang,
    t,
  } = useApp();

  const corporateLinks = navigationItems.filter(n => n.location === 'footer_corporate' || n.locations?.includes('footer_corporate'));
  const productLinks = navigationItems.filter(n => n.location === 'footer_products' || n.locations?.includes('footer_products'));
  const legalLinks = navigationItems.filter(n => n.location === 'footer_legal' || n.locations?.includes('footer_legal'));

  const handleLinkClick = (url: string, pageSlug?: string) => {
    if (pageSlug) {
      openPageModal(pageSlug);
      return;
    }
    if (url.startsWith('#page-')) {
      const slug = url.replace('#page-', '');
      openPageModal(slug);
      return;
    }
    if (url === '#contact' || url === '#iletisim' || url === '#page-iletisim') {
      openPageModal('iletisim');
      return;
    }
    if (url === '#payment') {
      openPaymentModal(null, 'economic');
      return;
    }
    if (url === '#hero' || url === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (url.startsWith('#')) {
      const el = document.querySelector(url);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.location.href = url;
  };

  return (
    <footer className="bg-white dark:bg-[#07090d] border-t border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-neutral-200/60 dark:border-neutral-800/60">
          {/* Col 1: Brand & Contact Info */}
          <div className="space-y-4">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-lg font-bold tracking-tight text-neutral-950 dark:text-white font-display inline-block"
            >
              {t('footer.brandName', settings.agencyName || 'Vanguard Studio')}
            </a>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed text-justify">
              {t('footer.tagline', currentLang === 'en' ? 'Elite & Turnkey Web Solutions for Small Businesses' : (settings.tagline || 'Küçük İşletmeler İçin Elit & Anahtar Teslim Web Çözümleri'))}
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                {t('footer.acceptingClients', 'Yeni Müşteri Kabulü Açık')}
              </span>
            </div>

            <div className="pt-2 text-xs space-y-2.5 border-t border-neutral-100 dark:border-neutral-800/80">
              {/* Türkiye & Genel Hub */}
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-amber-500">
                  🇹🇷 {t('footer.hubTurkey', 'Türkiye & Genel')}:
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <a
                    href={`https://wa.me/${(settings.whatsappTR || settings.whatsapp || '905057030194').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-500 transition-colors font-mono-numbers font-medium"
                  >
                    {settings.whatsappTR || settings.whatsapp || '+90 505 703 0194'}{' '}
                    <span className="text-[10px] text-neutral-400 font-sans">
                      ({t('footer.whatsappNote', t('contact.onlyWhatsapp', 'Sadece WhatsApp'))})
                    </span>
                  </a>
                </div>
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-[11px]">
                  <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                  <span>{t('footer.locationTR', settings.locationTR || 'Antalya, Türkiye')}</span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.email}
                </a>
              </div>
            </div>
          </div>

          {/* Col 2: KURUMSAL */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-neutral-950 dark:text-white tracking-wider">
              {t('footer.corporateTitle', 'KURUMSAL')}
            </div>
            <div className="text-xs space-y-2.5 flex flex-col">
              {corporateLinks.length > 0 ? (
                corporateLinks
                  .sort((a, b) => a.order - b.order)
                  .map((item, idx) => {
                    const locTitle = item.translations?.[currentLang]?.title || item.title;
                    const isCareer = item.pageSlug === 'kariyer' || item.id === 'nav-f-corp-kariyer' || item.url.includes('kariyer');
                    return (
                      <button
                        key={`${item.id}-${idx}`}
                        onClick={() => handleLinkClick(item.url, item.pageSlug)}
                        className={`text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 ${
                          isCareer ? 'font-medium text-emerald-600 dark:text-emerald-400' : ''
                        }`}
                      >
                        <span>{locTitle}</span>
                        {isCareer && (
                          <span className="px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-bold">
                            {currentLang === 'en' ? 'Hiring' : 'İlan'}
                          </span>
                        )}
                      </button>
                    );
                  })
              ) : (
                <>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {t('nav.home', 'Ana Sayfa')}
                  </button>
                  <button
                    onClick={() => openPageModal('hakkimizda')}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer font-medium text-neutral-800 dark:text-neutral-200"
                  >
                    {t('nav.about', 'Hakkımızda')}
                  </button>
                  <button
                    onClick={() => openPageModal('vizyon')}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {t('corporate.vision', 'Vizyon')}
                  </button>
                  <button
                    onClick={() => openPageModal('misyon')}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {t('corporate.mission', 'Misyon')}
                  </button>
                  <button
                    onClick={() => openPageModal('kariyer')}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"
                  >
                    <span>{t('corporate.careers', 'Kariyer & Uzaktan İş')}</span>
                    <span className="px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[9px] font-bold">
                      {t('footer.badgeHiring', 'İlan')}
                    </span>
                  </button>
                  <button
                    onClick={() => openPageModal('iletisim')}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer font-medium text-amber-600 dark:text-amber-400"
                  >
                    {t('nav.contactLink', 'İletişim & Teklif')}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Col 3: HAZIR SİTELER & PAKETLER */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-neutral-950 dark:text-white tracking-wider">
              {t('footer.modelsTitle', 'HAZIR SİTELER & PAKETLER')}
            </div>
            <div className="text-xs space-y-2.5 flex flex-col">
              {productLinks.length > 0 ? (
                productLinks
                  .sort((a, b) => a.order - b.order)
                  .map((item, idx) => {
                    const locTitle = item.translations?.[currentLang]?.title || item.title;
                    const isPay = item.url === '#payment' || item.id === 'nav-f-prod-pay';
                    return (
                      <button
                        key={`${item.id}-${idx}`}
                        onClick={() => handleLinkClick(item.url, item.pageSlug)}
                        className={`text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer ${
                          isPay ? 'text-amber-600 dark:text-amber-400 font-medium' : ''
                        }`}
                      >
                        {locTitle}
                      </button>
                    );
                  })
              ) : (
                <>
                  <button
                    onClick={() => handleLinkClick('#portfolio-section')}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {t('footer.catalogLink', 'Hazır Siteler Kataloğu')}
                  </button>
                  <button
                    onClick={() => handleLinkClick('#pricing-models')}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {t('models.economic.title', 'Ekonomik Paket (Yönetim Bizde)')}
                  </button>
                  <button
                    onClick={() => handleLinkClick('#pricing-models')}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {t('models.pro.title', 'Profesyonel Paket (Tam Yetkili CMS)')}
                  </button>
                  <button
                    onClick={() => handleLinkClick('#pricing-models')}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer"
                  >
                    {t('models.custom.title', 'Özel Talep & Kurumsal Mimari')}
                  </button>
                  <button
                    onClick={() => openPaymentModal(null, 'economic')}
                    className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer text-amber-600 dark:text-amber-400 font-medium"
                  >
                    {t('nav.paymentPortal', 'Güvenli Ödeme & Havale Portalı')}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Col 4: YASAL BİLDİRİMLER */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-neutral-950 dark:text-white tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('footer.legalTitle', 'YASAL BİLDİRİMLER')}</span>
            </div>
            <div className="text-xs space-y-2.5 flex flex-col">
              {legalLinks.length > 0 ? (
                legalLinks
                  .sort((a, b) => a.order - b.order)
                  .map((item, idx) => {
                    const locTitle = item.translations?.[currentLang]?.title || item.title;
                    return (
                      <button
                        key={`${item.id}-${idx}`}
                        onClick={() => handleLinkClick(item.url, item.pageSlug)}
                        className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <span>{locTitle}</span>
                        <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })
              ) : (
                customPages
                  .filter(p => p.category === 'legal')
                  .map((cp, idx) => {
                    const locTitle = cp.translations?.[currentLang]?.title || cp.title;
                    return (
                      <button
                        key={`${cp.id}-${idx}`}
                        onClick={() => openPageModal(cp.slug)}
                        className="text-left hover:text-neutral-950 dark:hover:text-white transition-colors cursor-pointer flex items-center justify-between group"
                      >
                        <span>{locTitle}</span>
                        <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </button>
                    );
                  })
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Studio Motto in Bottom-Left */}
        <div className="pt-8 pb-3 border-t border-neutral-100 dark:border-neutral-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-neutral-800 dark:text-neutral-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            <span className="font-semibold italic font-display tracking-wide">
              {t(
                'footer.motto',
                currentLang === 'en' ? '“Building with Code, Growing with Marketing. Digital Future Beyond Borders.”'  : '“Kodla İnşa Ediyor, Pazarlamayla Büyütüyoruz. Sınırların Ötesinde Dijital Gelecek.”'
              )}
            </span>
          </div>

          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-2 font-mono">
            <span>{t('footer.hubLocations', '🇹🇷 TR Antalya & 🇪🇺 EU Frankfurt Hub')}</span>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} {t('footer.copyrightOwner', 'Vanguard Studio')}. {t('footer.allRights', 'Tüm hakları saklıdır.')}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openPageModal('hakkimizda')}
              className="hover:underline cursor-pointer"
            >
              {t('footer.aboutLinkText', t('nav.about', 'Hakkımızda'))}
            </button>
            <span>·</span>
            <button
              onClick={() => openPageModal('gizlilik-politikasi')}
              className="hover:underline cursor-pointer"
            >
              {t(
                'footer.privacyLinkText',
                currentLang === 'en' ? 'Privacy & GDPR'  : 'Gizlilik & KVKK'
              )}
            </button>
            <span>·</span>
            <button
              onClick={() => handleLinkClick(t('footer.turnaroundUrl', '#page-48-saatte-teslim-ve-hizmet-garantisi'))}
              className="hover:underline hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              {t('footer.turnaround', currentLang === 'en' ? 'Turnkey Delivery in 48 Hours' : '48 Saatte Anahtar Teslim')}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Layout, ShieldCheck, Settings, Globe, ArrowRight, Check } from 'lucide-react';
import { ServiceItem } from '../types/index.ts';
import { RichContentRenderer } from './common/RichContentRenderer.tsx';

const iconMap: Record<string, React.ReactNode> = {
  Layout: <Layout className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />,
  Settings: <Settings className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />,
  Globe: <Globe className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />,
};

export const ServicesSection: React.FC = () => {
  const { services, openViewAll, openContactModal, getLocalizedService, t, currentLang } = useApp();

  // Show top 4 services localized to current language
  const displayedServices = services.slice(0, 4).map(s => getLocalizedService(s));

  const sectionNumber = t('services.sectionNumber', currentLang === 'en' ? '03. Agency Solutions' : '03. Ajans Çözümleri');
  const rawTitle = t('services.sectionTitle', currentLang === 'en' ? 'Agency Services' : 'Ajans Hizmetleri');
  const sectionTitle = currentLang === 'en' && rawTitle === 'Ajans Hizmetleri' ? 'Agency Services' : rawTitle;
  const sectionSubtitle = t(
    'services.sectionSubtitle',
    currentLang === 'en'
      ? 'Beyond our ready-made websites, end-to-end digital solutions to support your growth.'
      : 'Hazır sitelerimizin ötesinde, büyümenizi destekleyecek uçtan uca dijital çözümler.'
  );

  return (
    <section id="services-section" className="py-20 md:py-28 border-t border-neutral-200/70 dark:border-neutral-800/70">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div>
            <div className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              {sectionNumber}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white font-display">
              {sectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl text-justify">
              {sectionSubtitle}
            </p>
          </div>

          <button
            onClick={() => openViewAll('services')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span>{t('services.viewAllText', t('nav.viewAll', 'Tümünü Gör'))}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4-Item Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedServices.map((service: ServiceItem) => (
            <div
              key={service.id}
              className="p-8 bg-white dark:bg-[#10141d] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-400 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {service.number}
                  </span>
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                    {iconMap[service.iconName] || <Layout className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-neutral-950 dark:text-white font-display mb-1.5">
                  {service.title}
                </h3>
                <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-4">
                  {service.subtitle}
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6 text-justify">
                  <RichContentRenderer content={service.description} className="text-justify" />
                </div>

                {/* Deliverables */}
                <div className="space-y-2 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  {service.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4">
                <button
                  onClick={() => openContactModal(null, 'custom')}
                  className="text-xs font-semibold text-neutral-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{t('services.ctaQuote', t('models.ctaQuote', 'Bilgi & Teklif İste'))}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

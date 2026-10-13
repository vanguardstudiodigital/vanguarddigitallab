import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { ArrowRight, Quote } from 'lucide-react';
import { ReferenceItem } from '../types/index.ts';

export const ReferencesSection: React.FC = () => {
  const { references, openViewAll, getLocalizedReference, t, currentLang } = useApp();

  const displayedReferences = references.slice(0, 4).map(r => getLocalizedReference(r));

  const sectionNumber = t('references.sectionNumber', currentLang === 'en' ? '04. Proven Achievements' : '04. Kanıtlanmış Başarılar');
  const rawTitle = t('references.sectionTitle', currentLang === 'en' ? 'Partnerships & Proven Results' : 'İş Birliklerimiz & Sonuçlar');
  const sectionTitle = currentLang === 'en' && rawTitle === 'İş Birliklerimiz & Sonuçlar' ? 'Partnerships & Proven Results' : rawTitle;
  const sectionSubtitle = t(
    'references.sectionSubtitle',
    currentLang === 'en'
      ? 'Real-life success stories of small businesses in the Turkish and global markets.'
      : 'Türkiye ve global pazardaki küçük işletmelerin gerçek başarı deneyimleri.'
  );

  return (
    <section id="references-section" className="py-20 md:py-28 bg-neutral-50/70 dark:bg-[#0c0f16] border-t border-neutral-200/70 dark:border-neutral-800/70">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12">
          <div>
            <div className="text-xs font-semibold tracking-wider text-amber-600 dark:text-amber-400 mb-2">
              {sectionNumber}
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white font-display">
              {sectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 max-w-xl">
              {sectionSubtitle}
            </p>
          </div>

          <button
            onClick={() => openViewAll('references')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
          >
            <span>{t('references.viewAllText', t('nav.viewAll', 'Tümünü Gör'))}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedReferences.map((ref: ReferenceItem) => (
            <div
              key={ref.id}
              className="p-6 bg-white dark:bg-[#121620] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400">
                    {ref.sector}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {ref.year}
                  </span>
                </div>

                <div className="text-sm font-bold font-mono-numbers text-emerald-600 dark:text-emerald-400 mb-3">
                  {ref.metric}
                </div>

                <h3 className="text-base font-bold text-neutral-950 dark:text-white font-display mb-3">
                  {ref.clientName}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic mb-6">
                  "{ref.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800/80">
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {ref.author}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {ref.authorRole}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

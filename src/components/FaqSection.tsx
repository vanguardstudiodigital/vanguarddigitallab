import React, { useState, useMemo } from 'react';
import { HelpCircle, ChevronDown, Search, Sparkles, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext.tsx';
import { FaqItem } from '../types/index.ts';
import { RichContentRenderer } from './common/RichContentRenderer.tsx';

export const FaqSection: React.FC = () => {
  const { faqs, getLocalizedFaq, currentLang, t } = useApp();
  const [openIds, setOpenIds] = useState<string[]>(['faq-1']); // First FAQ open by default
  const [searchQuery, setSearchQuery] = useState('');

  // Active FAQs localized and ordered
  const localizedFaqs = useMemo(() => {
    return faqs
      .filter(f => f.active)
      .map(f => getLocalizedFaq(f))
      .sort((a, b) => a.order - b.order);
  }, [faqs, getLocalizedFaq]);

  // Search filtering
  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return localizedFaqs;
    const q = searchQuery.toLowerCase();
    return localizedFaqs.filter(
      f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q)
    );
  }, [localizedFaqs, searchQuery]);

  const toggleAccordion = (id: string) => {
    setOpenIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
  };

  const sectionTitle =
    currentLang === 'en'
      ? 'Frequently Asked Questions (FAQ)'
      : 'Sıkça Sorulan Sorular (SSS / FAQ)';

  const sectionSubtitle =
    currentLang === 'en'
      ? 'Clear, transparent answers regarding turnkey deployment, delivery SLAs, pricing, and ongoing support.'
      : 'Hazır web sitelerimizin teslimat süreçleri, paket seçenekleri, ödeme ve teknik destek hakkında merak edilen tüm yanıtlar.';

  return (
    <section id="faq-section" className="py-16 sm:py-24 bg-neutral-950/40 dark:bg-[#080a10]/80 relative overflow-hidden border-t border-neutral-800/60">
      {/* Background Subtle Accent Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-xs">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{currentLang === 'en' ? 'Help Center'  : 'Bilgi & Destek Masası'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight leading-tight">
            {sectionTitle}
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            {sectionSubtitle}
          </p>

          {/* Quick Search Filter */}
          <div className="relative max-w-md mx-auto pt-2">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  currentLang === 'en'
                    ? 'Search questions (e.g. payment, domain, delivery)...'
                    : 'Sorularda ara (örneğin: ödeme, domain, teslimat)...'
                }
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-900/90 dark:bg-[#0d101a] border border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:border-amber-400/80 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-xs text-neutral-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="text-[11px] text-neutral-400 mt-1.5 text-left pl-1">
                {filteredFaqs.length > 0
                  ? currentLang === 'en'
                    ? `Found ${filteredFaqs.length} match(es)`
                    : `${filteredFaqs.length} adet sonuç bulundu`
                  : currentLang === 'en' ? 'No matching questions found'  : 'Aranan kriterde soru bulunamadı'}
              </div>
            )}
          </div>
        </div>

        {/* Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-neutral-900/50 border border-neutral-800 space-y-3">
            <MessageSquare className="w-8 h-8 text-neutral-500 mx-auto" />
            <p className="text-sm text-neutral-400 font-medium">
              {currentLang === 'en' ? 'No matching FAQ items found.'  : 'Aramanıza uygun soru bulunamadı.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id}
                  className={`group rounded-2xl transition-all duration-200 border overflow-hidden ${
                    isOpen
                      ? 'bg-neutral-900/95 dark:bg-[#0e111a] border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-neutral-900/60 dark:bg-[#0b0d14]/80 hover:bg-neutral-900/90 border-neutral-800/80 hover:border-neutral-700/80'
                  }`}
                >
                  {/* Accordion Trigger Header */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full px-5 sm:px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isOpen ? 'bg-amber-400 text-black shadow-xs' : 'bg-neutral-800 text-neutral-400 group-hover:bg-neutral-700 group-hover:text-neutral-200'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-xs sm:text-base font-semibold text-neutral-100 group-hover:text-amber-300 transition-colors leading-snug">
                        {faq.question}
                      </h3>
                    </div>

                    <div className={`p-1.5 rounded-lg transition-transform duration-300 shrink-0 ${
                      isOpen ? 'bg-amber-500/20 text-amber-400 rotate-180' : 'bg-neutral-800 text-neutral-400 group-hover:text-white'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Accordion Body with Rich Content & Justified Formatting */}
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-neutral-800/60 animate-fadeIn">
                      <div className="pl-0 sm:pl-10 text-neutral-300 text-xs sm:text-sm leading-relaxed">
                        <RichContentRenderer content={faq.answer} className="text-justify text-neutral-300 dark:text-neutral-300" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Prompt */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-emerald-500/10 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 hidden sm:block">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white font-display">
                {currentLang === 'en' ? 'Have specific questions about your project?'  : 'Aradığınız sorunun cevabını bulamadınız mı?'}
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {currentLang === 'en' ? 'Reach out to our engineering desk for a free 1-on-1 technical consultation.'  : 'Müşteri temsilcilerimiz ve yazılım ekibimiz 7/24 sorularınızı yanıtlamaya hazırdır.'}
              </p>
            </div>
          </div>

          <a
            href="#page-iletisim"
            className="px-4 py-2.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
          >
            {currentLang === 'en' ? 'Ask a Question'  : 'Bize Ulaşın'}
          </a>
        </div>
      </div>
    </section>
  );
};

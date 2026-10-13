import React from 'react';
import { useApp } from '../context/AppContext.tsx';
import { X, Eye, ArrowRight, Check } from 'lucide-react';
import { TurnkeyProduct, ServiceItem, ReferenceItem } from '../types/index.ts';
import { RichContentRenderer } from './common/RichContentRenderer.tsx';

export const ViewAllModal: React.FC = () => {
  const {
    activeViewAllSection,
    closeViewAll,
    products,
    services,
    references,
    formatPrice,
    openDemo,
    openDetail,
    openContactModal,
    getLocalizedProduct,
    getLocalizedService,
    getLocalizedReference,
    t,
  } = useApp();

  if (!activeViewAllSection) return null;

  const localizedProducts = products.map(p => getLocalizedProduct(p));
  const localizedServices = services.map(s => getLocalizedService(s));
  const localizedReferences = references.map(r => getLocalizedReference(r));

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#10141d] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div>
            <h3 className="text-lg font-bold text-neutral-950 dark:text-white font-display">
              {activeViewAllSection === 'products' && t('viewAll.allProducts', 'Tüm Satışa Hazır Sektörel Siteler (Maks. 10)')}
              {activeViewAllSection === 'services' && t('viewAll.allServices', 'Tüm Ajans Hizmetlerimiz & Yeteneklerimiz')}
              {activeViewAllSection === 'references' && t('viewAll.allReferences', 'Tüm Referanslar & Müşteri Deneyimleri')}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {t('viewAll.catalogSubtitle', 'Vanguard Studio resmi kataloğu')}
            </p>
          </div>

          <button
            onClick={closeViewAll}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {/* Products List */}
          {activeViewAllSection === 'products' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {localizedProducts.map((product: TurnkeyProduct) => (
                <div
                  key={product.id}
                  className="flex flex-col bg-neutral-50 dark:bg-neutral-900/60 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 p-4 justify-between"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800 mb-3">
                      <img
                        src={product.coverImage}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white backdrop-blur-sm">
                        {product.sector}
                      </div>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-950 dark:text-white">
                      {product.title}
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
                      {product.tagline}
                    </p>

                    <div className="mt-3 pt-3 border-t border-neutral-200/60 dark:border-neutral-800 text-xs font-semibold font-mono-numbers">
                      {formatPrice(product.priceEconomicTRY)} ({t('products.economicBadge', 'Ekonomik')}) / {formatPrice(product.priceProfessionalTRY)} ({t('products.proBadge', 'CMS')})
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex gap-2">
                    <button
                      onClick={() => {
                        closeViewAll();
                        openDemo(product);
                      }}
                      className="flex-1 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-center"
                    >
                      Demo
                    </button>
                    <button
                      onClick={() => {
                        closeViewAll();
                        openDetail(product);
                      }}
                      className="flex-1 py-1.5 text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-lg text-center"
                    >
                      {t('megaMenu.examine', 'İncele')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Services List */}
          {activeViewAllSection === 'services' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localizedServices.map((serv: ServiceItem) => (
                <div
                  key={serv.id}
                  className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60"
                >
                  <div className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 mb-2">
                    {serv.number}
                  </div>
                  <h4 className="text-base font-bold text-neutral-950 dark:text-white mb-1">
                    {serv.title}
                  </h4>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 text-justify">
                    <RichContentRenderer content={serv.description} className="text-justify" />
                  </div>
                  <div className="space-y-1.5">
                    {serv.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* References List */}
          {activeViewAllSection === 'references' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {localizedReferences.map((ref: ReferenceItem) => (
                <div
                  key={ref.id}
                  className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60"
                >
                  <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                    <span>{ref.sector}</span>
                    <span>{ref.year}</span>
                  </div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    {ref.metric}
                  </div>
                  <h4 className="text-base font-bold text-neutral-950 dark:text-white mb-2">
                    {ref.clientName}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 italic mb-4">
                    "{ref.quote}"
                  </p>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                    {ref.author} · <span className="text-neutral-500 font-normal">{ref.authorRole}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

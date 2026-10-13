import React, { useState } from 'react';
import { TurnkeyProduct } from '../../types/index.ts';
import { TurnkeyLiveSite } from './TurnkeyLiveSite.tsx';
import { DeployPackageModal } from './DeployPackageModal.tsx';
import {
  ArrowLeft,
  Briefcase,
  Download,
  CreditCard,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Sparkles,
} from 'lucide-react';

interface StandaloneSiteViewProps {
  product: TurnkeyProduct;
  currentLang: string;
  setLanguage: (lang: string) => void;
  onClose: () => void;
  onOpenCustomerPanel: (productId: string) => void;
  onOpenPaymentModal: (product: TurnkeyProduct, pkg: 'economic' | 'professional') => void;
  onOpenContactModal: (product: TurnkeyProduct, pkg: 'economic' | 'professional') => void;
}

export const StandaloneSiteView: React.FC<StandaloneSiteViewProps> = ({
  product,
  currentLang,
  setLanguage,
  onClose,
  onOpenCustomerPanel,
  onOpenPaymentModal,
  onOpenContactModal,
}) => {
  const [isDeployOpen, setIsDeployOpen] = useState(false);
  const [isBarMinimized, setIsBarMinimized] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0c0e14] text-white">
      {/* Discreet Floating Vanguard Control Bar */}
      <div
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isBarMinimized
            ? 'translate-y-[-82%]'
            : 'translate-y-0'
        }`}
      >
        <div className="bg-neutral-950/95 backdrop-blur-md border-b border-amber-500/30 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-2xl">
          {/* Left: Vanguard Badge & Product Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 text-xs font-bold transition-all cursor-pointer"
              title={currentLang === 'en' ? 'Return to Vanguard Portal' : 'Vanguard Studio Ana Portalına Dön'}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Vanguard Portal</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-xs">
                <span className="font-bold text-white">{product.title}</span>
                <span className="text-neutral-400 ml-1.5 hidden md:inline">
                  · {currentLang === 'en' ? 'Live Turnkey Website Ready for Deployment (48h)'  : '48 Saatte Canlıya Alınabilir Bağımsız Web Sitesi'}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1 text-[11px]">
              <Globe className="w-3.5 h-3.5 text-neutral-400 ml-1" />
              {['tr', 'en'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-2 py-0.5 rounded-lg font-bold uppercase transition-colors cursor-pointer ${
                    currentLang === lang
                      ? 'bg-amber-400 text-black shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Edit in Customer Panel */}
            <button
              onClick={() => onOpenCustomerPanel(product.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-bold transition-colors cursor-pointer"
              title={currentLang === 'en' ? 'Open Customer CMS Panel for this site'  : 'Bu sitenin müşteri yönetim panelini aç'}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentLang === 'en' ? 'Customer CMS'  : 'Müşteri Paneli'}
              </span>
            </button>

            {/* Deploy & Export Package */}
            <button
              onClick={() => setIsDeployOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-amber-500/30 text-xs font-bold transition-colors cursor-pointer"
              title={currentLang === 'en' ? 'Deploy website & export HTML bundle'  : 'Siteyi yayına alma ve HTML paketini indirme'}
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {currentLang === 'en' ? 'Deploy & Export'  : 'Yayına Al & Export'}
              </span>
            </button>

            {/* Order / Purchase CTA */}
            <button
              onClick={() => onOpenPaymentModal(product, 'economic')}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-extrabold transition-all shadow-md flex items-center gap-1 cursor-pointer whitespace-nowrap"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>
                {currentLang === 'en' ? 'Order Site'  : 'Siparişi Başlat'}
              </span>
            </button>

            {/* Minimize / Expand Bar toggle */}
            <button
              onClick={() => setIsBarMinimized(!isBarMinimized)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-900 transition-colors"
              title={isBarMinimized ? (currentLang === 'en' ? 'Show Bar' : 'Çubuğu Göster') : (currentLang === 'en' ? 'Hide Bar' : 'Çubuğu Gizle')}
            >
              {isBarMinimized ? <ChevronDown className="w-4 h-4 text-amber-400" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Small Peek Tab if Minimized */}
        {isBarMinimized && (
          <div className="flex justify-center">
            <button
              onClick={() => setIsBarMinimized(false)}
              className="px-4 py-1 bg-amber-400 text-black text-[11px] font-bold rounded-b-xl shadow-lg flex items-center gap-1 cursor-pointer"
            >
              <span>{currentLang === 'en' ? 'Vanguard Bar'  : 'Vanguard Kontrol Barı'}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Main Full-Screen Standalone Website */}
      <div className={`flex-1 flex flex-col ${isBarMinimized ? 'pt-0' : 'pt-14'}`}>
        <TurnkeyLiveSite
          product={product}
          currentLang={currentLang}
          isStandalone={true}
          onOpenCustomerPanel={() => onOpenCustomerPanel(product.id)}
          onOpenOrderModal={() => onOpenContactModal(product, 'economic')}
          onCloseStandalone={onClose}
          onOpenDeployModal={() => setIsDeployOpen(true)}
        />
      </div>

      {/* Deploy & Export Package Modal */}
      <DeployPackageModal
        product={product}
        isOpen={isDeployOpen}
        onClose={() => setIsDeployOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  X,
  Lock,
  LayoutGrid,
  Layers,
  Star,
  Globe,
  Inbox,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Wallet,
  Compass,
  FileText,
  FileEdit,
  Sparkles,
  Briefcase,
  Menu,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Crown,
} from 'lucide-react';
import { ProductsAdmin } from './ProductsAdmin.tsx';
import { ServicesAdmin } from './ServicesAdmin.tsx';
import { ReferencesAdmin } from './ReferencesAdmin.tsx';
import { LanguagesAdmin } from './LanguagesAdmin.tsx';
import { InquiriesAdmin } from './InquiriesAdmin.tsx';
import { SettingsAdmin } from './SettingsAdmin.tsx';
import { NavigationAdmin } from './NavigationAdmin.tsx';
import { PagesAdmin } from './PagesAdmin.tsx';
import { GeoAuditAdmin } from './GeoAuditAdmin.tsx';
import { TextEditorAdmin } from './TextEditorAdmin.tsx';
import { FaqAdmin } from './FaqAdmin.tsx';
import { AdvisoryAdmin } from './AdvisoryAdmin.tsx';

// Dynamic lazy-load FinanceAdmin
const FinanceAdmin = React.lazy(() => import('./FinanceAdmin.tsx').then(m => ({ default: m.FinanceAdmin })));

type AdminTab =
  | 'products' | 'advisory' | 'hero_sections' | 'footer' | 'faqs' | 'text_editor'
  | 'geo_audit' | 'finance' | 'inquiries' | 'navigation' | 'pages' | 'languages'
  | 'services' | 'references' | 'settings';

interface ModalState {
  isOpen: boolean;
  type: 'add' | 'edit' | 'delete' | null;
  data?: any;
}

export const AdminPanel: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    inquiries,
    products,
    openCustomerPanel,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, type: null });

  if (!isAdminOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(pinInput);
    if (!success) {
      setPinError('Hatalı PIN kodu. (Varsayılan PIN: admin123)');
    } else {
      setPinError('');
      setPinInput('');
    }
  };

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length;

  const navTabs: {
    id: AdminTab;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: React.ReactNode;
  }[] = [
    {
      id: 'products',
      label: 'Hazır Siteler',
      description: '10 sektörlük hazır web sitesi ve demo yönetimi',
      icon: <LayoutGrid className="w-4 h-4 shrink-0 text-amber-400" />,
      badge: <span className="text-[10px] font-mono opacity-80">{products.length}/10</span>,
    },
    {
      id: 'advisory',
      label: 'VIP Danışmanlık (Nexus)',
      description: '50.000 TL+ Kurumsal Vanguard Nexus VIP danışmanlık kartı ve içerik yönetimi',
      icon: <Crown className="w-4 h-4 shrink-0 text-amber-400" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
          50K+ VIP
        </span>
      ),
    },
    {
      id: 'hero_sections',
      label: 'Hero & Sayfa Bölümleri',
      description: 'Giriş manşeti, başlık, spot, butonlar ve istatistik kartları',
      icon: <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
          Hero
        </span>
      ),
    },
    {
      id: 'footer',
      label: 'Footer (Alt Bilgi)',
      description: 'Alt bilgi metinleri, slogan, WhatsApp notu ve kolon başlıkları',
      icon: <Layers className="w-4 h-4 shrink-0 text-amber-400" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
          Footer
        </span>
      ),
    },
    {
      id: 'geo_audit',
      label: 'AI & GEO Denetimi',
      description: 'AEO ve Generative Engine Optimization skorları',
      icon: <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
          96/100
        </span>
      ),
    },
    {
      id: 'finance',
      label: 'Mali Sistem & Kasa',
      description: 'Gelir, gider, kâr marjı ve faturalandırma takibi',
      icon: <Wallet className="w-4 h-4 shrink-0 text-amber-400" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Kasa
        </span>
      ),
    },
    {
      id: 'inquiries',
      label: 'Gelen Talepler',
      description: 'Müşteri iletişim ve hazır site sipariş bildirimleri',
      icon: <Inbox className="w-4 h-4 shrink-0 text-sky-400" />,
      badge: newInquiriesCount > 0 ? (
        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
          {newInquiriesCount} Yeni
        </span>
      ) : null,
    },
    {
      id: 'navigation',
      label: 'Menü & Navigasyon',
      description: 'Header ve footer bağlantıları, sıralama',
      icon: <Compass className="w-4 h-4 shrink-0 text-indigo-400" />,
    },
    {
      id: 'pages',
      label: 'Özel Sayfalar & CMS',
      description: 'Hakkımızda, KVKK ve özel sayfaların yönetimi',
      icon: <FileText className="w-4 h-4 shrink-0 text-emerald-400" />,
    },
    {
      id: 'faqs',
      label: 'Sıkça Sorulan Sorular (FAQ)',
      description: 'Dinamik akordeon soru-cevap ve çok dilli SSS yönetimi',
      icon: <HelpCircle className="w-4 h-4 shrink-0 text-amber-400" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
          SSS
        </span>
      ),
    },
    {
      id: 'text_editor',
      label: 'Metin Editörü (Text-Editor)',
      description: 'Zengin biçimlendirme, iki yana yaslama & hazır şablonlar',
      icon: <FileEdit className="w-4 h-4 shrink-0 text-amber-400" />,
      badge: (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          WYSIWYG
        </span>
      ),
    },
    {
      id: 'languages',
      label: 'Diller & Çeviri Motoru',
      description: 'Türkçe, İngilizce ve Rusça çeviri anahtarları',
      icon: <Globe className="w-4 h-4 shrink-0 text-cyan-400" />,
    },
    {
      id: 'services',
      label: 'Hizmetler',
      description: 'Kurumsal hizmet paketleri ve açıklamalar',
      icon: <Layers className="w-4 h-4 shrink-0 text-purple-400" />,
    },
    {
      id: 'references',
      label: 'Referanslar',
      description: 'Müşteri yorumları ve puanlar',
      icon: <Star className="w-4 h-4 shrink-0 text-yellow-400" />,
    },
    {
      id: 'settings',
      label: 'Site & Banka Ayarları',
      description: 'IBAN, iletişim ve genel ayarlar',
      icon: <Settings className="w-4 h-4 shrink-0 text-neutral-400" />,
    },
  ];

  const currentTab = navTabs.find(t => t.id === activeTab) || navTabs[0];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div className="relative w-full max-w-7xl h-full sm:h-[94vh] bg-[#0c0e14] text-neutral-100 rounded-none sm:rounded-2xl border-0 sm:border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        {/* If NOT Authenticated: PIN Login View */}
        {!isAdminAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-full max-w-sm p-8 rounded-2xl bg-neutral-900/90 border border-neutral-800 text-center space-y-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Yönetici Terminali Girişi
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Vanguard Studio yönetim paneline erişmek için PIN kodunuzu girin.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {pinError && (
                  <div className="p-2.5 text-xs text-red-400 bg-red-950/40 border border-red-800/80 rounded-lg">
                    {pinError}
                  </div>
                )}

                <div>
                  <input
                    type="password"
                    autoFocus
                    required
                    value={pinInput}
                    onChange={e => setPinInput(e.target.value)}
                    placeholder="PIN Kodunu Girin (örn: admin123)"
                    className="w-full px-4 py-2.5 text-center text-sm font-mono rounded-xl border border-neutral-700 bg-neutral-950 text-white tracking-widest focus:border-amber-400 focus:outline-none"
                  />
                  <div className="text-[11px] text-neutral-500 mt-2">
                    İpucu: Varsayılan PIN <span className="text-amber-400 font-mono">admin123</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdminOpen(false)}
                    className="flex-1 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 rounded-xl"
                  >
                    Kapat
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl shadow-md cursor-pointer"
                  >
                    Giriş Yap
                  </button>
                </div>
              </form>

              {/* Quick Switch to Customer Panel */}
              <div className="pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdminOpen(false);
                    openCustomerPanel();
                  }}
                  className="w-full py-2 px-3 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/30 hover:bg-emerald-950/50 border border-emerald-800/50 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Müşteri Paneli'ne Geç (PIN Gerekmez)</span>
                </button>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Satın aldığınız hazır sitenin hizmetlerini, fiyatlarını ve telefonunu düzenleyin.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <>
            {/* Top Admin Bar */}
            <div className="h-14 sm:h-16 px-2.5 sm:px-6 bg-[#090b10] border-b border-neutral-800 flex items-center justify-between shrink-0 gap-2">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                {/* Mobile & Tablet Dedicated Menu Button */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                  aria-label="Yönetim Menüsü"
                >
                  <Menu className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Menü</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-white font-display truncate">
                    Vanguard Terminali
                  </span>
                </div>

                <span className="hidden xl:inline text-xs text-neutral-500 shrink-0">
                  | Portföy: {products.length}/10 Hazır Site
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAdminOpen(false);
                    openCustomerPanel();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs text-emerald-300 hover:text-white bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 rounded-xl transition-colors cursor-pointer"
                  title="Müşteri Yönetim Paneline Geç"
                >
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xs:inline">Müşteri Paneli</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsAdminOpen(false);
                  }}
                  className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-800 rounded-xl"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Siteyi Önizle</span>
                </button>

                <button
                  onClick={logoutAdmin}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] sm:text-xs text-red-400 hover:text-red-300 bg-red-950/20 border border-red-900/30 rounded-xl"
                  title="Çıkış Yap"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline">Çıkış</span>
                </button>

                <button
                  onClick={() => setIsAdminOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
                  aria-label="Kapat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile / Tablet Full Navigation Drawer */}
            {mobileMenuOpen && (
              <div
                className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-start animate-fadeIn"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div
                  className="w-full max-w-lg max-h-[85vh] bg-[#0c0e16] border-b sm:border-r border-neutral-800 rounded-b-2xl sm:rounded-none p-4 sm:p-5 overflow-y-auto shadow-2xl flex flex-col space-y-3"
                  onClick={e => e.stopPropagation()}
                >
                  {/* Drawer Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        <Menu className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Yönetim Terminali Menüsü</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
                            10 Modül
                          </span>
                        </h4>
                        <p className="text-[11px] text-neutral-400">
                          Kontrol etmek istediğiniz modülü seçin
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                      aria-label="Menüyü Kapat"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Modules List Grid / Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {navTabs.map(tab => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all cursor-pointer ${
                            isActive
                              ? 'bg-amber-400 text-black font-bold shadow-lg ring-2 ring-amber-300'
                              : 'bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 border border-neutral-800/80 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`p-2 rounded-lg shrink-0 ${
                                isActive ? 'bg-black/15 text-black' : 'bg-neutral-800 text-neutral-300'
                              }`}
                            >
                              {tab.icon}
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold truncate">{tab.label}</div>
                              <div
                                className={`text-[10px] truncate ${
                                  isActive ? 'text-black/80 font-medium' : 'text-neutral-400'
                                }`}
                              >
                                {tab.description}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            {tab.badge}
                            <ChevronRight
                              className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-neutral-500'}`}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Drawer Footer Actions */}
                  <div className="pt-3 border-t border-neutral-800 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsAdminOpen(false);
                        openCustomerPanel();
                      }}
                      className="py-2.5 px-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Müşteri Paneli</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setIsAdminOpen(false);
                      }}
                      className="py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Siteyi Önizle</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile/Tablet Horizontal Tabs Bar (Direct quick-switch tabs) */}
            <div className="lg:hidden flex items-center overflow-x-auto bg-[#090b10] border-b border-neutral-800 px-3 py-2 gap-1.5 shrink-0 no-scrollbar">
              {navTabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-black font-bold shadow-md'
                        : 'bg-neutral-900/80 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800/80'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge}
                  </button>
                );
              })}
            </div>

            {/* Main Admin Workspace (Desktop Sidebar Tabs + View) */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
              {/* Desktop Sidebar Navigation Tabs (hidden on mobile/tablet, visible on lg+) */}
              <div className="hidden lg:flex w-60 bg-[#090b10]/60 border-r border-neutral-800/80 p-4 space-y-1 shrink-0 overflow-y-auto flex-col justify-between">
                <div className="space-y-1">
                  {navTabs.slice(0, -1).map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-black font-bold shadow-md'
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {tab.icon}
                          <span className="truncate">{tab.label}</span>
                        </div>
                        {tab.badge}
                      </button>
                    );
                  })}
                </div>

                {/* Settings Tab pinned at bottom */}
                <div className="pt-4 border-t border-neutral-800/80 mt-4">
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeTab === 'settings'
                        ? 'bg-white text-black font-bold shadow-md'
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                    }`}
                  >
                    <Settings className="w-4 h-4 shrink-0" />
                    <span>Site & Banka Ayarları</span>
                  </button>
                </div>
              </div>

              {/* Viewport Content Panel */}
              <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto bg-[#0a0c10] min-w-0">
                {activeTab === 'products' && <ProductsAdmin />}
                {activeTab === 'advisory' && <AdvisoryAdmin />}
                {activeTab === 'hero_sections' && <SettingsAdmin initialSubTab="sections" />}
                {activeTab === 'footer' && <SettingsAdmin initialSubTab="footer" />}
                {activeTab === 'geo_audit' && <GeoAuditAdmin />}
                {activeTab === 'finance' && (
                  <React.Suspense fallback={<div className="p-8 text-center text-sm text-neutral-400">Finans Modülü Yükleniyor...</div>}>
                    <FinanceAdmin />
                  </React.Suspense>
                )}
                {activeTab === 'inquiries' && <InquiriesAdmin />}
                {activeTab === 'navigation' && <NavigationAdmin />}
                {activeTab === 'pages' && <PagesAdmin />}
                {activeTab === 'faqs' && <FaqAdmin />}
                {activeTab === 'text_editor' && <TextEditorAdmin />}
                {activeTab === 'languages' && <LanguagesAdmin />}
                {activeTab === 'services' && <ServicesAdmin />}
                {activeTab === 'references' && <ReferencesAdmin />}
                {activeTab === 'settings' && <SettingsAdmin />}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modular Modal - completely unmounts when modalState.isOpen is false */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4" onClick={() => setModalState({ isOpen: false, type: null })}>
          <div className="bg-neutral-900 p-6 rounded-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <h2 className="text-white font-bold mb-4">{modalState.type === 'add' ? 'Yeni Kayıt Ekle' : 'Kayıt Düzenle'}</h2>
            {/* Modal Content implementation would go here, based on modalState.type */}
            <button 
              onClick={() => setModalState({ isOpen: false, type: null })}
              className="mt-4 px-4 py-2 bg-neutral-800 text-white rounded-lg"
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

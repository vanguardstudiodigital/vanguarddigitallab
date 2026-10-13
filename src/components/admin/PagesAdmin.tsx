import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { CustomPage, PageLocation } from '../../types/index.ts';
import {
  FileText,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Save,
  X,
  Shield,
  Info,
  RotateCcw,
  CheckSquare,
  Square,
  Layers,
  MapPin,
  ChevronDown,
  Filter,
  Check,
  Tag,
  Wifi,
  WifiOff,
  CloudCheck,
  Clock,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { DEFAULT_PAGES } from '../../data/defaultData.ts';
import { RichTextEditor } from '../common/RichTextEditor.tsx';
import { stripHtml } from '../../utils/richTextRenderer.ts';
import { useCmsDraftManager } from '../../utils/cmsAutosave.ts';

const PREDEFINED_LOCATIONS: { id: string; label: string; icon: string }[] = [
  { id: 'corporate', label: '🏢 Kurumsal (Hakkımızda / Vizyon / Misyon)', icon: '🏢' },
  { id: 'legal', label: '🛡️ Yasal Bildirimler (KVKK / Gizlilik / Şartlar)', icon: '🛡️' },
  { id: 'info', label: 'ℹ️ Bilgi & Rehber', icon: 'ℹ️' },
  { id: 'support', label: '💬 Destek & Yardım', icon: '💬' },
  { id: 'header', label: '🔝 Header (Üst Menü Barı)', icon: '🔝' },
  { id: 'sidebar', label: '📌 Dikey Sabit Sol Sidebar', icon: '📌' },
  { id: 'footer_corporate', label: '🦶 Footer - Kurumsal Kolonu', icon: '🦶' },
  { id: 'footer_legal', label: '🦶 Footer - Yasal Kolonu', icon: '🦶' },
  { id: 'footer_products', label: '📦 Footer - Ürünler Kolonu', icon: '📦' },
  { id: 'mega_corporate', label: '🏬 Mega Menü - Kurumsal Vitrin', icon: '🏬' },
  { id: 'mega_support', label: '💬 Mega Menü - Destek Vitrin', icon: '💬' },
];

const LOCATION_LABEL_MAP: Record<string, { label: string; icon: string }> = {
  all: { label: 'Tüm Sayfalar', icon: '📑' },
  corporate: { label: 'Kurumsal', icon: '🏢' },
  legal: { label: 'Yasal KVKK', icon: '🛡️' },
  info: { label: 'Bilgi & SSS', icon: 'ℹ️' },
  support: { label: 'Destek', icon: '💬' },
  sidebar: { label: 'Dikey Sidebar', icon: '📌' },
  header: { label: 'Header Bar', icon: '🔝' },
  footer_corporate: { label: 'Footer Kurumsal', icon: '🦶' },
  footer_legal: { label: 'Footer Yasal', icon: '🦶' },
  footer_products: { label: 'Footer Ürünler', icon: '📦' },
  mega_corporate: { label: 'Mega Kurumsal', icon: '🏬' },
  mega_support: { label: 'Mega Destek', icon: '💬' },
};

export const PagesAdmin: React.FC = () => {
  const { customPages, saveCustomPage, deleteCustomPage, openPageModal } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en'>('tr');
  const [customLocationInput, setCustomLocationInput] = useState('');
  const [saveStatusMessage, setSaveStatusMessage] = useState<string | null>(null);

  // Fault-Tolerant Draft Manager Hook
  const {
    isOnline,
    lastAutosavedAt,
    hasUnsavedChanges,
    slug,
    setSlug,
    titleTR,
    setTitleTR,
    summaryTR,
    setSummaryTR,
    contentTR,
    setContentTR,
    titleEN,
    setTitleEN,
    summaryEN,
    setSummaryEN,
    contentEN,
    setContentEN,
    selectedLocations,
    setSelectedLocations,
    isPublished,
    setIsPublished,
    executeSaveWithHandshake,
    clearLocalDraft,
  } = useCmsDraftManager();

  const startCreate = () => {
    setEditingPage(null);
    setSlug('');
    setTitleTR('');
    setSummaryTR('');
    setContentTR('');
    setTitleEN('');
    setSummaryEN('');
    setContentEN('');

    const defaultLoc = activeFilter !== 'all' ? activeFilter : 'legal';
    setSelectedLocations([defaultLoc]);
    setCustomLocationInput('');
    setIsPublished(true);
    setIsCreating(true);
  };

  const startEdit = (page: CustomPage) => {
    setEditingPage(page);
    setSlug(page.slug);
    setTitleTR(page.title);
    setSummaryTR(page.summary || '');
    setContentTR(page.content);

    const en = page.translations?.['en'];
    setTitleEN(en?.title || '');
    setSummaryEN(en?.summary || '');
    setContentEN(en?.content || '');

    let locs: string[] = [];
    if (page.locations && page.locations.length > 0) {
      locs = [...page.locations];
    } else if (page.menuLocation) {
      locs = [page.menuLocation];
    } else {
      locs = [page.category];
    }
    setSelectedLocations(locs);
    setCustomLocationInput('');
    setIsPublished(page.isPublished !== false);
    setIsCreating(true);
  };

  const handleSaveWithHandshake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug.trim() || !titleTR.trim() || !contentTR.trim() || selectedLocations.length === 0) {
      alert('Lütfen Türkçe Sayfa Başlığı, URL Kodu ve İçeriğini doldurun.');
      return;
    }

    if (!isOnline) {
      setSaveStatusMessage('⚠️ İnternet bağlantınız koptu. Verileriniz yerel hafızaya güvenle kilitlendi.');
      return;
    }

    const primaryCategory =
      selectedLocations.find(l => ['legal', 'corporate', 'info', 'support'].includes(l)) ||
      selectedLocations[0] ||
      'corporate';
    const primaryMenuLocation = selectedLocations[0] || primaryCategory;

    const result = await executeSaveWithHandshake(async (draftData) => {
      const pageToSave: CustomPage = {
        id: editingPage ? editingPage.id : `page-${Date.now()}`,
        slug: (draftData.slug || slug).trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
        title: draftData.titleTR.trim(),
        summary: draftData.summaryTR.trim() || undefined,
        content: draftData.contentTR.trim(),
        category: primaryCategory,
        locations: selectedLocations as PageLocation[],
        menuLocation: primaryMenuLocation,
        isPublished: draftData.isPublished ?? true,
        updatedAt: new Date().toISOString().split('T')[0],
        translations: {
          en: {
            title: draftData.titleEN.trim() || undefined,
            summary: draftData.summaryEN.trim() || undefined,
            content: draftData.contentEN.trim() || undefined,
          },
        },
      };

      saveCustomPage(pageToSave);
    });

    if (result.success) {
      setSaveStatusMessage('✅ HTTP 200 OK: Sayfa başarıyla sunucuya ve yerel veritabanına kaydedildi!');
      setTimeout(() => setSaveStatusMessage(null), 4000);
      setIsCreating(false);
      setEditingPage(null);
    } else {
      setSaveStatusMessage(`⚠️ ${result.error}`);
    }
  };

  // Extract dynamic categories & location options from customPages
  const dynamicFilterOptions = useMemo(() => {
    const filterSet = new Set<string>();
    filterSet.add('all');

    // Add base options
    PREDEFINED_LOCATIONS.forEach(loc => filterSet.add(loc.id));

    // Add any unique values present in customPages
    customPages.forEach(p => {
      if (p.category) filterSet.add(p.category);
      if (p.menuLocation) filterSet.add(p.menuLocation);
      if (Array.isArray(p.locations)) {
        p.locations.forEach(loc => {
          if (loc) filterSet.add(loc);
        });
      }
    });

    const filterList = Array.from(filterSet);

    return filterList.map(key => {
      let label = key;
      let icon = '📍';

      if (LOCATION_LABEL_MAP[key]) {
        label = LOCATION_LABEL_MAP[key].label;
        icon = LOCATION_LABEL_MAP[key].icon;
      } else {
        // Format custom location key nicely (e.g. "dikey-sidebar" -> "Dikey Sidebar")
        label = key
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
      }

      const count = customPages.filter(p => {
        if (key === 'all') return true;
        if (p.category === key) return true;
        if (p.menuLocation === key) return true;
        if (Array.isArray(p.locations) && p.locations.some(l => l === key || l.toLowerCase() === key.toLowerCase())) return true;
        return false;
      }).length;

      return { key, label, icon, count };
    });
  }, [customPages]);

  const activeOptionObj = useMemo(() => {
    return dynamicFilterOptions.find(o => o.key === activeFilter) || dynamicFilterOptions[0];
  }, [dynamicFilterOptions, activeFilter]);

  const toggleLocation = (loc: string) => {
    setSelectedLocations(prev => {
      if (prev.includes(loc)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(l => l !== loc);
      } else {
        return [...prev, loc];
      }
    });
  };

  const handleAddCustomLocation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = customLocationInput.trim();
    if (!trimmed) return;
    if (!selectedLocations.includes(trimmed)) {
      setSelectedLocations(prev => [...prev, trimmed]);
    }
    setCustomLocationInput('');
  };

  const handleResetDefaults = () => {
    if (window.confirm('Tüm özel sayfaları ve yasal metinleri varsayılan fabrika ayarlarına sıfırlamak istiyor musunuz?')) {
      DEFAULT_PAGES.forEach(dp => saveCustomPage(dp));
    }
  };

  const filteredPages = customPages.filter(p => {
    if (activeFilter === 'all') return true;
    if (p.category === activeFilter) return true;
    if (p.menuLocation === activeFilter) return true;
    if (Array.isArray(p.locations) && p.locations.some(l => l === activeFilter || l.toLowerCase() === activeFilter.toLowerCase())) return true;
    return false;
  });

  const getLocationBadgeLabel = (loc: string) => {
    const found = PREDEFINED_LOCATIONS.find(o => o.id === loc);
    if (found) return found.label;
    if (LOCATION_LABEL_MAP[loc]) return `${LOCATION_LABEL_MAP[loc].icon} ${LOCATION_LABEL_MAP[loc].label}`;
    return `📍 ${loc}`;
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white font-display">
              Özel Sayfalar & Yasal Bildirimler CMS (Dinamik Çoklu Konum)
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Sayfaları istediğiniz kadar farklı kategoriye ve menü alanına (Sidebar, Header, Footer, Mega Menü, Özel Kolonlar) atayın.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Varsayılanları Sıfırla</span>
          </button>

          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Sayfa Oluştur</span>
          </button>
        </div>
      </div>

      {/* Dynamic Responsive Filter Area */}
      <div className="relative">
        {/* Mobile View: Custom Dropdown / Hamburger Style Selector */}
        <div className="block md:hidden">
          <button
            type="button"
            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white font-medium text-xs hover:border-neutral-700 transition-all cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-2.5 truncate">
              <Filter className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-neutral-400 font-semibold">Kategori:</span>
              <span className="font-bold flex items-center gap-1.5 truncate">
                <span>{activeOptionObj.icon}</span>
                <span>{activeOptionObj.label}</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-400/20 text-amber-400 font-bold shrink-0">
                {activeOptionObj.count}
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isFilterDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-30 p-2 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl max-h-80 overflow-y-auto space-y-1 animate-fade-in">
              {dynamicFilterOptions.map(opt => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setActiveFilter(opt.key);
                    setIsFilterDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                    activeFilter === opt.key
                      ? 'bg-amber-400/20 text-amber-400 font-bold border border-amber-500/30'
                      : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span>{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 text-[10px] rounded-md bg-neutral-800 text-neutral-400 font-semibold">
                      {opt.count}
                    </span>
                    {activeFilter === opt.key && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop View: Horizontal Tab Buttons with Count Badges */}
        <div className="hidden md:flex items-center gap-2 overflow-x-auto scrollbar-none pb-2 pt-1">
          {dynamicFilterOptions.map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                activeFilter === tab.key
                  ? 'bg-amber-400 border-amber-400 text-black font-bold shadow-sm'
                  : 'bg-neutral-900 border-neutral-800/80 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeFilter === tab.key ? 'bg-black/20 text-black' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Editor Modal with Fault-Tolerant CMS Engine */}
      {isCreating && (
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl space-y-5 animate-fade-in">
          {/* Offline Matrix & Autosave Notification Bar */}
          {!isOnline && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-bold flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-red-400 shrink-0" />
                <span>⚠️ İNTERNET BAĞLANTISI KOPTU (OFFLINE) - Verileriniz Yerel Hafızaya Güvenle Kilitlendi</span>
              </div>
              <span className="text-[10px] bg-red-950 px-2 py-0.5 rounded border border-red-800">
                Yerel Taslak Modu
              </span>
            </div>
          )}

          {isOnline && (
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-400 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Çevrimiçi (Online)</span>
                <span className="text-neutral-600">•</span>
                <span className="text-[11px]">Gerçek Zamanlı Yerel Aynalama (Real-time Mirroring) Aktif</span>
              </div>

              {lastAutosavedAt && (
                <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-mono">
                  <Clock className="w-3 h-3 text-amber-400" />
                  <span>Son Taslak Kaydı: {lastAutosavedAt}</span>
                </div>
              )}
            </div>
          )}

          {saveStatusMessage && (
            <div className={`p-3 rounded-xl text-xs font-bold border flex items-center gap-2 ${
              saveStatusMessage.includes('HTTP 200')
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}>
              <CloudCheck className="w-4 h-4 shrink-0" />
              <span>{saveStatusMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{editingPage ? `Sayfayı Düzenle: ${editingPage.title}` : 'Yeni Sayfa Oluştur'}</span>
            </h4>
            <button
              onClick={() => setIsCreating(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSaveWithHandshake} className="space-y-4 text-xs">
            {/* Multi-Location Selection Area */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
              <label className="block text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                <Layers className="w-4 h-4" />
                <span>Sayfanın Gösterileceği Alanlar & Kategori Atamaları (Çoklu Seçim) *</span>
              </label>
              <p className="text-[11px] text-neutral-400">
                Bu sayfayı aynı anda birden fazla menüde, dikey sidebar'da, footerdaki kolonlarda veya özel menü konumlarında gösterebilirsiniz:
              </p>

              {/* Predefined Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                {PREDEFINED_LOCATIONS.map(opt => {
                  const isChecked = selectedLocations.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleLocation(opt.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isChecked
                          ? 'bg-amber-500/15 border-amber-500/50 text-white font-semibold'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                      }`}
                    >
                      <span className="text-xs truncate">{opt.label}</span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-neutral-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Location / Column Input */}
              <div className="pt-2 border-t border-neutral-800/80 space-y-2">
                <label className="block text-neutral-300 font-semibold text-[11px] flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Yeni Özel Menü Konumu / Kolonu Ekle (Sisteme Anında Tanımlanır)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customLocationInput}
                    onChange={e => setCustomLocationInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomLocation();
                      }
                    }}
                    placeholder="Örn: Özel Kampanya Barı, Footer Sağ Kolon..."
                    className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomLocation()}
                    className="px-3 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shrink-0"
                  >
                    Konum Ekle
                  </button>
                </div>

                {/* Display Custom Locations Badges */}
                {selectedLocations.filter(loc => !PREDEFINED_LOCATIONS.some(p => p.id === loc)).length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-neutral-400 font-semibold">Eklenen Özel Konumlar:</span>
                    {selectedLocations
                      .filter(loc => !PREDEFINED_LOCATIONS.some(p => p.id === loc))
                      .map(customLoc => (
                        <span
                          key={customLoc}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5"
                        >
                          <span>📍 {customLoc}</span>
                          <button
                            type="button"
                            onClick={() => toggleLocation(customLoc)}
                            className="hover:text-white p-0.5 rounded cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Meta Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Sayfa URL Kodu (Slug) *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="örn: hakkimizda, sss, iade-kosullari"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={e => setIsPublished(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-neutral-950 border-neutral-800 cursor-pointer"
                  />
                  <span className="font-semibold text-white">Yayında (Sitede Aktif Göster)</span>
                </label>
              </div>
            </div>

            {/* Dual Language Tabs (TR & EN) */}
            <div className="border-t border-neutral-800 pt-3 space-y-3">
              <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 font-bold mr-1">Dil Düzenleme:</span>
                  <button
                    type="button"
                    onClick={() => setActiveLangTab('tr')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      activeLangTab === 'tr'
                        ? 'bg-amber-400 border-amber-400 text-black shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>🇹🇷 Türkçe İçerik (TR)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveLangTab('en')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      activeLangTab === 'en'
                        ? 'bg-amber-400 border-amber-400 text-black shadow-sm'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span>🇬🇧 İngilizce İçerik (EN)</span>
                  </button>
                </div>

                <div className="text-[11px] text-neutral-500 hidden sm:block font-mono">
                  Manuel Çift Dil Giriş Modu
                </div>
              </div>

              {/* TR Tab */}
              {activeLangTab === 'tr' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-semibold">Sayfa Başlığı (TR) *</label>
                    <input
                      type="text"
                      required
                      value={titleTR}
                      onChange={e => setTitleTR(e.target.value)}
                      placeholder="Örn: Hakkımızda & Kurumsal Vizyonumuz"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Kısa Özet (TR)</label>
                    <input
                      type="text"
                      value={summaryTR}
                      onChange={e => setSummaryTR(e.target.value)}
                      placeholder="Sayfa üstünde görünecek açıklama metni..."
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">İçerik Metni (TR) * (Zengin Metin Editörü & Manuel Giriş)</label>
                    <RichTextEditor
                      value={contentTR}
                      onChange={setContentTR}
                      language="tr"
                      placeholder="Sayfa içeriğini buraya yazın..."
                      minHeight="min-h-[220px]"
                    />
                  </div>
                </div>
              )}

              {/* EN Tab */}
              {activeLangTab === 'en' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-semibold">Page Title (EN)</label>
                    <input
                      type="text"
                      value={titleEN}
                      onChange={e => setTitleEN(e.target.value)}
                      placeholder="e.g. About Vanguard Studio & Corporate Vision"
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Summary (EN)</label>
                    <input
                      type="text"
                      value={summaryEN}
                      onChange={e => setSummaryEN(e.target.value)}
                      placeholder="Brief page summary in English..."
                      className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-amber-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1 font-semibold">Content (EN) (Rich Text Editor & Manual English Input)</label>
                    <RichTextEditor
                      value={contentEN}
                      onChange={setContentEN}
                      language="en"
                      placeholder="Enter page content in English..."
                      minHeight="min-h-[200px]"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-neutral-800">
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Handshake Doğrulama Sistemi Etkin</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 rounded-xl cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={!isOnline}
                  className="px-5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingPage ? 'Değişiklikleri Kaydet' : 'Sayfayı Yayınla'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Pages Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPages.map((page, idx) => {
          let locs: string[] = [];
          if (page.locations && page.locations.length > 0) {
            locs = page.locations;
          } else if (page.menuLocation) {
            locs = [page.menuLocation];
          } else {
            locs = [page.category];
          }

          return (
            <div
              key={`${page.id}-${idx}`}
              className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300 flex items-center gap-1">
                    {page.category === 'legal' ? <Shield className="w-3 h-3 text-emerald-400" /> : <Info className="w-3 h-3 text-amber-400" />}
                    <span>{page.category === 'legal' ? 'Yasal' : page.category === 'corporate' ? 'Kurumsal' : page.category}</span>
                  </span>
                  <span className="text-[10px] font-mono text-neutral-500">
                    /{page.slug}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-display line-clamp-1">
                  {page.title}
                </h4>

                <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                  {page.summary || stripHtml(page.content).slice(0, 100)}...
                </p>

                {/* Multiple Assigned Locations Badges */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-neutral-900">
                  <span className="text-[10px] text-neutral-500 font-semibold flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-amber-400" />
                    Konumlar ({locs.length}):
                  </span>
                  {locs.map(loc => (
                    <span
                      key={loc}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-900 border border-neutral-800 text-neutral-300"
                    >
                      {getLocationBadgeLabel(loc)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500">
                  Güncelleme: {page.updatedAt || '2026-10'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openPageModal(page.slug)}
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Önizle"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(page)}
                    className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`"${page.title}" sayfasını silmek istediğinize emin misiniz?`)) {
                        deleteCustomPage(page.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

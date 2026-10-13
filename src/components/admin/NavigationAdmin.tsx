import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { NavigationItem, NavigationLocation } from '../../types/index.ts';
import {
  Menu,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  RotateCcw,
  Save,
  X,
  Compass,
  Globe,
  CheckSquare,
  Square,
  Layers,
  MapPin,
} from 'lucide-react';
import { DEFAULT_NAVIGATION } from '../../data/defaultData.ts';

const LOCATION_OPTIONS: { id: NavigationLocation; label: string }[] = [
  { id: 'header', label: '🔝 Header (Üst Menü Barı)' },
  { id: 'footer_corporate', label: '🏢 Footer - Kurumsal Kolonu' },
  { id: 'footer_products', label: '🚀 Footer - Hazır Siteler Kolonu' },
  { id: 'footer_legal', label: '🛡️ Footer - Yasal Bildirimler Kolonu' },
  { id: 'mega_corporate', label: '🏬 Mega Menü - Kurumsal Vitrin' },
  { id: 'mega_support', label: '💬 Mega Menü - Destek Vitrin' },
  { id: 'sidebar', label: '📌 Dikey Sabit Sol Sidebar' },
];

export const NavigationAdmin: React.FC = () => {
  const {
    navigationItems,
    saveNavigationItem,
    deleteNavigationItem,
    reorderNavigationItems,
    customPages,
    languages,
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [activeLangTab, setActiveLangTab] = useState<string>('tr');

  // Form State
  const [title, setTitle] = useState('');
  const [itemTranslations, setItemTranslations] = useState<Record<string, { title?: string }>>({});
  const [url, setUrl] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<NavigationLocation[]>(['header']);
  const [order, setOrder] = useState(1);
  const [pageSlug, setPageSlug] = useState('');
  const [isOpenNewTab, setIsOpenNewTab] = useState(false);

  const toggleLocation = (loc: NavigationLocation) => {
    setSelectedLocations(prev => {
      if (prev.includes(loc)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(l => l !== loc);
      } else {
        return [...prev, loc];
      }
    });
  };

  const startCreate = () => {
    setEditingItem(null);
    setTitle('');
    setItemTranslations({});
    setUrl('');
    const defaultLoc: NavigationLocation = activeFilter !== 'all' ? (activeFilter as NavigationLocation) : 'header';
    setSelectedLocations([defaultLoc]);
    setOrder(navigationItems.length + 1);
    setPageSlug('');
    setIsOpenNewTab(false);
    setActiveLangTab(languages[0]?.code || 'tr');
    setIsCreating(true);
  };

  const startEdit = (item: NavigationItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setItemTranslations(item.translations || {});
    setUrl(item.url);
    const locs: NavigationLocation[] = item.locations && item.locations.length > 0 ? item.locations : [item.location];
    setSelectedLocations(locs);
    setOrder(item.order);
    setPageSlug(item.pageSlug || '');
    setIsOpenNewTab(item.isOpenNewTab || false);
    setActiveLangTab(languages[0]?.code || 'tr');
    setIsCreating(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || selectedLocations.length === 0) return;

    const itemToSave: NavigationItem = {
      id: editingItem ? editingItem.id : `nav-${Date.now()}`,
      title: title.trim(),
      url: url.trim(),
      location: selectedLocations[0] || 'header',
      locations: selectedLocations,
      order: Number(order) || 1,
      pageSlug: pageSlug || undefined,
      isOpenNewTab,
      translations: itemTranslations,
    };

    saveNavigationItem(itemToSave);
    setIsCreating(false);
    setEditingItem(null);
  };

  const handleReset = () => {
    if (window.confirm('Tüm menü ve navigasyon bağlantılarını varsayılan ayarlara sıfırlamak istediğinize emin misiniz?')) {
      reorderNavigationItems(DEFAULT_NAVIGATION);
    }
  };

  const filteredItems = navigationItems
    .filter(item => {
      if (activeFilter === 'all') return true;
      if (item.location === activeFilter) return true;
      if (item.locations && item.locations.includes(activeFilter as any)) return true;
      return false;
    })
    .sort((a, b) => a.order - b.order);

  const getLocationBadgeLabel = (loc: NavigationLocation) => {
    const found = LOCATION_OPTIONS.find(o => o.id === loc);
    return found ? found.label : loc;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white font-display">
              Menü & Navigasyon Yönetimi (Çoklu Konum Destekli)
            </h3>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Menü bağlantılarını tek tıkla birden fazla yere (Header, Footer, Mega Menü, Sidebar) atayabilir ve yönetebilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Varsayılan menüyü geri yükle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Varsayılana Sıfırla</span>
          </button>

          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Menü Linki Ekle</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
        {[
          { key: 'all', label: 'Tüm Menüler' },
          { key: 'header', label: '🔝 Header' },
          { key: 'footer_corporate', label: '🏢 Footer Kurumsal' },
          { key: 'footer_products', label: '🚀 Footer Hazır Siteler' },
          { key: 'footer_legal', label: '🛡️ Footer Yasal' },
          { key: 'mega_corporate', label: '🏬 Mega Menü Kurumsal' },
          { key: 'mega_support', label: '💬 Mega Menü Destek' },
          { key: 'sidebar', label: '📌 Dikey Sidebar' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors shrink-0 cursor-pointer ${
              activeFilter === tab.key
                ? 'bg-amber-400 text-black font-bold shadow-xs'
                : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Create / Edit Modal Form */}
      {isCreating && (
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Menu className="w-4 h-4 text-amber-400" />
              <span>{editingItem ? 'Menü Bağlantısını Düzenle' : 'Yeni Menü Bağlantısı Ekle'}</span>
            </h4>
            <button
              onClick={() => setIsCreating(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            {/* Multi-Location Selection Area */}
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-2">
              <label className="block text-amber-400 font-bold flex items-center gap-1.5 text-xs">
                <Layers className="w-4 h-4" />
                <span>Atama Konumları (Birden Fazla Yere Atayabilirsiniz) *</span>
              </label>
              <p className="text-[11px] text-neutral-400">
                Seçtiğiniz bu menü elemanı, işaretlediğiniz tüm alanlarda otomatik olarak görüntülenecektir:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                {LOCATION_OPTIONS.map(opt => {
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
            </div>

            {/* Language Selection Tabs */}
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] text-neutral-400 font-semibold mr-1">Menü Başlığı Çevirileri:</span>
                {languages.filter(l => l.active).map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setActiveLangTab(lang.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                      activeLangTab === lang.code
                        ? 'bg-amber-400 text-black border-amber-400 shadow-xs'
                        : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                    <span className="text-[10px] uppercase font-mono opacity-80">({lang.code})</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold flex items-center gap-1.5">
                  <span>
                    Bağlantı Başlığı ({languages.find(l => l.code === activeLangTab)?.name || activeLangTab.toUpperCase()})
                    {activeLangTab === 'tr' ? ' - Ana Başlık *' : ''}
                  </span>
                  {activeLangTab !== 'tr' && (
                    <span className="text-[10px] text-neutral-500 font-normal">
                      (Boş bırakılırsa varsayılan Türkçe başlık kullanılır)
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  required={activeLangTab === 'tr'}
                  value={activeLangTab === 'tr' ? title : (itemTranslations[activeLangTab]?.title || '')}
                  onChange={e => {
                    const val = e.target.value;
                    if (activeLangTab === 'tr') {
                      setTitle(val);
                    }
                    setItemTranslations(prev => ({
                      ...prev,
                      [activeLangTab]: { ...(prev[activeLangTab] || {}), title: val },
                    }));
                  }}
                  placeholder={
                    activeLangTab === 'tr'
                      ? 'Örn: Hakkımızda, Hizmetlerimiz, Ödeme & IBAN'
                      : `Örn: ${activeLangTab.toUpperCase()} dilinde menü bağlantı başlığı`
                  }
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">
                  Hedef URL veya Çapa (#) *
                </label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="#portfolio-section, #pricing-models veya https://..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white font-mono focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">
                  Özel Sayfaya Bağla (İsteğe Bağlı)
                </label>
                <select
                  value={pageSlug}
                  onChange={e => {
                    const slugVal = e.target.value;
                    setPageSlug(slugVal);
                    if (slugVal && !url) {
                      setUrl(`#page-${slugVal}`);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="">-- Sayfa Seçilmedi --</option>
                  {customPages.map(p => (
                    <option key={p.id} value={p.slug}>
                      {p.title} ({p.slug})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Sıralama (Order)</label>
                <input
                  type="number"
                  min={1}
                  value={order}
                  onChange={e => setOrder(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-5">
                <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                  <input
                    type="checkbox"
                    checked={isOpenNewTab}
                    onChange={e => setIsOpenNewTab(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-neutral-950 border-neutral-800 focus:ring-amber-400"
                  />
                  <span>Yeni Sekmede Aç (`target="_blank"`)</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 rounded-xl cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{editingItem ? 'Kaydet & Güncelle' : 'Ekle & Kaydet'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Navigation Items List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-2xl text-neutral-400 text-xs">
            Bu filtreded herhangi bir menü bağlantısı bulunamadı.
          </div>
        ) : (
          filteredItems.map((item, idx) => {
            const locs: NavigationLocation[] = item.locations && item.locations.length > 0 ? item.locations : [item.location];

            return (
              <div
                key={`${item.id}-${idx}`}
                className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    {item.pageSlug && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                        Sayfa: {item.pageSlug}
                      </span>
                    )}
                    {item.isOpenNewTab && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] bg-neutral-800 text-neutral-400 flex items-center gap-1">
                        <ExternalLink className="w-2.5 h-2.5" /> Yeni Sekme
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <span className="font-mono text-neutral-500">{item.url}</span>
                  </div>

                  {/* Multiple Assigned Locations Badges */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
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

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <span className="text-xs text-neutral-500 font-mono px-2 py-1 bg-neutral-900 rounded-lg">
                    #{item.order}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`"${item.title}" bağlantısını silmek istediğinize emin misiniz?`)) {
                        deleteNavigationItem(item.id);
                      }
                    }}
                    className="p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 rounded-lg transition-colors cursor-pointer"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

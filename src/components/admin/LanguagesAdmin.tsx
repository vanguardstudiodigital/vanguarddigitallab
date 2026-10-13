import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Globe,
  Plus,
  Trash2,
  Search,
  Check,
  Power,
  ToggleLeft,
  ToggleRight,
  Copy,
  Download,
  Upload,
  Save,
  X,
  FileText,
  AlertTriangle,
  RefreshCw,
  Code,
  CheckCircle2,
} from 'lucide-react';
import { LanguageDef } from '../../types/index.ts';

type CategoryFilter =
  | 'all'
  | 'nav'
  | 'customer'
  | 'products'
  | 'models'
  | 'services'
  | 'hero'
  | 'megamenu'
  | 'footer'
  | 'other';

type StatusFilter = 'all' | 'missing' | 'completed';

export const LanguagesAdmin: React.FC = () => {
  const {
    languages,
    addLanguage,
    deleteLanguage,
    toggleLanguageActive,
    translations,
    updateTranslationKey,
    deleteTranslationKey,
    importLanguageTranslations,
  } = useApp();

  const [selectedLangForEdit, setSelectedLangForEdit] = useState<string>('en');
  const [searchKey, setSearchKey] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // Add Language Form state
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newFlag, setNewFlag] = useState('');

  // Add Custom Translation Key Modal state
  const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyTR, setNewKeyTR] = useState('');
  const [newKeyTarget, setNewKeyTarget] = useState('');

  // JSON Import/Export Modal state
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonCopySuccess, setJsonCopySuccess] = useState(false);
  const [jsonImportError, setJsonImportError] = useState<string | null>(null);

  // Toast / notification feedback
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const currentDict = useMemo(() => {
    return translations[selectedLangForEdit] || {};
  }, [translations, selectedLangForEdit]);

  const baseDict = useMemo(() => {
    return translations['tr'] || {};
  }, [translations]);

  // All unique keys combined from TR, selected language, and EN
  const allKeys = useMemo(() => {
    const keySet = new Set<string>([
      ...Object.keys(baseDict),
      ...Object.keys(currentDict),
      ...Object.keys(translations['en'] || {}),
    ]);
    return Array.from(keySet).sort();
  }, [baseDict, currentDict, translations]);

  // Helper to categorize key
  const getKeyCategory = (key: string): CategoryFilter => {
    if (key.startsWith('nav.') || key.startsWith('header.')) return 'nav';
    if (key.startsWith('customer.')) return 'customer';
    if (key.startsWith('products.')) return 'products';
    if (key.startsWith('models.') || key.startsWith('pricing.')) return 'models';
    if (key.startsWith('services.') || key.startsWith('references.')) return 'services';
    if (key.startsWith('hero.')) return 'hero';
    if (key.startsWith('megaMenu.')) return 'megamenu';
    if (key.startsWith('footer.')) return 'footer';
    return 'other';
  };

  // Helper to check if key is translated
  const isKeyTranslated = (key: string): boolean => {
    const val = currentDict[key];
    if (selectedLangForEdit === 'tr') {
      return !!val && val.trim() !== '';
    }
    // In non-TR language, if empty or exact copy of TR, consider untranslated/missing
    if (!val || val.trim() === '') return false;
    return true;
  };

  // Filtered keys
  const filteredKeys = useMemo(() => {
    return allKeys.filter(key => {
      // Category filter
      if (categoryFilter !== 'all') {
        const cat = getKeyCategory(key);
        if (cat !== categoryFilter) return false;
      }

      // Status filter
      const translated = isKeyTranslated(key);
      if (statusFilter === 'missing' && translated) return false;
      if (statusFilter === 'completed' && !translated) return false;

      // Search query
      if (searchKey.trim()) {
        const q = searchKey.toLowerCase().trim();
        const val = (currentDict[key] || '').toLowerCase();
        const baseVal = (baseDict[key] || '').toLowerCase();
        const k = key.toLowerCase();
        if (!k.includes(q) && !val.includes(q) && !baseVal.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [allKeys, categoryFilter, statusFilter, searchKey, currentDict, baseDict, selectedLangForEdit]);

  // Statistics
  const stats = useMemo(() => {
    let completed = 0;
    let missing = 0;
    allKeys.forEach(k => {
      if (isKeyTranslated(k)) completed++;
      else missing++;
    });
    return {
      total: allKeys.length,
      completed,
      missing,
    };
  }, [allKeys, currentDict, selectedLangForEdit]);

  const handleAddLanguage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim() || !newName.trim()) return;

    const code = newCode.trim().toLowerCase();
    addLanguage({
      code,
      name: newName.trim(),
      flag: newFlag.trim() || '🌐',
      isDefault: false,
      active: true,
    });

    setSelectedLangForEdit(code);
    setNewCode('');
    setNewName('');
    setNewFlag('');
    showNotice(`"${newName.trim()}" dili sisteme eklendi.`);
  };

  // One-click copy missing keys from TR
  const handleSyncMissingFromTR = () => {
    const missingKeys = allKeys.filter(k => !currentDict[k] || currentDict[k].trim() === '');
    if (missingKeys.length === 0) {
      showNotice('Bu dilde eksik anahtar bulunmamaktadır.');
      return;
    }

    missingKeys.forEach(k => {
      const trVal = baseDict[k] || '';
      updateTranslationKey(selectedLangForEdit, k, trVal);
    });

    showNotice(`${missingKeys.length} eksik anahtar Türkçe şablondan bu dile eklendi.`);
  };

  // Add Custom Translation Key
  const handleAddCustomKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    const key = newKeyName.trim();
    if (newKeyTR.trim()) {
      updateTranslationKey('tr', key, newKeyTR.trim());
    }
    if (newKeyTarget.trim()) {
      updateTranslationKey(selectedLangForEdit, key, newKeyTarget.trim());
    } else if (newKeyTR.trim()) {
      updateTranslationKey(selectedLangForEdit, key, newKeyTR.trim());
    }

    setIsAddKeyModalOpen(false);
    setNewKeyName('');
    setNewKeyTR('');
    setNewKeyTarget('');
    showNotice(`"${key}" anahtarı sözlüğe eklendi.`);
  };

  // Open JSON Export/Import Modal
  const openJsonModal = () => {
    setJsonText(JSON.stringify(currentDict, null, 2));
    setJsonCopySuccess(false);
    setJsonImportError(null);
    setIsJsonModalOpen(true);
  };

  // Handle JSON Import
  const handleImportJson = () => {
    try {
      setJsonImportError(null);
      const parsed = JSON.parse(jsonText);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        setJsonImportError('JSON geçerli bir nesne (object) olmalıdır.');
        return;
      }
      importLanguageTranslations(selectedLangForEdit, parsed, true);
      setIsJsonModalOpen(false);
      showNotice(`"${selectedLangForEdit.toUpperCase()}" sözlüğü JSON ile başarıyla güncellendi.`);
    } catch (err: any) {
      setJsonImportError(`Geçersiz JSON formatı: ${err.message}`);
    }
  };

  const selectedLangObj = languages.find(l => l.code === selectedLangForEdit) || languages[0];

  return (
    <div className="space-y-8">
      {/* Top Banner Notice */}
      {actionNotice && (
        <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span className="font-semibold">{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="text-emerald-400/80 hover:text-emerald-300">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span>Dinamik Dil Yönetimi & Manuel Çeviri Masası</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Yapay zeka hatalarına takılmadan sitenizin tüm dillerini elle düzenleyin, eksik metinleri tamamlayın ve kontrolü elinizde tutun.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => setSelectedLangForEdit(l.code)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                selectedLangForEdit === l.code
                  ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-md'
                  : l.active
                  ? 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:bg-neutral-700'
                  : 'bg-neutral-950 text-neutral-500 border-neutral-800 hover:bg-neutral-800'
              }`}
            >
              <span>{l.flag}</span>
              <span>{l.name}</span>
              {!l.active && <span className="text-[10px] text-red-400 ml-0.5">(Pasif)</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Language Status Cards */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Power className="w-3.5 h-3.5 text-emerald-400" />
          <span>Sistemdeki Diller & Aktiflik Durumları</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {languages.map(lang => (
            <div
              key={lang.code}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                lang.active
                  ? 'bg-neutral-950/80 border-neutral-800'
                  : 'bg-neutral-950/40 border-neutral-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{lang.flag}</span>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{lang.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400">
                      {lang.code.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">
                    {lang.code === 'tr'
                      ? 'Ana Varsayılan Dil'
                      : lang.active
                      ? 'Sitede Yayında (Seçilebilir)'
                      : 'Pasif (Gizli)'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {lang.code !== 'tr' && (
                  <button
                    onClick={() => toggleLanguageActive(lang.code)}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                      lang.active
                        ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 border border-neutral-700'
                    }`}
                    title={lang.active ? 'Pasifleştir' : 'Aktifleştir'}
                  >
                    {lang.active ? (
                      <ToggleRight className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-4 h-4 text-neutral-500" />
                    )}
                  </button>
                )}

                {lang.code !== 'tr' && (
                  <button
                    onClick={() => {
                      if (confirm(`"${lang.name}" dilini ve sözlüğünü tamamen silmek istediğinize emin misiniz?`)) {
                        deleteLanguage(lang.code);
                        if (selectedLangForEdit === lang.code) setSelectedLangForEdit('tr');
                        showNotice(`"${lang.name}" dili silindi.`);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 cursor-pointer"
                    title="Dili tamamen sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Language Form */}
      <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Yeni Dil Ekle
        </h4>
        <form onSubmit={handleAddLanguage} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Dil Kodu (Örn: de, fr, es, ar)</label>
            <input
              type="text"
              required
              maxLength={4}
              value={newCode}
              onChange={e => setNewCode(e.target.value)}
              placeholder="de"
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Dil Adı (Örn: Deutsch)</label>
            <input
              type="text"
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Deutsch"
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white"
            />
          </div>

          <div>
            <label className="block text-[11px] text-neutral-400 mb-1">Bayrak Emojisi (Örn: 🇩🇪)</label>
            <input
              type="text"
              value={newFlag}
              onChange={e => setNewFlag(e.target.value)}
              placeholder="🇩🇪"
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-3 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer h-9 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Dili Sisteme Ekle</span>
            </button>
          </div>
        </form>
      </div>

      {/* Active Language Manual Translation Desk */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6">
        {/* Desk Header & Actions */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedLangObj?.flag}</span>
              <span className="text-base font-bold text-white">
                "{selectedLangObj?.name}" Manuel Çeviri Masası
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-neutral-800 text-amber-400 uppercase font-mono font-bold">
                {selectedLangForEdit}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Toplam <strong>{stats.total}</strong> anahtardan <strong>{stats.completed}</strong> adedi çevrildi,{' '}
              <strong className={stats.missing > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                {stats.missing}
              </strong>{' '}
              adedi eksik/boş.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAddKeyModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Yeni Anahtar Ekle</span>
            </button>

            {selectedLangForEdit !== 'tr' && (
              <button
                onClick={handleSyncMissingFromTR}
                className="px-3 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Türkçe sözlükte olup bu dilde henüz tanımlanmamış anahtarları ekler"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Eksik Anahtarları TR'den Çek</span>
              </button>
            )}

            <button
              onClick={openJsonModal}
              className="px-3 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON İçe / Dışa Aktar</span>
            </button>

            <button
              onClick={() => showNotice('Tüm çeviriler başarıyla güncel ve sistem hafızasına işlenmiş durumda.')}
              className="px-4 py-2 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Tümünü Kaydet</span>
            </button>
          </div>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-neutral-400 font-medium">Durum:</span>
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border ${
              statusFilter === 'all'
                ? 'bg-neutral-100 text-black border-neutral-100 font-bold'
                : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Tümü ({stats.total})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('missing')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border flex items-center gap-1 ${
              statusFilter === 'missing'
                ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-xs'
                : 'bg-neutral-950 text-amber-400/90 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Eksik / Çevrilmemiş ({stats.missing})</span>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors border flex items-center gap-1 ${
              statusFilter === 'completed'
                ? 'bg-emerald-500 text-black border-emerald-500 font-bold shadow-xs'
                : 'bg-neutral-950 text-emerald-400/90 border-neutral-800 hover:bg-neutral-800'
            }`}
          >
            <Check className="w-3 h-3" />
            <span>Çevrilmiş ({stats.completed})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all' as CategoryFilter, label: 'Tüm Kategoriler' },
            { id: 'nav' as CategoryFilter, label: '🔝 Header & Menü' },
            { id: 'customer' as CategoryFilter, label: '💼 Müşteri Paneli (CMS)' },
            { id: 'products' as CategoryFilter, label: '🚀 01. Hazır Siteler' },
            { id: 'models' as CategoryFilter, label: '📦 02. Teslimat Modelleri' },
            { id: 'services' as CategoryFilter, label: '🛠️ 03. Hizmetler & 04. Referanslar' },
            { id: 'hero' as CategoryFilter, label: '⚡ Hero & Giriş' },
            { id: 'megamenu' as CategoryFilter, label: '🏬 Mega Menü' },
            { id: 'footer' as CategoryFilter, label: '🛡️ Footer (Alt Bilgi)' },
            { id: 'other' as CategoryFilter, label: '🧩 Diğer' },
          ].map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border ${
                categoryFilter === cat.id
                  ? 'bg-white text-black border-white font-bold shadow-xs'
                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchKey}
            onChange={e => setSearchKey(e.target.value)}
            placeholder="Anahtar adı, Türkçe orijinal veya çeviri metni içinde ara (örn: nav.home, customer.title)..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Dictionary Table List */}
        <div className="max-h-[620px] overflow-y-auto rounded-xl border border-neutral-800 divide-y divide-neutral-800 bg-neutral-950/50">
          {filteredKeys.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-500">
              Arama veya filtre kriterlerine uygun çeviri anahtarı bulunamadı.
            </div>
          ) : (
            filteredKeys.map(key => {
              const trVal = baseDict[key] || '';
              const targetVal = currentDict[key] || '';
              const isTranslated = !!targetVal && targetVal.trim() !== '';

              return (
                <div key={key} className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 hover:bg-neutral-900/60 transition-colors">
                  {/* Left Column: Key & TR Original */}
                  <div className="lg:col-span-5 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono font-bold text-amber-400/95 break-all">
                        {key}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                          isTranslated
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {isTranslated ? '✅ Çevrildi' : '⚠️ Eksik'}
                      </span>
                    </div>

                    {/* TR Original Box */}
                    <div className="p-2.5 rounded-lg bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-300">
                      <div className="text-[9px] uppercase font-bold text-neutral-500 mb-1 flex items-center justify-between">
                        <span>🇹🇷 TR Orijinal Metin:</span>
                        {selectedLangForEdit !== 'tr' && (
                          <button
                            type="button"
                            onClick={() => {
                              updateTranslationKey(selectedLangForEdit, key, trVal);
                              showNotice(`"${key}" için TR metin kopyalandı.`);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] text-amber-400/90 hover:text-amber-300 cursor-pointer"
                            title="Türkçe metni çeviri kutusuna kopyala"
                          >
                            <Copy className="w-3 h-3" />
                            <span>TR'yi Kopyala</span>
                          </button>
                        )}
                      </div>
                      <div className="leading-relaxed whitespace-pre-wrap">{trVal || <em className="text-neutral-600">Boş</em>}</div>
                    </div>
                  </div>

                  {/* Right Column: Target Language Input */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                        <span>{selectedLangObj?.flag} {selectedLangObj?.name} Çevirisi:</span>
                        <span className="font-mono text-neutral-500">{targetVal.length} karakter</span>
                      </div>
                      <textarea
                        rows={2}
                        value={targetVal}
                        onChange={e => updateTranslationKey(selectedLangForEdit, key, e.target.value)}
                        placeholder={`${selectedLangObj?.name} karşılığını buraya yazın...`}
                        className={`w-full px-3 py-2 text-xs rounded-xl border bg-neutral-950 text-white focus:outline-none transition-colors ${
                          isTranslated
                            ? 'border-neutral-700 focus:border-amber-400'
                            : 'border-amber-500/40 focus:border-amber-400'
                        }`}
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          deleteTranslationKey(selectedLangForEdit, key);
                          showNotice(`"${key}" çevirisi temizlendi.`);
                        }}
                        className="px-2 py-1 text-[10px] text-neutral-500 hover:text-red-400 rounded cursor-pointer"
                        title="Bu çeviriyi temizle"
                      >
                        Temizle
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Custom Key Modal */}
      {isAddKeyModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-lg bg-[#0e1118] border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Yeni Çeviri Anahtarı Tanımla</span>
              </h4>
              <button
                onClick={() => setIsAddKeyModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomKey} className="space-y-4">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Anahtar Kodu (Örn: nav.newLink, footer.customNote) *
                </label>
                <input
                  type="text"
                  required
                  value={newKeyName}
                  onChange={e => setNewKeyName(e.target.value)}
                  placeholder="nav.customItem"
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  🇹🇷 Türkçe Orijinal Metin *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newKeyTR}
                  onChange={e => setNewKeyTR(e.target.value)}
                  placeholder="Türkçe karşılığı"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  {selectedLangObj?.flag} {selectedLangObj?.name} Çevirisi
                </label>
                <textarea
                  rows={2}
                  value={newKeyTarget}
                  onChange={e => setNewKeyTarget(e.target.value)}
                  placeholder={`${selectedLangObj?.name} çevirisi (boş bırakılırsa TR kopyalanır)`}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddKeyModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md"
                >
                  Sözlüğe Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JSON Import / Export Modal */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#0e1118] border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">
                  "{selectedLangObj?.name}" JSON Sözlüğü İçe / Dışa Aktar
                </h4>
              </div>
              <button
                onClick={() => setIsJsonModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Bu dilin tüm çeviri sözlüğünü kopyalayabilir veya dışarıda çevrilmiş JSON formatındaki sözlüğü buraya yapıştırarak tek tıkla sisteme aktarabilirsiniz.
            </p>

            {jsonImportError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{jsonImportError}</span>
              </div>
            )}

            <div>
              <textarea
                rows={12}
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
                className="w-full p-3 text-xs font-mono rounded-xl border border-neutral-700 bg-neutral-950 text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(jsonText);
                  setJsonCopySuccess(true);
                  setTimeout(() => setJsonCopySuccess(false), 2500);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                {jsonCopySuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{jsonCopySuccess ? 'Kopyalandı!' : 'JSON’ı Kopyala'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsJsonModalOpen(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer"
                >
                  Kapat
                </button>
                <button
                  type="button"
                  onClick={handleImportJson}
                  className="px-5 py-2 text-xs font-bold text-black bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>JSON’ı Sisteme Aktar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

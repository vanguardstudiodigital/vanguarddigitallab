import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Crown,
  Sparkles,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  ExternalLink,
  ShieldCheck,
  Link as LinkIcon,
  HelpCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { AdvisoryServiceConfig } from '../../types/index.ts';
import { DEFAULT_ADVISORY_SERVICE } from '../../data/defaultData.ts';

export const AdvisoryAdmin: React.FC = () => {
  const { advisoryService, updateAdvisoryService, formatPrice, languages, currentCurrency } = useApp();

  const [formData, setFormData] = useState<AdvisoryServiceConfig>(() => {
    return advisoryService ? JSON.parse(JSON.stringify(advisoryService)) : DEFAULT_ADVISORY_SERVICE;
  });

  const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'ru'>('tr');
  const [newFeatureText, setNewFeatureText] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  // Sync if external advisoryService changes
  React.useEffect(() => {
    if (advisoryService) {
      setFormData(JSON.parse(JSON.stringify(advisoryService)));
    }
  }, [advisoryService]);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateAdvisoryService(formData);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Vanguard Nexus danışmanlık kartı varsayılan kurumsal değerlerine sıfırlansın mı?')) {
      setFormData(JSON.parse(JSON.stringify(DEFAULT_ADVISORY_SERVICE)));
      updateAdvisoryService(DEFAULT_ADVISORY_SERVICE);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3000);
    }
  };

  // Feature operations for current language tab
  const getFeaturesForCurrentTab = (): string[] => {
    if (activeLangTab === 'tr') {
      return formData.features || [];
    }
    return formData.translations?.[activeLangTab]?.features || [];
  };

  const updateFeaturesForCurrentTab = (features: string[]) => {
    if (activeLangTab === 'tr') {
      setFormData(prev => ({ ...prev, features }));
    } else {
      setFormData(prev => ({
        ...prev,
        translations: {
          ...(prev.translations || {}),
          [activeLangTab]: {
            ...(prev.translations?.[activeLangTab] || {}),
            features,
          },
        },
      }));
    }
  };

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    const current = getFeaturesForCurrentTab();
    updateFeaturesForCurrentTab([...current, newFeatureText.trim()]);
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    const current = getFeaturesForCurrentTab();
    updateFeaturesForCurrentTab(current.filter((_, i) => i !== index));
  };

  const handleMoveFeature = (index: number, direction: 'up' | 'down') => {
    const current = [...getFeaturesForCurrentTab()];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= current.length) return;
    const temp = current[index];
    current[index] = current[targetIdx];
    current[targetIdx] = temp;
    updateFeaturesForCurrentTab(current);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const current = [...getFeaturesForCurrentTab()];
    current[index] = value;
    updateFeaturesForCurrentTab(current);
  };

  // Localized field getters & setters
  const getFieldValue = (field: 'badge' | 'packageName' | 'priceText' | 'priceSubtext' | 'buttonText' | 'description'): string => {
    if (activeLangTab === 'tr') {
      return formData[field] || '';
    }
    return formData.translations?.[activeLangTab]?.[field] || '';
  };

  const setFieldValue = (field: 'badge' | 'packageName' | 'priceText' | 'priceSubtext' | 'buttonText' | 'description', value: string) => {
    if (activeLangTab === 'tr') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({
        ...prev,
        translations: {
          ...(prev.translations || {}),
          [activeLangTab]: {
            ...(prev.translations?.[activeLangTab] || {}),
            [field]: value,
          },
        },
      }));
    }
  };

  // Preview card computed values
  const previewBadge = getFieldValue('badge') || formData.badge;
  const previewName = getFieldValue('packageName') || formData.packageName;
  const previewPriceText = getFieldValue('priceText') || formData.priceText;
  const previewPriceSubtext = getFieldValue('priceSubtext') || formData.priceSubtext;
  const previewDescription = getFieldValue('description') || formData.description;
  const previewFeatures = getFeaturesForCurrentTab().length > 0 ? getFeaturesForCurrentTab() : formData.features;
  const previewButtonText = getFieldValue('buttonText') || formData.buttonText;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#141824] to-[#0c0e14] border border-amber-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                Vanguard Nexus (Premium Web & AI Advisory)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500 text-black uppercase font-mono tracking-wider">
                VIP CMS
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              50.000 TL+ Taban bütçeli en prestijli C-Level teknik ve yapay zekâ danışmanlık hizmetini dinamik yönetin.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-xl border border-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Varsayılan verilere geri döndür"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Varsayılana Sıfırla</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            className="px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-amber-950/30"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Değişiklikleri Kaydet</span>
          </button>
        </div>
      </div>

      {/* Success Toast */}
      {savedToast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Vanguard Nexus danışmanlık kartı başarıyla güncellendi! Ana sayfadaki Fiyatlandırma bölümüne anında yansıtıldı.</span>
        </div>
      )}

      {/* Main Grid: Form Left, Live Preview Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Status & Base Budget Card */}
          <div className="p-5 rounded-2xl bg-[#0f121b] border border-neutral-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-2 font-mono">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Kart Durumu & Finansal Taban Değerleri</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <div>
                  <div className="text-xs font-bold text-white">Ana Sayfada Göster</div>
                  <div className="text-[11px] text-neutral-400">Kart Fiyatlandırma alanında yayınlansın</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={e => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>

              {/* Base Price TRY */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Taban Bütçe Tutarı (TRY)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.basePriceTRY || 50000}
                    onChange={e => setFormData(prev => ({ ...prev, basePriceTRY: Number(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono-numbers focus:border-amber-500 focus:outline-none pr-14"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-amber-400">
                    TRY
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 mt-1">
                  Mevcut dönüşüm: <strong>{formatPrice(formData.basePriceTRY || 50000)}</strong>
                </div>
              </div>
            </div>

            {/* Button Target / Link Configuration */}
            <div className="pt-2 border-t border-neutral-800/60 space-y-2">
              <label className="block text-xs font-semibold text-neutral-300">
                Buton Hedefi / Linki (Calendly veya Form Modal)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.buttonLink || ''}
                  onChange={e => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                  placeholder="Örn: https://calendly.com/... veya #page-iletisim (Boş ise Keşif Formu açılır)"
                  className="w-full px-3 py-2.5 pl-8 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono focus:border-amber-500 focus:outline-none"
                />
                <LinkIcon className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-3" />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                <span className="text-neutral-400">Hızlı Şablonlar:</span>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, buttonLink: '#contact' }))}
                  className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors cursor-pointer"
                >
                  Kurumsal Keşif Formu (#contact)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, buttonLink: 'https://calendly.com/vanguardstudio/strategy' }))}
                  className="px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 transition-colors cursor-pointer"
                >
                  Calendly Randevu
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, buttonLink: '#tech-advisory' }))}
                  className="px-2 py-0.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 transition-colors cursor-pointer"
                >
                  Danışmanlık Bölümü (#tech-advisory)
                </button>
              </div>
            </div>
          </div>

          {/* Multilingual Content Tabs */}
          <div className="p-5 rounded-2xl bg-[#0f121b] border border-neutral-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono">
                Kart İçerik Metinleri & Dil Ayarları
              </h3>
              <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('tr')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeLangTab === 'tr' ? 'bg-amber-500 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Türkçe (TR)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeLangTab === 'en' ? 'bg-amber-500 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('ru')}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    activeLangTab === 'ru' ? 'bg-amber-500 text-black shadow-xs' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Русский (RU)
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {/* Package Name */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Paket Adı ({activeLangTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={getFieldValue('packageName')}
                  onChange={e => setFieldValue('packageName', e.target.value)}
                  placeholder="Vanguard Nexus (Premium Web & AI Advisory)"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Badge Text */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Üst VIP Rozet Metni ({activeLangTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={getFieldValue('badge')}
                  onChange={e => setFieldValue('badge', e.target.value)}
                  placeholder="VIP Advisory · Kurumsal Teknoloji Masası"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Price Row: priceText & priceSubtext */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Görünen Fiyat Alanı ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={getFieldValue('priceText')}
                    onChange={e => setFieldValue('priceText', e.target.value)}
                    placeholder="50.000 TL'den Başlayan Fiyatlarla"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white font-mono-numbers focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Fiyat Alt Notu (Küçük Punto) ({activeLangTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={getFieldValue('priceSubtext')}
                    onChange={e => setFieldValue('priceSubtext', e.target.value)}
                    placeholder="Proje bazlı özel fiyatlandırma"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Buton Metni ({activeLangTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={getFieldValue('buttonText')}
                  onChange={e => setFieldValue('buttonText', e.target.value)}
                  placeholder="Strateji Toplantısı Planla"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Kurumsal Danışmanlık Özeti ({activeLangTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={getFieldValue('description')}
                  onChange={e => setFieldValue('description', e.target.value)}
                  placeholder="Dijital dönüşüm, özel yapay zekâ model orkestrasyonu ve kurumsal mimaride doğrudan C-Level teknik danışmanlık."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Bullet Points / Features Card */}
          <div className="p-5 rounded-2xl bg-[#0f121b] border border-neutral-800/80 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 font-mono">
                  Hizmet Maddeleri ({getFeaturesForCurrentTab().length} Madde · {activeLangTab.toUpperCase()})
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Kart üzerinde onay ikonu ile sıralanan VIP hizmet kapsam maddeleri
                </p>
              </div>

              <span className="px-2 py-0.5 text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono rounded">
                Dinamik Liste
              </span>
            </div>

            {/* Existing Items */}
            <div className="space-y-2">
              {getFeaturesForCurrentTab().map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-xl bg-neutral-900 border border-neutral-800/80 group hover:border-neutral-700 transition-colors"
                >
                  <span className="w-5 text-center text-[10px] font-mono text-neutral-500">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={feat}
                    onChange={e => handleFeatureChange(idx, e.target.value)}
                    className="flex-1 bg-transparent text-xs text-neutral-200 focus:outline-none focus:text-white"
                  />
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMoveFeature(idx, 'up')}
                      className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Yukarı Taşı"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === getFeaturesForCurrentTab().length - 1}
                      onClick={() => handleMoveFeature(idx, 'down')}
                      className="p-1 text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Aşağı Taşı"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="p-1 text-red-400 hover:text-red-300 cursor-pointer"
                      title="Maddeyi Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Feature */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={e => setNewFeatureText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder={`Yeni madde ekle (${activeLangTab.toUpperCase()})...`}
                className="flex-1 px-3 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ekle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Preview Area (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5 font-mono">
              <Eye className="w-4 h-4 text-amber-400" />
              <span>Canlı Kart Önizlemesi ({activeLangTab.toUpperCase()})</span>
            </h3>
            <span className="text-[10px] text-neutral-500">
              {formData.isActive ? '● Aktif Yayında' : '○ Pasif (Gizli)'}
            </span>
          </div>

          {/* Actual Card Render */}
          <div className="relative flex flex-col rounded-2xl p-6 sm:p-7 border-2 border-amber-500/70 bg-gradient-to-b from-[#141824] via-[#0f121d] to-[#080a0f] text-white shadow-2xl shadow-amber-950/40">
            {/* Top VIP banner badge */}
            <div className="absolute -top-3 left-6 sm:left-8 px-3.5 py-0.5 bg-gradient-to-r from-amber-400 to-amber-600 text-black text-[10px] font-extrabold tracking-widest rounded-full shadow-lg flex items-center gap-1.5 uppercase">
              <Crown className="w-3 h-3 text-black shrink-0" />
              <span>{previewBadge}</span>
            </div>

            <div className="flex items-start justify-between mb-5 mt-1">
              <div>
                <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-amber-400 flex items-center gap-1 uppercase">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>C-Level Advisory</span>
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white font-display mt-1 leading-snug">
                  {previewName}
                </h3>
              </div>
              <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>

            <div className="mb-5 pb-5 border-b border-amber-500/20">
              <div className="flex flex-col">
                <span className="text-base sm:text-lg xl:text-xl font-extrabold font-display text-amber-300 tracking-tight">
                  {previewPriceText}
                </span>
                <span className="text-[11px] font-medium text-amber-200/70 mt-0.5">
                  {previewPriceSubtext}
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-2.5 leading-relaxed min-h-[50px] text-justify">
                {previewDescription}
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3 mb-6 flex-1 text-xs text-neutral-200">
              {previewFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <div className="flex-1 py-2.5 px-3 text-xs font-bold text-black bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/20">
                <span>{previewButtonText}</span>
                {formData.buttonLink && (formData.buttonLink.startsWith('http://') || formData.buttonLink.startsWith('https://')) ? (
                  <ExternalLink className="w-3.5 h-3.5" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
              </div>
            </div>
          </div>

          {/* Helper Tips */}
          <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 space-y-2">
            <div className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Yönetici Notu:</span>
            </div>
            <p className="text-[11px] leading-relaxed text-justify">
              Bu form üzerinden yaptığınız tüm güncellemeler tarayıcınızın yerel hafızasına (localStorage) ve JSON yedekleme paketine otomatik entegre edilir. 'Değişiklikleri Kaydet' butonuna bastığınız anda ana sayfadaki 4. VIP kart yenilenir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Plus, Trash2, Edit2, Layout, AlertCircle, Cpu, Globe, Save } from 'lucide-react';
import { ServiceItem } from '../../types/index.ts';
import { stripHtml } from '../../utils/richTextRenderer.ts';

export const ServicesAdmin: React.FC = () => {
  const { services, addService, updateService, deleteService, currentLang } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // 1. ANAYASA KURALI: AJANS HİZMETLERİ İÇİN MANUEL ÇİFT DİLLİ FORM STATE YAPILARI
  const [number, setNumber] = useState('03');
  const [titleTR, setTitleTR] = useState('');
  const [titleEN, setTitleEN] = useState('');
  const [subtitleTR, setSubtitleTR] = useState('');
  const [subtitleEN, setSubtitleEN] = useState('');
  const [descTR, setDescTR] = useState('');
  const [descEN, setDescEN] = useState('');
  const [deliverablesTextTR, setDeliverablesTextTR] = useState('');
  const [deliverablesTextEN, setDeliverablesTextEN] = useState('');
  const [iconName, setIconName] = useState('Layout');
  const [isFeaturedInMegaMenu, setIsFeaturedInMegaMenu] = useState(true);

  // Anayasa Kuralı 2: SEO Uyumlu El İşçiliği Manuel Link Yapısı (Slug)
  const [slugTR, setSlugTR] = useState('');
  const [slugEN, setSlugEN] = useState('');

  const resetForm = () => {
    setNumber('03');
    setTitleTR('');
    setTitleEN('');
    setSubtitleTR('');
    setSubtitleEN('');
    setDescTR('');
    setDescEN('');
    setDeliverablesTextTR('');
    setDeliverablesTextEN('');
    setIconName('Layout');
    setIsFeaturedInMegaMenu(true);
    setSlugTR('');
    setSlugEN('');
    setIsEditing(false);
    setEditingId(null);
    setFormError('');
  };

  const startEdit = (item: ServiceItem) => {
    setNumber(item.number || '03');

    // Veritabanı yedeğindeki dual-language verileri forma güvenle dolduruyoruz
    setTitleTR(item.translations?.tr?.title || item.title || '');
    setTitleEN(item.translations?.en?.title || '');
    setSubtitleTR(item.translations?.tr?.subtitle || item.subtitle || '');
    setSubtitleEN(item.translations?.en?.subtitle || '');
    setDescTR(item.translations?.tr?.description || item.description || '');
    setDescEN(item.translations?.en?.description || '');

    // Anayasa Kuralı 2: Tamamen manuel düzenlenebilir sluglar forma yükleniyor
    setSlugTR(item.slug_tr || item.slug || '');
    setSlugEN(item.slug_en || '');

    // Özellikleri satır satır ayırarak textarealara basıyoruz
    setDeliverablesTextTR(
      item.translations?.tr?.deliverables
        ? item.translations.tr.deliverables.join('\n')
        : (item.deliverables || []).join('\n')
    );
    setDeliverablesTextEN(
      item.translations?.en?.deliverables
        ? item.translations.en.deliverables.join('\n')
        : ''
    );

    setIconName(item.iconName || 'Layout');
    setIsFeaturedInMegaMenu(item.isFeaturedInMegaMenu ?? true);
    setIsEditing(true);
    setEditingId(item.id);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleTR.trim()) {
      setFormError('Lütfen Türkçe Hizmet Başlığını doldurunuz.');
      return;
    }

    // Satır satır ayrılmış teslimatları dizilere döküyoruz
    const deliverablesTR = deliverablesTextTR
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const deliverablesEN = deliverablesTextEN
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    // Otomatik çeviriciyi bypass eden, veri kaybını önleyen dual-language objesi
    const translations = {
      tr: {
        title: titleTR.trim(),
        subtitle: subtitleTR.trim(),
        description: descTR.trim(),
        deliverables: deliverablesTR.length ? deliverablesTR : ['Özel Teslimat']
      },
      en: {
        title: titleEN.trim() || titleTR.trim(),
        subtitle: subtitleEN.trim() || subtitleTR.trim(),
        description: descEN.trim() || descTR.trim(),
        deliverables: deliverablesEN.length ? deliverablesEN : deliverablesTR
      }
    };

    const cleanSlug = (text: string) =>
      text
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const finalSlugTR = slugTR.trim() || cleanSlug(titleTR);
    const finalSlugEN = slugEN.trim() || cleanSlug(titleEN || titleTR);

    const serviceData = {
      number: number.trim(),
      title: titleTR.trim(),
      subtitle: subtitleTR.trim(),
      description: descTR.trim(),
      deliverables: deliverablesTR.length ? deliverablesTR : ['Özel Teslimat'],
      iconName,
      isFeaturedInMegaMenu,
      slug: finalSlugTR,
      slug_tr: finalSlugTR,
      slug_en: finalSlugEN,
      translations
    };

    if (editingId) {
      updateService(editingId, serviceData);
    } else {
      addService(serviceData);
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner and Navigation Bar */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Layout className="w-4 h-4 text-amber-400" />
            <span>Ajans Hizmetleri Yönetimi ({services.length})</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Mega menüde ve ana sayfada listelenen tam yetkili, çift dilli (TR/EN) ajans hizmetleri
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Hizmet Ekle</span>
          </button>
        )}
      </div>

      {/* Full Multi-Language Form Window */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-6 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-amber-400" />
              <span>{editingId ? 'Hizmeti Düzenle (Full CRUD)' : 'Yeni Hizmet Tanımla (Full CRUD)'}</span>
            </h4>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
          </div>

          {formError && (
            <div className="p-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* TR BÖLÜMÜ / TURKISH CONTENT NODE */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-neutral-800 pb-2 flex items-center gap-1.5">
              <span>🇹🇷 TÜRKÇE HİZMET YÖNETİMİ (EL İŞÇİLİĞİ)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Hizmet Başlığı (TR) *</label>
                <input
                  type="text"
                  required
                  value={titleTR}
                  onChange={e => setTitleTR(e.target.value)}
                  placeholder="Örn: Kurumsal Web Geliştirme"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Alt Başlık (TR)</label>
                <input
                  type="text"
                  value={subtitleTR}
                  onChange={e => setSubtitleTR(e.target.value)}
                  placeholder="Örn: Modern Mimari & Yüksek Performans"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Düzenlenebilir Dinamik Link (slug_tr)
              </label>
              <input
                type="text"
                value={slugTR}
                onChange={e => setSlugTR(e.target.value)}
                placeholder="Örn: kurumsal-web-gelistirme"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Boş bırakılırsa hizmet başlığından otomatik SEO uyumlu URL üretilir.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Hizmet Açıklaması (TR)</label>
              <textarea
                rows={4}
                value={descTR}
                onChange={e => setDescTR(e.target.value)}
                placeholder="Bu hizmetin detaylarını, standartlarını ve avantajlarını buraya yazın..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Teslimatlar (TR - Her Satıra Bir Madde)
              </label>
              <textarea
                rows={3}
                value={deliverablesTextTR}
                onChange={e => setDeliverablesTextTR(e.target.value)}
                placeholder="Örn:&#10;Next.js & Tailwind Kurulumu&#10;Google Core Web Vitals Skoru&#10;Tam SEO Optimizasyonu"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* EN BÖLÜMÜ / ENGLISH CONTENT NODE */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-neutral-800 pb-2 flex items-center gap-1.5">
              <span>🇺🇸 ENGLISH SERVICE MANAGEMENT (MANUAL CRAFT)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Service Title (EN)</label>
                <input
                  type="text"
                  value={titleEN}
                  onChange={e => setTitleEN(e.target.value)}
                  placeholder="Eg: Corporate Web Development"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Subtitle (EN)</label>
                <input
                  type="text"
                  value={subtitleEN}
                  onChange={e => setSubtitleEN(e.target.value)}
                  placeholder="Eg: Modern Architecture & High Performance"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Dynamic SEO Link (slug_en)
              </label>
              <input
                type="text"
                value={slugEN}
                onChange={e => setSlugEN(e.target.value)}
                placeholder="Eg: corporate-web-development"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-amber-400 font-mono focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                If left blank, automatically generated from English title.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Service Description (EN)</label>
              <textarea
                rows={4}
                value={descEN}
                onChange={e => setDescEN(e.target.value)}
                placeholder="Write the details, specifications, and scope of this service in English..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Deliverables (EN - One item per line)
              </label>
              <textarea
                rows={3}
                value={deliverablesTextEN}
                onChange={e => setDeliverablesTextEN(e.target.value)}
                placeholder="Eg:&#10;Next.js & Tailwind Setup&#10;Google Core Web Vitals Score&#10;Full SEO Optimization"
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* TEKNİK & GENEL AYARLAR */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider border-b border-neutral-800 pb-2">
              ⚙️ TEKNİK VE MENÜ AYARLARI
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Sıra / Numara (Örn: 01, 02, 03)</label>
                <input
                  type="text"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white font-mono focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">İkon Adı (Layout, Cpu, Globe vb.)</label>
                <input
                  type="text"
                  value={iconName}
                  onChange={e => setIconName(e.target.value)}
                  placeholder="Layout, Cpu, Globe, Zap"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white font-mono focus:border-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isFeaturedInMegaMenu"
                checked={isFeaturedInMegaMenu}
                onChange={e => setIsFeaturedInMegaMenu(e.target.checked)}
                className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-900 cursor-pointer"
              />
              <label htmlFor="isFeaturedInMegaMenu" className="text-xs text-neutral-300 cursor-pointer">
                Mega Menüde ve Ana Sayfada Öne Çıkar
              </label>
            </div>
          </div>

          {/* Form Aksiyon Butonları */}
          <div className="flex items-center gap-2 pt-4 border-t border-neutral-800">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-lg cursor-pointer transition-all shadow-md flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{editingId ? 'Değişiklikleri Kaydet' : 'Hizmeti Ekle & Yayına Al'}</span>
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}

      {/* Mevcut Hizmetler Listesi & Tam Yetkili CRUD Tablosu */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl mt-6">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <span>Tanımlı Hizmetler Portföyü</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 font-mono">
              {services.length}
            </span>
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {services.map(serv => {
            const hasEN = !!serv.translations?.en?.title;
            const displayTitleTR = serv.translations?.tr?.title || serv.title;
            const displayTitleEN = serv.translations?.en?.title || '—';
            const displayDesc = stripHtml(serv.translations?.tr?.description || serv.description || '');

            return (
              <div
                key={serv.id}
                className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                        {serv.number}
                      </span>
                      {serv.isFeaturedInMegaMenu && (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          Mega Menü
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(serv)}
                        className="p-1.5 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`"${serv.title}" hizmetini silmek istediğinize emin misiniz?`)) {
                            deleteService(serv.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h5 className="text-sm font-bold text-white mb-1">{displayTitleTR}</h5>
                  <div className="text-xs text-neutral-400 flex items-center gap-1.5 mb-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">EN:</span>
                    <span className={hasEN ? 'text-neutral-300' : 'text-neutral-600 italic'}>
                      {displayTitleEN}
                    </span>
                  </div>

                  {serv.subtitle && (
                    <p className="text-xs text-neutral-400 mb-2 italic">
                      {serv.translations?.tr?.subtitle || serv.subtitle}
                    </p>
                  )}

                  <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                    {displayDesc || 'Açıklama belirtilmemiş.'}
                  </p>

                  <div className="flex flex-wrap gap-2 text-[11px] mb-3">
                    {(serv.slug_tr || serv.slug) && (
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-emerald-400 font-mono text-[10px]">
                        tr: /{serv.slug_tr || serv.slug}
                      </span>
                    )}
                    {serv.slug_en && (
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-amber-400 font-mono text-[10px]">
                        en: /{serv.slug_en}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>
                    {(serv.translations?.tr?.deliverables?.length || serv.deliverables?.length || 0)} teslimat maddesi
                  </span>
                  <div className="flex items-center gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                      TR
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded border ${
                        hasEN
                          ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                          : 'bg-neutral-900 text-neutral-600 border-neutral-800'
                      }`}
                    >
                      EN
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

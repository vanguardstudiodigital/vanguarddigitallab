import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Plus, Trash2, Edit2, Star, AlertCircle, Save, Globe } from 'lucide-react';
import { ReferenceItem } from '../../types/index.ts';

export const ReferencesAdmin: React.FC = () => {
  const { references, addReference, updateReference, deleteReference, currentLang } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // 1. ANAYASA KURALI: REFERANSLAR İÇİN MANUEL ÇİFT DİLLİ FORM STATE YAPILARI
  const [clientNameTR, setClientNameTR] = useState('');
  const [clientNameEN, setClientNameEN] = useState('');
  const [sectorTR, setSectorTR] = useState('');
  const [sectorEN, setSectorEN] = useState('');
  const [metricTR, setMetricTR] = useState('');
  const [metricEN, setMetricEN] = useState('');
  const [quoteTR, setQuoteTR] = useState('');
  const [quoteEN, setQuoteEN] = useState('');
  const [authorTR, setAuthorTR] = useState('');
  const [authorEN, setAuthorEN] = useState('');
  const [authorRoleTR, setAuthorRoleTR] = useState('');
  const [authorRoleEN, setAuthorRoleEN] = useState('');

  // Anayasa Kuralı 2: Tamamen manuel, el işçiliği düzenlenebilir bağımsız dinamik linkler
  const [slugTR, setSlugTR] = useState('');
  const [slugEN, setSlugEN] = useState('');

  const [year, setYear] = useState('2026');

  const resetForm = () => {
    setClientNameTR('');
    setClientNameEN('');
    setSectorTR('');
    setSectorEN('');
    setMetricTR('');
    setMetricEN('');
    setQuoteTR('');
    setQuoteEN('');
    setAuthorTR('');
    setAuthorEN('');
    setAuthorRoleTR('');
    setAuthorRoleEN('');
    setSlugTR('');
    setSlugEN('');
    setYear('2026');
    setIsEditing(false);
    setEditingId(null);
    setFormError('');
  };

  const startEdit = (item: ReferenceItem) => {
    setYear(item.year || '2026');

    // Veritabanı yedeğindeki dual-language verileri forma güvenle dolduruyoruz
    setClientNameTR(item.translations?.tr?.clientName || item.clientName || '');
    setClientNameEN(item.translations?.en?.clientName || '');
    setSectorTR(item.translations?.tr?.sector || item.sector || '');
    setSectorEN(item.translations?.en?.sector || '');
    setMetricTR(item.translations?.tr?.metric || item.metric || '');
    setMetricEN(item.translations?.en?.metric || '');
    setQuoteTR(item.translations?.tr?.quote || item.quote || '');
    setQuoteEN(item.translations?.en?.quote || '');
    setAuthorTR(item.translations?.tr?.author || item.author || '');
    setAuthorEN(item.translations?.en?.author || '');
    setAuthorRoleTR(item.translations?.tr?.authorRole || item.authorRole || '');
    setAuthorRoleEN(item.translations?.en?.authorRole || '');

    // Anayasa Kuralı 2: Tamamen manuel düzenlenebilir sluglar forma yükleniyor
    setSlugTR(item.slug_tr || item.slug || '');
    setSlugEN(item.slug_en || '');

    setIsEditing(true);
    setEditingId(item.id);
    setFormError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientNameTR.trim() || !quoteTR.trim()) {
      setFormError('Lütfen Türkçe Müşteri/Firma Adı ve Müşteri Yorumunu doldurunuz.');
      return;
    }

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

    const finalSlugTR = slugTR.trim() || cleanSlug(clientNameTR);
    const finalSlugEN = slugEN.trim() || cleanSlug(clientNameEN || clientNameTR);

    // Otomatik çeviriciyi bypass eden, veri kaybını önleyen dual-language objesi
    const translations = {
      tr: {
        clientName: clientNameTR.trim(),
        sector: sectorTR.trim(),
        metric: metricTR.trim(),
        quote: quoteTR.trim(),
        author: authorTR.trim(),
        authorRole: authorRoleTR.trim()
      },
      en: {
        clientName: clientNameEN.trim() || clientNameTR.trim(),
        sector: sectorEN.trim() || sectorTR.trim(),
        metric: metricEN.trim() || metricTR.trim(),
        quote: quoteEN.trim() || quoteTR.trim(),
        author: authorEN.trim() || authorTR.trim(),
        authorRole: authorRoleEN.trim() || authorRoleTR.trim()
      }
    };

    const payloadData = {
      clientName: clientNameTR.trim(),
      sector: sectorTR.trim(),
      year: year.trim() || '2026',
      metric: metricTR.trim(),
      quote: quoteTR.trim(),
      author: authorTR.trim(),
      authorRole: authorRoleTR.trim(),
      slug: finalSlugTR,
      slug_tr: finalSlugTR,
      slug_en: finalSlugEN,
      translations
    };

    if (editingId) {
      updateReference(editingId, payloadData);
    } else {
      addReference({
        ...payloadData,
        isFeaturedInMegaMenu: true
      });
    }
    resetForm();
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white font-display">
            Referanslar & Başarı Hikayeleri ({references?.length || 0})
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Müşteri yorumları, sektör başarıları ve somut büyüme metrikleri
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className="px-4 py-2 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Referans Ekle</span>
          </button>
        )}
      </div>

      {/* Editing & Creation Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
              <h4 className="text-sm font-bold text-white">
                {editingId ? 'Referansı Düzenle (Tam Yetki TR / EN)' : 'Yeni Başarı Hikayesi Ekle'}
              </h4>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Vazgeç
            </button>
          </div>

          {formError && (
            <div className="p-3 bg-red-950/60 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Ortak / Yıl Seçimi */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Referans Yılı</label>
            <input
              type="text"
              value={year}
              onChange={e => setYear(e.target.value)}
              placeholder="Örn: 2026"
              className="w-full sm:w-48 px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white font-mono"
            />
          </div>

          {/* TR BÖLÜMÜ / TURKISH CONTENT NODE */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
              🇹🇷 TÜRKÇE REFERANS YÖNETİMİ (EL İŞÇİLİĞİ)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Müşteri / Firma Adı (TR) *</label>
                <input
                  type="text"
                  required
                  value={clientNameTR}
                  onChange={e => setClientNameTR(e.target.value)}
                  placeholder="Örn: Dr. Dt. Taha Furkan Başaran"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Sektör / Lokasyon (TR)</label>
                <input
                  type="text"
                  value={sectorTR}
                  onChange={e => setSectorTR(e.target.value)}
                  placeholder="Örn: Sağlık / İstanbul"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Başarı Metriği (TR)</label>
                <input
                  type="text"
                  value={metricTR}
                  onChange={e => setMetricTR(e.target.value)}
                  placeholder="Örn: +210% WhatsApp Randevu Talebi"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Müşteri Yorumu / Alıntı (TR) *</label>
              <textarea
                rows={3}
                required
                value={quoteTR}
                onChange={e => setQuoteTR(e.target.value)}
                placeholder="12.500 TL bütçeyle 2 gün içinde harika bir siteye kavuştuk..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Kişi / Yetkili Adı (TR)</label>
                <input
                  type="text"
                  value={authorTR}
                  onChange={e => setAuthorTR(e.target.value)}
                  placeholder="Örn: Dr. Dt. Taha Furkan Başaran"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Unvan / Görev (TR)</label>
                <input
                  type="text"
                  value={authorRoleTR}
                  onChange={e => setAuthorRoleTR(e.target.value)}
                  placeholder="Örn: Kurucu Diş Hekimi"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Dinamik Link / Slug (TR)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-mono">/referanslar/</span>
                <input
                  type="text"
                  value={slugTR}
                  onChange={e => setSlugTR(e.target.value)}
                  placeholder="dr-taha-furkan-basaran"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* EN BÖLÜMÜ / ENGLISH CONTENT NODE */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
            <div className="text-xs font-bold text-sky-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
              🇺🇸 ENGLISH CASE STUDY MANAGEMENT (MANUAL CRAFT)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Client / Company Name (EN)</label>
                <input
                  type="text"
                  value={clientNameEN}
                  onChange={e => setClientNameEN(e.target.value)}
                  placeholder="e.g. Dr. Furkan Basaran Dental"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Sector / Location (EN)</label>
                <input
                  type="text"
                  value={sectorEN}
                  onChange={e => setSectorEN(e.target.value)}
                  placeholder="e.g. Healthcare / Istanbul"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Success Metric (EN)</label>
                <input
                  type="text"
                  value={metricEN}
                  onChange={e => setMetricEN(e.target.value)}
                  placeholder="e.g. +210% WhatsApp Consultation Inquiries"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Client Testimonial / Quote (EN)</label>
              <textarea
                rows={3}
                value={quoteEN}
                onChange={e => setQuoteEN(e.target.value)}
                placeholder="With a modest budget, we received an exceptional clinic portal in just 2 days..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Author / Representative Name (EN)</label>
                <input
                  type="text"
                  value={authorEN}
                  onChange={e => setAuthorEN(e.target.value)}
                  placeholder="e.g. Dr. Taha Furkan Basaran"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Title / Designation (EN)</label>
                <input
                  type="text"
                  value={authorRoleEN}
                  onChange={e => setAuthorRoleEN(e.target.value)}
                  placeholder="e.g. Founder & Chief Dentist"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Dynamic Link / Slug (EN)</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 font-mono">/references/</span>
                <input
                  type="text"
                  value={slugEN}
                  onChange={e => setSlugEN(e.target.value)}
                  placeholder="dr-furkan-basaran-dental"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white font-mono"
                />
              </div>
            </div>
          </div>

          {/* Form Aksiyon Kaydetme Butonları */}
          <div className="flex items-center gap-2 pt-4 border-t border-neutral-800">
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-lg cursor-pointer transition-all shadow-md"
            >
              {editingId ? 'Değişiklikleri Kaydet' : 'Referansı Ekle & Yayına Al'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Vazgeç
            </button>
          </div>
        </form>
      )}

      {/* Mevcut Referanslar Listesi & Tam Yetkili CRUD Tablosu */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl mt-6">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Aktif Başarı Hikayeleri & Referans Portföyü
            </h4>
          </div>
          <span className="text-xs font-mono text-neutral-500">
            Toplam: {references?.length || 0}
          </span>
        </div>

        <div className="divide-y divide-neutral-800/60">
          {references.map((ref) => {
            const trTrans = ref.translations?.tr;
            const enTrans = ref.translations?.en;
            const displayClient = trTrans?.clientName || ref.clientName;
            const displaySector = trTrans?.sector || ref.sector;
            const displayMetric = trTrans?.metric || ref.metric;
            const displayQuote = trTrans?.quote || ref.quote;
            const displayAuthor = trTrans?.author || ref.author;
            const displayAuthorRole = trTrans?.authorRole || ref.authorRole;
            const itemSlugTR = ref.slug_tr || ref.slug || '';
            const itemSlugEN = ref.slug_en || '';

            return (
              <div
                key={ref.id}
                className="p-5 hover:bg-neutral-800/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
                      {ref.year || '2026'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                      {displayMetric}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {displaySector}
                    </span>
                    {/* TR & EN Badges */}
                    <div className="flex items-center gap-1 ml-2">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-900/40 text-emerald-400 border border-emerald-800/40">
                        TR
                      </span>
                      {enTrans?.clientName || enTrans?.quote ? (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-900/40 text-sky-400 border border-sky-800/40">
                          EN
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-neutral-800 text-neutral-500 border border-neutral-700">
                          EN Yok
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <h5 className="text-sm font-bold text-white font-display">
                      {displayClient}
                    </h5>
                    {itemSlugTR && (
                      <span className="text-[11px] font-mono text-neutral-500">
                        /{itemSlugTR}
                      </span>
                    )}
                    {itemSlugEN && (
                      <span className="text-[11px] font-mono text-neutral-500">
                        (en: /{itemSlugEN})
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-neutral-300 italic line-clamp-2">
                    "{displayQuote}"
                  </p>

                  <div className="text-[11px] text-neutral-400">
                    {displayAuthor} · {displayAuthorRole}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    type="button"
                    onClick={() => startEdit(ref)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white flex items-center gap-1.5 cursor-pointer border border-neutral-700 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`"${displayClient}" referansını silmek istediğinize emin misiniz?`)) {
                        deleteReference(ref.id);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 flex items-center gap-1.5 cursor-pointer border border-red-900/50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sil</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

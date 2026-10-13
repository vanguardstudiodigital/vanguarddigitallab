import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  Link as LinkIcon,
  Video,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Eye,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { TurnkeyProduct } from '../../types/index.ts';

export const ProductsAdmin: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    formatPrice,
    openDemo,
    openStandaloneSite,
    currentLang,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  // 1. ANAYASA KURALI: STRICT ÇİFT DİLLİ MANUEL EL İŞÇİLİĞİ FORM STATE'LERİ
  const [titleTR, setTitleTR] = useState('');
  const [titleEN, setTitleEN] = useState('');
  const [sectorTR, setSectorTR] = useState('');
  const [sectorEN, setSectorEN] = useState('');
  const [taglineTR, setTaglineTR] = useState('');
  const [taglineEN, setTaglineEN] = useState('');
  const [descTR, setDescTR] = useState('');
  const [descEN, setDescEN] = useState('');
  const [badgeTR, setBadgeTR] = useState('');
  const [badgeEN, setBadgeEN] = useState('');

  // 2. ANAYASA KURALI: MANUEL EDİTLENEBİLİR BILINGUAL SLUG KONTROLLERİ
  const [slugTR, setSlugTR] = useState('');
  const [slugEN, setSlugEN] = useState('');

  const [priceEconomicTRY, setPriceEconomicTRY] = useState(10000);
  const [priceProfessionalTRY, setPriceProfessionalTRY] = useState(18000);
  const [featuresTextTR, setFeaturesTextTR] = useState('');
  const [featuresTextEN, setFeaturesTextEN] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [demoType, setDemoType] = useState<TurnkeyProduct['demoType']>('medical');
  const [isFeaturedInMegaMenu, setIsFeaturedInMegaMenu] = useState(false);
  const [active, setActive] = useState(true);

  const [imageUploadType, setImageUploadType] = useState<'url' | 'local'>('url');
  const [videoUploadType, setVideoUploadType] = useState<'url' | 'local'>('url');

  const resetForm = () => {
    setTitleTR('');
    setTitleEN('');
    setSectorTR('');
    setSectorEN('');
    setSlugTR('');
    setSlugEN('');
    setTaglineTR('');
    setTaglineEN('');
    setDescTR('');
    setDescEN('');
    setBadgeTR('');
    setBadgeEN('');
    setPriceEconomicTRY(10000);
    setPriceProfessionalTRY(18000);
    setFeaturesTextTR('');
    setFeaturesTextEN('');
    setCoverImage('');
    setVideoUrl('');
    setDemoType('medical');
    setIsFeaturedInMegaMenu(false);
    setActive(true);
    setIsEditing(false);
    setEditingId(null);
    setFormError('');
  };

  const startEdit = (product: TurnkeyProduct) => {
    // Veritabanı yedeğindeki dual-language verileri forma güvenle dolduruyoruz
    setTitleTR(product.translations?.tr?.title || product.title || '');
    setTitleEN(product.translations?.en?.title || '');
    setSectorTR(product.translations?.tr?.sector || product.sector || '');
    setSectorEN(product.translations?.en?.sector || '');

    // Anayasa Kuralı 2: Tamamen manuel düzenlenebilir slug'lar forma yükleniyor
    setSlugTR(product.slug_tr || product.slug || '');
    setSlugEN(product.slug_en || '');

    setTaglineTR(product.translations?.tr?.tagline || product.tagline || '');
    setTaglineEN(product.translations?.en?.tagline || '');
    setDescTR(product.translations?.tr?.description || product.description || '');
    setDescEN(product.translations?.en?.description || '');
    setBadgeTR(product.translations?.tr?.badge || product.badge || '');
    setBadgeEN(product.translations?.en?.badge || '');

    setPriceEconomicTRY(product.priceEconomicTRY);
    setPriceProfessionalTRY(product.priceProfessionalTRY);

    // Özellikleri satır satır ayırarak textarealara basıyoruz
    setFeaturesTextTR(
      product.translations?.tr?.features
        ? product.translations.tr.features.join('\n')
        : product.features
        ? product.features.join('\n')
        : ''
    );
    setFeaturesTextEN(product.translations?.en?.features ? product.translations.en.features.join('\n') : '');

    setCoverImage(product.coverImage);
    setVideoUrl(product.videoUrl || '');
    setDemoType(product.demoType);
    setIsFeaturedInMegaMenu(product.isFeaturedInMegaMenu || false);
    setActive(product.active);
    setIsEditing(true);
    setEditingId(product.id);
    setFormError('');
  };

  const handleLocalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Görsel boyutu maksimum 5MB olmalıdır.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setCoverImage(event.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleLocalVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) {
      alert('Lokal video boyutu maksimum 25MB olmalıdır (veya harici YouTube/Vimeo/MP4 linki ekleyin).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) setVideoUrl(event.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleTR.trim() || !sectorTR.trim()) {
      setFormError('Türkçe Başlık ve Sektör alanları zorunludur.');
      return;
    }

    const featuresArrayTR = featuresTextTR
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const featuresArrayEN = featuresTextEN
      .split('\n')
      .map(f => f.trim())
      .filter(f => f.length > 0);

    // Anayasa Kuralı 2: Kullanıcı boş bırakırsa otomatik üret, doluysa sizin yazdığınız slug'ı strictly kilitle
    const cleanSlugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-');
    const finalSlugTR = slugTR.trim() || cleanSlugify(titleTR);
    const finalSlugEN = slugEN.trim() || (titleEN.trim() ? cleanSlugify(titleEN) : cleanSlugify(titleTR) + '-en');

    // Otomatik çeviri motorları tamamen bypass edildi; tamamen el işçiliği veri nesnesi inşa ediliyor
    const payloadData = {
      title: titleTR,
      sector: sectorTR,
      slug: finalSlugTR, // Legacy/Geriye dönük uyumluluk köprüsü
      slug_tr: finalSlugTR,
      slug_en: finalSlugEN,
      tagline: taglineTR,
      description: descTR,
      priceEconomicTRY: Number(priceEconomicTRY),
      priceProfessionalTRY: Number(priceProfessionalTRY),
      features: featuresArrayTR.length > 0 ? featuresArrayTR : ['WhatsApp Entegrasyonu', 'Hızlı Açılış', 'Mobil Uyum'],
      coverImage: coverImage || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=70',
      videoUrl,
      badge: badgeTR,
      demoType,
      isFeaturedInMegaMenu,
      active,
      translations: {
        tr: {
          title: titleTR,
          sector: sectorTR,
          tagline: taglineTR,
          description: descTR,
          badge: badgeTR,
          features: featuresArrayTR.length > 0 ? featuresArrayTR : ['WhatsApp Entegrasyonu', 'Hızlı Açılış', 'Mobil Uyum'],
        },
        en: {
          title: titleEN.trim() || titleTR,
          sector: sectorEN.trim() || sectorTR,
          tagline: taglineEN.trim() || taglineTR,
          description: descEN.trim() || descTR,
          badge: badgeEN.trim() || badgeTR,
          features: featuresArrayEN.length > 0 ? featuresArrayEN : featuresArrayTR,
        },
      },
    };

    if (editingId) {
      updateProduct(editingId, payloadData);
      resetForm();
    } else {
      const res = addProduct({
        ...payloadData,
        galleryImages: [],
        deliveryDays: 2,
      });

      if (!res.success) {
        setFormError(res.error || 'Ürün eklenemedi.');
        return;
      }
      resetForm();
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Status Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-900 border border-neutral-800">
        <div>
          <h3 className="text-base font-bold text-white font-display">Hazır Siteler Kataloğu Yönetimi</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Maksimum 10 hazır site portföyü kuralı aktiftir. Şu an:{' '}
            <span className="font-bold text-amber-400">{products?.length || 0} / 10 site</span>
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => {
              if (products?.length >= 10) {
                alert('Maksimum 10 hazır site sınırına ulaşıldı. Yeni eklemek için mevcut bir siteyi silmelisiniz.');
                return;
              }
              resetForm();
              setIsEditing(true);
            }}
            disabled={products?.length >= 10}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              products?.length >= 10
                ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                : 'bg-white text-neutral-950 hover:bg-neutral-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Hazır Site Ekle</span>
          </button>
        )}
      </div>

      {/* Full CRUD Multi-Language Form Window */}
      {isEditing && (
        <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-700 shadow-xl space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <h4 className="text-sm font-bold text-white">
              {editingId ? 'Hazır Siteyi Düzenle (Full CRUD)' : 'Yeni Hazır Site Ekle (Full CRUD)'}
            </h4>
            <button type="button" onClick={resetForm} className="text-xs text-neutral-400 hover:text-white cursor-pointer">
              Vazgeç
            </button>
          </div>

          {formError && (
            <div className="p-3 text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* TR BÖLÜMÜ / TURKISH CONTENT NODE */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
                🇹🇷 TÜRKÇE İÇERİK YÖNETİMİ (EL İŞÇİLİĞİ)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Site Başlığı (TR) *</label>
                  <input
                    type="text"
                    required
                    value={titleTR}
                    onChange={e => setTitleTR(e.target.value)}
                    placeholder="Örn: Aura Dental Klinik"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Sektör / Kategori (TR) *</label>
                  <input
                    type="text"
                    required
                    value={sectorTR}
                    onChange={e => setSectorTR(e.target.value)}
                    placeholder="Örn: Sağlık & Klinik"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Rozet / Etiket (TR)</label>
                  <input
                    type="text"
                    value={badgeTR}
                    onChange={e => setBadgeTR(e.target.value)}
                    placeholder="Örn: Popüler"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Kısa Slogan / Tagline (TR)</label>
                  <input
                    type="text"
                    value={taglineTR}
                    onChange={e => setTaglineTR(e.target.value)}
                    placeholder="Hasta randevu akışını artıran..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Düzenlenebilir Dinamik Link (slug_tr)</label>
                  <input
                    type="text"
                    value={slugTR}
                    onChange={e => setSlugTR(e.target.value)}
                    placeholder="Örn: aura-dental-klinik"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-emerald-400 font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* EN BÖLÜMÜ / ENGLISH CONTENT NODE */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider border-b border-neutral-800 pb-2">
                🇺🇸 ENGLISH CONTENT MANAGEMENT (MANUAL CODES)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Site Title (EN)</label>
                  <input
                    type="text"
                    value={titleEN}
                    onChange={e => setTitleEN(e.target.value)}
                    placeholder="Eg: Aura Dental Clinic"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Sector / Category (EN)</label>
                  <input
                    type="text"
                    value={sectorEN}
                    onChange={e => setSectorEN(e.target.value)}
                    placeholder="Eg: Health & Medical"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Badge / Tag (EN)</label>
                  <input
                    type="text"
                    value={badgeEN}
                    onChange={e => setBadgeEN(e.target.value)}
                    placeholder="Eg: Popular"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Short Tagline (EN)</label>
                  <input
                    type="text"
                    value={taglineEN}
                    onChange={e => setTaglineEN(e.target.value)}
                    placeholder="A prestigious clinic website..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Editable Dynamic Link (slug_en)</label>
                  <input
                    type="text"
                    value={slugEN}
                    onChange={e => setSlugEN(e.target.value)}
                    placeholder="Eg: aura-dental-clinic-en"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-amber-400 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Demo & Simulation Types */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Demo Türü (İnteraktif Simülasyon)</label>
                <select
                  value={demoType}
                  onChange={e => setDemoType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="medical">Klinik & Sağlık (Randevu Simülatörü)</option>
                  <option value="law">Hukuk & Danışmanlık (Danışma Formu)</option>
                  <option value="restaurant">Restoran & Kafe (Rezervasyon & QR Menü)</option>
                  <option value="architecture">Mimarlık & İnşaat (Portföy & Proje)</option>
                  <option value="logistics">Lojistik (Navlun Hesaplayıcı)</option>
                  <option value="ecommerce">Butik E-Ticaret (WhatsApp Sipariş)</option>
                  <option value="realestate">Gayrimenkul (Mülk Listeleme)</option>
                  <option value="fitness">Spor Salonu (Ders Programı)</option>
                  <option value="portfolio">Kişisel & Ajans Portföy</option>
                  <option value="custom">Özel Şablon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Ekonomik Fiyat (TL) - Yönetim Bizde</label>
                <input
                  type="number"
                  value={priceEconomicTRY}
                  onChange={e => setPriceEconomicTRY(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white font-mono text-emerald-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Profesyonel CMS Fiyat (TL) - Müşteri Yönetimli</label>
                <input
                  type="number"
                  value={priceProfessionalTRY}
                  onChange={e => setPriceProfessionalTRY(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white font-mono text-amber-400 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Description & Separate Localized Features */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Açıklama / Detaylar (TR)</label>
                  <textarea
                    rows={4}
                    value={descTR}
                    onChange={e => setDescTR(e.target.value)}
                    placeholder="Türkçe detaylar..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Description / Details (EN)</label>
                  <textarea
                    rows={4}
                    value={descEN}
                    onChange={e => setDescEN(e.target.value)}
                    placeholder="English details..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Özellikler TR (Her satıra bir özellik)</label>
                  <textarea
                    rows={4}
                    value={featuresTextTR}
                    onChange={e => setFeaturesTextTR(e.target.value)}
                    placeholder={'WhatsApp Randevu Sistemi\nHızlı Açılış'}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Features EN (One feature per line)</label>
                  <textarea
                    rows={4}
                    value={featuresTextEN}
                    onChange={e => setFeaturesTextEN(e.target.value)}
                    placeholder={'WhatsApp Appointment System\nHigh Performance'}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Media Blocks */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-400">Kapak Görseli</label>
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setImageUploadType('url')}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        imageUploadType === 'url' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadType('local')}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        imageUploadType === 'local' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Lokal Dosya
                    </button>
                  </div>
                </div>
                {imageUploadType === 'url' ? (
                  <input
                    type="url"
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                  />
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLocalImageUpload}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-neutral-800 file:text-white cursor-pointer"
                  />
                )}
                {coverImage && (
                  <div className="mt-2 w-24 h-16 rounded overflow-hidden border border-neutral-700 bg-neutral-800">
                    <img src={coverImage} alt="Önizleme" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-neutral-400">Tanıtım Videosu</label>
                  <div className="flex gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setVideoUploadType('url')}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        videoUploadType === 'url' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoUploadType('local')}
                      className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                        videoUploadType === 'local' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      Lokal Dosya
                    </button>
                  </div>
                </div>
                {videoUploadType === 'url' ? (
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/... veya .mp4 linki"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-white focus:border-amber-500 focus:outline-none"
                  />
                ) : (
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleLocalVideoUpload}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-300 file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-neutral-800 file:text-white cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* Toggles & Submit Action Controls */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeaturedInMegaMenu}
                  onChange={e => setIsFeaturedInMegaMenu(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-0"
                />
                <span>Mega Menüde Öne Çıkar (Maksimum 4 adet)</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={e => setActive(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-950 text-emerald-500 focus:ring-0"
                />
                <span className="font-bold text-emerald-400">Sitede Aktif / Yayında (%100 Senkronizasyon)</span>
              </label>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-neutral-800">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-black bg-white hover:bg-neutral-200 rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                {editingId ? 'Değişiklikleri Kaydet' : 'Hazır Siteyi Ekle'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 text-xs text-neutral-400 hover:text-white cursor-pointer transition-colors"
              >
                Vazgeç
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Existing Products Data List Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/40">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Mevcut Hazır Siteler ({products?.length || 0})
          </span>
        </div>

        <div className="divide-y divide-neutral-800">
          {products?.map((product: TurnkeyProduct) => {
            const lang = currentLang || 'tr';
            const displayTitle = product.translations?.[lang]?.title || product.title;
            const displaySector = product.translations?.[lang]?.sector || product.sector;
            return (
              <div
                key={product.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-800/30 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-16 h-12 rounded-lg bg-neutral-800 overflow-hidden shrink-0 border border-neutral-700">
                    <img src={product.coverImage} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-white truncate max-w-xs">{displayTitle}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 font-medium">
                        {displaySector}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {formatPrice(product.priceEconomicTRY)}
                      </span>
                      {!product.active && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase tracking-wider">
                          Gizli / Pasif
                        </span>
                      )}
                      {product.isFeaturedInMegaMenu && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase tracking-wider">
                          Mega Menü
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-1 flex flex-wrap items-center gap-3">
                      <span className="font-mono text-[10px] text-neutral-500">TR Slug: /{product.slug_tr || product.slug}</span>
                      {product.slug_en && (
                        <span className="font-mono text-[10px] text-neutral-500">EN Slug: /{product.slug_en}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Secure CRUD Action Frame Triggers */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => openDemo(product)}
                    className="p-2 text-neutral-400 hover:text-cyan-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Demo Simülasyonu Aç"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openStandaloneSite(product)}
                    className="p-2 text-neutral-400 hover:text-emerald-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Tam Sayfa Demo Aç"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => startEdit(product)}
                    className="p-2 text-neutral-400 hover:text-amber-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Düzenle (Edit)"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`"${displayTitle}" sitesini silmek istediğinize emin misiniz?`)) {
                        deleteProduct(product.id);
                      }
                    }}
                    className="p-2 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                    title="Sil (Delete)"
                  >
                    <Trash2 className="w-4 h-4" />
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

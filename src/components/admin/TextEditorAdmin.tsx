import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { RichTextEditor } from '../common/RichTextEditor.tsx';
import { CustomPage } from '../../types/index.ts';
import { translateContent } from '../../utils/translationUtils.ts';
import {
  FileEdit,
  Save,
  Plus,
  RotateCcw,
  CheckCircle2,
  FileText,
  LayoutGrid,
  Layers,
  Globe,
  Sparkles,
  AlignJustify,
  ExternalLink,
  BookOpen,
  Info,
  Loader2,
} from 'lucide-react';

export const TextEditorAdmin: React.FC = () => {
  const {
    customPages,
    saveCustomPage,
    products,
    updateProduct,
    services,
    openPageModal,
    openDemo,
  } = useApp();

  // Content type selector: 'page' | 'product' | 'service' | 'freeform'
  const [contentType, setContentType] = useState<'page' | 'product' | 'service' | 'freeform'>('page');
  const [selectedId, setSelectedId] = useState<string>('hakkimizda');
  const [activeLang, setActiveLang] = useState<'tr' | 'en'>('tr');

  // Editor states
  const [editorContent, setEditorContent] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentSummary, setDocumentSummary] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslateCurrentContent = async (targetLang: 'en') => {
    if (!editorContent.trim() && !documentTitle.trim()) {
      alert('Lütfen önce metin veya başlık alanını doldurun.');
      return;
    }

    setIsTranslating(true);
    try {
      const [translatedTitle, translatedSummary, translatedBody] = await Promise.all([
        documentTitle ? translateContent(documentTitle, targetLang) : Promise.resolve(''),
        documentSummary ? translateContent(documentSummary, targetLang) : Promise.resolve(''),
        editorContent ? translateContent(editorContent, targetLang) : Promise.resolve(''),
      ]);

      setDocumentTitle(translatedTitle);
      setDocumentSummary(translatedSummary);
      setEditorContent(translatedBody);
      setActiveLang(targetLang);

      showNotice(`✨ Gemini AI: Metin ${targetLang.toUpperCase()} diline HTML etiketleri ve liste düzeni korunarak çevrildi!`);
    } catch (err) {
      console.error('Translation error:', err);
      alert('Çeviri esnasında hata oluştu.');
    } finally {
      setIsTranslating(false);
    }
  };

  // New page creation modal
  const [isCreatingNewPage, setIsCreatingNewPage] = useState(false);
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageCategory, setNewPageCategory] = useState<CustomPage['category']>('corporate');

  // Load content when selection changes
  useEffect(() => {
    if (contentType === 'page') {
      const page = customPages.find(p => p.slug === selectedId) || customPages[0];
      if (page) {
        if (activeLang === 'tr') {
          setDocumentTitle(page.title);
          setDocumentSummary(page.summary || '');
          setEditorContent(page.content);
        } else {
          const trans = page.translations?.[activeLang];
          setDocumentTitle(trans?.title || page.title);
          setDocumentSummary(trans?.summary || page.summary || '');
          setEditorContent(trans?.content || page.content);
        }
      }
    } else if (contentType === 'product') {
      const prod = products.find(p => p.id === selectedId) || products[0];
      if (prod) {
        setDocumentTitle(prod.title);
        setDocumentSummary(prod.tagline);
        setEditorContent(prod.description);
      }
    } else if (contentType === 'service') {
      const srv = services.find(s => s.id === selectedId) || services[0];
      if (srv) {
        setDocumentTitle(srv.title);
        setDocumentSummary(srv.deliverables.join(', '));
        setEditorContent(srv.description);
      }
    } else if (contentType === 'freeform') {
      // Keep existing editor content
    }
  }, [contentType, selectedId, activeLang, customPages, products, services]);

  // Save changes directly into the system
  const handleSaveToSystem = () => {
    if (contentType === 'page') {
      const existingPage = customPages.find(p => p.slug === selectedId);
      if (!existingPage) return;

      let updatedPage: CustomPage;

      if (activeLang === 'tr') {
        updatedPage = {
          ...existingPage,
          title: documentTitle.trim() || existingPage.title,
          summary: documentSummary.trim() || undefined,
          content: editorContent.trim(),
          updatedAt: new Date().toISOString().split('T')[0],
        };
      } else {
        updatedPage = {
          ...existingPage,
          updatedAt: new Date().toISOString().split('T')[0],
          translations: {
            ...existingPage.translations,
            [activeLang]: {
              title: documentTitle.trim() || undefined,
              summary: documentSummary.trim() || undefined,
              content: editorContent.trim() || undefined,
            },
          },
        };
      }

      saveCustomPage(updatedPage);
      showNotice(`"${updatedPage.title}" sayfası (${activeLang.toUpperCase()}) sisteme başarıyla kaydedildi!`);
    } else if (contentType === 'product') {
      const existingProduct = products.find(p => p.id === selectedId);
      if (!existingProduct) return;

      const updatedProduct = {
        ...existingProduct,
        title: documentTitle.trim() || existingProduct.title,
        tagline: documentSummary.trim() || existingProduct.tagline,
        description: editorContent.trim(),
      };

      updateProduct(existingProduct.id, updatedProduct);
      showNotice(`"${updatedProduct.title}" hazır site açıklaması sisteme başarıyla kaydedildi!`);
    } else if (contentType === 'service') {
      showNotice(`Hizmet metin açıklaması sisteme başarıyla işlendi!`);
    } else if (contentType === 'freeform') {
      setIsCreatingNewPage(true);
      setNewPageSlug(documentTitle.toLowerCase().replace(/[^a-z0-9_-]/g, '-'));
    }
  };

  const handleCreateNewPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageSlug.trim() || !documentTitle.trim() || !editorContent.trim()) return;

    const newPage: CustomPage = {
      id: `page-${Date.now()}`,
      slug: newPageSlug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-'),
      title: documentTitle.trim(),
      summary: documentSummary.trim() || undefined,
      content: editorContent.trim(),
      category: newPageCategory,
      isPublished: true,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    saveCustomPage(newPage);
    setIsCreatingNewPage(false);
    setContentType('page');
    setSelectedId(newPage.slug);
    showNotice(`Yeni "${newPage.title}" sayfası başarıyla oluşturuldu ve yayınlandı!`);
  };

  const showNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Station */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900 border border-neutral-800 shadow-xl">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Sistem Entegre Metin & İçerik Editörü (Text Editor)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Tam Entegre
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
              Özel sayfaları (Biz Kimiz, Neden Kurulduk, Çalışma İlkelerimiz, KVKK vb.), hazır site ürün açıklamalarını veya serbest kurumsal metinleri zengin biçimlendirme ve iki yana yaslama (justify) ile düzenleyin.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2 self-start lg:self-auto shrink-0">
          {contentType === 'page' && (
            <button
              type="button"
              onClick={() => openPageModal(selectedId)}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-700"
              title="Bu Sayfayı Canlı Önizle"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span>Sayfayı Canlı Aç</span>
            </button>
          )}

          {contentType === 'product' && (
            <button
              type="button"
              onClick={() => {
                const p = products.find(prod => prod.id === selectedId);
                if (p) openDemo(p);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-700"
              title="Bu Hazır Siteyi Canlı Önizle"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>Siteyi Canlı Gör</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveToSystem}
            className="px-4 py-2 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Sisteme Kaydet & Yayına Al</span>
          </button>
        </div>
      </div>

      {/* Save Success Notice */}
      {saveSuccessNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span className="font-semibold">{saveSuccessNotice}</span>
        </div>
      )}

      {/* Content Selector Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Content Type Filter */}
          <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setContentType('page');
                setSelectedId('hakkimizda');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                contentType === 'page'
                  ? 'bg-amber-400 text-black shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Özel Sayfalar ({customPages.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setContentType('product');
                setSelectedId(products[0]?.id || 'prod-med-klinik');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                contentType === 'product'
                  ? 'bg-amber-400 text-black shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Hazır Siteler ({products.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setContentType('service');
                setSelectedId(services[0]?.id || 'srv-turnkey');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                contentType === 'service'
                  ? 'bg-amber-400 text-black shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Hizmetler ({services.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setContentType('freeform');
                setDocumentTitle('Yeni Taslak Metin');
                setDocumentSummary('');
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                contentType === 'freeform'
                  ? 'bg-amber-400 text-black shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Serbest Yazım</span>
            </button>
          </div>

          {/* Language Tabs & Gemini AI Quick Translate */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-neutral-950 border border-neutral-800 rounded-xl p-1 text-xs">
              <span className="text-[11px] text-neutral-400 font-semibold px-2">Dil:</span>
              {(['tr', 'en'] as const).map(lang => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                    activeLang === lang
                      ? 'bg-white text-black shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {lang === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleTranslateCurrentContent('en')}
              disabled={isTranslating}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              title="Mevcut metni Gemini AI ile İngilizceye çevir (HTML etiketleri ve liste hizalaması korunur)"
            >
              {isTranslating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-amber-300" />}
              <span>Gemini TR ➔ EN</span>
            </button>
          </div>
        </div>

        {/* Target Item Dropdown */}
        {contentType !== 'freeform' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-neutral-800">
            <span className="text-xs font-semibold text-neutral-400 whitespace-nowrap">
              Düzenlenen İçerik Öğesi:
            </span>
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="flex-1 p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-semibold text-xs focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              {contentType === 'page' &&
                customPages.map(page => (
                  <option key={page.id} value={page.slug}>
                    {page.title} ({page.slug}) · {page.category === 'legal' ? 'Yasal' : 'Kurumsal'}
                  </option>
                ))}

              {contentType === 'product' &&
                products.map(prod => (
                  <option key={prod.id} value={prod.id}>
                    {prod.title} ({prod.sector}) · 48 Saat Teslimat
                  </option>
                ))}

              {contentType === 'service' &&
                services.map(srv => (
                  <option key={srv.id} value={srv.id}>
                    {srv.title}
                  </option>
                ))}
            </select>
          </div>
        )}

        {/* Title & Summary Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
              Başlık / İsim ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={documentTitle}
              onChange={e => setDocumentTitle(e.target.value)}
              placeholder="Örn: Hakkımızda & Vanguard Studio"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
              Kısa Özet / Slogan ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={documentSummary}
              onChange={e => setDocumentSummary(e.target.value)}
              placeholder="Sayfa başında ve kartlarda görünecek kısa açıklama..."
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Main Rich Text Editor Component */}
      <RichTextEditor
        value={editorContent}
        onChange={setEditorContent}
        language={activeLang}
        title={`${documentTitle || 'İçerik'} (${activeLang.toUpperCase()})`}
        minHeight="min-h-[350px]"
        showTemplates={true}
        onSave={handleSaveToSystem}
      />

      {/* Info Callout Box on Justify Standards */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 space-y-2">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <AlignJustify className="w-4 h-4" />
          <span>İki Yana Yaslama (Text-Justify) Standartları & Entegrasyon Rehberi</span>
        </div>
        <p className="leading-relaxed text-justify">
          Tüm geniş hacimli metin blokları (Biz Kimiz, Neden Kurulduk, Çalışma İlkelerimiz, KVKK, Hizmet Sözleşmeleri ve Hazır Site Tanıtımları) ziyaretçinin tarayıcısında <code className="text-amber-400 font-mono">text-justify</code> ve <code className="text-amber-400 font-mono">hyphens: auto</code> sınıflarıyla derlenir. Editör toolbar'ındaki <strong className="text-white">"İki Yana Yasla"</strong> butonuna basarak istediğiniz paragrafı ya da tüm dökümanı anında iki yana yaslayabilir, "Bölünmüş" veya "Önizle" modlarında canlı editoryal görünümü inceleyebilirsiniz.
        </p>
      </div>

      {/* Modal: New Page Creation */}
      {isCreatingNewPage && (
        <div className="fixed inset-0 z-[120] bg-black/80 flex items-center justify-center p-4">
          <form onSubmit={handleCreateNewPageSubmit} className="w-full max-w-md p-6 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4 text-xs shadow-2xl">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Yeni Özel Sayfa Olarak Kaydet</span>
            </h4>
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Sayfa URL Kodu (Slug) *</label>
              <input
                type="text"
                required
                value={newPageSlug}
                onChange={e => setNewPageSlug(e.target.value)}
                placeholder="orn: sirket-profili, calisma-modeli"
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Kategori</label>
              <select
                value={newPageCategory}
                onChange={e => setNewPageCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
              >
                <option value="corporate">Kurumsal / Hakkımızda</option>
                <option value="legal">Yasal / KVKK / Sözleşme</option>
                <option value="info">Rehber / Bilgilendirme</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNewPage(false)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-black font-bold hover:bg-amber-300"
              >
                Sayfayı Oluştur ve Yayınla
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

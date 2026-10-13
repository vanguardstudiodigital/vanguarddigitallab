import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Globe,
  Save,
  X,
  Sparkles,
  Check,
  AlertCircle,
  AlignJustify,
} from 'lucide-react';
import { useApp } from '../../context/AppContext.tsx';
import { FaqItem } from '../../types/index.ts';
import { RichTextEditor } from '../common/RichTextEditor.tsx';
import { RichContentRenderer } from '../common/RichContentRenderer.tsx';

export const FaqAdmin: React.FC = () => {
  const { faqs, addFaq, updateFaq, deleteFaq, reorderFaqs, currentLang } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [previewTab, setPreviewTab] = useState<'list' | 'preview'>('list');
  const [activeLangTab, setActiveLangTab] = useState<'tr' | 'en' | 'ru'>('tr');

  // Form State
  const [formQuestionTR, setFormQuestionTR] = useState('');
  const [formAnswerTR, setFormAnswerTR] = useState('');
  const [formQuestionEN, setFormQuestionEN] = useState('');
  const [formAnswerEN, setFormAnswerEN] = useState('');
  const [formQuestionRU, setFormQuestionRU] = useState('');
  const [formAnswerRU, setFormAnswerRU] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [formOrder, setFormOrder] = useState(1);

  // Filtered & Ordered List
  const filteredFaqs = useMemo(() => {
    let list = [...faqs].sort((a, b) => a.order - b.order);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        f =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q) ||
          f.translations?.en?.question?.toLowerCase().includes(q) ||
          f.translations?.ru?.question?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [faqs, searchQuery]);

  const handleOpenAddModal = () => {
    setEditingFaq(null);
    setIsNew(true);
    setFormQuestionTR('');
    setFormAnswerTR('<p style="text-align: justify;">Soru cevabını buraya zengin metin olarak yazın...</p>');
    setFormQuestionEN('');
    setFormAnswerEN('');
    setFormQuestionRU('');
    setFormAnswerRU('');
    setFormActive(true);
    setFormOrder(faqs.length + 1);
    setActiveLangTab('tr');
  };

  const handleOpenEditModal = (faq: FaqItem) => {
    setEditingFaq(faq);
    setIsNew(false);
    setFormQuestionTR(faq.question || '');
    setFormAnswerTR(faq.answer || '');
    setFormQuestionEN(faq.translations?.en?.question || '');
    setFormAnswerEN(faq.translations?.en?.answer || '');
    setFormQuestionRU(faq.translations?.ru?.question || '');
    setFormAnswerRU(faq.translations?.ru?.answer || '');
    setFormActive(faq.active);
    setFormOrder(faq.order);
    setActiveLangTab('tr');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestionTR.trim()) {
      alert('Lütfen Türkçe soru başlığını doldurun.');
      return;
    }

    const translations: FaqItem['translations'] = {};
    if (formQuestionEN.trim() || formAnswerEN.trim()) {
      translations.en = {
        question: formQuestionEN.trim(),
        answer: formAnswerEN,
      };
    }
    if (formQuestionRU.trim() || formAnswerRU.trim()) {
      translations.ru = {
        question: formQuestionRU.trim(),
        answer: formAnswerRU,
      };
    }

    if (isNew) {
      addFaq({
        question: formQuestionTR.trim(),
        answer: formAnswerTR,
        order: Number(formOrder) || faqs.length + 1,
        active: formActive,
        translations: Object.keys(translations).length > 0 ? translations : undefined,
      });
    } else if (editingFaq) {
      updateFaq(editingFaq.id, {
        question: formQuestionTR.trim(),
        answer: formAnswerTR,
        order: Number(formOrder) || editingFaq.order,
        active: formActive,
        translations: Object.keys(translations).length > 0 ? translations : undefined,
      });
    }

    setEditingFaq(null);
    setIsNew(false);
  };

  const handleDelete = (id: string, question: string) => {
    if (window.confirm(`"${question}" sorusunu silmek istediğinize emin misiniz?`)) {
      deleteFaq(id);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const sorted = [...faqs].sort((a, b) => a.order - b.order);
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sorted.length) return;

    const temp = sorted[index];
    sorted[index] = sorted[targetIdx];
    sorted[targetIdx] = temp;

    reorderFaqs(sorted);
  };

  const toggleActiveStatus = (faq: FaqItem) => {
    updateFaq(faq.id, { active: !faq.active });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900/90 border border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Sıkça Sorulan Sorular (FAQ / SSS) Yönetimi
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Müşterilerinize görünecek akordeon SSS içeriklerini ekleyin, zengin metin düzenleyin ve Türkçe/İngilizce/Rusça yerelleştirin.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setPreviewTab(prev => (prev === 'list' ? 'preview' : 'list'))}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer border ${
              previewTab === 'preview'
                ? 'bg-amber-400 text-black border-amber-400 font-bold'
                : 'bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{previewTab === 'preview' ? 'Yönetim Listesine Dön' : 'Canlı SSS Önizlemesi'}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 text-xs font-bold text-black bg-emerald-400 hover:bg-emerald-300 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Soru Ekle</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Live Accordion Preview Tab */}
      {previewTab === 'preview' ? (
        <div className="p-6 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Son Kullanıcı SSS Görünümü Önizleme Paneli</span>
            </span>
            <span className="text-[11px] text-neutral-400">
              Aktif Soru Sayısı: <strong className="text-emerald-400">{faqs.filter(f => f.active).length}</strong>
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {faqs
              .filter(f => f.active)
              .sort((a, b) => a.order - b.order)
              .map((faq, idx) => (
                <details
                  key={faq.id}
                  className="group rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden"
                  open={idx === 0}
                >
                  <summary className="p-4 cursor-pointer font-bold text-sm text-neutral-200 hover:text-amber-300 flex items-center justify-between">
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                  </summary>
                  <div className="p-4 pt-2 border-t border-neutral-800 text-neutral-300 text-xs sm:text-sm">
                    <RichContentRenderer content={faq.answer} className="text-justify" />
                  </div>
                </details>
              ))}
          </div>
        </div>
      ) : (
        /* Mode 2: FAQ Items Admin List */
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Sorularda ve cevaplarda arayın..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* List Table */}
          <div className="rounded-2xl bg-neutral-900/90 border border-neutral-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-950/80 text-neutral-400 border-b border-neutral-800 uppercase font-mono tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">Sıra</th>
                    <th className="py-3.5 px-4">Soru (Türkçe)</th>
                    <th className="py-3.5 px-4 w-32 text-center">Çeviri Durumu</th>
                    <th className="py-3.5 px-4 w-28 text-center">Durum</th>
                    <th className="py-3.5 px-4 w-44 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60">
                  {filteredFaqs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-neutral-500">
                        {searchQuery ? 'Aramanıza uygun SSS maddesi bulunamadı.' : 'Henüz SSS eklenmemiş.'}
                      </td>
                    </tr>
                  ) : (
                    filteredFaqs.map((faq, index) => {
                      const hasEN = Boolean(faq.translations?.en?.question);
                      const hasRU = Boolean(faq.translations?.ru?.question);

                      return (
                        <tr key={faq.id} className="hover:bg-neutral-800/40 transition-colors">
                          {/* Order Index & Position Controls */}
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-amber-400">
                            <div className="flex items-center justify-center gap-1">
                              <span>#{faq.order}</span>
                              <div className="flex flex-col gap-0.5 ml-1">
                                <button
                                  type="button"
                                  disabled={index === 0}
                                  onClick={() => handleMove(index, 'up')}
                                  className="p-0.5 rounded text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                  title="Yukarı Taşı"
                                >
                                  <ArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={index === filteredFaqs.length - 1}
                                  onClick={() => handleMove(index, 'down')}
                                  className="p-0.5 rounded text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                                  title="Aşağı Taşı"
                                >
                                  <ArrowDown className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Question Title & Answer Preview */}
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white text-sm line-clamp-1">{faq.question}</div>
                            <div className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">
                              {faq.answer.replace(/<[^>]*>/g, '')}
                            </div>
                          </td>

                          {/* Translations Badges */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  hasEN ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' : 'bg-neutral-800 text-neutral-600'
                                }`}
                              >
                                EN
                              </span>
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  hasRU ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-neutral-800 text-neutral-600'
                                }`}
                              >
                                RU
                              </span>
                            </div>
                          </td>

                          {/* Active / Inactive Status */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => toggleActiveStatus(faq)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                                faq.active
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                              }`}
                            >
                              {faq.active ? (
                                <>
                                  <CheckCircle2 className="w-3 h-3" />
                                  <span>Yayında</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3 h-3" />
                                  <span>Pasif</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(faq)}
                                className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30 font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Düzenle</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(faq.id, faq.question)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors cursor-pointer"
                                title="Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit FAQ Modal */}
      {(isNew || editingFaq) && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0c0e14] text-neutral-100 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-30 shrink-0 flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#0c0e14]/95 backdrop-blur-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    {isNew ? 'Yeni SSS Maddesi Ekle' : 'SSS Maddesini Düzenle'}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Soru başlığı ve zengin metin düzenleyici ile biçimlendirilmiş cevap metni hazırlayın.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingFaq(null);
                  setIsNew(false);
                }}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body & Multilingual Tabs */}
            <form onSubmit={handleSave} className="flex-1 flex flex-col overflow-y-auto p-6 space-y-6">
              {/* Language Switch Tabs */}
              <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-900 border border-neutral-800 w-fit">
                <button
                  type="button"
                  onClick={() => setActiveLangTab('tr')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeLangTab === 'tr'
                      ? 'bg-amber-400 text-black shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>🇹🇷 Türkçe (Varsayılan)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeLangTab === 'en'
                      ? 'bg-amber-400 text-black shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>🇬🇧 English</span>
                  {formQuestionEN && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLangTab('ru')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeLangTab === 'ru'
                      ? 'bg-amber-400 text-black shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <span>🇷🇺 Русский</span>
                  {formQuestionRU && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </button>
              </div>

              {/* TR Tab */}
              {activeLangTab === 'tr' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Soru (Türkçe) <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formQuestionTR}
                      onChange={e => setFormQuestionTR(e.target.value)}
                      placeholder="Örn: Hazır web siteleri kaç saat içinde teslim edilir?"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-neutral-300">
                        Cevap Metni (Zengin Metin Editörü - Zengin Biçimlendirme & İki Yana Yaslama)
                      </label>
                      <span className="text-[11px] text-amber-400 font-mono flex items-center gap-1">
                        <AlignJustify className="w-3 h-3" />
                        <span>text-justify aktif</span>
                      </span>
                    </div>

                    <RichTextEditor
                      value={formAnswerTR}
                      onChange={setFormAnswerTR}
                      minHeight="min-h-[220px]"
                      placeholder="Cevap metnini biçimlendirerek yazın..."
                    />
                  </div>
                </div>
              )}

              {/* EN Tab */}
              {activeLangTab === 'en' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Question (English)
                    </label>
                    <input
                      type="text"
                      value={formQuestionEN}
                      onChange={e => setFormQuestionEN(e.target.value)}
                      placeholder="e.g. How fast are turnkey websites delivered?"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Answer (English Rich Text)
                    </label>
                    <RichTextEditor
                      value={formAnswerEN}
                      onChange={setFormAnswerEN}
                      minHeight="min-h-[200px]"
                      placeholder="Write the English response with formatting..."
                    />
                  </div>
                </div>
              )}

              {/* RU Tab */}
              {activeLangTab === 'ru' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Вопрос (Русский)
                    </label>
                    <input
                      type="text"
                      value={formQuestionRU}
                      onChange={e => setFormQuestionRU(e.target.value)}
                      placeholder="Например: Как быстро сдаются готовые сайты?"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                      Ответ (Русский Форматированный Текст)
                    </label>
                    <RichTextEditor
                      value={formAnswerRU}
                      onChange={setFormAnswerRU}
                      minHeight="min-h-[200px]"
                      placeholder="Введите ответ на русском языке..."
                    />
                  </div>
                </div>
              )}

              {/* General Controls: Active Checkbox & Order Index */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-800">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Görüntülenme Sırası
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formOrder}
                    onChange={e => setFormOrder(Number(e.target.value))}
                    className="w-full px-4 py-2 text-xs rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={e => setFormActive(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 text-amber-400 focus:ring-amber-400 bg-neutral-900"
                    />
                    <span className="text-xs font-bold text-white">
                      Bu soruyu web sitesinde yayına al (Aktif Durum)
                    </span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setEditingFaq(null);
                    setIsNew(false);
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 rounded-xl cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  <Save className="w-4 h-4" />
                  <span>{isNew ? 'Kaydet & Yayına Al' : 'Soru Değişikliklerini Kaydet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

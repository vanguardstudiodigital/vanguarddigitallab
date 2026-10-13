import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Quote,
  Link as LinkIcon,
  Minus,
  Sparkles,
  Undo2,
  Redo2,
  Copy,
  Check,
  Download,
  Eye,
  Edit3,
  FileCode,
  Clock,
  BookOpen,
  Eraser,
  CheckCircle2,
  AlertTriangle,
  Unlink,
} from 'lucide-react';
import { stripHtml, cleanAndNormalizeRichText } from '../../utils/richTextRenderer.ts';
import { RichContentRenderer } from './RichContentRenderer.tsx';

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  title?: string;
  language?: 'tr' | 'en' | 'ru';
  onSave?: () => void;
  showTemplates?: boolean;
  compact?: boolean;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'İçeriğinizi buraya yazın veya üstteki zengin metin araçlarını kullanın...',
  minHeight = 'min-h-[220px]',
  title,
  language = 'tr',
  onSave,
  showTemplates = true,
  compact = false,
  className = '',
}) => {
  // Görünüm modları: 'visual' (WYSIWYG) | 'preview' (Önizleme) | 'code' (HTML Kaynak Kodu)
  const [viewMode, setViewMode] = useState<'visual' | 'preview' | 'code'>('visual');
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Link Modalı Durumu
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  // Editor ref & İçerik senkronizasyonu
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Normalize edilmiş ilk değer
  const initialHtml = useMemo(() => {
    return cleanAndNormalizeRichText(value || '');
  }, []);

  // HTML Kod Modu için yerel state
  const [rawHtmlCode, setRawHtmlCode] = useState(initialHtml);

  // Editör DOM'una dışarıdan gelen value değiştiğinde bas (kullanıcı yazarken cursor zıplamasın)
  useEffect(() => {
    const normalized = cleanAndNormalizeRichText(value || '');
    setRawHtmlCode(normalized);

    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== normalized) {
        editorRef.current.innerHTML = normalized || '';
      }
    }
    isInternalChange.current = false;
  }, [value]);

  // İlk açılışta içeriği yükle
  useEffect(() => {
    if (editorRef.current && initialHtml) {
      editorRef.current.innerHTML = initialHtml;
    }
  }, [initialHtml]);

  // Değişikliği üst bileşene bildir
  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    const currentHtml = editorRef.current.innerHTML;
    setRawHtmlCode(currentHtml);
    onChange(currentHtml);
  }, [onChange]);

  // Kod modundan geri dönüldüğünde veya kod modunda yazıldığında
  const handleRawCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setRawHtmlCode(newCode);
    isInternalChange.current = false;
    onChange(newCode);
  };

  // Komut çalıştırma (execCommand + CSS stilleri)
  const execCmd = (command: string, cmdValue: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, cmdValue);
    handleContentChange();
  };

  // Blok Başlığı Biçimlendirme (H1, H2, H3, P)
  const formatBlock = (tag: 'h1' | 'h2' | 'h3' | 'p') => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('formatBlock', false, `<${tag}>`);
    handleContentChange();
  };

  // Metin Hizalama (Özellikle İKİ YANA YASLAMA - JUSTIFY)
  const alignText = (alignment: 'justify' | 'left' | 'center' | 'right') => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    if (alignment === 'justify') {
      document.execCommand('justifyFull', false);
    } else if (alignment === 'center') {
      document.execCommand('justifyCenter', false);
    } else if (alignment === 'right') {
      document.execCommand('justifyRight', false);
    } else {
      document.execCommand('justifyLeft', false);
    }

    // Seçili blokların style'larını standardize et
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const parentBlock = selection.anchorNode?.parentElement?.closest('p, div, h1, h2, h3, li, blockquote');
      if (parentBlock && parentBlock instanceof HTMLElement) {
        parentBlock.style.textAlign = alignment;
      }
    }

    handleContentChange();
  };

  // TÜM METNİ İKİ YANA YASLA (Hızlı Aksiyon)
  const justifyAllContent = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const paragraphs = editorRef.current.querySelectorAll('p, div, li, blockquote');
    if (paragraphs.length > 0) {
      paragraphs.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.textAlign = 'justify';
          el.classList.add('text-justify');
        }
      });
    } else {
      // İçerik tek satırsa tüm kapsayıcıyı ayarla
      document.execCommand('justifyFull', false);
    }

    handleContentChange();
  };

  // Microsoft Word Tipi Girintiyi Artır / Azalt (Indent / Outdent)
  const handleIndent = (direction: 'increase' | 'decrease') => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      if (direction === 'increase') document.execCommand('indent', false);
      else document.execCommand('outdent', false);
      handleContentChange();
      return;
    }

    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;

    const blockSelector = 'p, div, h1, h2, h3, h4, h5, h6, li, blockquote';
    let targetBlocks: HTMLElement[] = [];

    if (container instanceof HTMLElement) {
      const children = container.querySelectorAll(blockSelector);
      if (children.length > 0) {
        targetBlocks = Array.from(children) as HTMLElement[];
      } else {
        const parent = container.closest(blockSelector);
        if (parent && parent instanceof HTMLElement) {
          targetBlocks = [parent];
        }
      }
    } else if (container.parentElement) {
      const parent = container.parentElement.closest(blockSelector);
      if (parent && parent instanceof HTMLElement) {
        targetBlocks = [parent];
      }
    }

    if (targetBlocks.length === 0) {
      if (direction === 'increase') {
        document.execCommand('indent', false);
      } else {
        document.execCommand('outdent', false);
      }
    } else {
      const uniqueBlocks = Array.from(new Set(targetBlocks));
      const stepPx = 32; // 2rem / 32px per indent level

      uniqueBlocks.forEach(block => {
        const currentPad = block.style.paddingLeft || block.style.marginLeft || '0px';
        let currentPx = 0;

        if (currentPad.endsWith('rem')) {
          currentPx = parseFloat(currentPad) * 16;
        } else if (currentPad.endsWith('px')) {
          currentPx = parseFloat(currentPad);
        } else if (currentPad.endsWith('em')) {
          currentPx = parseFloat(currentPad) * 16;
        }

        let newPx = direction === 'increase' ? currentPx + stepPx : currentPx - stepPx;

        if (newPx <= 0) {
          block.style.paddingLeft = '';
          if (block.style.marginLeft === '0px' || block.style.marginLeft === '0rem') {
            block.style.marginLeft = '';
          }
        } else {
          block.style.paddingLeft = `${newPx}px`;
        }
      });
    }

    handleContentChange();
  };

  // Link Ekleme
  const handleOpenLinkModal = () => {
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString() : '';
    setLinkText(selectedText);
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const handleApplyLink = () => {
    if (!linkUrl) {
      setShowLinkModal(false);
      return;
    }

    const formattedUrl = linkUrl.startsWith('http') || linkUrl.startsWith('mailto:') || linkUrl.startsWith('tel:')
      ? linkUrl
      : `https://${linkUrl}`;

    if (editorRef.current) {
      editorRef.current.focus();
    }

    if (linkText) {
      const linkHtml = `<a href="${formattedUrl}" target="_blank" rel="noopener noreferrer" class="text-amber-500 underline font-semibold hover:text-amber-400">${linkText}</a>`;
      document.execCommand('insertHTML', false, linkHtml);
    } else {
      document.execCommand('createLink', false, formattedUrl);
    }

    setShowLinkModal(false);
    handleContentChange();
  };

  const handleRemoveLink = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('unlink', false);
    handleContentChange();
  };

  // Biçimlendirmeyi Temizle & Tüm Düzensizlikleri Otomatik Düzelt (Normalize & Clean)
  const handleClearFormat = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('removeFormat', false);
    const cleaned = cleanAndNormalizeRichText(editorRef.current.innerHTML);
    editorRef.current.innerHTML = cleaned;
    handleContentChange();
  };

  // Yapıştırma Anında Otomatik Temizleme & Düzeltme (Paste Sanitizer)
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const htmlData = e.clipboardData.getData('text/html');
    const textData = e.clipboardData.getData('text/plain');

    let cleaned = '';
    if (htmlData) {
      cleaned = cleanAndNormalizeRichText(htmlData);
    } else if (textData) {
      cleaned = cleanAndNormalizeRichText(textData);
    }

    if (cleaned) {
      document.execCommand('insertHTML', false, cleaned);
    } else if (textData) {
      document.execCommand('insertText', false, textData);
    }
    handleContentChange();
  };

  // Hazır Şablonlar
  const templates = useMemo(() => {
    return [
      {
        id: 'service-intro',
        title: '🏢 Kurumsal Hizmet Tanıtımı',
        html: `<h2 style="text-align: justify;"><strong>Kurumsal Dijital Dönüşüm Hizmetlerimiz</strong></h2>
<p style="text-align: justify;">Vanguard Studio olarak, modern işletmelerin dijital dünyadaki varlığını güçlendirmek amacıyla anahtar teslim web çözümleri, kurumsal kimlik entegrasyonu ve yüksek performanslı bulut altyapıları sunuyoruz. Tüm süreçlerimiz şeffaf, ölçülebilir ve hızlı teslim prensibiyle yönetilmektedir.</p>
<h3 style="text-align: justify;"><strong>Sunduğumuz Temel Avantajlar</strong></h3>
<ul>
  <li style="text-align: justify;"><strong>48 Saatte Hızlı Teslim:</strong> İşletmenizin zaman kaybetmeden dijital pazara adım atmasını sağlıyoruz.</li>
  <li style="text-align: justify;"><strong>Tam Mobil ve SEO Uyumu:</strong> Google algoritmalarına tam entegre, yüksek hızlı altyapı garantisi.</li>
  <li style="text-align: justify;"><strong>Sürekli Teknik Destek:</strong> Yayına alım sonrasında da güvenle işinize odaklanabilmeniz için yanınızdayız.</li>
</ul>`,
      },
      {
        id: 'product-features',
        title: '💎 Ürün & Çözüm Özellikleri',
        html: `<h2 style="text-align: justify;"><strong>Teknik Özellikler ve Donanım Standartları</strong></h2>
<p style="text-align: justify;">Bu hazır çözüm paketi; modern Tailwind CSS mimarisi, React bileşen kütüphanesi ve optimize edilmiş tipografi hiyerarşisiyle tasarlanmıştır. Kullanıcı deneyimini maksimuma çıkaran temiz tasarım prensipleri uygulanmıştır.</p>
<blockquote>
  <p style="text-align: justify;"><em>"Hızlı yüklenen, mobil cihazlarda mükemmel görünen ve dönüşüm oranlarını artıran çağdaş bir dijital vitrin."</em></p>
</blockquote>
<p style="text-align: justify;">Tüm içerikler yönetici panelinden tek tıkla güncellenebilir, çoklu dil desteğiyle küresel müşterilere hitap edebilir.</p>`,
      },
      {
        id: 'terms-policy',
        title: '📋 Hüküm & Şartlar / Sözleşme Maddeleri',
        html: `<h3 style="text-align: justify;"><strong>Hizmet ve Teslimat Koşulları</strong></h3>
<p style="text-align: justify;">İşbu sözleşme kapsamında sunulan hizmetler, sipariş onayından itibaren taahhüt edilen süre zarfında eksiksiz olarak devreye alınacaktır. Müşteri memnuniyeti ve veri güvenliği birincil önceliğimizdir.</p>
<ol>
  <li style="text-align: justify;">Sipariş edilen şablonun alan adına kurulumu ve SSL sertifikasının yapılandırılması.</li>
  <li style="text-align: justify;">Kurumsal içeriklerin, iletişim kanallarının ve ürün kataloglarının yerleştirilmesi.</li>
  <li style="text-align: justify;">Yönetim paneli eğitim dokümantasyonunun teslimi ve yetki devri.</li>
</ol>`,
      },
    ];
  }, []);

  const handleApplyTemplate = (templateHtml: string) => {
    if (editorRef.current) {
      editorRef.current.innerHTML = templateHtml;
      setRawHtmlCode(templateHtml);
      isInternalChange.current = true;
      onChange(templateHtml);
      setShowTemplateMenu(false);
    }
  };

  // İstatistikler (Kelime, Karakter, Süre)
  const stats = useMemo(() => {
    const plainText = stripHtml(rawHtmlCode || value || '');
    const words = plainText.trim() ? plainText.trim().split(/\s+/).length : 0;
    const chars = plainText.length;
    const readMinutes = Math.max(1, Math.ceil(words / 180));
    const hasJustify =
      rawHtmlCode.includes('text-align: justify') ||
      rawHtmlCode.includes('text-justify') ||
      rawHtmlCode.includes('align="justify"');
    return { words, chars, readMinutes, hasJustify };
  }, [rawHtmlCode, value]);

  // Kopyalama fonksiyonları
  const handleCopy = (type: 'html' | 'text') => {
    const textToCopy = type === 'html' ? rawHtmlCode : stripHtml(rawHtmlCode);
    navigator.clipboard.writeText(textToCopy);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // HTML İndirme
  const handleDownload = () => {
    const blob = new Blob([rawHtmlCode], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`w-full rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl flex flex-col ${className}`}>
      {/* Üst Başlık & Mod Seçimi */}
      <div className="px-4 py-3 bg-neutral-950/80 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-neutral-200 tracking-wide">
            {title || (language === 'tr' ? 'Zengin Metin Editörü' : language === 'ru' ? 'Текстовый Редактор' : 'Rich Text Editor')}
          </span>
          <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
            HTML & İki Yana Yaslama
          </span>
        </div>

        {/* Görünüm Modları: Görsel | Önizleme | HTML Kod */}
        <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => setViewMode('visual')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'visual'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Görsel Editör</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'preview'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Canlı Önizleme</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('code')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'code'
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>HTML Kodu</span>
          </button>
        </div>
      </div>

      {/* Ana Toolbar (Yalnızca Görsel Editör Modunda Açık) */}
      {viewMode === 'visual' && (
        <div className="p-2.5 bg-neutral-950/40 border-b border-neutral-800/80 flex flex-wrap items-center gap-1 text-neutral-300 select-none">
          {/* Geri Al / İleri Al */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-neutral-800">
            <button
              type="button"
              onClick={() => execCmd('undo')}
              title="Geri Al (Ctrl+Z)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('redo')}
              title="İleri Al (Ctrl+Y)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Temel Biçimlendirme (Bold, Italic, Underline, Strike) */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-neutral-800">
            <button
              type="button"
              onClick={() => execCmd('bold')}
              title="Kalın (Ctrl+B)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white font-bold transition-colors"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('italic')}
              title="İtalik (Ctrl+I)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white italic transition-colors"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('underline')}
              title="Altı Çizili (Ctrl+U)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white underline transition-colors"
            >
              <Underline className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('strikeThrough')}
              title="Üstü Çizili"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white line-through transition-colors"
            >
              <Strikethrough className="w-4 h-4" />
            </button>
          </div>

          {/* Başlıklar (H1, H2, H3, P) */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-neutral-800">
            <button
              type="button"
              onClick={() => formatBlock('p')}
              title="Normal Paragraf"
              className="px-2 py-1 text-xs font-semibold rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              P
            </button>
            <button
              type="button"
              onClick={() => formatBlock('h1')}
              title="Başlık 1 (H1)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => formatBlock('h2')}
              title="Başlık 2 (H2)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => formatBlock('h3')}
              title="Başlık 3 (H3)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* HİZALAMA BUTONLARI (Özellikle İKİ YANA YASLAMA - JUSTIFY) */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-neutral-800 bg-neutral-900/60 p-0.5 rounded-xl">
            <button
              type="button"
              onClick={() => alignText('justify')}
              title="İki Yana Yasla (Justify - Tavsiye Edilen)"
              className="p-1.5 rounded-lg bg-amber-400/20 text-amber-400 hover:bg-amber-400 hover:text-black font-semibold transition-all flex items-center gap-1"
            >
              <AlignJustify className="w-4 h-4" />
              <span className="text-[10px] hidden sm:inline">Yasla</span>
            </button>
            <button
              type="button"
              onClick={() => alignText('left')}
              title="Sola Yasla"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => alignText('center')}
              title="Ortala"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => alignText('right')}
              title="Sağa Yasla"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          {/* Hızlı Aksiyon: Tüm Paragrafları İki Yana Yasla */}
          <div className="pr-2 border-r border-neutral-800">
            <button
              type="button"
              onClick={justifyAllContent}
              title="Metindeki tüm paragrafları otomatik olarak iki yana yasla"
              className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400 hover:text-black transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tümünü İki Yana Yasla</span>
            </button>
          </div>

          {/* Listeler (UL / OL) */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-neutral-800">
            <button
              type="button"
              onClick={() => execCmd('insertUnorderedList')}
              title="Maddeli Liste"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('insertOrderedList')}
              title="Numaralı Liste"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Girintiyi Artır / Azalt (Word Tipi Indent / Outdent) */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-neutral-800">
            <button
              type="button"
              onClick={() => handleIndent('decrease')}
              title="Girintiyi Azalt (Outdent - Word Tipi)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Outdent className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleIndent('increase')}
              title="Girintiyi Artır (Indent - Word Tipi)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Indent className="w-4 h-4" />
            </button>
          </div>

          {/* Alıntı, Çizgi ve Bağlantı */}
          <div className="flex items-center gap-0.5 pr-2 border-r border-neutral-800">
            <button
              type="button"
              onClick={() => formatBlock('p')}
              onMouseDown={(e) => {
                e.preventDefault();
                execCmd('formatBlock', '<blockquote>');
              }}
              title="Alıntı (Blockquote)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('insertHorizontalRule')}
              title="Yatay Çizgi (Ayraç)"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleOpenLinkModal}
              title="Bağlantı (Link) Ekle"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-amber-400 transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemoveLink}
              title="Bağlantıyı Kaldır"
              className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-red-400 transition-colors"
            >
              <Unlink className="w-4 h-4" />
            </button>
          </div>

          {/* Biçimlendirmeyi Temizle */}
          <button
            type="button"
            onClick={handleClearFormat}
            title="Biçimlendirmeyi Temizle"
            className="p-1.5 rounded-lg hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            <Eraser className="w-4 h-4" />
          </button>

          {/* Hazır Şablonlar Butonu */}
          {showTemplates && (
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Hazır Şablonlar</span>
              </button>

              {showTemplateMenu && (
                <div className="absolute right-0 top-full mt-1.5 w-72 rounded-xl bg-neutral-950 border border-neutral-800 shadow-2xl p-2 z-50 space-y-1">
                  <div className="text-[11px] font-bold text-neutral-400 px-2 py-1 uppercase tracking-wider">
                    Örnek Kurumsal Bloklar
                  </div>
                  {templates.map(tpl => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl.html)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-900 text-xs text-neutral-300 hover:text-white transition-colors"
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Link Ekleme Modalı */}
      {showLinkModal && (
        <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-neutral-400 font-semibold">Link Ekle:</span>
          <input
            type="text"
            placeholder="URL (örn: https://vanguard.studio)"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white flex-1 min-w-[200px] focus:outline-none focus:border-amber-400"
          />
          <input
            type="text"
            placeholder="Görünecek Metin (opsiyonel)"
            value={linkText}
            onChange={e => setLinkText(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white min-w-[140px] focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleApplyLink}
            className="px-3 py-1.5 rounded-lg bg-amber-400 text-black font-semibold hover:bg-amber-300"
          >
            Ekle
          </button>
          <button
            type="button"
            onClick={() => setShowLinkModal(false)}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white"
          >
            İptal
          </button>
        </div>
      )}

      {/* EDİTÖR İÇERİK GÖVDE ALANI */}
      <div className="relative flex-1 bg-neutral-950 p-4">
        {/* Mod 1: Görsel WYSIWYG Editör */}
        {viewMode === 'visual' && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleContentChange}
            onBlur={handleContentChange}
            onPaste={handlePaste}
            data-placeholder={placeholder}
            className={`w-full ${minHeight} outline-none text-neutral-200 text-sm sm:text-base leading-relaxed text-justify text-justify-content font-sans prose dark:prose-invert max-w-none focus:ring-0 select-text rich-editor-canvas rich-text-content`}
            style={{
              textAlign: 'justify',
              textJustify: 'inter-word',
            }}
          />
        )}

        {/* Mod 2: Canlı Önizleme */}
        {viewMode === 'preview' && (
          <div className={`w-full ${minHeight} p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 overflow-y-auto`}>
            <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-3 pb-2 border-b border-neutral-800">
              Canlı Ziyaretçi Görünümü (İki Yana Yaslanmış & Temiz HTML)
            </div>
            <RichContentRenderer content={rawHtmlCode} className="text-justify" />
          </div>
        )}

        {/* Mod 3: HTML Kaynak Kodu */}
        {viewMode === 'code' && (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2 text-xs text-neutral-400">
              <span className="font-mono text-[11px] text-amber-400">
                Temiz HTML Çıktısı (&lt;p style="text-align: justify"&gt;)
              </span>
              <button
                type="button"
                onClick={() => setRawHtmlCode(cleanAndNormalizeRichText(rawHtmlCode))}
                className="text-[11px] text-neutral-400 hover:text-white underline cursor-pointer"
              >
                HTML'i Standartlaştır & Temizle
              </button>
            </div>
            <textarea
              value={rawHtmlCode}
              onChange={handleRawCodeChange}
              rows={12}
              className={`w-full ${minHeight} p-3 rounded-xl bg-neutral-900 border border-neutral-800 font-mono text-xs text-emerald-400 focus:outline-none focus:border-amber-400 leading-relaxed resize-y`}
              placeholder="HTML kodları burada görünecektir..."
            />
          </div>
        )}
      </div>

      {/* Alt Bilgi & İstatistik Çubuğu */}
      <div className="px-4 py-2.5 bg-neutral-950 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
        {/* Metin İstatistikleri */}
        <div className="flex items-center gap-4 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Kelime:</span>
            <span className="text-white font-bold">{stats.words}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Karakter:</span>
            <span className="text-white font-bold">{stats.chars}</span>
          </div>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <Clock className="w-3 h-3 text-neutral-500" />
            <span>~{stats.readMinutes} dk okuma</span>
          </div>
          {stats.hasJustify && (
            <div className="flex items-center gap-1 text-emerald-400 font-sans hidden md:flex">
              <CheckCircle2 className="w-3 h-3" />
              <span>İki Yana Yaslı</span>
            </div>
          )}
        </div>

        {/* Hızlı Kopyalama ve İndirme Araçları */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleCopy('html')}
            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] flex items-center gap-1 transition-colors"
            title="Temiz HTML kodunu panoya kopyala"
          >
            {copiedType === 'html' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>HTML Kopyala</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopy('text')}
            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] flex items-center gap-1 transition-colors"
            title="Yalnızca düz metni panoya kopyala"
          >
            {copiedType === 'text' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>Düz Metin</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            title="HTML Dosyası Olarak İndir"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              className="ml-2 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-semibold text-[11px] transition-colors shadow-sm"
            >
              Kaydet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

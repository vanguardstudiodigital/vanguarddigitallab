import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Globe,
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ShieldCheck,
  Cpu,
  Bot,
  Layers,
  ArrowUpRight,
  Code2,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  Terminal,
  Activity,
  Sliders,
  Check,
  FileCode,
  Smartphone,
  Eye,
  Info,
  Maximize2,
  Sun,
  Moon,
  X,
  ArrowRight,
  Download,
} from 'lucide-react';

interface AuditItem {
  id: string;
  category: 'critical' | 'warning' | 'passed';
  engine: 'GEO' | 'SEO' | 'Schema' | 'Performance';
  title: string;
  subtitle: string;
  impact: string;
  scoreEffect: number;
  description: string;
  fixSnippet?: string;
  isFixed?: boolean;
}

export const GeoAuditAdmin: React.FC = () => {
  const { currentLang, t, formatPrice } = useApp();

  // Target URL and scan parameters
  const [targetUrl, setTargetUrl] = useState('https://vanguardstudio.digital');
  const [selectedLang, setSelectedLang] = useState('auto');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasStartedAnalysis, setHasStartedAnalysis] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [filterTab, setFilterTab] = useState<'all' | 'critical' | 'warning' | 'passed'>('all');
  const [expandedItem, setExpandedItem] = useState<string | null>('audit-1');

  // Mobile preview drawer toggle with zero-overhead lazy state lock
  const [showMobileSimulator, setShowMobileSimulator] = useState(false);
  const [hasLoadedSimulator, setHasLoadedSimulator] = useState(false);
  const [simDeviceModel, setSimDeviceModel] = useState<'iphone' | 'pixel'>('iphone');
  const [isSimulatedDark, setIsSimulatedDark] = useState(true);
  const [isSimReloading, setIsSimReloading] = useState(false);

  // Timer refs to prevent unhandled background interval buffering
  const scanIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const simTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Lifecycle cleanup hook: zero initial load footprint, terminate timers on unmount
  React.useEffect(() => {
    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
      if (simTimeoutRef.current) {
        clearTimeout(simTimeoutRef.current);
        simTimeoutRef.current = null;
      }
    };
  }, []);

  // Dynamic audit items
  const [auditItems, setAuditItems] = useState<AuditItem[]>([
    {
      id: 'audit-1',
      category: 'critical',
      engine: 'GEO',
      title: 'AI Crawler Bot İzinleri & X-Robots-Tag Doğrulaması',
      subtitle: 'PerplexityBot, GPTBot ve Google-Extended tarama erişimi',
      impact: 'Kritik Etki (-6 Skor)',
      scoreEffect: -6,
      description: 'Yapay zeka arama motorları (Perplexity, ChatGPT Search, Claude) içeriğinizi doğrudan alıntılayabilmek için robots.txt ve meta etiketlerinde açık izin arar. Sitede bot kısıtlaması tespit edildi.',
      fixSnippet: `# robots.txt - AI Ajanlarına Açık İzin
User-agent: GPTBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /`,
      isFixed: false,
    },
    {
      id: 'audit-2',
      category: 'warning',
      engine: 'GEO',
      title: 'llms.txt AI Context Manifestosu Eksikliği',
      subtitle: 'LLM modelleri için yapılandırılmış marka ve hizmet özeti',
      impact: 'Orta Fırsat (-4 Skor)',
      scoreEffect: -4,
      description: '/llms.txt dosyası bulunamadı. Bu dosya, Gemini ve ChatGPT gibi üretken yapay zeka sistemlerine sitenizin sunduğu hazır web paketlerini ve fiyatları tek seferde semantik formatta sunar.',
      fixSnippet: `# /llms.txt
# Vanguard Studio - Turnkey Web Architecture
> 48 saatte yayına hazır, KOBİ'lere özel anahtar teslim sektörel web siteleri.
- Fiyat Aralığı: ${formatPrice(10000)} - ${formatPrice(20000)}
- Teslim Süresi: 48 Saat
- Hizmetler: Kurumsal Kimlik, E-Posta, SSL, CMS`,
      isFixed: false,
    },
    {
      id: 'audit-3',
      category: 'warning',
      engine: 'SEO',
      title: 'Görsel WebP/AVIF Dönüşümü & Semantik Alt-Etiketleri',
      subtitle: '2 görselde eksik zenginleştirilmiş alt metin saptandı',
      impact: 'Küçük İyileştirme (-2 Skor)',
      scoreEffect: -2,
      description: 'Portfolio vitrinindeki 2 adet kapak görselinde sektörel anahtar kelimeler ve açıklayıcı alt etiketler optimize edilebilir. Bu hem Google Lens hem de AI multimodal aramalarını güçlendirir.',
      fixSnippet: `<img 
  src="/img/aura-dental.webp" 
  alt="Aura Dental Klinik - 48 Saatte Hazır Sağlık Web Sitesi Şablonu" 
  loading="lazy" 
  decoding="async" 
/>`,
      isFixed: false,
    },
    {
      id: 'audit-4',
      category: 'passed',
      engine: 'Schema',
      title: 'JSON-LD Organization & WebSite Entity Graph Doğrulandı',
      subtitle: 'Google Rich Results & Knowledge Graph %100 Uyumlu',
      impact: 'Mükemmel (+10 Skor)',
      scoreEffect: 10,
      description: 'Schema.org standartlarında Organization, WebSite ve LocalBusiness yapısal veri hiyerarşisi sıfır hata ile doğrulandı. Marka güven skoru maksimum seviyede.',
      fixSnippet: `{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Vanguard Studio",
  "priceRange": "₺₺",
  "openingHours": "Mo-Sa 09:00-20:00"
}`,
      isFixed: true,
    },
    {
      id: 'audit-5',
      category: 'passed',
      engine: 'SEO',
      title: 'Core Web Vitals - LCP 0.72s (Ultra Hızlı Yeşil Bölge)',
      subtitle: 'Largest Contentful Paint 0.72s · INP 38ms · CLS 0.00',
      impact: 'Mükemmel (+10 Skor)',
      scoreEffect: 10,
      description: 'Google Lighthouse performans skorlarında 98/100 performansı. Sunucu yanıt süresi (TTFB) 48ms ile küresel CDN üzerinden anında yükleniyor.',
      isFixed: true,
    },
    {
      id: 'audit-6',
      category: 'passed',
      engine: 'GEO',
      title: 'Doğrudan Alıntılanabilir Varlık & Cümle Yapısı (Answer Engine Readiness)',
      subtitle: 'Perplexity ve Google AI Overviews için atomik yanıt blokları',
      impact: 'Mükemmel (+10 Skor)',
      scoreEffect: 10,
      description: 'Metin blokları 40-60 kelimelik net tanımlar ve somut fiyat/teslimat verileri içeriyor. Yapay zeka arama motorları doğrudan bu paragrafları kaynak göstererek kullanıcıya sunabiliyor.',
      isFixed: true,
    },
    {
      id: 'audit-7',
      category: 'passed',
      engine: 'Schema',
      title: 'Product & AggregateOffer Fiyatlandırma Şeması Aktif',
      subtitle: `${formatPrice(10000)} - ${formatPrice(20000)} aralığı Google Arama Sonuçlarında görünür`,
      impact: 'Mükemmel (+5 Skor)',
      scoreEffect: 5,
      description: 'Tüm hazır site modelleri ve ekonomik/profesyonel paketler para birimi ve fiyat meta verileriyle yapılandırılmıştır.',
      isFixed: true,
    },
    {
      id: 'audit-8',
      category: 'passed',
      engine: 'SEO',
      title: 'HTTP/3 QUIC & SSL TLS 1.3 Sertifikasyon Güvenliği',
      subtitle: 'Cloudflare Edge SSL ve HSTS katı güvenlik protokolü',
      impact: 'Mükemmel (+5 Skor)',
      scoreEffect: 5,
      description: 'Tüm trafik zorunlu HTTPS üzerinden şifrelenmiştir ve en yeni nesil HTTP/3 protokolüyle gecikme süresi sıfıra indirilmiştir.',
      isFixed: true,
    },
  ]);

  const [overallScore, setOverallScore] = useState(96);
  const [classicSeoScore, setClassicSeoScore] = useState(90);
  const [geoScore, setGeoScore] = useState(98);
  const [schemaScore, setSchemaScore] = useState(100);

  const scanStepsText = [
    'DNS ve SSL TLS 1.3 bağlantısı doğrulanıyor...',
    'HTML5 Semantic hiyerarşisi ve Meta etiketleri taranıyor...',
    'Yapay zeka bot erişimi (GPTBot, PerplexityBot) test ediliyor...',
    'Schema.org JSON-LD Entity Graph parse ediliyor...',
    'Perplexity & Gemini doğrudan alıntı analizi hesaplanıyor...',
    'Denetim tamamlandı! Metrikler başarıyla güncellendi.',
  ];

  const handleStartDeepScan = () => {
    if (isAnalyzing) return;

    // Terminate any previous interval to prevent background memory retention
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    setHasStartedAnalysis(true);
    setIsAnalyzing(true);
    setScanStep(0);

    scanIntervalRef.current = setInterval(() => {
      setScanStep(prev => {
        if (prev >= scanStepsText.length - 1) {
          if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
          }
          setIsAnalyzing(false);
          setOverallScore(98);
          setClassicSeoScore(94);
          setGeoScore(99);
          setSchemaScore(100);
          return prev;
        }
        return prev + 1;
      });
    }, 550);
  };

  const handleApplyFix = (itemId: string) => {
    setAuditItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            category: 'passed',
            impact: 'Düzeltildi & Doğrulandı (+ Skor)',
            isFixed: true,
          };
        }
        return item;
      })
    );

    setOverallScore(prev => Math.min(100, prev + 3));
    if (itemId === 'audit-1' || itemId === 'audit-2') {
      setGeoScore(prev => Math.min(100, prev + 2));
    } else {
      setClassicSeoScore(prev => Math.min(100, prev + 4));
    }
  };

  const handleSimReload = () => {
    if (simTimeoutRef.current) {
      clearTimeout(simTimeoutRef.current);
      simTimeoutRef.current = null;
    }
    setIsSimReloading(true);
    simTimeoutRef.current = setTimeout(() => {
      setIsSimReloading(false);
      simTimeoutRef.current = null;
    }, 500);
  };

  const toggleMobileSimulator = () => {
    setShowMobileSimulator(prev => {
      const next = !prev;
      if (next) {
        setHasLoadedSimulator(true);
      } else {
        if (simTimeoutRef.current) {
          clearTimeout(simTimeoutRef.current);
          simTimeoutRef.current = null;
        }
      }
      return next;
    });
  };

  const filteredItems = auditItems.filter(item => {
    if (filterTab === 'all') return true;
    if (filterTab === 'critical') return item.category === 'critical';
    if (filterTab === 'warning') return item.category === 'warning';
    if (filterTab === 'passed') return item.category === 'passed';
    return true;
  });

  const criticalCount = auditItems.filter(i => i.category === 'critical').length;
  const warningCount = auditItems.filter(i => i.category === 'warning').length;
  const passedCount = auditItems.filter(i => i.category === 'passed').length;

  return (
    <div className="space-y-6">
      {/* Top Admin Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-white font-display">
              AI & GEO Denetim Paneli (SEO SaaS Dashboard)
            </h2>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Yapay zeka arama motorları (Perplexity, ChatGPT Search, Gemini) ve klasik Google botları için gerçek zamanlı semantik analiz, entity denetimi ve responsive önizleme.
          </p>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleMobileSimulator}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
              showMobileSimulator
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                : 'bg-[#121622] text-neutral-300 border-[#1e2638] hover:text-white hover:border-emerald-500/30'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{showMobileSimulator ? 'Mobil Simülatörü Gizle' : 'Katlama Üstü Mobil Simülatörü'}</span>
          </button>

          <button
            type="button"
            onClick={handleStartDeepScan}
            disabled={isAnalyzing}
            className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-400 hover:from-emerald-300 hover:to-teal-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.35)] disabled:opacity-75"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? 'Denetleniyor...' : 'Derin Analiz Başlat'}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. ÜST AKSİYON ÇUBUĞU (URL GİRİŞ BARI + DİL SEÇİCİ + ANALİZ) */}
      {/* ============================================================== */}
      <div className="p-4 rounded-2xl bg-[#121622] border border-[#1e2638] shadow-xl">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Target URL with protocol pill */}
          <div className="flex-1 flex items-center bg-[#0d0f17] rounded-xl border border-[#1e2638] px-3 py-1.5 focus-within:border-emerald-500/60 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md shrink-0">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="font-mono">HTTPS</span>
            </div>

            <div className="h-4 w-[1px] bg-neutral-800 mx-2 shrink-0" />
            <Globe className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />

            <input
              type="text"
              value={targetUrl}
              onChange={e => setTargetUrl(e.target.value)}
              placeholder="https://siteniz.com"
              className="w-full bg-transparent text-xs sm:text-sm font-mono text-white placeholder-neutral-500 focus:outline-none tracking-tight"
            />

            <div className="hidden sm:flex items-center gap-2 pl-2 shrink-0 text-[11px] text-neutral-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>200 OK · HTTP/3</span>
            </div>
          </div>

          {/* Otomatik Dil Seçici */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <select
                value={selectedLang}
                onChange={e => setSelectedLang(e.target.value)}
                className="appearance-none bg-[#0d0f17] border border-[#1e2638] text-neutral-300 text-xs rounded-xl px-3.5 py-2.5 pr-8 focus:outline-none focus:border-emerald-500/50 cursor-pointer font-medium hover:bg-[#161b26] transition-colors"
                aria-label="Otomatik Dil Seçici"
              >
                <option value="auto">🌐 Otomatik Dil (TR · EN · RU)</option>
                <option value="tr">🇹🇷 Türkçe (Öncelikli)</option>
                <option value="en">🇬🇧 English (Global GEO)</option>
                <option value="ru">🇷🇺 Русский (Avrasya)</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Preset domain shortcuts */}
            <div className="hidden md:flex items-center gap-1">
              {['vanguardstudio.digital', 'auradental.com', 'lexislegal.com'].map(domain => (
                <button
                  key={domain}
                  type="button"
                  onClick={() => setTargetUrl(`https://${domain}`)}
                  className={`px-2 py-1 text-[11px] font-mono rounded-lg transition-colors cursor-pointer ${
                    targetUrl.includes(domain)
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-neutral-400 hover:text-white bg-[#0d0f17] border border-[#1e2638]'
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live scanning progress bar */}
        {isAnalyzing && (
          <div className="mt-3 pt-3 border-t border-[#1e2638] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-mono">
              <Terminal className="w-3.5 h-3.5 animate-pulse" />
              <span className="truncate">{scanStepsText[scanStep]}</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-400">
              %{Math.round(((scanStep + 1) / scanStepsText.length) * 100)}
            </span>
          </div>
        )}
      </div>

      {/* Optional: Side-by-side or Embedded Live Mobile Simulator (Zero Initial Load) */}
      {showMobileSimulator && hasLoadedSimulator && (
        <div className="p-5 rounded-2xl bg-[#0e111a] border-2 border-emerald-500/40 shadow-2xl relative animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-4 border-b border-[#1e2638]">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-display">
                Canlı Önizleme (Katlama Üstü - Above the Fold) Simülatörü
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Mobil UX / CLS Doğrulama
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowMobileSimulator(false)}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-col md:flex-row items-center justify-center gap-6">
            {/* Phone Frame */}
            <div className="w-[310px] sm:w-[340px] bg-[#0c0e14] rounded-[40px] p-3 shadow-2xl border-4 border-[#1e2638] ring-1 ring-white/10 shrink-0">
              {/* Top Chassis Control Bar */}
              <div className="flex items-center justify-between px-3 py-1 text-xs text-neutral-400 border-b border-[#1e2638] mb-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSimDeviceModel(simDeviceModel === 'iphone' ? 'pixel' : 'iphone')}
                    className="text-[10px] font-mono font-semibold hover:text-white transition-colors cursor-pointer"
                  >
                    {simDeviceModel === 'iphone' ? 'iPhone 16 Pro' : 'Pixel 9'}
                  </button>
                  <span className="text-neutral-600">·</span>
                  <span className="text-[10px] text-emerald-400 font-mono">DPR 3.0</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleSimReload}
                    className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    title="Yeniden Yükle"
                  >
                    <RefreshCw className={`w-3 h-3 ${isSimReloading ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSimulatedDark(!isSimulatedDark)}
                    className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                    title="Koyu / Açık Tema"
                  >
                    {isSimulatedDark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3 text-amber-400" />}
                  </button>
                </div>
              </div>

              {/* Screen Screen */}
              <div
                className={`relative rounded-[30px] overflow-hidden border border-[#1e2638] transition-colors ${
                  isSimulatedDark ? 'bg-[#0a0c12] text-neutral-100' : 'bg-white text-neutral-900'
                }`}
                style={{ height: '420px' }}
              >
                {/* Dynamic Notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-30">
                  <div className="w-22 h-4 bg-black rounded-full flex items-center justify-between px-2 border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-900" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                </div>

                {/* Status Bar */}
                <div className="h-8 px-5 pt-1.5 flex items-center justify-between text-[9px] font-mono font-semibold text-neutral-400 shrink-0">
                  <span>09:41</span>
                  <div className="flex items-center gap-1">
                    <span>5G</span>
                    <div className="w-3.5 h-1.5 border border-current rounded-xs p-0.5">
                      <div className="h-full bg-current rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* Viewport Content */}
                <div className="h-[calc(420px-32px)] overflow-y-auto p-3.5 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1e2638]/50">
                    <span className="text-[11px] font-bold font-display">Vanguard Studio</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                      GEO 96/100
                    </span>
                  </div>

                  <div className="space-y-2 pt-0.5">
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 fill-current" />
                      48 Saatte Canlıda Teslim
                    </span>

                    <h4 className="text-sm font-extrabold font-display leading-tight">
                      Prestijli Hazır Web Siteleri & AI/GEO Mimarisi
                    </h4>

                    <p className="text-[10px] text-neutral-400 leading-relaxed">
                      {formatPrice(10000)} – {formatPrice(20000)} aralığında, Perplexity ve Google AI uyumlu anahtar teslim dijital vitrinler.
                    </p>

                    <div className="pt-1 space-y-2">
                      <button
                        type="button"
                        className="w-full py-2 px-3 rounded-lg bg-emerald-400 text-neutral-950 font-bold text-[11px] flex items-center justify-center gap-1"
                      >
                        <span>Hazır Siteleri Keşfet</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <div className="grid grid-cols-2 gap-1.5 text-center text-[9px] font-mono">
                        <div className="p-1.5 rounded-lg bg-[#121622] border border-[#1e2638]">
                          <div className="text-white font-bold">0.72s</div>
                          <div className="text-neutral-500">LCP Hızı</div>
                        </div>
                        <div className="p-1.5 rounded-lg bg-[#121622] border border-[#1e2638]">
                          <div className="text-emerald-400 font-bold">100%</div>
                          <div className="text-neutral-500">JSON-LD</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-neutral-600/60 rounded-full" />
              </div>
            </div>

            {/* Diagnostic Metrics Explanations */}
            <div className="flex-1 space-y-3">
              <h4 className="text-sm font-bold text-white font-display">
                Katlama Üstü (Above-the-Fold) Canlı Performans Kriterleri
              </h4>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-[#121622] border border-[#1e2638] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">First Contentful Paint (FCP)</div>
                    <div className="text-[11px] text-neutral-400">Sayfa ilk pikselinin çizilme süresi</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">0.48 saniye (A+)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#121622] border border-[#1e2638] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Cumulative Layout Shift (CLS)</div>
                    <div className="text-[11px] text-neutral-400">Yüklenme sırasında kayma oranı</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">0.00 (Sıfır Kayma)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#121622] border border-[#1e2638] flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Dokunma Alanı (Touch Target Size)</div>
                    <div className="text-[11px] text-neutral-400">Buton ve linklerin parmakla tıklanabilirliği</div>
                  </div>
                  <span className="text-emerald-400 font-bold font-mono">≥ 48px (%100 Uyumlu)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. METRİK HALKALARI (PROGRESS RINGS - 4'LÜ KOMPAKT DAİRE GRAFİKLER) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ring 1: Genel Sağlık */}
        <div className="p-5 rounded-2xl bg-[#121622] border border-[#1e2638] hover:border-emerald-500/40 transition-all group relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
                Genel Sağlık
              </span>
              <h4 className="text-base font-bold text-white font-display mt-0.5">
                SEO & GEO Skoru
              </h4>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4 flex items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#1e2638]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - overallScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-white font-mono tabular-nums leading-none">
                  {overallScore}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold mt-1">/ 100</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1e2638] flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="text-emerald-400 font-semibold">Mükemmel Seviye</span>
            <span>LCP 0.72s · INP 38ms</span>
          </div>
        </div>

        {/* Ring 2: Klasik SEO */}
        <div className="p-5 rounded-2xl bg-[#121622] border border-[#1e2638] hover:border-amber-500/40 transition-all group relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
                Klasik SEO
              </span>
              <h4 className="text-base font-bold text-white font-display mt-0.5">
                Teknik & Core Vitals
              </h4>
            </div>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4 flex items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#1e2638]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - classicSeoScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-white font-mono tabular-nums leading-none">
                  {classicSeoScore}
                </span>
                <span className="text-[10px] text-amber-400 font-semibold mt-1">/ 100</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1e2638] flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="text-amber-400 font-semibold">2 İyileştirme</span>
            <span>H1-H3 · Sitemap OK</span>
          </div>
        </div>

        {/* Ring 3: AI & GEO Uyumu */}
        <div className="p-5 rounded-2xl bg-[#161b26] border border-[#1e2638] hover:border-emerald-500/50 transition-all group relative overflow-hidden shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>AI & GEO Uyumu</span>
              </span>
              <h4 className="text-base font-bold text-white font-display mt-0.5">
                Perplexity & ChatGPT
              </h4>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Bot className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4 flex items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#1e2638]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - geoScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-white font-mono tabular-nums leading-none">
                  {geoScore}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold mt-1">/ 100</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1e2638] flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="text-emerald-400 font-semibold">Alıntı Hazır</span>
            <span>Gemini · Perplexity</span>
          </div>
        </div>

        {/* Ring 4: Schema & JSON-LD */}
        <div className="p-5 rounded-2xl bg-[#121622] border border-[#1e2638] hover:border-emerald-500/40 transition-all group relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-400 tracking-wider uppercase">
                Schema / JSON-LD
              </span>
              <h4 className="text-base font-bold text-white font-display mt-0.5">
                Entity & Rich Results
              </h4>
            </div>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Code2 className="w-4 h-4" />
            </div>
          </div>

          <div className="my-4 flex items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#1e2638]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - schemaScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-white font-mono tabular-nums leading-none">
                  {schemaScore}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold mt-1">/ 100</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#1e2638] flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="text-emerald-400 font-semibold">0 Hata</span>
            <span>5 Entity Şeması OK</span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. EKSİKLER & İYİLEŞTİRME PANELİ */}
      {/* ============================================================== */}
      <div className="p-6 rounded-2xl bg-[#121622] border border-[#1e2638] shadow-xl space-y-5">
        {/* Header row with counts and filter tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1e2638]">
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-base sm:text-lg font-bold font-display text-white">
                Eksikler & İyileştirme Fırsatları
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#161b26] border border-[#1e2638] text-neutral-300">
                {auditItems.length} Denetim Maddesi
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Yapay zeka arama motorları (GEO) ve klasik arama botlarının sitenizi tararken karşılaştığı eksikler ve otomatik çözüm önerileri.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0d0f17] border border-[#1e2638] overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 ${
                filterTab === 'all'
                  ? 'bg-[#161b26] text-white border border-[#1e2638]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tümü ({auditItems.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('critical')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                filterTab === 'critical'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-neutral-400 hover:text-rose-400'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              <span>Kritik ({criticalCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('warning')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                filterTab === 'warning'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-neutral-400 hover:text-amber-400'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Fırsatlar ({warningCount})</span>
            </button>
            <button
              type="button"
              onClick={() => setFilterTab('passed')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 ${
                filterTab === 'passed'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Başarılı ({passedCount})</span>
            </button>
          </div>
        </div>

        {/* List of Audit findings */}
        <div className="space-y-3">
          {filteredItems.map(item => {
            const isExpanded = expandedItem === item.id;
            const isCritical = item.category === 'critical';
            const isWarning = item.category === 'warning';
            const isPassed = item.category === 'passed';

            return (
              <div
                key={item.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isCritical
                    ? 'bg-[#161b26]/90 border-rose-500/30 hover:border-rose-500/50'
                    : isWarning
                    ? 'bg-[#161b26]/90 border-amber-500/30 hover:border-amber-500/50'
                    : 'bg-[#0d0f17]/90 border-[#1e2638] hover:border-emerald-500/30'
                }`}
              >
                {/* Item Summary Bar */}
                <div
                  onClick={() => setExpandedItem(isExpanded ? null : item.id)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5 shrink-0">
                      {isCritical && (
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                      )}
                      {isWarning && (
                        <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                      )}
                      {isPassed && (
                        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-display">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#0a0c12] border border-[#1e2638] text-neutral-400">
                          {item.engine}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span
                      className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-lg ${
                        isCritical
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                          : isWarning
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {item.impact}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Detail View */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#1e2638]/60 bg-[#0a0c12]/50 space-y-3 text-xs text-neutral-300">
                    <p className="leading-relaxed text-neutral-300/90">
                      {item.description}
                    </p>

                    {item.fixSnippet && (
                      <div className="rounded-xl bg-[#0d0f17] border border-[#1e2638] p-3 overflow-hidden">
                        <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1e2638] text-[11px] font-mono text-neutral-400">
                          <span className="flex items-center gap-1.5">
                            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Önerilen Kod / Yapılandırma</span>
                          </span>
                          <span className="text-emerald-400">Hazır Şablon</span>
                        </div>
                        <pre className="text-[11px] font-mono text-emerald-300/90 overflow-x-auto whitespace-pre leading-relaxed">
                          {item.fixSnippet}
                        </pre>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="text-[11px] text-neutral-500 font-mono">
                        Etki: {item.engine} Algoritmaları & AI Alıntılanabilirliği
                      </span>

                      {!item.isFixed ? (
                        <button
                          type="button"
                          onClick={() => handleApplyFix(item.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Zap className="w-3.5 h-3.5 fill-current" />
                          <span>Simüle Et & Otomatik Çözüm Uygula</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold font-mono">
                          <Check className="w-4 h-4" />
                          <span>Optimizasyon Sisteme İşlendi</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

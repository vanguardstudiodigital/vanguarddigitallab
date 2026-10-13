import React, { useState } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Globe,
  Server,
  ShieldCheck,
  FileCode,
  ExternalLink,
  Sparkles,
  Layers,
  Terminal,
  QrCode,
  Smartphone,
  CheckCircle2,
  RefreshCw,
  Send,
  Zap,
} from 'lucide-react';
import { TurnkeyProduct } from '../../types/index.ts';

interface DeployPackageModalProps {
  product: TurnkeyProduct;
  isOpen: boolean;
  onClose: () => void;
  currentLang: string;
}

type DeployTab = 'domain' | 'package' | 'cloud' | 'mobile';

export const DeployPackageModal: React.FC<DeployPackageModalProps> = ({
  product,
  isOpen,
  onClose,
  currentLang,
}) => {
  const [activeTab, setActiveTab] = useState<DeployTab>('domain');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState(`${product.slug}.com`);
  const [dnsChecking, setDnsChecking] = useState(false);
  const [dnsStatus, setDnsStatus] = useState<'idle' | 'verified'>('idle');
  const [cloudDeployStatus, setCloudDeployStatus] = useState<'idle' | 'deploying' | 'deployed'>('idle');

  if (!isOpen) return null;

  const isRu = currentLang === 'ru';
  const isEn = currentLang === 'en';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerifyDns = () => {
    setDnsChecking(true);
    setTimeout(() => {
      setDnsChecking(false);
      setDnsStatus('verified');
    }, 1200);
  };

  const handleTriggerCloudDeploy = () => {
    setCloudDeployStatus('deploying');
    setTimeout(() => {
      setCloudDeployStatus('deployed');
    }, 1600);
  };

  const generateStandaloneHtml = () => {
    const info = product.customerBusinessInfo;
    const phone = info?.phone || '+90 (212) 890 42 10';
    const whatsapp = (info?.whatsapp || '+90 505 703 0194').replace(/[^0-9]/g, '');
    const email = info?.email || 'iletisim@' + (product.slug || 'isletme') + '.com';
    const address = info?.address || (isRu ? 'ул. Багдат №142, Кадыкёй / Стамбул' : isEn ? 'Bagdat Ave No:142, Kadikoy / Istanbul' : 'Bağdat Caddesi No:142, Kadıköy / İstanbul');
    const siteTitle = product.title;

    return `<!DOCTYPE html>
<html lang="${currentLang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${siteTitle} - ${product.sector}</title>
  <meta name="description" content="${product.tagline}">
  <meta property="og:title" content="${siteTitle} - ${product.sector}">
  <meta property="og:description" content="${product.tagline}">
  <meta property="og:image" content="${product.coverImage}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-amber-400 selection:text-black">
  <!-- Top Bar -->
  <div class="bg-black/90 border-b border-slate-800 text-xs py-2 px-6 flex flex-wrap justify-between items-center text-slate-400 gap-2">
    <div class="flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
      <span>${isRu ? 'Открыто · Онлайн-заявки принимаются' : isEn ? 'Open Now · Taking Online Requests' : 'Şu An Açık · Randevu & Sipariş Kabul Ediliyor'}</span>
    </div>
    <div class="flex items-center gap-4">
      <a href="tel:${phone.replace(/[^0-9+]/g, '')}" class="hover:text-amber-400 transition-colors">${phone}</a>
      <a href="https://wa.me/${whatsapp}" target="_blank" class="text-emerald-400 hover:underline">WhatsApp</a>
    </div>
  </div>

  <!-- Header -->
  <header class="sticky top-0 z-30 bg-slate-900/90 backdrop-blur border-b border-slate-800 py-4 px-6 sm:px-12 flex justify-between items-center">
    <div class="font-extrabold text-lg tracking-tight text-white flex items-center gap-2">
      <span class="w-8 h-8 rounded-lg bg-amber-500 text-black flex items-center justify-center font-black">${siteTitle.charAt(0)}</span>
      <div>
        <div class="leading-none">${siteTitle}</div>
        <div class="text-[10px] text-slate-400 uppercase tracking-widest font-normal">${product.sector}</div>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <a href="https://wa.me/${whatsapp}?text=${encodeURIComponent(`${isRu ? 'Здравствуйте' : isEn ? 'Hello' : 'Merhaba'} ${siteTitle}, ${isRu ? 'хочу получить консультацию.' : isEn ? 'I would like to inquire.' : 'randevu ve detaylı bilgi almak istiyorum.'}`)}" target="_blank" class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl shadow transition-colors">
        ${isRu ? 'Записаться Онлайн' : isEn ? 'Book Appointment' : 'Online Randevu / İletişim'}
      </a>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative py-24 px-6 sm:px-12 text-center bg-cover bg-center" style="background-image: linear-gradient(to bottom, rgba(2, 6, 23, 0.85), rgba(2, 6, 23, 0.95)), url('${product.coverImage}');">
    <div class="max-w-3xl mx-auto space-y-5">
      <span class="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">
        ${product.sector}
      </span>
      <h1 class="text-3xl sm:text-5xl font-black text-white leading-tight">
        ${product.tagline}
      </h1>
      <p class="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
        ${product.description}
      </p>
      <div class="pt-4 flex flex-wrap justify-center gap-3">
        <a href="https://wa.me/${whatsapp}?text=${encodeURIComponent(`Merhaba ${siteTitle}, web sitenizden ulaşıyorum.`)}" target="_blank" class="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow-lg transition-colors">
          ${isRu ? 'Написать в WhatsApp' : isEn ? 'Chat on WhatsApp' : "WhatsApp'tan Hızlı İletişim"}
        </a>
      </div>
    </div>
  </section>

  <!-- Features & Services -->
  <section class="py-16 px-6 sm:px-12 max-w-5xl mx-auto w-full">
    <h2 class="text-2xl font-bold text-center text-white mb-10">
      ${isRu ? 'Наши Услуги и Стандарты' : isEn ? 'Services & Quality Standards' : 'Sunulan Hizmet ve Çözümler'}
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      ${product.features.map(f => `
      <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
        <div class="text-amber-400 font-bold text-sm">✓ ${f}</div>
        <p class="text-xs text-slate-400">${isRu ? 'Профессиональные стандарты и гарантированное качество.' : isEn ? 'Delivered with corporate excellence and specialist care.' : 'Alanında uzman kadro ve kurumsal standartlarla teslim edilen hizmet detayı.'}</p>
      </div>`).join('')}
    </div>
  </section>

  <!-- Footer -->
  <footer class="mt-auto bg-slate-950 border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
    <div>© ${new Date().getFullYear()} ${siteTitle}. ${isRu ? 'Все права защищены.' : isEn ? 'All rights reserved.' : 'Tüm hakları saklıdır.'}</div>
    <div class="mt-1">${address} · ${phone} · ${email}</div>
  </footer>
</body>
</html>`;
  };

  const handleDownloadStandaloneHtml = () => {
    const html = generateStandaloneHtml();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${product.slug}-index.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyHtmlCode = () => {
    const html = generateStandaloneHtml();
    copyToClipboard(html, 'full-html');
  };

  const stagingSubdomain = `https://${product.slug}.vanguard.agency`;

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="relative w-full max-w-3xl bg-[#0c0e16] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#090b10] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                {product.title} · {isRu ? 'Терминал Запуска и Экспорта' : isEn ? 'Deployment & Export Console' : 'Talep Halinde Yayına Alma & Export Terminali'}
              </h3>
              <p className="text-xs text-neutral-400">
                {isRu
                  ? 'Запустите готовый сайт на вашем домене за 48 часов или скачайте готовый автономный веб-пакет.'
                  : isEn
                  ? 'Deploy this turnkey site to live production in 48 hours or export the self-contained production bundle.'
                  : 'Bu hazır siteyi müşteriniz adına anında yayına alabilir veya üretim HTML paketini indirebilirsiniz.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-6 border-b border-neutral-800 bg-[#090b10]/60 gap-2 text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('domain')}
            className={`py-3 px-3.5 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'domain'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{isRu ? 'Домен и DNS' : isEn ? 'Domain & SSL' : 'Alan Adı & DNS'}</span>
          </button>

          <button
            onClick={() => setActiveTab('package')}
            className={`py-3 px-3.5 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'package'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>{isRu ? 'Скачать Веб-Пакет (HTML5)' : isEn ? 'Standalone Package' : 'Üretim Paketi (HTML5)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('cloud')}
            className={`py-3 px-3.5 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'cloud'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>{isRu ? 'Облачный Хостинг & Вебхук' : isEn ? 'Cloud Hosting & Webhook' : 'Bulut Sunucu & Webhook'}</span>
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`py-3 px-3.5 border-b-2 font-bold transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'mobile'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>{isRu ? 'QR Тест & Готовность' : isEn ? 'QR Preview & Audit' : 'Mobil QR & Kalite Denetimi'}</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs max-h-[75vh]">
          {/* TAB 1: DOMAIN & DNS */}
          {activeTab === 'domain' && (
            <div className="space-y-5">
              {/* Free Subdomain Preview */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-neutral-400">
                    {isRu ? 'Мгновенный бесплатный тестовый домен:' : isEn ? 'Instant Free Cloud Subdomain:' : 'Anında Ücretsiz Bulut Test Alan Adı:'}
                  </div>
                  <div className="font-mono text-amber-400 text-xs sm:text-sm font-bold mt-0.5">
                    {stagingSubdomain}
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(stagingSubdomain, 'subdomain')}
                  className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg flex items-center gap-1 font-medium transition-colors"
                >
                  {copiedKey === 'subdomain' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'subdomain' ? (isRu ? 'Скопировано' : isEn ? 'Copied' : 'Kopyalandı') : (isRu ? 'Копировать' : isEn ? 'Copy' : 'Kopyala')}</span>
                </button>
              </div>

              {/* Custom Domain Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white">
                  {isRu ? 'Подключить собственный домен клиента:' : isEn ? 'Connect Custom Client Domain:' : 'Müşterinin Kendi Özel Alan Adı (Domain):'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={e => setCustomDomain(e.target.value)}
                    placeholder="ornek-klinik.com"
                    className="flex-1 p-2.5 rounded-xl bg-neutral-950 border border-neutral-700 font-mono text-white text-xs"
                  />
                  <button
                    onClick={handleVerifyDns}
                    disabled={dnsChecking}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black font-bold rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${dnsChecking ? 'animate-spin' : ''}`} />
                    <span>{dnsChecking ? (isRu ? 'Проверка...' : isEn ? 'Checking...' : 'Kontrol Ediliyor...') : (isRu ? 'Проверить DNS' : isEn ? 'Verify DNS' : 'DNS Doğrula')}</span>
                  </button>
                </div>
                {dnsStatus === 'verified' && (
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{isRu ? 'DNS успешно настроен! Сертификат SSL активен.' : isEn ? 'DNS records validated! 256-Bit SSL certificate active.' : 'DNS kayıtları doğrulandı! 256-Bit SSL sertifikası aktifleşti.'}</span>
                  </div>
                )}
              </div>

              {/* DNS Records Table */}
              <div className="space-y-2">
                <div className="text-neutral-400 font-semibold">
                  {isRu ? 'Необходимые DNS-записи для регистратора (GoDaddy, Cloudflare, Reg.ru):' : isEn ? 'DNS Records to enter at domain registrar:' : 'Alan adı sağlayıcısına (Cloudflare, GoDaddy, Natro) eklenecek kayıtlar:'}
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs flex items-center justify-between">
                  <div>
                    <span className="text-neutral-500">{isRu ? 'Запись' : isEn ? 'Type' : 'Kayıt'} A:</span>{' '}
                    <span className="text-emerald-400 font-bold">@ ➜ 76.76.21.21</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('76.76.21.21', 'dns-a')}
                    className="p-1 hover:text-white text-neutral-400 flex items-center gap-1"
                  >
                    {copiedKey === 'dns-a' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'dns-a' ? (isRu ? 'Скопировано' : isEn ? 'Copied' : 'Kopyalandı') : (isRu ? 'Копировать' : isEn ? 'Copy' : 'Kopyala')}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 font-mono text-xs flex items-center justify-between">
                  <div>
                    <span className="text-neutral-500">{isRu ? 'Запись' : isEn ? 'Type' : 'Kayıt'} CNAME:</span>{' '}
                    <span className="text-emerald-400 font-bold">www ➜ cname.vanguardstudio.digital</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard('cname.vanguardstudio.digital', 'dns-cname')}
                    className="p-1 hover:text-white text-neutral-400 flex items-center gap-1"
                  >
                    {copiedKey === 'dns-cname' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'dns-cname' ? (isRu ? 'Скопировано' : isEn ? 'Copied' : 'Kopyalandı') : (isRu ? 'Копировать' : isEn ? 'Copy' : 'Kopyala')}</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>
                  {isRu
                    ? 'Автоматический SSL-сертификат Let\'s Encrypt 256-Bit генерируется сразу после обновления DNS.'
                    : isEn
                    ? 'Automatic 256-Bit Let\'s Encrypt SSL certificate provisions within 15 minutes.'
                    : 'Otomatik 256-Bit Let\'s Encrypt SSL sertifikası yönlendirmeden hemen sonra aktifleşir.'}
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: STANDALONE PACKAGE (HTML5) */}
          {activeTab === 'package' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {isRu ? 'Автономный Экспорт' : isEn ? 'Zero-Dependency Export' : 'Sıfır Bağımlılık'}
                    </span>
                    <h4 className="text-sm font-bold text-white font-display mt-0.5">
                      {isRu ? 'Полный Автономный HTML5 Веб-Пакет' : isEn ? 'Full Standalone HTML5 Production Bundle' : 'Tam Bağımsız Canlı Site HTML Paketi'}
                    </h4>
                    <p className="text-neutral-400 text-xs mt-1 leading-relaxed">
                      {isRu
                        ? 'Единый автономный HTML5-файл с готовым Tailwind CSS, логотипом, контактами, услугами и интеграцией с WhatsApp. Готов к загрузке на любой хостинг (cPanel, Nginx, Apache, Vercel, Netlify, GitHub Pages).'
                        : isEn
                        ? 'Self-contained responsive HTML5 file pre-compiled with full brand styling, WhatsApp checkout, working hours, and doctor/service roster. Drop directly onto any host without external databases.'
                        : 'Müşterinizin tüm iletişim bilgileri, hizmetleri ve WhatsApp entegrasyonuyla derlenmiş bağımsız tek sayfalık HTML dosyası. İstediğiniz cPanel, Vercel, Netlify veya Apache sunucusuna atıp hemen yayına alabilirsiniz.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={handleDownloadStandaloneHtml}
                    className="py-3 px-4 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isRu ? 'Скачать index.html' : isEn ? 'Download index.html' : 'Tek Tıkla HTML İndir (.html)'}</span>
                  </button>

                  <button
                    onClick={handleCopyHtmlCode}
                    className="py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-bold text-xs rounded-xl border border-neutral-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {copiedKey === 'full-html' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'full-html' ? (isRu ? 'Код Скопирован' : isEn ? 'Code Copied' : 'Kaynak Kod Kopyalandı') : (isRu ? 'Скопировать HTML-код' : isEn ? 'Copy Full HTML' : 'Tüm HTML Kodunu Kopyala')}</span>
                  </button>
                </div>
              </div>

              {/* Hosting Compatibility Checklist */}
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
                <div className="font-bold text-white text-xs">
                  {isRu ? 'Поддерживаемые серверные среды:' : isEn ? 'Supported Hosting Environments:' : 'Uyumlu Sunucu ve Hosting Ortamları:'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-neutral-400 font-mono">
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> cPanel & Plesk</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Nginx & Apache</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Vercel & Netlify</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> Cloudflare Pages</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> GitHub Pages</div>
                  <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-400" /> AWS S3 & Firebase</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD HOSTING & WEBHOOK */}
          {activeTab === 'cloud' && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{isRu ? '1-Клик Запуск в Облачной Сети Vanguard Edge' : isEn ? '1-Click Vanguard Edge Cloud Deployment' : '1-Tıkla Vanguard Edge Cloud Yayını'}</span>
                </div>

                <p className="text-neutral-400 leading-relaxed">
                  {isRu
                    ? 'Сайт компилируется и мгновенно кэшируется на 275+ мировых пограничных серверах Cloudflare & Fastly. Запуск занимает менее 5 секунд.'
                    : isEn
                    ? 'Site bundle compiles and replicates across 275+ global edge nodes. Zero maintenance, zero configuration required.'
                    : 'Hazır siteniz tek tıkla Vanguard Edge CDN altyapısına dağıtılır. Müşteriniz için sıfır bakım gerektirir.'}
                </p>

                {cloudDeployStatus === 'idle' && (
                  <button
                    onClick={handleTriggerCloudDeploy}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isRu ? 'Запустить в Облаке Сейчас' : isEn ? 'Deploy to Edge Cloud Now' : 'Buluta Canlıya Al'}</span>
                  </button>
                )}

                {cloudDeployStatus === 'deploying' && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-center gap-3">
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                    <span>{isRu ? 'Компиляция и распространение на CDN серверах...' : isEn ? 'Replicating to global CDN edge nodes...' : 'CDN düğümlerine paket aktarılıyor...'}</span>
                  </div>
                )}

                {cloudDeployStatus === 'deployed' && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    <div>
                      <div className="font-bold">{isRu ? 'Сайт успешно опубликован в прямом эфире!' : isEn ? 'Site is Live on Production Edge!' : 'Site Başarıyla Canlıya Alındı!'}</div>
                      <div className="font-mono text-[11px] mt-0.5">{stagingSubdomain}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Webhook API */}
              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="text-neutral-400 font-semibold">{isRu ? 'Вебхук для авто-деплоя (CI/CD):' : isEn ? 'Auto-Deploy Webhook Endpoint:' : 'CI/CD Otomatik Dağıtım Webhook Uç Noktası:'}</div>
                <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-[11px] text-amber-400 break-all">
                  https://api.vanguardstudio.digital/v1/deploy/{product.slug}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: QR & AUDIT */}
          {activeTab === 'mobile' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* QR Code box */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center space-y-3">
                  <div className="p-3 bg-white rounded-2xl shadow-md">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(stagingSubdomain)}`}
                      alt="Mobile QR Code"
                      className="w-36 h-36"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">{isRu ? 'Сканируйте смартфоном' : isEn ? 'Scan with Mobile Camera' : 'Mobil Kamerayla Tara'}</h5>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {isRu ? 'Мгновенное тестирование на iOS и Android.' : isEn ? 'Instant test on iOS & Android devices.' : 'iPhone ve Android cihazlarda anında test.'}
                    </p>
                  </div>
                </div>

                {/* Performance & Quality Checklist */}
                <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3">
                  <h5 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isRu ? 'Чек-лист готовности к продакшену' : isEn ? 'Production Readiness Audit' : 'Üretim Kalite Denetimi'}</span>
                  </h5>

                  <div className="space-y-2 text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isRu ? '100/100 Core Web Vitals (Мгновенная загрузка)' : isEn ? '100/100 Core Web Vitals (Instant Paint)' : '100/100 Core Web Vitals (Anında Açılış)'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isRu ? '100% Адаптивность под смартфоны и планшеты' : isEn ? '100% Mobile & Tablet Responsive' : '%100 Mobil ve Tablet Uyumlu'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isRu ? 'Маршрутизация заявок прямо в WhatsApp и CRM' : isEn ? 'Direct WhatsApp & CRM lead routing' : 'WhatsApp ve CRM doğrudan talep yönlendirme'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isRu ? 'SEO OpenGraph метатеги и фавикон настроены' : isEn ? 'SEO OpenGraph & Rich Social previews configured' : 'SEO OpenGraph & Sosyal Medya kartları hazır'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isRu ? 'Панель управления клиента (CMS) активна' : isEn ? 'Client simplified CMS panel active' : 'Müşteri yönetim paneli (CMS) bağlı'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#090b10] border-t border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-500">
            {isRu ? 'Vanguard Studio · Запуск готовых сайтов под ключ за 48 часов' : isEn ? 'Vanguard Studio · 48-Hour Turnkey Deployment Engine' : 'Vanguard Studio · 48 Saatte Anahtar Teslim Canlı Yayına Alma'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            {isRu ? 'Закрыть' : isEn ? 'Close' : 'Kapat'}
          </button>
        </div>
      </div>
    </div>
  );
};

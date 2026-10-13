import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import {
  Inbox,
  Phone,
  Mail,
  MessageCircle,
  Trash2,
  Clock,
  CheckCircle2,
  FileText,
  AlertCircle,
  Download,
  Paperclip,
  Briefcase,
  Copy,
  Check,
  Globe,
  ExternalLink,
  X,
  Sparkles,
} from 'lucide-react';
import { LeadInquiry } from '../../types/index.ts';

export const getWhatsAppTemplate = (
  inquiry: LeadInquiry,
  lang: 'tr' | 'en' | 'ru' = 'tr'
): string => {
  const clientName =
    inquiry.clientName?.trim() ||
    (lang === 'ru' ? 'уважаемый клиент' : lang === 'en' ? 'valued client' : 'Değerli Müşterimiz');

  const rawCompany = inquiry.companyName?.trim();
  const hasCompany = rawCompany && rawCompany !== 'Belirtilmedi' && rawCompany !== 'Kariyer / CV Başvurusu';

  const companyName = hasCompany
    ? rawCompany
    : lang === 'ru'
    ? 'вашей компании'
    : lang === 'en'
    ? 'your company'
    : 'firmanız';

  if (inquiry.preferredPackage === 'economic') {
    if (lang === 'en') {
      return `Hello ${clientName}, reaching out from Vanguard Studio Project Management Desk. Your 'Economic Package' turnkey website setup request and brief for ${companyName} have been received. I would like to connect with you to schedule your 48-hour rapid deployment timeline and clarify your domain name details.`;
    }
    if (lang === 'ru') {
      return `Здравствуйте, ${clientName}! Вас приветствует проектная группа Vanguard Studio. Ваша заявка на разработку готового сайта по тарифу 'Эконом' для ${companyName} и брифинг успешно получены. Я хотел(а) бы обсудить с вами детали домена и составить график запуска за 48 часов.`;
    }
    return `Merhaba ${clientName}, Vanguard Studio Proje Yönetim Masasından ulaşıyorum. ${companyName} için iletmiş olduğunuz 'Ekonomik Paket' hazır web sitesi kurulum talebiniz ve brifing belgeniz sistemimize ulaşmıştır. 48 saatlik acil devreye alma takviminizi planlamak ve alan adı (domain) detaylarını netleştirmek için sizinle görüşmek isterim.`;
  }

  if (inquiry.preferredPackage === 'advisory') {
    if (lang === 'en') {
      return `Hello ${clientName}, reaching out from Vanguard Studio Executive Advisory Desk. Your request for the 'Vanguard Nexus VIP Web & AI Advisory' (50,000+ TRY tier) for ${companyName} has been received. Our lead architect is ready to schedule a private executive strategy session to define your AI models, cloud architecture, and digital transformation roadmap.`;
    }
    if (lang === 'ru') {
      return `Здравствуйте, ${clientName}! Вас приветствует дирекция консалтинга Vanguard Studio. Ваша заявка на VIP-консалтинг 'Vanguard Nexus (AI & Web Advisory)' для ${companyName} принята. Наш главный архитектор готов согласовать время стратегической сессии для выстраивания дорожной карты цифровой трансформации и интеграции нейросетей.`;
    }
    return `Merhaba ${clientName}, Vanguard Studio Üst Düzey Danışmanlık Masasından ulaşıyorum. ${companyName} için iletmiş olduğunuz 'Vanguard Nexus (Premium Web & AI Advisory - 50.000 TL+)' talebiniz sistemimize ulaşmıştır. Baş mimarımız ile özel bir kurumsal strateji toplantısı planlayarak yapay zekâ model entegrasyonu ve kurumsal sistem yol haritanızı netleştirmek üzere sizinle görüşmek isteriz.`;
  }

  if (inquiry.preferredPackage === 'professional') {
    if (lang === 'en') {
      return `Hello ${clientName}, reaching out from Vanguard Studio Project Management Desk. Your request for the 'Professional CMS Package' for ${companyName} has been received. We are ready to discuss the setup of your fully authorized admin control panel, configuration of your corporate email accounts (up to 5 accounts), and your 48-hour delivery workflow.`;
    }
    if (lang === 'ru') {
      return `Здравствуйте, ${clientName}! Вас приветствует проектная группа Vanguard Studio. Ваша заявка на 'Профессиональный CMS Пакет' для ${companyName} успешно поступила в нашу систему. Мы готовы обсудить настройку вашей панели управления, регистрацию корпоративных e-mail адресов (до 5 аккаунтов) и этапы запуска за 48 часов.`;
    }
    return `Merhaba ${clientName}, Vanguard Studio Proje Yönetim Masasından ulaşıyorum. ${companyName} için iletmiş olduğunuz 'Profesyonel CMS Paketi' talebiniz sistemimize ulaşmıştır. Tam yetkili yönetim panelinizin kurulumu, kurumsal e-posta hesaplarınızın (maksimum 5 adet) tanımlanması ve 48 saatlik teslimat süreciniz hakkında detayları görüşmek üzere hazırız.`;
  }

  // Custom software / Consultancy / Career / Default
  if (lang === 'en') {
    return `Hello ${clientName}, reaching out from Vanguard Studio Project Management Desk. Your custom software and architectural web project specifications have been reviewed by our engineering team. We would like to arrange an initial meeting to present our best budget proposal and technical scope for your partnership.`;
  }
  if (lang === 'ru') {
    return `Здравствуйте, ${clientName}! Вас приветствует проектная группа Vanguard Studio. Детали вашего индивидуального веб-проекта были внимательно изучены нашей технической командой. Мы хотели бы организовать предварительное обсуждение, чтобы представить вам лучшее коммерческое предложение и техническую спецификацию.`;
  }
  return `Merhaba ${clientName}, Vanguard Studio Proje Yönetim Masasından ulaşıyorum. Bizimle paylaştığınız özel yazılım ve mimari web projesi detaylarınız teknik ekibimizce incelenmiştir. İş ortaklığımız kapsamında size en uygun bütçe teklifini ve teknik şartnameyi sunmak üzere bir ön görüşme organize etmek isteriz.`;
};

export const InquiriesAdmin: React.FC = () => {
  const { inquiries, updateInquiryStatus, deleteInquiry, formatPrice } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // WhatsApp Interactive Modal State
  const [activeWaInquiry, setActiveWaInquiry] = useState<LeadInquiry | null>(null);
  const [waLang, setWaLang] = useState<'tr' | 'en' | 'ru'>('tr');
  const [waCustomMessage, setWaCustomMessage] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (activeWaInquiry) {
      setWaCustomMessage(getWhatsAppTemplate(activeWaInquiry, waLang));
    }
  }, [activeWaInquiry, waLang]);

  const filteredInquiries = inquiries.filter(inq => {
    if (filterStatus === 'all') return true;
    return inq.status === filterStatus;
  });

  const getStatusBadge = (status: LeadInquiry['status']) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold">Yeni Talep</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">Görüşüldü</span>;
      case 'proposal_sent':
        return <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">Teklif Yollandı</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Satış Yapıldı</span>;
      case 'cancelled':
        return <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px] font-bold">İptal</span>;
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(waCustomMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Inbox className="w-4 h-4 text-amber-400" />
            <span>Gelen Müşteri Talepleri & Siparişler ({inquiries.length})</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Siteden gelen hazır site sipariş, brifing ve danışmanlık formları
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex gap-1 overflow-x-auto text-xs">
          {['all', 'new', 'contacted', 'proposal_sent', 'completed'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                filterStatus === st ? 'bg-white text-black font-bold' : 'bg-neutral-800 text-neutral-300'
              }`}
            >
              {st === 'all' && 'Tümü'}
              {st === 'new' && 'Yeni'}
              {st === 'contacted' && 'Görüşülen'}
              {st === 'proposal_sent' && 'Teklif'}
              {st === 'completed' && 'Tamamlanan'}
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {filteredInquiries.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 bg-neutral-900 rounded-xl border border-neutral-800">
            Bu filtrelere uygun müşteri talebi bulunmuyor.
          </div>
        ) : (
          filteredInquiries.map(inq => {
            const rawPhoneDigits = inq.phone.replace(/[^0-9]/g, '');
            const defaultTrMsg = getWhatsAppTemplate(inq, 'tr');

            return (
              <div
                key={inq.id}
                className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-3">
                    <h4 className="text-sm font-bold text-white">{inq.clientName}</h4>
                    {inq.companyName && (
                      <span className="text-xs text-neutral-400">({inq.companyName})</span>
                    )}
                    {getStatusBadge(inq.status)}
                    {(inq.productId === 'kariyer' || inq.companyName === 'Kariyer / CV Başvurusu') && (
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30 flex items-center gap-1">
                        <Briefcase className="w-3 h-3" />
                        <span>Kariyer / CV</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(inq.createdAt).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Inquired Product & Package Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs">
                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono">İlgilenilen Site:</span>
                    <div className="font-semibold text-neutral-200 mt-0.5">
                      {inq.productTitle || 'Genel Danışmanlık'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono">Tercih Edilen Model:</span>
                    <div className="font-semibold text-amber-400 mt-0.5">
                      {inq.preferredPackage === 'economic' && `Ekonomik Paket (${formatPrice(10000)}-${formatPrice(15000)} · Yönetim Bizde)`}
                      {inq.preferredPackage === 'professional' && `Profesyonel CMS (${formatPrice(18000)}-${formatPrice(25000)})`}
                      {inq.preferredPackage === 'custom' && 'Özel Mimari / Danışmanlık'}
                      {inq.preferredPackage === 'advisory' && 'Vanguard Nexus VIP Danışmanlık (50.000 TL+ · AI & Mimari)'}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-neutral-500 uppercase font-mono">İletişim & WhatsApp:</span>
                    <div className="font-mono text-neutral-300 mt-0.5 flex flex-col gap-0.5">
                      <div>Tel: <span className="text-white font-semibold">{inq.phone}</span></div>
                      {inq.whatsappNumber && inq.whatsappNumber !== inq.phone && (
                        <div className="text-emerald-400">WA: {inq.whatsappNumber}</div>
                      )}
                      {inq.email && <div className="text-neutral-400 text-[11px] truncate">{inq.email}</div>}
                    </div>
                  </div>
                </div>

                {/* Message */}
                {inq.message && (
                  <div className="p-3 rounded-lg bg-neutral-800/40 text-xs text-neutral-300 italic">
                    "{inq.message}"
                  </div>
                )}

                {/* Attachment / Uploaded CV */}
                {(inq.attachmentData || inq.attachmentName) && (
                  <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                          <Paperclip className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{inq.attachmentName || 'Ekteki Belge / CV'}</span>
                        </div>
                        {inq.attachmentSize ? (
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {inq.attachmentSize < 1024 * 1024
                              ? `${(inq.attachmentSize / 1024).toFixed(1)} KB`
                              : `${(inq.attachmentSize / (1024 * 1024)).toFixed(2)} MB`}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {inq.attachmentData && (
                      <a
                        href={inq.attachmentData}
                        download={inq.attachmentName || 'Ek-Dosya.pdf'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>CV / Dosyayı İndir</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Action Toolbar with Custom WhatsApp Templates */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-500">Durumu Değiştir:</span>
                    <select
                      value={inq.status}
                      onChange={e => updateInquiryStatus(inq.id, e.target.value as any)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-neutral-700 bg-neutral-950 text-white cursor-pointer"
                    >
                      <option value="new">Yeni Talep</option>
                      <option value="contacted">Görüşüldü</option>
                      <option value="proposal_sent">Teklif Yollandı</option>
                      <option value="completed">Satış Tamamlandı</option>
                      <option value="cancelled">İptal Edildi</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Primary Interactive WhatsApp Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveWaInquiry(inq);
                        setWaLang('tr');
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                      title="Pakete Özel Kurumsal WhatsApp Şablonunu Aç"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp'tan Yaz</span>
                    </button>

                    {/* Quick direct language triggers */}
                    <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-neutral-800">
                      <a
                        href={`https://wa.me/${rawPhoneDigits}?text=${encodeURIComponent(getWhatsAppTemplate(inq, 'tr'))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[10px] font-mono font-bold bg-neutral-800 hover:bg-emerald-900/60 text-neutral-300 hover:text-emerald-300 rounded border border-neutral-700 transition-colors"
                        title="Hızlı Türkçe WhatsApp Mesajı Gönder"
                      >
                        🇹🇷 TR
                      </a>
                      <a
                        href={`https://wa.me/${rawPhoneDigits}?text=${encodeURIComponent(getWhatsAppTemplate(inq, 'en'))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[10px] font-mono font-bold bg-neutral-800 hover:bg-sky-900/60 text-neutral-300 hover:text-sky-300 rounded border border-neutral-700 transition-colors"
                        title="Hızlı İngilizce WhatsApp Mesajı Gönder"
                      >
                        🇬🇧 EN
                      </a>
                      <a
                        href={`https://wa.me/${rawPhoneDigits}?text=${encodeURIComponent(getWhatsAppTemplate(inq, 'ru'))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[10px] font-mono font-bold bg-neutral-800 hover:bg-purple-900/60 text-neutral-300 hover:text-purple-300 rounded border border-neutral-700 transition-colors"
                        title="Hızlı Rusça WhatsApp Mesajı Gönder"
                      >
                        🇷🇺 RU
                      </a>
                    </div>

                    {inq.email && inq.email !== 'Belirtilmedi' && (
                      <a
                        href={`mailto:${inq.email}?subject=Vanguard Studio Web Sitesi Teklifi`}
                        className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-1.5 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>E-Posta</span>
                      </a>
                    )}

                    <button
                      onClick={() => {
                        if (confirm('Bu talebi silmek istediğinize emin misiniz?')) {
                          deleteInquiry(inq.id);
                        }
                      }}
                      className="p-1.5 text-neutral-500 hover:text-red-400 rounded-lg hover:bg-neutral-800 cursor-pointer"
                      title="Talebi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* WhatsApp Template Customization Modal */}
      {activeWaInquiry && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0c0e14] text-neutral-100 rounded-2xl border border-neutral-800 shadow-2xl overflow-hidden my-auto p-6 space-y-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    WhatsApp Kurumsal Mesaj Şablonu
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Müşteri: <strong className="text-white">{activeWaInquiry.clientName}</strong> · Paket: <span className="text-amber-400 font-semibold">{activeWaInquiry.preferredPackage === 'advisory' ? 'Vanguard Nexus VIP (50K+)' : activeWaInquiry.preferredPackage === 'economic' ? 'Ekonomik Paket' : activeWaInquiry.preferredPackage === 'professional' ? 'Profesyonel CMS' : 'Özel Mimari / Danışmanlık'}</span>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveWaInquiry(null)}
                className="p-1.5 rounded-xl text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Language Switcher Tabs */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-400">
                Şablon Dilini Seçin:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setWaLang('tr')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    waLang === 'tr'
                      ? 'bg-amber-400 text-black shadow-md font-extrabold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <span>🇹🇷 Türkçe (TR)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWaLang('en')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    waLang === 'en'
                      ? 'bg-amber-400 text-black shadow-md font-extrabold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <span>🇬🇧 English (EN)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setWaLang('ru')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    waLang === 'ru'
                      ? 'bg-amber-400 text-black shadow-md font-extrabold'
                      : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  <span>🇷🇺 Русский (RU)</span>
                </button>
              </div>
            </div>

            {/* Generated Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-neutral-300">
                <span>Dinamik Satış Mesajı Taslağı:</span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Dinamik Paket & İsim Entegrasyonu</span>
                </span>
              </div>
              <textarea
                rows={6}
                value={waCustomMessage}
                onChange={e => setWaCustomMessage(e.target.value)}
                className="w-full p-3.5 text-xs sm:text-sm rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
              />
            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleCopyMessage}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Metin Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setActiveWaInquiry(null)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 text-xs font-semibold cursor-pointer"
                >
                  Kapat
                </button>

                <a
                  href={`https://wa.me/${activeWaInquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    waCustomMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setActiveWaInquiry(null)}
                  className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>WhatsApp'ta Gönder</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

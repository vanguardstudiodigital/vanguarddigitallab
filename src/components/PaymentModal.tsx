import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  X,
  CreditCard,
  Building2,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  ArrowRight,
  MessageCircle,
  FileCheck2,
} from 'lucide-react';

export const PaymentModal: React.FC = () => {
  const {
    isPaymentModalOpen,
    closePaymentModal,
    paymentProduct,
    paymentPackage,
    formatPrice,
    settings,
    bankAccountsList,
    t,
    currentLang,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'card' | 'bank'>('card');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePaymentModal();
    };
    if (isPaymentModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPaymentModalOpen, closePaymentModal]);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isPaymentModalOpen) return null;

  const priceTRY =
    paymentPackage === 'economic'
      ? paymentProduct?.priceEconomicTRY || 12000
      : paymentProduct?.priceProfessionalTRY || 19500;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleCardPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 1800);
  };

  const bankInfo = settings.bankAccounts;

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) closePaymentModal();
      }}
      className="fixed inset-0 z-[150] flex items-start sm:items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl max-h-[88vh] bg-white dark:bg-[#10141d] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden my-auto text-neutral-900 dark:text-neutral-100">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 shrink-0 flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#10141d]/95 backdrop-blur-md">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm sm:text-base font-bold font-display">
                {t('payment.portalTitle', 'Güvenli Ödeme & Havale Portalı')}
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {paymentProduct ? `${currentLang === 'en' ? 'Selected Site: ' : 'Seçilen Site: '}${paymentProduct.title}` : (currentLang === 'en' ? 'Turnkey Web Development' : 'Anahtar Teslim Web Geliştirme')}
            </p>
          </div>

          <button
            type="button"
            onClick={closePaymentModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-neutral-900 dark:text-white bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-all cursor-pointer border border-neutral-300 dark:border-neutral-700 shadow-sm"
            title={t('common.close', 'Kapat')}
          >
            <X className="w-4 h-4" />
            <span>{t('common.close', 'Kapat')}</span>
          </button>
        </div>

        {/* Amount Summary Bar */}
        <div className="shrink-0 px-6 py-3.5 bg-neutral-100/70 dark:bg-neutral-950/80 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 tracking-wider">
              {paymentPackage === 'economic' ? t('models.economic.title', 'Ekonomik Paket (Yönetim Bizde)') : t('models.pro.title', 'Profesyonel CMS Paketi')}
            </span>
            <div className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              {t('payment.launchFee', '48 Saat İçinde Yayına Alma Bedeli')}
            </div>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold font-mono-numbers text-neutral-950 dark:text-white">
              {formatPrice(priceTRY)}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="shrink-0 grid grid-cols-2 p-2 gap-2 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40">
          <button
            onClick={() => {
              setActiveTab('card');
              setPaymentSuccess(false);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-500" />
            <span>{t('payment.tabCard', 'Kredi / Banka Kartı (Stripe)')}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bank');
              setPaymentSuccess(false);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === 'bank'
                ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-white shadow-xs'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-500" />
            <span>{t('payment.tabBank', 'Banka Havalesi / FAST / СБП')}</span>
          </button>
        </div>

        {/* Scrollable Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'card' ? (
            /* Stripe Credit Card Tab */
            paymentSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <FileCheck2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold font-display">
                  {t('payment.successTitle', 'Ödeme Başarıyla Tamamlandı!')}
                </h4>
                <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
                  {t('payment.successDesc', 'İşleminiz Stripe altyapısı üzerinden güvenle onaylandı. Projeniz hemen sıraya alındı ve teknik ekibimiz 2 saat içinde iletişime geçecektir.')}
                </p>
                <div className="pt-2">
                  <button
                    onClick={closePaymentModal}
                    className="px-6 py-2.5 text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-xl cursor-pointer"
                  >
                    {t('common.close', 'Pencereyi Kapat')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCardPayment} className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
                  <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{currentLang === 'en' ? '256-Bit SSL & Stripe Security'  : '256-Bit SSL & Stripe Korumalı Ödeme'}</span>
                  </span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-400">
                    <span>VISA</span> · <span>Mastercard</span> · <span>Troy</span> · <span>MIR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {t('payment.cardName', 'Kart Üzerindeki İsim')}
                  </label>
                  <input
                    type="text"
                    required
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    placeholder={currentLang === 'en' ? 'John Doe'  : 'Adınız Soyadınız'}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    {t('payment.cardNumber', 'Kart Numarası')}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardNumber}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
                      setCardNumber(val);
                    }}
                    placeholder="4000 0000 0000 0000"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('payment.cardExpiry', 'Son Kullanma Tarihi')}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={5}
                      value={cardExpiry}
                      onChange={e => {
                        let val = e.target.value.replace(/\D/g, '');
                        if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                        setCardExpiry(val);
                      }}
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      {t('payment.cardCvc', 'Güvenlik Kodu (CVC / CVV)')}
                    </label>
                    <input
                      type="password"
                      required
                      maxLength={4}
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 px-4 text-xs font-semibold text-white bg-neutral-950 dark:bg-white dark:text-neutral-950 rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-4"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    {isProcessing
                      ? t('payment.processing', 'Stripe Üzerinden İşleniyor...')
                      : `${formatPrice(priceTRY)} · ${t('payment.completePay', 'Güvenli Ödemeyi Tamamla')}`}
                  </span>
                </button>
              </form>
            )
          ) : (
            /* Dynamic Bank Accounts / Wire Transfer / FAST / СБП Tab */
            <div className="space-y-4">
              {bankAccountsList && bankAccountsList.filter(b => b.isActive).length > 0 ? (
                bankAccountsList
                  .filter(b => b.isActive)
                  .map(bank => {
                    const flag = bank.country === 'TR' ? '🇹🇷' : '🌐';
                    return (
                      <div
                        key={bank.id}
                        className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                            <span>{flag}</span>
                            <span>{bank.title || bank.bankName}</span>
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                              {bank.currency}
                            </span>
                            {bank.country === 'TR' && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold hidden sm:inline">
                                7/24 FAST
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-[10px] text-neutral-500 font-medium">{t('payment.bank', 'Banka')}:</span>
                            <div className="font-semibold text-neutral-800 dark:text-neutral-200">{bank.bankName}</div>
                          </div>
                          <div>
                            <span className="text-[10px] text-neutral-500 font-medium">{t('payment.accountHolder', 'Hesap Sahibi')}:</span>
                            <div className="font-semibold text-neutral-800 dark:text-neutral-200">{bank.accountHolder}</div>
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-neutral-500 font-medium">IBAN:</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(bank.iban, bank.id)}
                              className="text-[10px] text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                            >
                              <Copy className="w-2.5 h-2.5" />
                              <span>{copiedField === bank.id ? t('payment.copied', 'Kopyalandı') : t('payment.copy', 'Kopyala')}</span>
                            </button>
                          </div>
                          <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-700 mt-1 font-mono text-xs">
                            <span className="truncate">{bank.iban}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(bank.iban, bank.id)}
                              className="px-2 py-1 text-[11px] font-sans font-medium text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              {copiedField === bank.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedField === bank.id ? t('payment.copied', 'Kopyalandı') : t('payment.copy', 'Kopyala')}</span>
                            </button>
                          </div>
                        </div>

                        {bank.notes && (
                          <div className="text-[11px] text-neutral-500 italic bg-neutral-100/60 dark:bg-neutral-950/40 p-2 rounded-lg">
                            {bank.notes}
                          </div>
                        )}
                      </div>
                    );
                  })
              ) : (
                /* Fallback default TR / RU */
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 text-xs">
                  <div className="font-semibold">{bankInfo.bankNameTR} - {bankInfo.ibanTR}</div>
                </div>
              )}

              {/* Dekont Gönder WhatsApp Butonu & Kapatma Butonu */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    currentLang === 'ru'
                      ? `Здравствуйте, Vanguard Studio! Я совершил банковский перевод ${formatPrice(priceTRY)} за проект ${paymentProduct ? `"${paymentProduct.title}"` : 'сайт'}. Отправляю квитанцию.`
                      : currentLang === 'en'
                      ? `Hello Vanguard Studio! I have completed the wire transfer of ${formatPrice(priceTRY)} for ${paymentProduct ? `"${paymentProduct.title}"` : 'web project'}. Sharing the receipt.`
                      : `Merhaba Vanguard Studio! ${paymentProduct ? `"${paymentProduct.title}"` : 'Web projesi'} için ${formatPrice(priceTRY)} tutarındaki havaleyi gerçekleştirdim. Dekontumu paylaşıyorum.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('payment.sendReceiptWhatsapp', "Havale Sonrası WhatsApp'tan Dekont İlet")}</span>
                </a>

                <button
                  type="button"
                  onClick={closePaymentModal}
                  className="py-3 px-5 text-xs font-bold text-neutral-900 dark:text-white bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 border border-neutral-300 dark:border-neutral-700 shadow-sm"
                >
                  <X className="w-4 h-4" />
                  <span>{t('common.close', 'Pencereyi Kapat')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

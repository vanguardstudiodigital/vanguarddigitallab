import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import { useApp } from '../../context/AppContext.tsx';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Clock,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
  Building2,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  Upload,
  Check,
} from 'lucide-react';
import {
  FinancialTransaction,
  FinancialTransactionType,
  TransactionCategory,
  CurrencyCode,
} from '../../types/index.ts';

const CATEGORY_LABELS: Record<TransactionCategory, { label: string; color: string }> = {
  project_sale: { label: 'Hazır Site Satışı', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  deposit: { label: 'Ön Ödeme / Kapora', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  maintenance: { label: 'Bakım & Destek', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  custom_feature: { label: 'Özel Eklenti / Kod', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  hosting_domain: { label: 'Sunucu & Domain', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  freelance: { label: 'Freelance & Tasarım', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  advertising: { label: 'Dijital Reklam', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  software_license: { label: 'Yazılım / Lisans', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  tax_legal: { label: 'Vergi & Harç & Muhasebe', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  operational: { label: 'Operasyonel & Ofis', color: 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20' },
  other: { label: 'Diğer İşlemler', color: 'bg-neutral-600/10 text-neutral-300 border-neutral-600/20' },
};

const PAYMENT_METHOD_LABELS: Record<FinancialTransaction['paymentMethod'], string> = {
  fast: 'FAST / Havale (7/24)',
  bank_transfer: 'Banka Havalesi',
  stripe: 'Kredi Kartı (Stripe)',
  sbp: 'СБП (Система быстрых платежей)',
  cash: 'Nakit',
  other: 'Diğer Ödeme',
};

export const FinanceAdmin: React.FC = () => {
  const {
    financialTransactions,
    addFinancialTransaction,
    addFinancialTransactionsBatch,
    updateFinancialTransaction,
    deleteFinancialTransaction,
    formatPrice,
    products,
    centralBankRates,
    currentCurrency,
  } = useApp();

  // Filters & Search
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'cancelled'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Bank Excel Import State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importFileName, setImportFileName] = useState('');
  const [parsedImportRows, setParsedImportRows] = useState<Omit<FinancialTransaction, 'id' | 'createdAt'>[]>([]);
  const [selectedImportIndices, setSelectedImportIndices] = useState<number[]>([]);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccessMsg, setImportSuccessMsg] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState(false);

  // Form State
  const [formType, setFormType] = useState<FinancialTransactionType>('income');
  const [formTitle, setFormTitle] = useState('');
  const [formClientOrVendor, setFormClientOrVendor] = useState('');
  const [formAmount, setFormAmount] = useState<number>(10000);
  const [formCurrency, setFormCurrency] = useState<CurrencyCode>('TRY');
  const [formCategory, setFormCategory] = useState<TransactionCategory>('project_sale');
  const [formPaymentMethod, setFormPaymentMethod] = useState<FinancialTransaction['paymentMethod']>('fast');
  const [formStatus, setFormStatus] = useState<FinancialTransaction['status']>('completed');
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formRelatedProductId, setFormRelatedProductId] = useState('');
  const [formInvoiceNumber, setFormInvoiceNumber] = useState('');
  const [formNotes, setFormNotes] = useState('');

  // Open modal for new
  const handleOpenNew = (defaultType: FinancialTransactionType = 'income') => {
    setEditingId(null);
    setFormType(defaultType);
    setFormTitle('');
    setFormClientOrVendor('');
    setFormAmount(defaultType === 'income' ? 15000 : 2500);
    setFormCurrency('TRY');
    setFormCategory(defaultType === 'income' ? 'project_sale' : 'hosting_domain');
    setFormPaymentMethod('fast');
    setFormStatus('completed');
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormRelatedProductId('');
    setFormInvoiceNumber(`VNG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormNotes('');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (tx: FinancialTransaction) => {
    setEditingId(tx.id);
    setFormType(tx.type);
    setFormTitle(tx.title);
    setFormClientOrVendor(tx.clientOrVendor);
    setFormAmount(tx.amount);
    setFormCurrency(tx.currency);
    setFormCategory(tx.category);
    setFormPaymentMethod(tx.paymentMethod);
    setFormStatus(tx.status);
    setFormDate(tx.date);
    setFormRelatedProductId(tx.relatedProductId || '');
    setFormInvoiceNumber(tx.invoiceNumber || '');
    setFormNotes(tx.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingId) {
      updateFinancialTransaction(editingId, {
        type: formType,
        title: formTitle.trim(),
        clientOrVendor: formClientOrVendor.trim(),
        amount: Number(formAmount),
        currency: formCurrency,
        category: formCategory,
        paymentMethod: formPaymentMethod,
        status: formStatus,
        date: formDate,
        relatedProductId: formRelatedProductId || undefined,
        invoiceNumber: formInvoiceNumber.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });
    } else {
      addFinancialTransaction({
        type: formType,
        title: formTitle.trim(),
        clientOrVendor: formClientOrVendor.trim(),
        amount: Number(formAmount),
        currency: formCurrency,
        amountTRY: Number(formAmount), // recalculated in context
        category: formCategory,
        paymentMethod: formPaymentMethod,
        status: formStatus,
        date: formDate,
        relatedProductId: formRelatedProductId || undefined,
        invoiceNumber: formInvoiceNumber.trim() || undefined,
        notes: formNotes.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  // Parse Bank Excel / CSV File
  const handleBankFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsParsingFile(true);
      setImportError(null);
      setImportSuccessMsg(null);
      setImportFileName(file.name);

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];
      const rows: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!rows || rows.length === 0) {
        setImportError('Dosya boş veya formatı okunamadı.');
        setIsParsingFile(false);
        return;
      }

      // Find header row and column mappings
      let headerRowIndex = -1;
      let dateCol = -1;
      let kanalCol = -1;
      let descCol = -1;
      let amountCol = -1;
      let balanceCol = -1;
      let creditCol = -1; // Alacak (Gelen)
      let debitCol = -1;  // Borç (Giden)

      for (let r = 0; r < Math.min(rows.length, 25); r++) {
        const row = rows[r];
        if (!Array.isArray(row)) continue;
        for (let c = 0; c < row.length; c++) {
          const val = String(row[c] || '').toLowerCase().trim();
          if (val.includes('tarih') || val.includes('date') || val.includes('valör') || val.includes('valor')) {
            dateCol = c;
            headerRowIndex = r;
          }
          if (val.includes('kanal')) {
            kanalCol = c;
          }
          if (val.includes('açıklama') || val.includes('aciklama') || val.includes('işlem detayı') || val.includes('tanım') || val.includes('dekont') || val.includes('description')) {
            descCol = c;
          }
          if (val.includes('alacak') || val.includes('gelen') || val.includes('tahsilat') || val.includes('credit')) {
            creditCol = c;
          }
          if (val.includes('borç') || val.includes('borc') || val.includes('giden') || val.includes('ödeme') || val.includes('debit')) {
            debitCol = c;
          }
          if (val.includes('tutar') || val.includes('amount') || val.includes('miktar')) {
            amountCol = c;
          }
          if (val.includes('bakiye') || val.includes('balance')) {
            balanceCol = c;
          }
        }
        if (dateCol !== -1 && (descCol !== -1 || amountCol !== -1 || creditCol !== -1)) {
          break;
        }
      }

      if (headerRowIndex === -1) {
        headerRowIndex = 0;
        dateCol = 0;
        kanalCol = 1;
        descCol = 2;
        amountCol = 3;
        balanceCol = 4;
      }

      const parsed: Omit<FinancialTransaction, 'id' | 'createdAt'>[] = [];

      for (let r = headerRowIndex + 1; r < rows.length; r++) {
        const row = rows[r];
        if (!row || row.length === 0) continue;

        const rawDate = row[dateCol];
        const rawKanal = kanalCol !== -1 ? String(row[kanalCol] || '').trim() : '';
        const rawDesc = descCol !== -1 ? String(row[descCol] || '').trim() : '';
        const rawCredit = creditCol !== -1 ? row[creditCol] : null;
        const rawDebit = debitCol !== -1 ? row[debitCol] : null;
        const rawAmount = amountCol !== -1 ? row[amountCol] : null;

        // Skip non-transaction summary rows like "DEVREDEN BAKİYE"
        const upperDesc = rawDesc.toUpperCase();
        if (upperDesc.includes('DEVREDEN BAKİYE') || upperDesc.includes('DEVİR BAKİYE') || upperDesc.includes('DÖNEM BAŞI')) {
          continue;
        }

        if (!rawDate && !rawDesc && !rawCredit && !rawDebit && !rawAmount) continue;

        // Parse date (e.g. "19.04.2026", "20/04/2026", or Excel numeric date)
        let dateStr = new Date().toISOString().slice(0, 10);
        if (typeof rawDate === 'number') {
          const d = XLSX.SSF.parse_date_code(rawDate);
          if (d) {
            dateStr = `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
          }
        } else if (typeof rawDate === 'string' && rawDate.trim()) {
          const parts = rawDate.trim().split(/[./-]/);
          if (parts.length === 3) {
            if (parts[0].length === 4) {
              dateStr = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
            } else {
              dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          }
        }

        // Precision Turkish Currency Amount Parser:
        // Handles "23.252,62", "-22.500,00", "-300,00", Excel floats, comma/dot separators
        const parseAmountWithSign = (val: any): { amount: number; isNegative: boolean } => {
          if (typeof val === 'number') {
            return { amount: Math.abs(val), isNegative: val < 0 };
          }
          if (!val) return { amount: 0, isNegative: false };
          let s = String(val).replace(/TL|TRY|USD|EUR/gi, '').trim();
          const isNegative = s.includes('-') || (s.startsWith('(') && s.endsWith(')'));
          // Remove signs and whitespace
          s = s.replace(/[\-+\(\)\s]/g, '');
          if (!s) return { amount: 0, isNegative: false };

          if (s.includes('.') && s.includes(',')) {
            // E.g. "23.252,62" or "-22.500,00" -> remove dot thousand separator, replace comma with dot
            s = s.replace(/\./g, '').replace(',', '.');
          } else if (s.includes(',')) {
            // E.g. "300,00" or "19,80"
            s = s.replace(',', '.');
          }
          const num = parseFloat(s);
          return {
            amount: isNaN(num) ? 0 : Math.abs(num),
            isNegative,
          };
        };

        let type: FinancialTransactionType = 'income';
        let amount = 0;

        if (rawCredit !== null && rawCredit !== undefined && String(rawCredit).trim() !== '') {
          const res = parseAmountWithSign(rawCredit);
          if (res.amount > 0) {
            type = 'income';
            amount = res.amount;
          }
        } else if (rawDebit !== null && rawDebit !== undefined && String(rawDebit).trim() !== '') {
          const res = parseAmountWithSign(rawDebit);
          if (res.amount > 0) {
            type = 'expense';
            amount = res.amount;
          }
        } else if (rawAmount !== null && rawAmount !== undefined) {
          const res = parseAmountWithSign(rawAmount);
          if (res.amount > 0) {
            type = res.isNegative ? 'expense' : 'income';
            amount = res.amount;
          }
        }

        if (amount <= 0) continue;

        // Smart Category Detection
        let category: TransactionCategory = type === 'income' ? 'project_sale' : 'operational';

        if (upperDesc.includes('KAPORA') || upperDesc.includes('ÖN ÖDEME')) {
          category = 'deposit';
        } else if (upperDesc.includes('HOSTING') || upperDesc.includes('SUNUCU') || upperDesc.includes('DOMAIN') || upperDesc.includes('HETZNER') || upperDesc.includes('TURHOST')) {
          category = 'hosting_domain';
          type = 'expense';
        } else if (upperDesc.includes('GOOGLE') || upperDesc.includes('YANDEX') || upperDesc.includes('META') || upperDesc.includes('REKLAM') || upperDesc.includes('ADS')) {
          category = 'advertising';
          type = 'expense';
        } else if (upperDesc.includes('CLOUDFLARE') || upperDesc.includes('LİSANS') || upperDesc.includes('SOFTWARE') || upperDesc.includes('FIGMA')) {
          category = 'software_license';
          type = 'expense';
        } else if (upperDesc.includes('VERGİ') || upperDesc.includes('GİB') || upperDesc.includes('HARÇ') || upperDesc.includes('SGK') || upperDesc.includes('BAĞKUR')) {
          category = 'tax_legal';
          type = 'expense';
        } else if (upperDesc.includes('MAAŞ') || upperDesc.includes('EMEKLİ') || upperDesc.includes('MEVDUAT')) {
          category = 'other';
        }

        // Channel & Payment Method Detection (Kanal: MB, ŞB, İNT, ATM, POS)
        let paymentMethod: FinancialTransaction['paymentMethod'] = 'bank_transfer';
        const upperKanal = rawKanal.toUpperCase();
        if (upperKanal === 'MB' || upperKanal.includes('MOBİL') || upperDesc.includes('FAST') || upperDesc.includes('MOBIL')) {
          paymentMethod = 'fast';
        } else if (upperKanal === 'ATM') {
          paymentMethod = 'cash';
        } else if (upperKanal.includes('POS') || upperDesc.includes('STRIPE') || upperDesc.includes('KART')) {
          paymentMethod = 'stripe';
        }

        // Query Number / Reference Number Extraction (e.g. "Sorgu No: 1475626079")
        let invoiceNumber = `BNK-${dateStr.replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
        if (rawDesc.includes('Sorgu No:')) {
          const snMatch = rawDesc.match(/Sorgu\s*No:\s*([0-9A-Za-z]+)/i);
          if (snMatch && snMatch[1]) {
            invoiceNumber = `SN-${snMatch[1]}`;
          }
        } else if (rawDesc.includes('Dekont No:')) {
          const dnMatch = rawDesc.match(/Dekont\s*No:\s*([0-9A-Za-z]+)/i);
          if (dnMatch && dnMatch[1]) {
            invoiceNumber = `DK-${dnMatch[1]}`;
          }
        }

        // Extract Client / Vendor Name
        let clientOrVendor = type === 'income' ? 'Müşteri (Gelen Ödeme)' : 'Alıcı / Tedarikçi';

        if (rawDesc.includes('Alıcı :')) {
          const aliciPart = rawDesc.split(/Alıcı\s*:\s*/i)[1]?.split(/(?:Sorgu|Banka|IBAN|Şube|TAO|\/)/i)[0]?.trim();
          if (aliciPart) clientOrVendor = aliciPart;
        } else if (rawDesc.includes('Gönderen :') || rawDesc.includes('GÖNDEREN:')) {
          const gonderenPart = rawDesc.split(/Gönderen\s*:\s*/i)[1]?.split(/(?:Sorgu|Banka|IBAN|Şube|\/)/i)[0]?.trim();
          if (gonderenPart) clientOrVendor = gonderenPart;
        } else if (upperDesc.includes('QNB A.S.') || upperDesc.includes('QNB A.Ş.')) {
          clientOrVendor = 'QNB Finansbank / SSK Emekli Maaş';
        } else if (upperDesc.includes('HAVALE')) {
          clientOrVendor = rawDesc.split(/HAVALE/i)[1]?.split(/[\/;]/)[0]?.trim() || clientOrVendor;
        }

        // Clean and format display title
        let title = rawDesc;
        if (title.length > 90) {
          title = `${title.slice(0, 87)}...`;
        }

        parsed.push({
          type,
          title: title || `${type === 'income' ? 'Gelen Ödeme' : 'Giden Ödeme'} (${dateStr})`,
          clientOrVendor: clientOrVendor.slice(0, 60),
          amount,
          currency: 'TRY',
          amountTRY: amount,
          category,
          paymentMethod,
          status: 'completed',
          date: dateStr,
          invoiceNumber,
          notes: `Banka Ekstresi (${rawKanal ? `Kanal: ${rawKanal} | ` : ''}${rawDesc})`,
        });
      }

      if (parsed.length === 0) {
        setImportError('Excel dosyasında geçerli para hareketi satırı bulunamadı. Lütfen dosya sütunlarını kontrol edin.');
        setIsParsingFile(false);
        return;
      }

      setParsedImportRows(parsed);
      setSelectedImportIndices(parsed.map((_, idx) => idx));
      setIsParsingFile(false);
    } catch (err: any) {
      setImportError(`Dosya okunurken hata oluştu: ${err?.message || err}`);
      setIsParsingFile(false);
    }
  };

  const handleConfirmImport = () => {
    const rowsToImport = selectedImportIndices
      .map(idx => parsedImportRows[idx])
      .filter((row): row is Omit<FinancialTransaction, 'id' | 'createdAt'> => Boolean(row));

    if (rowsToImport.length === 0) return;

    addFinancialTransactionsBatch(rowsToImport);

    setImportSuccessMsg(`${rowsToImport.length} adet banka işlemi başarıyla Mali Sistem & Kasa'ya aktarıldı!`);
    setTimeout(() => {
      setIsImportModalOpen(false);
      setParsedImportRows([]);
      setSelectedImportIndices([]);
      setImportSuccessMsg(null);
    }, 1800);
  };

  const downloadSampleBankExcel = () => {
    const sampleData = [
      ['İşlem Tarihi', 'Kanal*', 'İşlem Açıklaması', 'Tutar', 'Bakiye'],
      ['', '', 'DEVREDEN BAKİYE', '', '19,80'],
      ['19.04.2026', 'ŞB', 'Mevduat İşlemleri - 19/04/2026 tarihli QNB A.S. SSK Emekli Maaş 00', '23.252,62', '23.272,42'],
      ['20.04.2026', 'MB', 'Transfer İşlemleri - Alıcı : İsmail kaplan Türkiye Vakıflar Bankası T.A.O. Sorgu No: 1475626079 MOBIL', '-22.500,00', '772,42'],
      ['20.04.2026', 'MB', 'Transfer İşlemleri - Alıcı : İsmail kaplan Türkiye Vakıflar Bankası T.A.O. Sorgu No: 1476370584 MOBIL', '-300,00', '472,42'],
      ['21.04.2026', 'MB', 'Transfer İşlemleri - Gönderen : Dr. Selin Bozkurt Aura Klinik Web Satışı Sorgu No: 1478912345 MOBIL', '19.500,00', '19.972,42'],
      ['22.04.2026', 'MB', 'Transfer İşlemleri - Gönderen : Emre Karaca Atelier Artisan Ön Kapora Sorgu No: 1479834120 MOBIL', '6.000,00', '25.972,42'],
    ];
    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hesap Hareketleri');
    XLSX.writeFile(wb, 'ornek-qnb-finansbank-ekstresi.xlsx');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Tarih', 'Tur', 'Kategori', 'Baslik', 'Taraf', 'Tutar', 'Para Birimi', 'TL Karsiligi', 'Odeme Yontemi', 'Durum', 'Fatura No'];
    const rows = financialTransactions.map(tx => [
      tx.id,
      tx.date,
      tx.type === 'income' ? 'GELIR' : 'GIDER',
      CATEGORY_LABELS[tx.category]?.label || tx.category,
      `"${tx.title.replace(/"/g, '""')}"`,
      `"${tx.clientOrVendor.replace(/"/g, '""')}"`,
      tx.amount,
      tx.currency,
      tx.amountTRY,
      PAYMENT_METHOD_LABELS[tx.paymentMethod] || tx.paymentMethod,
      tx.status,
      tx.invoiceNumber || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vanguard-mali-dokum-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculated Metrics
  const metrics = useMemo(() => {
    let totalIncomeTRY = 0;
    let totalExpenseTRY = 0;
    let pendingIncomeTRY = 0;
    let completedCount = 0;

    financialTransactions.forEach(tx => {
      if (tx.status === 'completed') {
        completedCount++;
        if (tx.type === 'income') {
          totalIncomeTRY += tx.amountTRY;
        } else {
          totalExpenseTRY += tx.amountTRY;
        }
      } else if (tx.status === 'pending' && tx.type === 'income') {
        pendingIncomeTRY += tx.amountTRY;
      }
    });

    const netProfitTRY = totalIncomeTRY - totalExpenseTRY;
    const profitMargin = totalIncomeTRY > 0 ? Math.round((netProfitTRY / totalIncomeTRY) * 100) : 0;

    return {
      totalIncomeTRY,
      totalExpenseTRY,
      netProfitTRY,
      profitMargin,
      pendingIncomeTRY,
      completedCount,
    };
  }, [financialTransactions]);

  // Filtered list
  const filteredTransactions = useMemo(() => {
    return financialTransactions.filter(tx => {
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      if (statusFilter !== 'all' && tx.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && tx.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = tx.title.toLowerCase().includes(q);
        const matchesClient = tx.clientOrVendor.toLowerCase().includes(q);
        const matchesInvoice = tx.invoiceNumber?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesClient && !matchesInvoice) return false;
      }
      return true;
    });
  }, [financialTransactions, typeFilter, statusFilter, categoryFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-neutral-900 border border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-display">
                Mali Sistem & Kasa (Gelir / Gider Yönetimi)
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Hazır web sitesi satışları, kaporalar, sunucu/reklam giderleri ve net kâr analizi.
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-amber-400 font-mono font-medium border border-neutral-700/80">
                  TCMB USD: 34.52 ₺
                </span>
                <span className="px-2 py-0.5 rounded-md bg-neutral-800 text-amber-400 font-mono font-medium border border-neutral-700/80">
                  TCMB EUR: 37.84 ₺
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                  Seçili Para Birimi: {currentCurrency}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setIsImportModalOpen(true);
              setImportError(null);
              setImportSuccessMsg(null);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-800/60 rounded-xl transition-all cursor-pointer shadow-xs"
            title="Garanti, İş Bankası, Yapı Kredi, Akbank vb. Excel/CSV Ekstresini Yükle"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Banka Ekstresi / Excel Yükle</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer"
            title="Excel uyumlu CSV Raporu İndir"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV İndir</span>
          </button>

          <button
            onClick={() => handleOpenNew('expense')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 rounded-xl transition-all cursor-pointer"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Gider Ekle</span>
          </button>

          <button
            onClick={() => handleOpenNew('income')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Gelir / Satış Ekle</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Toplam Gelir */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
            <span>Tahsil Edilen Toplam Gelir</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-white">
              {formatPrice(metrics.totalIncomeTRY)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Gerçekleşen hazır site satışları</span>
          </div>
        </div>

        {/* Toplam Gider */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
            <span>Toplam Maliyet & Giderler</span>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-white">
              {formatPrice(metrics.totalExpenseTRY)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-400">
            <span>Sunucu, lisans, reklam ve operasyon</span>
          </div>
        </div>

        {/* Net Kasa / Kâr */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
            <span>Net Kasa & Faaliyet Kârı</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${metrics.netProfitTRY >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatPrice(metrics.netProfitTRY)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kâr Marjı: %{metrics.profitMargin}</span>
          </div>
        </div>

        {/* Bekleyen Tahsilatlar */}
        <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 relative overflow-hidden">
          <div className="flex items-center justify-between text-neutral-400 text-xs font-medium">
            <span>Bekleyen Tahsilatlar (Kapora/Bakiye)</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono text-white">
              {formatPrice(metrics.pendingIncomeTRY)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-blue-400">
            <span>Onay ve teslim aşamasında</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="İşlem adı, müşteri, firma veya fatura no ile ara..."
            className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {/* Type Filter */}
          <div className="flex p-0.5 rounded-xl bg-neutral-950 border border-neutral-800 shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${typeFilter === 'all' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              Tümü
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${typeFilter === 'income' ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              Gelirler
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${typeFilter === 'expense' ? 'bg-rose-500/20 text-rose-400 font-bold' : 'text-neutral-400 hover:text-white'}`}
            >
              Giderler
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300 focus:outline-none focus:border-amber-400 shrink-0"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="completed">Tamamlandı</option>
            <option value="pending">Bekliyor</option>
            <option value="cancelled">İptal</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-300 focus:outline-none focus:border-amber-400 shrink-0"
          >
            <option value="all">Tüm Kategoriler</option>
            {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/60 text-neutral-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Tarih</th>
                <th className="py-3 px-4">Tür & Kategori</th>
                <th className="py-3 px-4">İşlem Başlığı & Taraf</th>
                <th className="py-3 px-4">Ödeme Kanalı</th>
                <th className="py-3 px-4 text-right">Tutar</th>
                <th className="py-3 px-4 text-center">Durum</th>
                <th className="py-3 px-4 text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    Kriterlere uygun herhangi bir finansal kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map(tx => {
                  const isIncome = tx.type === 'income';
                  const catInfo = CATEGORY_LABELS[tx.category] || CATEGORY_LABELS.other;

                  return (
                    <tr key={tx.id} className="hover:bg-neutral-800/30 transition-colors">
                      {/* Tarih */}
                      <td className="py-3.5 px-4 font-mono text-neutral-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                          <span>{tx.date}</span>
                        </div>
                        {tx.invoiceNumber && (
                          <span className="text-[10px] text-neutral-500 font-mono block mt-0.5">
                            {tx.invoiceNumber}
                          </span>
                        )}
                      </td>

                      {/* Tür & Kategori */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                              isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${catInfo.color}`}
                          >
                            {catInfo.label}
                          </span>
                        </div>
                      </td>

                      {/* Başlık & Taraf */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-200">
                          {tx.title}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {tx.clientOrVendor || 'Belirtilmedi'}
                        </div>
                        {tx.notes && (
                          <div className="text-[10px] text-neutral-500 italic mt-0.5 line-clamp-1">
                            "{tx.notes}"
                          </div>
                        )}
                      </td>

                      {/* Ödeme Kanalı */}
                      <td className="py-3.5 px-4 text-neutral-400 whitespace-nowrap">
                        <span className="px-2 py-1 rounded bg-neutral-950 border border-neutral-800 text-[11px] font-mono">
                          {PAYMENT_METHOD_LABELS[tx.paymentMethod] || tx.paymentMethod}
                        </span>
                      </td>

                      {/* Tutar */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div
                          className={`font-mono font-bold text-sm ${
                            isIncome ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {isIncome ? '+' : '-'}
                          {tx.amount.toLocaleString()}{' '}
                          {tx.currency === 'TRY' ? '₺' : tx.currency === 'USD' ? '$' : tx.currency === 'EUR' ? '€' : '₽'}
                        </div>
                        {tx.currency !== 'TRY' && (
                          <div className="text-[10px] text-neutral-500 font-mono">
                            ≈ {formatPrice(tx.amountTRY)}
                          </div>
                        )}
                      </td>

                      {/* Durum */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {tx.status === 'completed' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Tamamlandı
                          </span>
                        )}
                        {tx.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                            Bekliyor
                          </span>
                        )}
                        {tx.status === 'cancelled' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-800 text-neutral-400">
                            İptal
                          </span>
                        )}
                      </td>

                      {/* Aksiyonlar */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(tx)}
                            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
                            title="Düzenle"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${tx.title}" kaydını silmek istediğinize emin misiniz?`)) {
                                deleteFinancialTransaction(tx.id);
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-800 transition-colors"
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

      {/* Add / Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-white my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    formType === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}
                >
                  {formType === 'income' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-sm font-bold font-display">
                    {editingId ? 'Mali Kaydı Düzenle' : formType === 'income' ? 'Yeni Gelir / Satış Kaydı' : 'Yeni Gider / Harcama Kaydı'}
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Kasa hareketini kaydedin ve finansal raporlarınıza anlık yansıtın.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 rounded-xl border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setFormType('income')}
                  className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    formType === 'income'
                      ? 'bg-emerald-500 text-black shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Gelir (Müşteri Satışı / Tahsilat)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormType('expense')}
                  className={`py-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    formType === 'expense'
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Gider (Sunucu / Reklam / Lisans)</span>
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  İşlem Açıklaması / Başlık *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="örn: Aura Dental Web Sitesi Profesyonel CMS Satışı"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Client or Vendor */}
              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  {formType === 'income' ? 'Müşteri Adı / Firma' : 'Tedarikçi / Sağlayıcı Firma'}
                </label>
                <input
                  type="text"
                  value={formClientOrVendor}
                  onChange={e => setFormClientOrVendor(e.target.value)}
                  placeholder={formType === 'income' ? 'örn: Dr. Selin Bozkurt' : 'örn: Hetzner Online / Cloudflare / Google Ads'}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Amount and Currency */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Tutar *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formAmount}
                    onChange={e => setFormAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 font-mono text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Para Birimi *
                  </label>
                  <select
                    value={formCurrency}
                    onChange={e => setFormCurrency(e.target.value as CurrencyCode)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 font-semibold focus:outline-none focus:border-amber-400"
                  >
                    <option value="TRY">TRY - Türk Lirası (₺)</option>
                    <option value="USD">USD - Amerikan Doları ($)</option>
                    <option value="EUR">EUR - Euro (€)</option>
                  </select>
                </div>
              </div>

              {/* Category and Payment Method */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as TransactionCategory)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                  >
                    {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Ödeme Yöntemi / Kanalı *
                  </label>
                  <select
                    value={formPaymentMethod}
                    onChange={e => setFormPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                  >
                    {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status and Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Durum *
                  </label>
                  <select
                    value={formStatus}
                    onChange={e => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="completed">Tamamlandı (Tahsil Edildi / Ödendi)</option>
                    <option value="pending">Bekliyor (Kapora / Teslimat Bekleniyor)</option>
                    <option value="cancelled">İptal Edildi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Tarih *
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={e => setFormDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Related Product (if applicable) & Invoice Number */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    İlgili Hazır Site (Opsiyonel)
                  </label>
                  <select
                    value={formRelatedProductId}
                    onChange={e => setFormRelatedProductId(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value="">İlişkili site yok</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-medium mb-1">
                    Fatura / Dekont No (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={formInvoiceNumber}
                    onChange={e => setFormInvoiceNumber(e.target.value)}
                    placeholder="örn: VNG-2026-0044"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-neutral-400 font-medium mb-1">
                  Özel Not / Açıklama
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="İşlem hakkında varsa ek ayrıntılar..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-neutral-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 rounded-xl"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl shadow-md cursor-pointer"
                >
                  {editingId ? 'Güncellemeyi Kaydet' : 'Kaydı Tamamla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bank Statement Excel / CSV Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 text-white my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-display">
                    Banka Ekstresi & Hesap Hareketleri İçe Aktarma
                  </h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Garanti BBVA, İş Bankası, Yapı Kredi, Akbank vb. internet bankacılığından indirdiğiniz Excel veya CSV ekstresini yükleyin.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compatible Banks Badges */}
            <div className="mt-4 p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3 text-xs flex-wrap">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Building2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Uyumlu Bankalar:</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-neutral-300">
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">Garanti BBVA</span>
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">İş Bankası</span>
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">Yapı Kredi</span>
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">Akbank</span>
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">Ziraat Bankası</span>
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">QNB / Enpara</span>
                <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">Tüm .xlsx / .csv</span>
              </div>
            </div>

            {/* Error & Success Messages */}
            {importError && (
              <div className="mt-4 p-3 rounded-xl bg-red-950/40 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccessMsg && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{importSuccessMsg}</span>
              </div>
            )}

            {/* File Upload Zone */}
            {parsedImportRows.length === 0 ? (
              <div className="mt-6 border-2 border-dashed border-neutral-700 hover:border-amber-400/80 rounded-2xl p-8 text-center transition-colors bg-neutral-950/50">
                <input
                  type="file"
                  id="bank-file-input"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleBankFileUpload}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>

                <h5 className="text-sm font-bold text-white mb-1">
                  Banka Ekstresi Dosyanızı Buraya Sürükleyin veya Seçin
                </h5>
                <p className="text-xs text-neutral-400 max-w-md mx-auto mb-4">
                  İnternet bankacılığınızın "Hesap Hareketleri" sayfasından indirdiğiniz Excel (.xlsx / .xls) veya CSV dosyasını seçin. Gelen havale ve FAST ödemeleri otomatik ayrıştırılacaktır.
                </p>

                <div className="flex items-center justify-center gap-3">
                  <label
                    htmlFor="bank-file-input"
                    className="px-5 py-2.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-xl shadow-md cursor-pointer inline-flex items-center gap-2 transition-all"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>{isParsingFile ? 'Dosya İşleniyor...' : 'Dosya Seç & Yükle'}</span>
                  </label>

                  <button
                    type="button"
                    onClick={downloadSampleBankExcel}
                    className="px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    title="Standart formatı görmek için örnek şablonu indirin"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Örnek Excel Şablonu İndir</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Parsed Rows Preview */
              <div className="mt-5 space-y-4">
                {/* Stats Bar */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-white">
                      Dosya: <span className="font-mono text-amber-400">{importFileName}</span>
                    </span>
                    <span className="text-neutral-500">|</span>
                    <span className="text-neutral-400">
                      Okunan: <strong className="text-white">{parsedImportRows.length}</strong> işlem
                    </span>
                    <span className="text-neutral-500">|</span>
                    <span className="text-neutral-400">
                      Seçilen: <strong className="text-emerald-400">{selectedImportIndices.length}</strong> işlem
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedImportIndices(parsedImportRows.map((_, i) => i))}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                    >
                      Tümünü Seç
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedImportIndices(
                          parsedImportRows
                            .map((r, i) => (r.type === 'income' ? i : -1))
                            .filter(i => i !== -1)
                        )
                      }
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 hover:bg-emerald-900/60"
                    >
                      Sadece Gelenleri Seç
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedImportIndices([])}
                      className="px-2.5 py-1 text-[11px] rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400"
                    >
                      Seçimi Temizle
                    </button>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="max-h-[380px] overflow-y-auto rounded-xl border border-neutral-800 bg-neutral-950">
                  <table className="w-full text-left text-xs">
                    <thead className="sticky top-0 bg-neutral-900 text-neutral-400 text-[11px] border-b border-neutral-800 z-10">
                      <tr>
                        <th className="py-2.5 px-3 w-8">
                          <input
                            type="checkbox"
                            checked={selectedImportIndices.length === parsedImportRows.length}
                            onChange={e => {
                              if (e.target.checked) {
                                setSelectedImportIndices(parsedImportRows.map((_, i) => i));
                              } else {
                                setSelectedImportIndices([]);
                              }
                            }}
                            className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                          />
                        </th>
                        <th className="py-2.5 px-3">Tarih</th>
                        <th className="py-2.5 px-3">Tür</th>
                        <th className="py-2.5 px-3">Açıklama / Gönderen</th>
                        <th className="py-2.5 px-3">Kategori</th>
                        <th className="py-2.5 px-3 text-right">Tutar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/60">
                      {parsedImportRows.map((row, idx) => {
                        const isSelected = selectedImportIndices.includes(idx);
                        const isIncome = row.type === 'income';

                        return (
                          <tr
                            key={idx}
                            className={`hover:bg-neutral-900/50 transition-colors ${
                              isSelected ? 'bg-neutral-900/30' : 'opacity-60'
                            }`}
                          >
                            <td className="py-2 px-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedImportIndices([...selectedImportIndices, idx]);
                                  } else {
                                    setSelectedImportIndices(selectedImportIndices.filter(i => i !== idx));
                                  }
                                }}
                                className="rounded border-neutral-700 bg-neutral-900 text-amber-500"
                              />
                            </td>
                            <td className="py-2 px-3 font-mono text-neutral-400 whitespace-nowrap">
                              {row.date}
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isIncome
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}
                              >
                                {isIncome ? 'GELİR (Gelen)' : 'GİDER (Giden)'}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <div className="font-medium text-neutral-200 line-clamp-1">{row.title}</div>
                              <div className="text-[10px] text-neutral-400">{row.clientOrVendor}</div>
                            </td>
                            <td className="py-2 px-3 whitespace-nowrap">
                              <span className="text-[10px] text-neutral-400">
                                {CATEGORY_LABELS[row.category]?.label || row.category}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-right font-mono font-bold whitespace-nowrap">
                              <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>
                                {isIncome ? '+' : '-'}
                                {row.amount.toLocaleString('tr-TR')} ₺
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Modal Footer Controls */}
                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setParsedImportRows([]);
                      setSelectedImportIndices([]);
                      setImportFileName('');
                    }}
                    className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
                  >
                    Farklı Dosya Seç
                  </button>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsImportModalOpen(false)}
                      className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-800 rounded-xl"
                    >
                      Kapat
                    </button>
                    <button
                      type="button"
                      disabled={selectedImportIndices.length === 0}
                      onClick={handleConfirmImport}
                      className="px-5 py-2 text-xs font-semibold text-black bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>{selectedImportIndices.length} Adet İşlemi Kasaya Aktar</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

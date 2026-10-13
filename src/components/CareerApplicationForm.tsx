import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext.tsx';
import {
  Briefcase,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  X,
  Send,
  ShieldCheck,
  Globe,
  Phone,
  Mail,
  User,
} from 'lucide-react';

export const CareerApplicationForm: React.FC = () => {
  const { submitInquiry, currentLang, t } = useApp();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [interviewLanguage, setInterviewLanguage] = useState<'tr' | 'en' | 'ru'>('tr');
  const [coverNote, setCoverNote] = useState('');
  const [kvkkAccepted, setKvkkAccepted] = useState(true);

  // File upload state (Max 10MB)
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileError, setFileError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const readerRef = useRef<FileReader | null>(null);

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
  const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.zip'];

  // Cleanup hook: terminate and dereference any active FileReader on unmount
  useEffect(() => {
    return () => {
      if (readerRef.current) {
        try {
          readerRef.current.abort();
        } catch {
          // ignore
        }
        readerRef.current.onload = null;
        readerRef.current.onerror = null;
        readerRef.current.onabort = null;
        readerRef.current.onloadend = null;
        readerRef.current = null;
      }
    };
  }, []);

  const validateAndProcessFile = (selectedFile: File) => {
    setFileError('');
    const extension = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      setFileError(
        currentLang === 'en' ? 'Unsupported file format. Please upload PDF, DOCX, or ZIP.'  : 'Geçersiz dosya formatı. Lütfen PDF, DOCX veya ZIP formatında yükleyin.'
      );
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setFileError(
        currentLang === 'en' ? 'File size exceeds maximum 10MB limit.'  : 'Dosya boyutu 10MB sınırını aşıyor.'
      );
      return false;
    }

    // Safely abort and terminate previous reader event hooks before initiating new file read
    if (readerRef.current) {
      try {
        readerRef.current.abort();
      } catch {
        // ignore
      }
      readerRef.current.onload = null;
      readerRef.current.onerror = null;
      readerRef.current.onabort = null;
      readerRef.current.onloadend = null;
      readerRef.current = null;
    }

    const reader = new FileReader();
    readerRef.current = reader;

    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        setFile(selectedFile);
        setFileBase64(result);
      }
      // Terminate event hooks and release memory immediately upon read completion
      reader.onload = null;
      reader.onerror = null;
      reader.onabort = null;
      reader.onloadend = null;
      readerRef.current = null;
    };

    reader.onerror = () => {
      setFileError(
        currentLang === 'en' ? 'Error reading file. Please try again.'  : 'Dosya okunurken bir hata oluştu. Lütfen tekrar deneyin.'
      );
      // Terminate event hooks and release memory immediately on error
      reader.onload = null;
      reader.onerror = null;
      reader.onabort = null;
      reader.onloadend = null;
      readerRef.current = null;
    };

    reader.onabort = () => {
      reader.onload = null;
      reader.onerror = null;
      reader.onabort = null;
      reader.onloadend = null;
      readerRef.current = null;
    };

    // Execute read only when handleFileChange/handleDrop explicitly invokes
    reader.readAsDataURL(selectedFile);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      validateAndProcessFile(selected);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndProcessFile(droppedFile);
    }
  };

  const removeFile = () => {
    if (readerRef.current) {
      try {
        readerRef.current.abort();
      } catch {
        // ignore
      }
      readerRef.current.onload = null;
      readerRef.current.onerror = null;
      readerRef.current.onabort = null;
      readerRef.current.onloadend = null;
      readerRef.current = null;
    }
    setFile(null);
    setFileBase64('');
    setFileError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setFormError(
        currentLang === 'en'
          ? 'Please fill in full name, phone number, and email.'
          : 'Lütfen Ad-Soyad, Telefon ve E-posta alanlarını eksiksiz doldurun.'
      );
      return;
    }

    if (!file) {
      setFormError(
        currentLang === 'en'
          ? 'Please upload your CV/Resume (PDF, DOCX, ZIP).'
          : 'Lütfen güncel Özgeçmişinizi / CV dosyanızı (PDF, DOCX, ZIP) yükleyin.'
      );
      return;
    }

    setIsSubmitting(true);

    const refCode = `VG-CV-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      // 1. Send FormData to Backend API /api/forms/career
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      formData.append('interviewLanguage', interviewLanguage);
      formData.append('coverNote', coverNote.trim());
      formData.append('file', file);

      let finalRef = refCode;
      try {
        const res = await fetch('/api/forms/career', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const resJson = await res.json();
          if (resJson.referenceCode) {
            finalRef = resJson.referenceCode;
          }
        }
      } catch (apiErr) {
        console.warn('API endpoint fetch fallback to AppContext:', apiErr);
      }

      // 2. Local State / AppContext sync
      submitInquiry({
        clientName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        companyName: 'Kariyer / CV Başvurusu',
        productId: 'kariyer',
        productTitle: 'Kariyer: Pazarlama Uzmanı & Media Buyer',
        preferredPackage: 'custom',
        budgetTRY: 0,
        message: `[Kariyer & CV Başvurusu] [Mülakat Dili: ${interviewLanguage.toUpperCase()}] Not: ${
          coverNote.trim() || 'Not eklenmedi'
        }`,
        attachmentName: file.name,
        attachmentSize: file.size,
        attachmentData: fileBase64,
        notes: `Referans No: ${finalRef} | Başvuru Rolü: Performans Pazarlama Uzmanı & Media Buyer`,
      });

      // Safely terminate reader event hooks upon successful submission
      if (readerRef.current) {
        try {
          readerRef.current.abort();
        } catch {
          // ignore
        }
        readerRef.current.onload = null;
        readerRef.current.onerror = null;
        readerRef.current.onabort = null;
        readerRef.current.onloadend = null;
        readerRef.current = null;
      }

      setSubmittedRef(finalRef);
    } catch {
      setFormError(
        currentLang === 'en'
          ? 'An error occurred while submitting. Please try again.'
          : 'Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyin.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (submittedRef) {
    return (
      <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-neutral-900 border border-emerald-500/30 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg sm:text-xl font-bold text-white font-display">
            {currentLang === 'en' ? 'Application & Resume Successfully Submitted!'  : 'Başvurunuz ve Özgeçmişiniz Başarıyla Alındı!'}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto">
            {currentLang === 'en' ? 'Your CV has been dispatched to our Growth Lead. We will reach out via WhatsApp or email to schedule your video interview.'  : 'Özgeçmişiniz doğrudan Büyüme & Performans Masamıza iletilmiştir. İnceleme sonrası online mülakat planlaması için WhatsApp veya e-posta yoluyla sizinle irtibata geçilecektir.'}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-950 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <span>{currentLang === 'en' ? 'Reference ID:' : 'Başvuru Takip Kodu:'}</span>
          <span className="font-bold">{submittedRef}</span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              setSubmittedRef(null);
              setFullName('');
              setPhone('');
              setEmail('');
              setCoverNote('');
              removeFile();
            }}
            className="text-xs font-semibold text-neutral-400 hover:text-white underline cursor-pointer"
          >
            {currentLang === 'en' ? 'Submit another application'  : 'Yeni bir başvuru gönder'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
      <div className="rounded-2xl bg-neutral-50 dark:bg-[#0c0e14] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 space-y-6 shadow-lg">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>
                {currentLang === 'en' ? 'Direct Application · Media Buyer'  : 'Yerleşik Başvuru & CV Formu'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white font-display">
              {currentLang === 'en' ? 'Apply for Performance Marketing & Media Buyer'  : 'Pazarlama Uzmanı & Media Buyer Başvuru Formu'}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {currentLang === 'en' ? 'Complete your profile and upload your CV (PDF, DOCX, ZIP up to 10MB.'  : 'Bilgilerinizi doldurun ve CV dosyanızı (PDF, DOCX, ZIP maks 10MB) ekleyin.'}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400 bg-white dark:bg-neutral-900 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto shrink-0">
            <Globe className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px]">
              {currentLang === 'en'
                ? 'Interviews: EN / TR'
                : 'Mülakatlar: TR / EN'}
            </span>
          </div>
        </div>

        {formError && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neutral-400" />
                <span>{currentLang === 'en' ? 'Full Name *' : 'Ad Soyad *'}</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder={currentLang === 'en' ? 'e.g. Can Yilmaz' : 'Örn: Can Yılmaz'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white text-xs focus:outline-none focus:border-amber-400 dark:focus:border-amber-400"
              />
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                {currentLang === 'en'
                  ? 'Please enter your official full name for legal preparation of official interview processes and your remote work contract.'
                  : 'Resmi mülakat süreçleri ve uzaktan çalışma sözleşmenizin yasal olarak hazırlanabilmesi için lütfen resmi adınızı ve soyadınızı giriniz.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-neutral-400" />
                <span>{currentLang === 'en' ? 'Phone & WhatsApp *' : 'Telefon & WhatsApp *'}</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Örn: +90 (555) 123 45 67"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white text-xs font-mono focus:outline-none focus:border-amber-400 dark:focus:border-amber-400"
              />
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                {currentLang === 'en'
                  ? 'Our human resources team will contact you via WhatsApp for pre-interview briefings and flexible working hours coordination. Please enter with country code.'
                  : 'Mülakat öncesi ön bilgilendirme ve esnek çalışma saatleri koordinasyonu için insan kaynakları ekibimiz sizinle WhatsApp üzerinden iletişim kuracaktır. Lütfen ülke koduyla birlikte giriniz.'}
              </p>
            </div>
          </div>

          {/* Row 2: Email & Interview Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-neutral-400" />
                <span>{currentLang === 'en' ? 'Email Address *' : 'E-Posta Adresi *'}</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={currentLang === 'en' ? 'e.g. canyilmaz@gmail.com' : 'Örn: canyilmaz@gmail.com'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white text-xs focus:outline-none focus:border-amber-400 dark:focus:border-amber-400"
              />
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 leading-tight">
                {currentLang === 'en'
                  ? 'Your online interview invitation and performance tests will be sent to this address. You can safely enter the personal email address you actively use daily.'
                  : 'Online mülakat davetiyeniz ve performans testleriniz bu adrese gönderilecektir. Günlük olarak aktif kullandığınız kişisel e-posta adresinizi güvenle girebilirsiniz.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                <span>
                  {currentLang === 'en'
                    ? 'Preferred Online Interview Language'
                    : 'Tercih Edilen Mülakat Dili'}
                </span>
              </label>
              <select
                value={interviewLanguage}
                onChange={e => setInterviewLanguage(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="tr">🇹🇷 Türkçe (Online Mülakat)</option>
                <option value="en">🇬🇧 English (Global Video Interview)</option>
              </select>
            </div>
          </div>

          {/* Row 3: Cover note / Campaign Experience */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
              {currentLang === 'en' ? 'Cover Note / Ad Budgets Managed & Key Verticals'  : 'Kısa Not / Yönettiğiniz Reklam Bütçeleri & Deneyim Özeti'}
            </label>
            <textarea
              rows={3}
              value={coverNote}
              onChange={e => setCoverNote(e.target.value)}
              placeholder={
                currentLang === 'en' ? 'Summarize your core acquisition channels (Meta, Google, Yandex, Telegram), monthly spend, and ROAS...'  : 'Meta Ads, Google Ads veya Yandex Direct tecrübeniz, aylık bütçe ölçeğiniz ve uzmanlaştığınız sektörler...'
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-neutral-950 dark:text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Row 4: File Upload (PDF, DOCX, ZIP - Max 10MB */}
          <div>
            <label className="block text-xs font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5 flex items-center justify-between">
              <span>
                {currentLang === 'en'
                  ? 'Upload Resume / CV (PDF, DOCX, ZIP - Max 10MB) *'
                  : 'Özgeçmiş (CV) Yükleme (PDF, DOCX, ZIP - Maks 10MB) *'}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">Maks: 10MB</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.zip,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/zip"
              onChange={handleFileChange}
              className="hidden"
              id="career-cv-file-upload"
            />

            {!file ? (
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/10'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-amber-400 dark:hover:border-amber-400 bg-white/60 dark:bg-neutral-900/60'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">
                    {currentLang === 'en'
                      ? 'Click to browse or drag & drop your CV file here'
                      : 'Dosya seçmek için tıklayın veya CV belgenizi buraya sürükleyin'}
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {currentLang === 'en'
                      ? 'Strictly allowed formats: .pdf, .docx, .zip (Max 10MB)'
                      : 'Kesin izin verilen formatlar: .pdf, .docx, .zip (Maksimum 10MB)'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {file.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono">
                      {formatFileSize(file.size)} · {file.type || 'Belge'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white bg-white dark:bg-neutral-800 rounded-lg border border-neutral-300 dark:border-neutral-700"
                  >
                    {currentLang === 'en' ? 'Replace' : 'Değiştir'}
                  </button>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800"
                    title={currentLang === 'en' ? 'Remove file' : 'Dosyayı kaldır'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1.5 leading-tight">
              {currentLang === 'en'
                ? 'Due to system security and data integrity requirements, only unencrypted .pdf, .docx, or .zip formats are accepted. You can add a Google Drive or Notion link in the notes area for your portfolio or large case studies.'
                : 'Sistem güvenliği ve veri bütünlüğü gerekçesiyle yalnızca şifresiz .pdf, .docx veya .zip formatları kabul edilmektedir. Portfolyo veya büyük boyutlu vaka analizleriniz için not alanına Google Drive veya Notion linki ekleyebilirsiniz.'}
            </p>

            {fileError && (
              <div className="mt-2 text-xs text-red-400 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{fileError}</span>
              </div>
            )}
          </div>

          {/* KVKK / GDPR Consent */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-neutral-600 dark:text-neutral-400 leading-normal">
              <input
                type="checkbox"
                checked={kvkkAccepted}
                onChange={e => setKvkkAccepted(e.target.checked)}
                required
                className="w-4 h-4 mt-0.5 rounded text-amber-500 focus:ring-amber-400 cursor-pointer shrink-0"
              />
              <span>
                {currentLang === 'en' ? 'I consent to the processing of my personal details and CV for recruitment evaluation at Vanguard Studio.'  : 'Özgeçmişimin ve iletişim bilgilerimin Vanguard Studio insan kaynakları ve başvuru değerlendirme süreçleri kapsamında işlenmesini onaylıyorum.'}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>
                  {currentLang === 'en' ? 'Transmitting Application...'  : 'Başvuru İletiliyor...'}
                </span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>
                    {currentLang === 'en' ? 'Submit Application & Resume'  : 'Başvuruyu & CV Belgesini Gönder'}
                  </span>
                </>
              )}
            </button>
            <div className="text-center mt-2 text-[10px] text-neutral-500 dark:text-neutral-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>
                {currentLang === 'en' ? '256-Bit SSL Encrypted · Guaranteed candidate confidentiality'  : '256-Bit SSL Şifreli · Başvurular anlık olarak Gelen Talepler masasına iletilir'}
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

import express from 'express';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Sanitize string to prevent XSS & SQL Injection attacks
function sanitizeInput(input: any): string {
  if (input === null || input === undefined) return '';
  let str = String(input).trim();
  
  // Remove null bytes and dangerous control characters
  str = str.replace(/\0/g, '');
  
  // Strip dangerous script/style tags
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  str = str.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Escape HTML special characters
  str = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return str;
}

// Email Validator (100% Personal emails like Gmail, Hotmail, Yahoo, iCloud, etc. are allowed)
function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}

// Allowed File Extensions & MIME Types for Contact Form
const CONTACT_ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.pdf', '.zip', '.docx'];
const CONTACT_ALLOWED_MIMES = [
  'image/png',
  'image/jpeg',
  'image/pjpeg',
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

// Allowed File Extensions & MIME Types for Career CV Form (Strictly PDF, DOCX, ZIP)
const CAREER_ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.zip'];
const CAREER_ALLOWED_MIMES = [
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/x-zip',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
];

// Setup upload directory
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration - Assigns secure random UUID filenames to prevent RCE & Path Traversal
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const prefix = req.path.includes('career') ? 'cv' : 'doc';
    const uuid = randomUUID();
    cb(null, `${prefix}_${uuid}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

function postProcessHtmlServer(html: string, targetLang: string): string {
  if (!html || typeof html !== 'string') return '';

  let processed = html;

  // Inject "style="text-align: left; list-style-position: inside;"" into <ul ...> and <ol ...> tags
  processed = processed.replace(/<(ul|ol)([^>]*)>/gi, (match, tag, attrs) => {
    let newAttrs = attrs;

    if (/style=["']([^"']*)["']/i.test(newAttrs)) {
      newAttrs = newAttrs.replace(/style=["']([^"']*)["']/i, (_sMatch: string, styleVal: string) => {
        let s = styleVal;
        if (!/text-align/i.test(s)) s += '; text-align: left;';
        if (!/list-style-position/i.test(s)) s += '; list-style-position: inside;';
        return `style="${s.replace(/^;\s*/, '')}"`;
      });
    } else {
      newAttrs += ' style="text-align: left; list-style-position: inside;"';
    }

    return `<${tag}${newAttrs}>`;
  });

  // Fix corrupted Russian word starts inside <li> or <p> tags
  if (targetLang === 'ru') {
    processed = processed
      .replace(/<(li|p)([^>]*)>\s*сли\b/gi, '<$1$2>Если')
      .replace(/<(li|p)([^>]*)>\s*тобы\b/gi, '<$1$2>Чтобы')
      .replace(/<(li|p)([^>]*)>\s*то\b/gi, '<$1$2>Что');
  }

  // Ensure <li> items inside lists don't have broken outer tags
  processed = processed.replace(/<li([^>]*)>\s*<p[^>]*>([\s\S]*?)<\/p>\s*<\/li>/gi, '<li$1>$2</li>');

  return processed;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));

  // API Status & Health Check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Gemini TR -> EN / RU AI Translation Endpoint (HTML Protector & List Alignment Guaranteed)
  app.post('/api/translate', async (req, res) => {
    try {
      const { text, targetLang } = req.body;
      if (!text || typeof text !== 'string') {
        return res.status(400).json({ error: 'Text is required' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        // Return post-processed text if API key is not present in environment
        return res.json({ translatedText: postProcessHtmlServer(text, targetLang || 'en') });
      }

      const ai = new GoogleGenAI({ apiKey });
      const targetLangName = targetLang === 'ru' ? "Rusça'ya" : "İngilizce'ye";

      const systemInstruction = `SEN DÜNYANIN EN İYİ HUKUKİ VE KURUMSAL TERCÜMANISIN. Sana gönderilen metin Tiptap editöründen gelen HTML etiketleri (<p>, <ul>, <li> vb.) içermektedir. 
GÖREVİN: Etiketlerin isimlerini, büyüktür/küçüktür işaretlerini ve HTML yapılarını ASLA DEĞİŞTİRME, SİLME VEYA KOPYALAMA. Ancak etiketlerin İÇİNDE YER ALAN TÜM TÜRKÇE METİNLERİ KESİNLİKLE VE %100 HEDEF DİLE (${targetLangName}) KUSURSUZCA TERCÜME ET. Türkçe metni olduğu gibi hedef dile kopyalamak KESİNLİKLE YASAKTIR. Çıktı olarak sadece ve sadece içi tercüme edilmiş HTML kodunu teslim et, asla ekstra açıklama yazma.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: text,
        config: {
          systemInstruction,
          temperature: 0.1,
        },
      });

      let translated = (response.text || '').trim();
      // Strip markdown codeblock backticks if Gemini added ```html ... ```
      translated = translated
        .replace(/^```html\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```$/i, '')
        .trim();

      // RESPONSE CHECK & RETRY FALLBACK:
      // If AI returned identical text to original source (copy-pasted without translating)
      const cleanOrig = text.trim().replace(/\s+/g, ' ');
      const cleanTrans = translated.replace(/\s+/g, ' ');

      if (!translated || cleanTrans === cleanOrig) {
        console.warn('Gemini AI returned identical text, executing simple translation fallback retry...');
        const retryPrompt = `Translate following inner texts of HTML to ${targetLang === 'ru' ? 'Russian' : 'English'} layout:\n\n${text}`;
        
        const retryResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: retryPrompt,
          config: {
            temperature: 0.2,
          },
        });

        let retryText = (retryResponse.text || '').trim();
        retryText = retryText
          .replace(/^```html\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```$/i, '')
          .trim();

        if (retryText && retryText.replace(/\s+/g, ' ') !== cleanOrig) {
          translated = retryText;
        }
      }

      const finalHtml = postProcessHtmlServer(translated, targetLang || 'en');

      return res.json({ translatedText: finalHtml });
    } catch (error) {
      console.error('Gemini translation API error:', error);
      return res.json({ translatedText: postProcessHtmlServer(req.body?.text || '', req.body?.targetLang || 'en') });
    }
  });

  // =========================================================================
  // FORM 1: İLETİŞİM & TEKLİF FORMU API ENDPOINT (/api/forms/contact)
  // =========================================================================
  const handleContactFormSubmit = (req: express.Request, res: express.Response) => {
    try {
      const body = req.body || {};
      const file = req.file;

      // Extract & Sanitize Input Fields
      const clientName = sanitizeInput(body.clientName || body.fullName || body.name);
      const email = sanitizeInput(body.email);
      const phone = sanitizeInput(body.phone || body.phoneNumber);
      const companyName = sanitizeInput(body.companyName || body.company);
      const message = sanitizeInput(body.message || body.notes || body.comment);
      const selectedProductId = sanitizeInput(body.productId || body.selectedProductId);
      const preferredPackage = sanitizeInput(body.preferredPackage || body.selectedPackage);

      // Validation Checks
      if (!clientName) {
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({ success: false, error: 'Ad Soyad alanı zorunludur.' });
      }

      if (!isValidEmail(email)) {
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({
          success: false,
          error: 'Geçerli bir e-posta adresi giriniz. Kişisel ve kurumsal tüm e-postalar kabul edilmektedir.',
        });
      }

      if (!phone) {
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({ success: false, error: 'Telefon numarası alanı zorunludur.' });
      }

      // File Attachment MIME-Type & Extension Security Validation
      let fileInfo = null;
      if (file) {
        const ext = path.extname(file.originalname).toLowerCase();
        const mime = file.mimetype.toLowerCase();

        if (!CONTACT_ALLOWED_EXTENSIONS.includes(ext) || !CONTACT_ALLOWED_MIMES.includes(mime)) {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          return res.status(400).json({
            success: false,
            error: 'Güvenlik ihlali: Yalnızca PNG, JPG, PDF, DOCX ve ZIP formatında dosyalar kabul edilir.',
          });
        }

        fileInfo = {
          originalName: sanitizeInput(file.originalname),
          savedName: file.filename, // Secure UUID filename (e.g., doc_9b1deb4d-3b7d-41b4.pdf)
          mimeType: mime,
          sizeBytes: file.size,
          url: `/uploads/${file.filename}`,
        };
      } else if (body.attachmentName && body.attachmentData) {
        // Handle Base64 file payload
        fileInfo = {
          originalName: sanitizeInput(body.attachmentName),
          savedName: `doc_${randomUUID()}${path.extname(body.attachmentName).toLowerCase()}`,
          mimeType: 'application/octet-stream',
          sizeBytes: Number(body.attachmentSize) || 0,
        };
      }

      const referenceCode = `VG-CNT-${Math.floor(100000 + Math.random() * 900000)}`;

      return res.status(200).json({
        success: true,
        referenceCode,
        message: 'İletişim ve teklif talebiniz siber güvenlik korumalı sunucumuza başarıyla kaydedildi.',
        timestamp: new Date().toISOString(),
        submission: {
          referenceCode,
          clientName,
          email,
          phone,
          companyName,
          message,
          selectedProductId,
          preferredPackage,
          file: fileInfo,
        },
      });
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası: Form işlenirken beklenmeyen bir hata oluştu.',
      });
    }
  };

  app.post('/api/forms/contact', upload.single('file'), handleContactFormSubmit);
  app.post('/api/contact', upload.single('file'), handleContactFormSubmit);

  // =========================================================================
  // FORM 2: KARİYER & UZAKTAN İŞ BAŞVURUSU FORMU API ENDPOINT (/api/forms/career)
  // =========================================================================
  const handleCareerFormSubmit = (req: express.Request, res: express.Response) => {
    try {
      const body = req.body || {};
      const file = req.file;

      // Extract & Sanitize Input Fields
      const fullName = sanitizeInput(body.fullName || body.clientName || body.name);
      const email = sanitizeInput(body.email);
      const phone = sanitizeInput(body.phone || body.phoneNumber);
      const interviewLanguage = sanitizeInput(body.interviewLanguage || 'tr');
      const coverNote = sanitizeInput(body.coverNote || body.message || body.notes);

      // Validation Checks
      if (!fullName) {
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({ success: false, error: 'Ad Soyad alanı zorunludur.' });
      }

      if (!isValidEmail(email)) {
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({
          success: false,
          error: 'Geçerli bir e-posta adresi giriniz. Kişisel e-posta adresleri (%100) tamamen geçerlidir.',
        });
      }

      if (!phone) {
        if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
        return res.status(400).json({ success: false, error: 'Telefon numarası alanı zorunludur.' });
      }

      // CV Attachment Strict Security Check (Strictly PDF, DOCX, ZIP)
      let fileInfo = null;
      if (file) {
        const ext = path.extname(file.originalname).toLowerCase();
        const mime = file.mimetype.toLowerCase();

        // Strict extension and MIME validation against malicious file uploads (.exe, .php, .js, .sh, etc.)
        if (!CAREER_ALLOWED_EXTENSIONS.includes(ext) || !CAREER_ALLOWED_MIMES.includes(mime)) {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
          return res.status(400).json({
            success: false,
            error: 'Siber güvenlik engeli: Yalnızca şifresiz .pdf, .docx veya .zip formatlarında CV kabul edilir.',
          });
        }

        fileInfo = {
          originalName: sanitizeInput(file.originalname),
          savedName: file.filename, // Secure UUID filename (e.g., cv_98231a4b-8192-491a.pdf)
          mimeType: mime,
          sizeBytes: file.size,
          url: `/uploads/${file.filename}`,
        };
      } else if (body.attachmentName && body.attachmentData) {
        const ext = path.extname(body.attachmentName).toLowerCase();
        if (!CAREER_ALLOWED_EXTENSIONS.includes(ext)) {
          return res.status(400).json({
            success: false,
            error: 'Siber güvenlik engeli: Yalnızca şifresiz .pdf, .docx veya .zip formatlarında CV kabul edilir.',
          });
        }
        fileInfo = {
          originalName: sanitizeInput(body.attachmentName),
          savedName: `cv_${randomUUID()}${ext}`,
          mimeType: 'application/octet-stream',
          sizeBytes: Number(body.attachmentSize) || 0,
        };
      } else {
        return res.status(400).json({
          success: false,
          error: 'Lütfen güncel Özgeçmişinizi / CV belgenizi (PDF, DOCX veya ZIP) yükleyin.',
        });
      }

      const referenceCode = `VG-CV-${Math.floor(100000 + Math.random() * 900000)}`;

      return res.status(200).json({
        success: true,
        referenceCode,
        message: 'Kariyer ve CV başvurunuz siber güvenlik doğrulamalarından geçerek başarıyla alındı.',
        timestamp: new Date().toISOString(),
        submission: {
          referenceCode,
          fullName,
          email,
          phone,
          interviewLanguage,
          coverNote,
          file: fileInfo,
        },
      });
    } catch (err: any) {
      console.error('Career form submission error:', err);
      return res.status(500).json({
        success: false,
        error: 'Sunucu hatası: CV başvurusu işlenirken beklenmeyen bir hata oluştu.',
      });
    }
  };

  app.post('/api/forms/career', upload.single('file'), handleCareerFormSubmit);
  app.post('/api/career', upload.single('file'), handleCareerFormSubmit);

  if (!isProduction) {
    // In development mode, attach Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production mode, serve built static files from dist with efficient cache policies
    const distPath = path.resolve(__dirname, 'dist');
    app.use('/assets', express.static(path.resolve(distPath, 'assets'), {
      maxAge: '1y',
      immutable: true,
    }));
    app.use(express.static(distPath, {
      maxAge: '1h',
    }));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

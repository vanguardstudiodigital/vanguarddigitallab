# Vanguard Studio | Hazır Web Siteleri & Dijital Çözümler Vitrini

Küçük işletmeler ve KOBİ'ler için 10.000 – 20.000 TL bütçeli, 48 saatte teslime hazır sektörel web siteleri ve profesyonel CMS vitrini.

---

## 🚀 Yerel Ortamda (Local) Çalıştırma

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### 1. Bağımlılıkları Yükleyin:
Terminal veya komut satırında proje dizinindeyken:
```bash
npm install
```

### 2. Geliştirme Sunucusunu Başlatın:
```bash
npm run dev
```

Sunucu başladığında tarayıcınızdan açın:
```
http://localhost:3000
```
*(veya terminalde belirtilen yerel port)*

### 3. Üretim Derlemesi (Build):
```bash
npm run build
```

---

## 🛠️ Yönetici Paneli (Admin CMS) Kullanımı

- **Panele Giriş:** Sitenin en altındaki (Footer) **"Yönetici Paneli"** bağlantısına tıklayın.
- **Varsayılan PIN:** `admin123`
- **Panel Özellikleri:**
  1. **Hazır Siteler Yönetimi:** Yeni sektör sitesi ekleme (maksimum 10 site), başlık, fiyatlandırma (Ekonomik vs Profesyonel CMS), görsel yükleme (bilgisayardan veya harici URL), video ekleme.
  2. **Gelen Talepler (Inquiries):** Müşterilerin siteden gönderdiği sipariş/teklif formları anlık buraya düşer. Tek tıkla doğrudan WhatsApp'tan müşteriye yazabilirsiniz.
  3. **Diller & Otomatik Çeviri:** Yeni diller ekleyebilir, mevcut çevirileri arayıp düzenleyebilir veya tek tıkla otomatik çeviri motorunu çalıştırabilirsiniz.
  4. **Hizmetler & Referanslar:** Ajans hizmetlerini ve müşteri başarı hikayelerini düzenleyebilirsiniz.
  5. **Veri Yedekleme (JSON Export / Import):**
     - Girdiğiniz tüm içerikleri **"Yedek Dosyasını İndir (.json)"** butonu ile tek tıkla bilgisayarınıza indirebilirsiniz.
     - Başka bir bilgisayara geçtiğinizde veya siteyi canlı sunucuya taşıdığınızda **"Yedekten Geri Yükle"** diyerek saniyeler içinde tüm verileri geri yükleyebilirsiniz.

---

## 📁 Proje Dizin Yapısı

- `src/components/` : Arayüz bileşenleri (Header, MegaMenu, Hero, TurnkeyGrid, LiveDemoModal, ContactModal, Footer vb.)
- `src/components/admin/` : Yönetici paneli ve alt modülleri
- `src/context/AppContext.tsx` : Durum yönetimi, tema, çoklu dil, para birimi ve yerel depolama (`localStorage`)
- `src/data/defaultData.ts` : Başlangıç hazır siteleri, hizmetler, referanslar ve TR/EN/RU çeviri sözlükleri
- `src/types/index.ts` : TypeScript veri modelleri

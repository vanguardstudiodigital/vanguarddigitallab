// Sector-specific rich data and templates for all 9 ready-made turnkey websites
// Fully localized for TR, EN, and RU

export interface DoctorStaff {
  name: string;
  role: string;
  specialty: string;
  image: string;
  experience: string;
}

export interface MedicalTreatment {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  priceNote: string;
}

export interface AttorneyStaff {
  name: string;
  title: string;
  barNumber: string;
  specialties: string[];
  image: string;
  education: string;
}

export interface LegalPracticeArea {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  casesHandled: string;
}

export interface RestaurantMenuItem {
  id: string;
  category: 'pizza' | 'mains' | 'breakfast' | 'dessert' | 'drinks';
  title: string;
  description: string;
  priceTRY: number;
  dietaryTags?: string[];
  image: string;
  isChefSpecial?: boolean;
}

export interface ArchitectureProject {
  id: string;
  title: string;
  category: string;
  location: string;
  area: string;
  year: string;
  image: string;
  description: string;
}

export interface LogisticsService {
  id: string;
  title: string;
  transitTime: string;
  route: string;
  description: string;
  icon: string;
}

export interface EcomProduct {
  id: string;
  title: string;
  category: string;
  priceTRY: number;
  oldPriceTRY?: number;
  image: string;
  specs: string[];
  inStock: boolean;
  rating: number;
}

export interface RealEstateListing {
  id: string;
  title: string;
  type: string;
  location: string;
  priceTRY: number;
  priceUSD: number;
  bedrooms: number;
  bathrooms: number;
  areaM2: number;
  image: string;
  features: string[];
  isFeatured?: boolean;
}

export interface FitnessPlan {
  id: string;
  name: string;
  monthlyTRY: number;
  features: string[];
  isPopular?: boolean;
}

export interface FitnessTrainer {
  name: string;
  role: string;
  specialty: string;
  image: string;
}

export interface StudioCaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  metric: string;
  image: string;
  description: string;
}

export const TURNKEY_TEMPLATES = {
  medical: {
    heroKicker: {
      tr: 'Aura Dental & Estetik Ağız Sağlığı Polikliniği',
      en: 'Aura Dental & Aesthetic Oral Health Clinic',
    },
    heroHeading: {
      tr: 'Gülüşünüzü Yeniden Keşfedin: Modern & Ağrısız Diş Hekimliği',
      en: 'Rediscover Your Confident Smile: Modern & Painless Dentistry',
    },
    heroSub: {
      tr: 'Almanya & İsviçre standartlarında FDA onaylı dijital gülüş tasarımı, ömür boyu garantili implantlar ve uzman hekim kadromuzla yanınızdayız.',
      en: 'FDA-certified digital smile architecture, lifetime guaranteed implants, and specialized dentists practicing European clinical standards.',
    },
    ctaButton: {
      tr: 'Online Randevu Oluştur',
      en: 'Book Online Appointment',
    },
    staffTitle: {
      tr: 'Uzman Hekim Kadromuz',
      en: 'Our Specialist Doctors',
    },
    doctors: [
      {
        name: 'Dt. Selin Yılmaz',
        role: 'Ağız, Diş ve Çene Cerrahisi',
        specialty: 'İmplantoloji & All-on-Four Tedavisi',
        experience: '14+ Yıl Deneyim · Hacettepe Üniv.',
        image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=70',
      },
      {
        name: 'Dr. Kerem Aksoy',
        role: 'Estetik Diş Hekimi',
        specialty: 'Zirkonyum & Porselen Lamine Gülüş Tasarımı',
        experience: '11+ Yıl Deneyim · İstanbul Üniv. Çapa',
        image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=70',
      },
      {
        name: 'Dt. Zeynep Kaya',
        role: 'Ortodonti Uzmanı',
        specialty: 'Şeffaf Plak (Invisalign) & Çene Ortopedisi',
        experience: '9+ Yıl Deneyim · Ege Üniv.',
        image: 'https://images.unsplash.com/photo-1594824813628-98e8749bcbf8?auto=format&fit=crop&w=400&q=70',
      },
    ],
    treatments: [
      {
        id: 't-1',
        title: 'Dijital Gülüş Tasarımı (Hollywood Smile)',
        category: 'Estetik',
        duration: '2 - 3 Seans',
        description: 'Yüz hatlarınıza ve mimiklerinize tam uyumlu 3D taranmış porselen lamine ve zirkonyum kaplama uygulaması.',
        priceNote: 'Kişiye Özel Planlama',
      },
      {
        id: 't-2',
        title: 'Dikişsiz & Hızlı İmplant Tedavisi',
        category: 'Cerrahi',
        duration: 'Tek Günde İmplant',
        description: 'İsviçre Straumann ve Alman Medentika implant sistemleriyle ömür boyu uluslararası garanti sertifikası.',
        priceNote: 'FDA & CE Onaylı',
      },
      {
        id: 't-3',
        title: 'Şeffaf Plak ile Telsiz Ortodonti',
        category: 'Ortodonti',
        duration: '6 - 12 Ay',
        description: 'Dışarıdan fark edilmeyen şeffaf plaklarla diş çapraşıklıklarını konforlu ve acısız düzeltme protokolü.',
        priceNote: '3D Simülasyon Dahil',
      },
      {
        id: 't-4',
        title: 'Klinik Tipi Lazer Diş Beyazlatma (Zoom)',
        category: 'Estetik',
        duration: '45 Dakika',
        description: 'Diş minenize zarar vermeden tek seansta 6-8 ton doğal beyazlık kazandıran ileri teknoloji fotokatalitik sistem.',
        priceNote: 'Ağrısız & Hızlı',
      },
    ],
  },

  law: {
    heroKicker: {
      tr: 'Lexington Hukuk & Uluslararası Danışmanlık Bürosu',
      en: 'Lexington Legal & Global Advisory Chambers',
    },
    heroHeading: {
      tr: 'Hukuki Güvenceniz, Ticari Başarınızın Temelidir',
      en: 'Your Legal Certainty, The Foundation of Business Growth',
    },
    heroSub: {
      tr: 'Şirketler hukuku, gayrimenkul ihtilafları, yabancılar hukuku ve kurumsal sözleşme yönetiminde müvekkil odaklı, yüksek gizlilik standartlarında avukatlık hizmeti.',
      en: 'Specialized counsel in corporate structuring, cross-border M&A, real estate litigation, and strategic commercial contracts with strict confidentiality.',
    },
    ctaButton: {
      tr: 'Ön Hukuki Değerlendirme İste',
      en: 'Request Legal Assessment',
    },
    staffTitle: {
      tr: 'Ortak ve Kıdemli Avukatlarımız',
      en: 'Managing Partners & Senior Counsel',
    },
    doctors: [
      {
        name: 'Av. Mehmet Eren Lexington',
        role: 'Yönetici Ortak · Baro Sicil: 38410',
        specialty: 'Şirketler & Ticaret Hukuku, M&A',
        experience: '18+ Yıl Dava & Danışmanlık · Galatasaray Üniv.',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=70',
      },
      {
        name: 'Av. Begüm Soylu',
        role: 'Kıdemli Ortak · Baro Sicil: 45920',
        specialty: 'Gayrimenkul, İnşaat & Kira Hukuku',
        experience: '12+ Yıl Dava Tecrübesi · Ankara Üniv. Hukuk',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=70',
      },
      {
        name: 'Av. Aleksandr V. Petrov',
        role: 'Uluslararası Danışman',
        specialty: 'Yabancılar Hukuku & Rusya/BDT Ticareti',
        experience: '15+ Yıl Uluslararası Tahkim · Moskova MGIMO',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=70',
      },
    ],
    practices: [
      {
        id: 'p-1',
        title: 'Şirketler Hukuku & Kurumsal Sözleşmeler',
        subtitle: 'Ticaret & Danışmanlık',
        description: 'Şirket kuruluşu, ortaklar sözleşmesi, genel kurul hazırlıkları, birleşme & devralma (M&A) süreçleri.',
        casesHandled: '240+ Şirket Portföyü',
      },
      {
        id: 'p-2',
        title: 'Gayrimenkul, İnşaat & Tapu Uyuşmazlıkları',
        subtitle: 'Mülkiyet & İhtilaf',
        description: 'Tapu iptali ve tescil davaları, kat karşılığı inşaat sözleşmeleri, kira tespit ve tahliye uyuşmazlıkları.',
        casesHandled: '180+ Çözümlenen Dava',
      },
      {
        id: 'p-3',
        title: 'Yabancılar Hukuku & Vatandaşlık İşlemleri',
        subtitle: 'Uluslararası Yatırım',
        description: 'Gayrimenkul yatırımıyla Türk vatandaşlığı, ikamet tezkeresi, yabancı şirket şube açılışı ve çalışma izinleri.',
        casesHandled: '450+ Başarılı Dosya',
      },
      {
        id: 'p-4',
        title: 'İş Hukuku Danışmanlığı & Arabuluculuk',
        subtitle: 'İşveren & Çalışan',
        description: 'Kıdem-ihbar tazminatları, işe iade davaları, gizlilik sözleşmeleri ve kurumsal insan kaynakları mevzuat uyumu.',
        casesHandled: '%92 Arabuluculuk Başarısı',
      },
    ],
  },

  restaurant: {
    heroKicker: {
      tr: 'Artisan Roast & Taş Fırın Gastronomi',
      en: 'Artisan Roast & Hearthside Gastronomy',
    },
    heroHeading: {
      tr: 'Gerçek Odun Ateşinde, Nitelikli Malzemelerle Hazırlanan Lezzetler',
      en: 'Wood-Fired Flavors Crafted with Farm-to-Table Ingredients',
    },
    heroSub: {
      tr: '48 saat fermente ekşi mayalı taş fırın pizzalar, taze el yapımı makarnalar ve kendi kavrumumuz nitelikli kahvelerle Kadıköy ve Nişantaşı’nda.',
      en: 'Slow-fermented sourdough pizzas, handcrafted pasta, and specialty single-origin coffees roasted in-house daily.',
    },
    ctaButton: {
      tr: 'Online Masa Ayırt',
      en: 'Reserve a Table',
    },
    menu: [
      {
        id: 'm-1',
        category: 'pizza' as const,
        title: 'Truffle & Funghi Pizza',
        description: 'Trüf kreması, taze porcini ve istiridye mantarları, manda fior di latte, fior di sale ve kekik.',
        priceTRY: 380,
        dietaryTags: ['Vejetaryen', 'Şefin Spesiyali'],
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=70',
        isChefSpecial: true,
      },
      {
        id: 'm-2',
        category: 'pizza' as const,
        title: 'Burrata Margherita D.O.P.',
        description: 'San Marzano domates sosu, fesleğen, soğuk sıkım sızma zeytinyağı, fırın çıkışı taze Burrata peyniri.',
        priceTRY: 340,
        dietaryTags: ['İtalyan Klasiği'],
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=400&q=70',
      },
      {
        id: 'm-3',
        category: 'mains' as const,
        title: 'El Yapımı Pappardelle al Ragu',
        description: 'Taze yumurtalı geniş makarna, 8 saat ağır ateşte pişmiş dana incik ragu sosu, 24 ay eskitilmiş Parmesan.',
        priceTRY: 410,
        dietaryTags: ['Taze Hamur'],
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d62817d2?auto=format&fit=crop&w=400&q=70',
        isChefSpecial: true,
      },
      {
        id: 'm-4',
        category: 'breakfast' as const,
        title: 'Artisan Benedict & Kruvasan',
        description: 'Tereyağlı sıcak kruvasan üzerinde poşe köy yumurtası, füme dana kaburga, ev yapımı trüflü hollandaise sos.',
        priceTRY: 290,
        dietaryTags: ['Tüm Gün Kahvaltı'],
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=70',
      },
      {
        id: 'm-5',
        category: 'dessert' as const,
        title: 'Akışkan San Sebastian Cheesecake',
        description: 'Yüksek ısıda fırınlanmış karamelize kabuk, kremsi akışkan iç dolgu, yanında eritilmiş Belçika çikolatası.',
        priceTRY: 180,
        dietaryTags: ['Glutensiz'],
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=400&q=70',
      },
    ],
  },

  architecture: {
    heroKicker: {
      tr: 'Khora Mimarlık & Çağdaş İç Mekan Tasarımı',
      en: 'Khora Architecture & Contemporary Interior Studio',
    },
    heroHeading: {
      tr: 'Işık, Doku ve Malzemenin Kusursuz Mekansal Uyumu',
      en: 'Timeless Spatial Harmony of Light, Texture, and Raw Form',
    },
    heroSub: {
      tr: 'Lüks konutlar, butik oteller ve modern çalışma alanları için konsept aşamasından anahtar teslim şantiye yönetimine kadar uçtan uca mimari vizyon.',
      en: 'From concept sketch to turnkey execution, delivering bespoke residential villas, boutique hospitality, and human-centric commercial environments.',
    },
    ctaButton: {
      tr: 'Proje Görüşmesi Başlat',
      en: 'Discuss Your Project',
    },
    projects: [
      {
        id: 'arch-1',
        title: 'Villa Mare Serenity',
        category: 'Lüks Konut Mimarlık',
        location: 'Kaş / Antalya',
        area: '540 m²',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=70',
        description: 'Akdeniz yamacına gömülü taş ve brüt beton mimari; sonsuzluk havuzu ve panoramik deniz cepheli cam cepheler.',
      },
      {
        id: 'arch-2',
        title: 'Atelier Khora Penthouse',
        category: 'İç Mimari & Renovasyon',
        location: 'Nişantaşı / İstanbul',
        area: '280 m²',
        year: '2024',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=70',
        description: 'Doğal ceviz ahşap paneller, traverten şömine ve özel tasarım aydınlatmalarla sessiz lüks (silent luxury) konsepti.',
      },
      {
        id: 'arch-3',
        title: 'Nordic Tech Campus',
        category: 'Ticari & Ofis Tasarımı',
        location: 'Maslak / İstanbul',
        area: '2.400 m²',
        year: '2025',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=70',
        description: 'Biyofilik tasarım öğeleri, akustik podlar ve esnek hibrit çalışma istasyonlarıyla çalışan refahını artıran çalışma alanı.',
      },
    ],
  },

  logistics: {
    heroKicker: {
      tr: 'Nordic Global Lojistik & Kıtalararası Taşımacılık',
      en: 'Nordic Global Freight & Multimodal Logistics',
    },
    heroHeading: {
      tr: 'Türkiye, Rusya ve Avrupa Hattında Kesintisiz Tedarik Zinciri',
      en: 'Resilient Cross-Border Supply Chains Linking Eurasia & Europe',
    },
    heroSub: {
      tr: 'Karayolu komple (FTL) ve parsiyel (LTL) taşımacılık, denizyolu konteyner, ekspres hava kargo ve gümrüklü antrepo çözümlerimizle 7/24 operasyon güvencesi.',
      en: 'Door-to-door temperature-controlled FTL/LTL freight, ocean container shipping, air express, and bonded customs warehousing with live telematics tracking.',
    },
    ctaButton: {
      tr: 'Anlık Navlun Teklifi Al',
      en: 'Instant Freight Quote',
    },
    services: [
      {
        id: 'log-1',
        title: 'Karayolu FTL & LTL Parsiyel Taşıma',
        transitTime: '4 - 7 Gün Teslim',
        route: 'Türkiye ⇄ Rusya / BDT & Avrupa',
        description: 'Euro 6 filomuzla tenteli, frigo ve mega araçlarla kapıdan kapıya düzenli parsiyel ve komple taşımacılık.',
        icon: 'Truck',
      },
      {
        id: 'log-2',
        title: 'Denizyolu FCL & LCL Konteyner',
        transitTime: 'Düzenli Hat Servisi',
        route: 'Ambarlı, Mersin, Novorossiysk, St. Petersburg',
        description: 'Dünya çapında armatörlerle özel navlun kontratları, liman elleçleme, transit gümrükleme ve iç taşıma.',
        icon: 'Ship',
      },
      {
        id: 'log-3',
        title: 'Gümrükleme & Antrepo Depolama',
        transitTime: 'Aynı Gün İşlem',
        route: 'İstanbul & Moskova Lojistik Merkezleri',
        description: 'A Tipi gümrüklü antrepo, gümrük müşavirliği, GTİP tespiti, serbest dolaşım ve geçici depolama desteği.',
        icon: 'ShieldCheck',
      },
    ],
  },

  ecommerce: {
    heroKicker: {
      tr: 'Velo Butik · Bisiklet, Ekipman & Şehir Hareketliliği',
      en: 'Velo Boutique · Urban Cycling, Gear & Micro-Mobility',
    },
    heroHeading: {
      tr: 'Şehirde Özgürlük: Üstün Tasarım, Sıfır Emisyon',
      en: 'Pure Urban Freedom: Precision Craftsmanship, Zero Emission',
    },
    heroSub: {
      tr: 'Karbon yol bisikletleri, şık şehir modelleri, İtalyan kasklar ve profesyonel su geçirmez çantalarla sürüş deneyiminizi bir üst seviyeye taşıyın.',
      en: 'Carbon performance road machines, minimalist city commuters, Italian aero helmets, and weatherproof technical bike packs.',
    },
    ctaButton: {
      tr: 'Kataloğu & Ürünleri Gör',
      en: 'Explore Product Catalog',
    },
    products: [
      {
        id: 'v-1',
        title: 'Velo Corsa Pro Carbon Yol Bisikleti',
        category: 'Yol Bisikleti',
        priceTRY: 48500,
        oldPriceTRY: 54000,
        image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=70',
        specs: ['7.6 kg Karbon Kadro', 'Shimano 105 Di2 2x12', 'Hidrolik Disk Fren'],
        inStock: true,
        rating: 4.9,
      },
      {
        id: 'v-2',
        title: 'Metropolis Minimalist Şehir Bisikleti',
        category: 'Şehir & Commuter',
        priceTRY: 24500,
        image: 'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=400&q=70',
        specs: ['Kayış Aktarma (Yağsız)', 'Entegre Dinamo Far', 'Nexus 8 Vites'],
        inStock: true,
        rating: 4.8,
      },
      {
        id: 'v-3',
        title: 'Aero MIPS Güvenlik Kaskı (Mat Titanyum)',
        category: 'Kask & Güvenlik',
        priceTRY: 4200,
        oldPriceTRY: 4900,
        image: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=400&q=70',
        specs: ['MIPS Beyin Koruma', '240g Süper Hafif', 'Manyetik Fidlock Toka'],
        inStock: true,
        rating: 5.0,
      },
      {
        id: 'v-4',
        title: 'Waterproof DryBag Heybe & Tur Çantası 24L',
        category: 'Aksesuar & Çanta',
        priceTRY: 2850,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=70',
        specs: ['IPX6 Tam Su Geçirmez', 'Hızlı Tık-Kilit Montaj', 'Reflektif Güvenlik Şeridi'],
        inStock: true,
        rating: 4.9,
      },
    ],
  },

  realestate: {
    heroKicker: {
      tr: 'Veritas Gayrimenkul & Yatırım Portföyü',
      en: 'Veritas Luxury Real Estate & Prime Assets',
    },
    heroHeading: {
      tr: 'Değer Kazanan Seçkin Mülkler ve Güvenli Yatırım Danışmanlığı',
      en: 'High-Yield Trophy Properties & Trusted Asset Advisory',
    },
    heroSub: {
      tr: 'Antalya, Bodrum ve İstanbul’un en prestijli lokasyonlarında; vatandaşlığa ve yüksek kira getirisine uygun lüks villalar, rezidanslar ve ticari gayrimenkuller.',
      en: 'Curated seaside villas, penthouses, and commercial real estate in premier Turkish coastal & metropolitan enclaves qualified for residence and citizenship.',
    },
    ctaButton: {
      tr: 'Seçkin Portföyü İncele',
      en: 'View Prime Listings',
    },
    properties: [
      {
        id: 're-1',
        title: 'Panoramik Deniz Manzaralı Akıllı Villa',
        type: 'Müstakil Villa',
        location: 'Kalkan / Kaş, Antalya',
        priceTRY: 29500000,
        priceUSD: 850000,
        bedrooms: 4,
        bathrooms: 4,
        areaM2: 380,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=70',
        features: ['Sonsuzluk Havuzu', 'Akıllı Ev Sistemi', 'Yüksek Sezonluk Kira', 'Vatandaşlığa Uygun'],
        isFeatured: true,
      },
      {
        id: 're-2',
        title: 'Boğaz Manzaralı Tarihi Yalı Dairesi',
        type: 'Rezidans & Yalı',
        location: 'Bebek / Beşiktaş, İstanbul',
        priceTRY: 42000000,
        priceUSD: 1200000,
        bedrooms: 3,
        bathrooms: 2,
        areaM2: 210,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=70',
        features: ['Özel Rıhtım Kullanımı', 'Tarihi Eser Statüsü', 'Özel Kapalı Otopark'],
        isFeatured: true,
      },
      {
        id: 're-3',
        title: 'Modern Marina Rezidans & Bahçe Katı',
        type: 'Lüks Daire',
        location: 'Yalıkavak / Bodrum',
        priceTRY: 19800000,
        priceUSD: 570000,
        bedrooms: 2,
        bathrooms: 2,
        areaM2: 145,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=70',
        features: ['Marinaya 300 Metre', 'Site İçi Özel Plaj', '7/24 Özel Güvenlik & Concierge'],
      },
    ],
  },

  fitness: {
    heroKicker: {
      tr: 'Pulse Elite Wellness & Bireysel Antrenörlük Kulübü',
      en: 'Pulse Elite Wellness & Private Athletic Coaching',
    },
    heroHeading: {
      tr: 'Hedeflerinize Bilimsel Antrenman ve Uzman Koçlukla Ulaşın',
      en: 'Transform Your Performance with Science-Based Athletic Coaching',
    },
    heroSub: {
      tr: 'Kişiye özel biomekanik analiz, Reformer Pilates, fonksiyonel güç antrenmanları ve beslenme takibiyle sonuç odaklı lüks wellness deneyimi.',
      en: 'Private personal training, clinical Reformer Pilates, high-performance HIIT, and bespoke nutritional programming tailored to your biometric profile.',
    },
    ctaButton: {
      tr: 'Ücretsiz 1 Günlük Deneme Al',
      en: 'Get Free 1-Day Trial Pass',
    },
    plans: [
      {
        id: 'fit-1',
        name: 'Silver Access (Aylık Sınırsız)',
        monthlyTRY: 2400,
        features: [
          'Tüm Fitness & Kardiyo Alanına Sınırsız Giriş',
          'Akıllı Vücut Yağ/Kas Analizi (InBody 770)',
          'Ücretsiz Havlu, Dolap ve Sauna Kullanımı',
          'Mobil Antrenman Takip Uygulaması',
        ],
      },
      {
        id: 'fit-2',
        name: 'Gold Club (Grup Dersleri Dahil)',
        monthlyTRY: 3600,
        isPopular: true,
        features: [
          'Silver Kapsamındaki Tüm Haklar',
          'Sınırsız Pilates, Yoga ve Boks Grup Dersleri',
          'Ayda 2 Seans Bireysel PT Ölçüm Seansı',
          'Wellness & Beslenme Danışmanlığı',
          'Misafir Davet Hakkı (Ayda 2 Kez)',
        ],
      },
      {
        id: 'fit-3',
        name: 'VIP Private PT (Birebir Koçluk)',
        monthlyTRY: 7800,
        features: [
          'Haftada 3 Gün Özel Eğitmenle Birebir Çalışma',
          'Kişisel Diyetisyen & Makro Beslenme Planı',
          'Reformer Pilates Özel Stüdyo Kullanımı',
          'VIP Soyunma Odası & Spa Masaj İndirimi',
          '7/24 WhatsApp Eğitmen Desteği',
        ],
      },
    ],
  },

  portfolio: {
    heroKicker: {
      tr: 'Aethel Tasarım Stüdyosu & Dijital Marka Kolektifi',
      en: 'Aethel Design Studio & Digital Brand Collective',
    },
    heroHeading: {
      tr: 'Cesur Markalar İçin Sıra Dışı Tasarımlar & Web Çözümleri',
      en: 'Unconventional Digital Products & Branding for Forward-Thinking Brands',
    },
    heroSub: {
      tr: 'UI/UX stratejisi, ödüllü 3D web deneyimleri ve küresel marka kimliği tasarımıyla işletmenizi sektöründe zirveye taşıyoruz.',
      en: 'Transforming ambitious brands through bespoke UI/UX architecture, award-winning interactive design, and high-conversion web development.',
    },
    ctaButton: {
      tr: 'Proje Başlatın / Brief İletin',
      en: 'Start a Project / Send Brief',
    },
    staffTitle: {
      tr: 'Kreatif Direktörler & Ekip',
      en: 'Creative Directors & Collective',
    },
    caseStudies: [
      {
        id: 'cs-1',
        title: 'Luminary Global FinTech Portal',
        client: 'Luminary Asset Management (Zürih / Londra)',
        category: 'Web App & Design System',
        metric: '+310% Dönüşüm Artışı',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=70',
        description: 'Kurumsal kur ve varlık yönetimi için karanlık mod odaklı, mikro etkileşimli yeni nesil finans arayüzü mimarisi.',
      },
      {
        id: 'cs-2',
        title: 'Maison Élysée Haute Couture',
        client: 'Élysée Parfums (Paris)',
        category: 'Lüks E-Ticaret & 3D Deneyim',
        metric: 'Awwwards Site of the Day',
        image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=70',
        description: 'WebGL interaktif şişe keşif deneyimi ve akıcı minimalist alışveriş akışıyla küresel lüks segment satış rekoru.',
      },
      {
        id: 'cs-3',
        title: 'Hyperion Autonomous Mobility',
        client: 'Hyperion Robotics (Berlin)',
        category: 'Marka Kimliği & 3D Web',
        metric: 'FWA of the Day Ödülü',
        image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=600&q=70',
        description: 'Otonom lojistik robotları için fütüristik marka dili, interaktif simülasyon ve Series-B yatırım lansmanı.',
      },
      {
        id: 'cs-4',
        title: 'Aura Health Biometric App',
        client: 'Aura Health Technologies (Stockholm)',
        category: 'iOS/Android UI/UX Mimarisi',
        metric: '4.9 App Store Puanı (80k İndirme)',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=70',
        description: 'Kullanıcı dostu sağlık takibi, biyometrik kalp ritmi görselleştirmeleri ve tele-sağlık randevu ekosistemi.',
      },
    ],
  },

  custom: {
    heroKicker: {
      tr: 'UFO Dünyası & Kozmik Medya Portalı',
      en: 'UFO World & Cosmic Media Portal',
    },
    heroHeading: {
      tr: 'Evrenin Gizemlerini ve Siber Teorileri Keşfedin',
      en: 'Unlock the Mysteries of the Universe & Cyber Theories',
    },
    heroSub: {
      tr: 'Yapay zeka analizli uydu telemetrileri, doğrulanmış ufo ihbarları ve siber uzay araştırmalarıyla kitleleri büyüleyen yeni nesil dijital medya şablonu.',
      en: 'Next-gen digital media template captivating audiences with AI-analyzed satellite telemetries, verified UFO reports, and cyberspace research.',
    },
    ctaButton: {
      tr: 'Topluluğa Katıl / Yazı Gönder',
      en: 'Join Community / Submit Post',
    },
    staffTitle: {
      tr: 'Yapay Zeka Araştırmacıları & İçerik Kurulu',
      en: 'AI Researchers & Editorial Board',
    },
    caseStudies: [
      {
        id: 'ufo-cs-1',
        title: {
          tr: 'Roswell Dosyaları Yeniden Açıldı: Derin Öğrenme Analizi',
          en: 'Roswell Files Reopened: Deep Learning Telemetry',
        },
        client: 'Kozmik Araştırma Masası',
        category: 'Yapay Zeka Telemetri',
        metric: '%99.4 Siber Doğrulama',
        image: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=70',
        description: {
          tr: '1947 Roswell olayına ait ses kayıtları ve askeri radyo izleri gelişmiş AI modelleriyle yeniden işlendi ve spektrogram anomalileri haritalandırıldı.',
          en: '1947 Roswell event audio logs and military radio traces reprocessed with advanced AI deep learning models to map frequency anomalies.',
        },
      },
      {
        id: 'ufo-cs-2',
        title: {
          tr: 'Oumuamua Yıldızlararası Sondası ve İtki Teorileri',
          en: 'Oumuamua Interstellar Probe & Propulsion Theories',
        },
        client: 'Astfizik & Siber İnceleme',
        category: 'Derin Uzay',
        metric: '38.2 km/sn Yörünge Hızı',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=70',
        description: {
          tr: 'Güneş sistemimizden geçen ilk yıldızlararası cismin ışık yansıma ivmesi ve yapay yelken olma olasılığına dair simülasyon raporu.',
          en: 'Simulation report analyzing light reflection acceleration and artificial solar sail probability of the first interstellar visitor.',
        },
      },
      {
        id: 'ufo-cs-3',
        title: {
          tr: 'Antarktika Gizli Anomali Sinyalleri ve Yeraltı Radarı',
          en: 'Antarctica Hidden Anomaly Signals & Subterranean Radar',
        },
        client: 'Kutup Siber Telemetri',
        category: 'Anomali Analizi',
        metric: '4.2 GHz Mikro Sinyal',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=70',
        description: {
          tr: 'Buz tabakasının 3 km altında tespit edilen manyetik kırılmalar ve yapay frekans dalgalarının yapay zeka destekli topoğrafik analizi.',
          en: 'Topographic AI analysis of magnetic fractures and artificial frequency waves detected 3 km under the Antarctic ice sheet.',
        },
      },
      {
        id: 'ufo-cs-4',
        title: {
          tr: 'Pentagon UAP Raporu ve Siber Savunma Protokolü',
          en: 'Pentagon UAP Dossier & Cyber Defense Protocol',
        },
        client: 'Küresel Siber Medya',
        category: 'Gizli Belge Analizi',
        metric: '144 Doğrulanmış Vaka',
        image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=70',
        description: {
          tr: 'Pentagon tarafından açıklanan resmi UAP görüntülerinin termal sensör verileri ve yapay zeka hız vektörü doğrulama çalışmaları.',
          en: 'Thermal sensor telemetry and AI velocity vector validation studies on official declassified Pentagon UAP footage.',
        },
      },
    ],
  },
};

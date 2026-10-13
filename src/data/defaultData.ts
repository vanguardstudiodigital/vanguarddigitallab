import {
  TurnkeyProduct,
  ServiceItem,
  ReferenceItem,
  AgencySettings,
  NavigationItem,
  CustomPage,
  FaqItem,
  LanguageDef,
  TranslationDictionary,
  CurrencyInfo,
  CentralBankRate,
  AdvisoryServiceConfig,
  BankAccountItem,
  LegalTaxInfo,
  FinancialTransaction,
  BankAccountInfo
} from '../types/index.ts';

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'TRY', symbol: '₺', name: 'Türk Lirası', rateToTRY: 1 },
  { code: 'USD', symbol: '$', name: 'ABD Doları', rateToTRY: 35.5 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToTRY: 38.2 },
];

export const DEFAULT_CENTRAL_BANK_RATES: CentralBankRate[] = [
  { pair: 'USD / TRY', rate: 35.50, change: '+0.14%', source: 'TCMB' },
  { pair: 'EUR / TRY', rate: 38.20, change: '+0.08%', source: 'TCMB' },
];

export const DEFAULT_ADVISORY_SERVICE: AdvisoryServiceConfig = {
  id: "advisory-vip",
  badge: "VIP Advisory · Enterprise Tech Desk",
  packageName: "Vanguard Nexus (Premium Web & AI Advisory)",
  priceText: "Starting from $1,500+ (50,000 TRY)",
  priceSubtext: "Bespoke project-based pricing",
  basePriceTRY: 50000,
  features: [
    "Enterprise Web Infrastructure & Performance Transformation",
    "Custom LLM & AI Model Integration",
    "KVKK & GDPR Compliant System Architecture",
    "Google Lighthouse 99+ Speed & SEO Optimization",
    "B2B Strategic Technology Roadmap"
  ],
  buttonText: "Schedule Strategy Session",
  buttonLink: "#tech-advisory",
  description: "Direct C-Level technical advisory in digital transformation, custom AI models, and enterprise high-scale architecture.",
  isActive: true,
  translations: {
    en: {
      badge: "VIP Advisory · Enterprise Tech Desk",
      packageName: "Vanguard Nexus (Premium Web & AI Advisory)",
      priceText: "Starting from $1,500+ (50,000 TRY)",
      priceSubtext: "Bespoke project-based pricing",
      features: [
        "Enterprise Web Infrastructure & Performance Transformation",
        "Custom LLM & AI Model Integration",
        "KVKK & GDPR Compliant System Architecture",
        "Google Lighthouse 99+ Speed & SEO Optimization",
        "B2B Strategic Technology Roadmap"
      ],
      buttonText: "Schedule Strategy Session",
      description: "Direct C-Level technical advisory in digital transformation, custom AI models, and enterprise high-scale architecture."
    }
  }
};

export const DEFAULT_PRODUCTS: TurnkeyProduct[] = [
  {
    id: "prod-dental-clinic",
    title: "Dental & Estetik Klinik",
    sector: "Sağlık & Klinik",
    slug: "aura-dental-clinic",
    tagline: "Hasta randevu akışını artıran prestijli klinik web platformu.",
    description: "Özel diş hekimleri, estetik klinikleri, dermatologlar ve doktor muayenehaneleri için 'sessiz lüks' tasarım diliyle geliştirilmiş elit bir dijital vitrin. Tek Tıkla WhatsApp Hızlı Randevu Sistemi ile entegre edilmiştir.",
    priceEconomicTRY: 12500,
    priceProfessionalTRY: 19500,
    features: [
      "WhatsApp & Online Ön Randevu Sistemi",
      "Hekimler ve Tedavi Branşları Tanıtım Sayfaları",
      "Önce / Sonra Tedavi Sonuçları Galeri Modülü",
      "Google Haritalar ve Klinik Konumu Entegrasyonu",
      "Mobil Uyumlu, Süper Hızlı (99+ Lighthouse)",
      "Temel SEO ve SSL Güvenlik Sertifikası"
    ],
    coverImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=70",
    galleryImages: [
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=70"
    ],
    videoUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
    isVideoLocal: false,
    badge: "Popüler",
    deliveryDays: 2,
    demoType: "medical",
    isFeaturedInMegaMenu: true,
    active: true,
    translations: {
      en: {
        title: "Aura Dental & Aesthetic Clinic",
        sector: "Healthcare & Clinic",
        tagline: "Prestigious clinic storefront driving continuous patient bookings",
        description: "Engineered for private dentists, aesthetic practices, and medical doctors. Equipped with fast WhatsApp appointment dispatch, doctor team showcase, and mobile treatment catalog.",
        badge: "Popular",
        features: [
          "WhatsApp & Instant Online Booking System",
          "Doctor Profiles & Treatment Branch Showcase",
          "Before & After Clinical Results Gallery",
          "Google Maps Location & Driving Directions",
          "Mobile-First & Ultra Fast (99+ Lighthouse)",
          "Core SEO Setup & Free SSL Certificate"
        ]
      }
    }
  },
  {
    id: "prod-law-firm",
    title: "Hukuk Bürosu & Danışmanlık",
    sector: "Hukuk & Müşavirlik",
    slug: "lexington-law-firm",
    tagline: "Güven, ciddiyet ve kurumsal saygınlık aşılayan avukatlık bürosu platformu.",
    description: "Hukuk büroları, bağımsız avukatlar ve mali müşavirler için adaletin ve kurumsal otoritenin gücünü yansıtan, ağırbaşlı ve elit bir web mimarisi.",
    priceEconomicTRY: 13500,
    priceProfessionalTRY: 21000,
    features: [
      "Uzmanlık Alanları & Dava Referansları Bölümü",
      "Hukuki Makale ve Blog Yayınlama Modülü",
      "Gizli Müvekkil Ön Danışma İletişim Formu",
      "Avukat ve Ortak Özgeçmiş Kartları",
      "KVKK & Aydınlatma Metinleri Uyumluluğu",
      "Çok Dilli Altyapı Desteği (TR / EN)"
    ],
    coverImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=70",
    galleryImages: [],
    videoUrl: "",
    isVideoLocal: false,
    badge: "Kurumsal",
    deliveryDays: 2,
    demoType: "law",
    isFeaturedInMegaMenu: true,
    active: true,
    translations: {
      en: {
        title: "Lexington Law Firm & Advisory",
        sector: "Law & Legal Services",
        tagline: "Authoritative law firm platform instilling absolute trust and prestige",
        description: "Sophisticated digital web architecture for law firms, independent attorneys, and legal consultants reflecting absolute legal rigor and corporate standing.",
        badge: "Corporate",
        features: [
          "Practice Areas & Landmark Case References",
          "Legal Insights & Blog Publishing Module",
          "Confidential Client Pre-Consultation Form",
          "Partner & Senior Attorney Bio Cards",
          "GDPR & Compliance Privacy Disclosures",
          "Multilingual Readiness (TR / EN)"
        ]
      }
    }
  },
  {
    id: "prod-gastronomy",
    title: "Artisanal Restoran & Kafe",
    sector: "Restoran & Gastronomi",
    slug: "artisan-roast-bistro",
    tagline: "Gurme lezzetleri ve mekan atmosferini dijitalde en şık şekilde sunan web çözümü.",
    description: "Nitelikli kahve dükkanları, fine-dining restoranlar, artisanal fırınlar ve butik kafeler için tasarlanmış iştah kabartıcı, modern gastronomi vitrini.",
    priceEconomicTRY: 11000,
    priceProfessionalTRY: 17500,
    features: [
      "Kategorize Edilebilir Dijital Menü & Fiyat Listesi",
      "Online Masa Rezervasyon & Etkinlik Talebi",
      "Chef's Special Öne Çıkan Lezzetler Vitrini",
      "Instagram & Google Yorumlar Entegrasyonu",
      "Hızlı Açılış, Mobil Uyumlu Fotoğraf Galerisi",
      "Temel SEO & SSL Güvenlik Sertifikası"
    ],
    coverImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=70",
    galleryImages: [],
    videoUrl: "",
    isVideoLocal: false,
    badge: "Lezzet",
    deliveryDays: 2,
    demoType: "restaurant",
    isFeaturedInMegaMenu: true,
    active: true,
    translations: {
      en: {
        title: "Artisan Roast & Bakery Bistro",
        sector: "Restaurant & Gastronomy",
        tagline: "Appetizing digital showcase bringing gourmet flavors and ambiance online",
        description: "Mouth-watering modern gastronomy storefront designed for specialty coffee shops, fine-dining restaurants, artisanal bakeries, and boutique cafes.",
        badge: "Culinary",
        features: [
          "Categorized Digital Menu & Price Board",
          "Online Table Reservation & Event Inquiry",
          "Chef's Special Featured Dish Showcase",
          "Instagram & Google Review Widget Integration",
          "Mobile-Optimized High-Resolution Gallery",
          "Core SEO & SSL Security Certificate"
        ]
      }
    }
  },
  {
    id: "prod-architecture",
    title: "Mimarlık & İç Mekan Stüdyosu",
    sector: "Mimarlık & Tasarım",
    slug: "hora-architecture-studio",
    tagline: "Projelerinizi ve tasarım felsefenizi estetikla sergileyen mimarlık portföyü.",
    description: "Mimari ofisler, iç mimarlık stüdyoları ve tasarımcılar için minimal, siyah-beyaz tonlarda odaklanmış ödüllü portföy mimarisi.",
    priceEconomicTRY: 14000,
    priceProfessionalTRY: 22000,
    features: [
      "Full-Screen Proje Vitrini & Detay Galerisi",
      "Mimari Metrekare, Yıl ve Konum Künyesi",
      "Tasarım Ekibi & Basında Biz Bölümü",
      "Müşteri Proje Talep ve Keşif Formu",
      "Google Lighthouse 99+ Hız Optimizasyonu",
      "Temel SEO & SSL Güvenlik Sertifikası"
    ],
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=70",
    galleryImages: [],
    videoUrl: "",
    isVideoLocal: false,
    badge: "Tasarım",
    deliveryDays: 2,
    demoType: "architecture",
    isFeaturedInMegaMenu: true,
    active: true,
    translations: {
      en: {
        title: "Hora Architecture & Interior Studio",
        sector: "Architecture & Design",
        tagline: "Award-winning portfolio architecture showcasing your design philosophy",
        description: "Minimalist, monochromatic architectural portfolio built for design studios, interior architects, and creative built-environment practices.",
        badge: "Design",
        features: [
          "Full-Screen Project Showcase & Gallery",
          "Square Footage, Year & Location Metadata",
          "Design Team & Press Mentions Section",
          "Client Consultation & Project Brief Form",
          "Google Lighthouse 99+ Speed Optimization",
          "Core SEO & SSL Security Certificate"
        ]
      }
    }
  },
  {
    id: "prod-logistics",
    title: "Global Lojistik & Kargo",
    sector: "Lojistik & Taşımacılık",
    slug: "nordic-global-logistics",
    tagline: "Uluslararası taşımacılık ve parsiyel yük ağı sunan lojistik platformu.",
    description: "Karayolu, denizyolu ve havayolu taşımacılığı yapan lojistik firmaları için güven veren, kurumsal ve çok dilli nakliye çözümleri portalı.",
    priceEconomicTRY: 12500,
    priceProfessionalTRY: 19500,
    features: [
      "Navlun & Taşıma Maliyeti Teklif Formu",
      "Düzenli Seferler & Transit Süre Tablosu",
      "Depolama & Gümrükleme Hizmetleri Modülü",
      "Global Depo & Acente Ağ Konumları",
      "Hızlı Yük Takibi ve WhatsApp İletişimi",
      "Temel SEO & SSL Güvenlik Sertifikası"
    ],
    coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=70",
    galleryImages: [],
    videoUrl: "",
    isVideoLocal: false,
    badge: "Global",
    deliveryDays: 2,
    demoType: "logistics",
    isFeaturedInMegaMenu: true,
    active: true,
    translations: {
      en: {
        title: "Nordic Global Logistics & Freight",
        sector: "Logistics & Supply Chain",
        tagline: "International freight forwarding and multimodal cargo network portal",
        description: "Reliable, enterprise-grade logistics and transportation solutions portal for road, sea, and air freight operators.",
        badge: "Global",
        features: [
          "Freight Rate & Shipping Quote Calculator",
          "Scheduled Routes & Transit Time Matrix",
          "Warehousing & Customs Brokerage Services",
          "Global Hub & Agency Location Network",
          "Quick Cargo Tracking & WhatsApp Support",
          "Core SEO & SSL Security Certificate"
        ]
      }
    }
  },
  {
    id: "prod-ecommerce",
    title: "Kentsel Bisiklet & Outdoor Butik",
    sector: "E-Ticaret & Butik",
    slug: "veloboutique-urban-store",
    tagline: "Şehir içi mobilite, bisiklet ve outdoor ekipmanları için e-ticaret vitrini.",
    description: "Butik e-ticaret girişimleri ve özel ürün satan mağazalar için yüksek dönüşüm odaklı, modern ve hızlı ürün sergileme platformu.",
    priceEconomicTRY: 13000,
    priceProfessionalTRY: 20500,
    features: [
      "Öne Çıkan Ürünler & Kategori Vitrini",
      "Teknik Özellik & MIPS / Malzeme Tablosu",
      "Stok Durumu ve Hızlı WhatsApp Sipariş",
      "Müşteri Değerlendirmeleri ve Puanlama",
      "Mobil Uyumlu Retina Kalitesinde Görseller",
      "Temel SEO & SSL Güvenlik Sertifikası"
    ],
    coverImage: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=70",
    galleryImages: [],
    videoUrl: "",
    isVideoLocal: false,
    badge: "E-Ticaret",
    deliveryDays: 2,
    demoType: "ecommerce",
    isFeaturedInMegaMenu: true,
    active: true,
    translations: {
      en: {
        title: "VeloBoutique Urban Cycling Store",
        sector: "E-Commerce & Retail",
        tagline: "Urban mobility, cycling gear, and outdoor equipment storefront",
        description: "High-conversion modern product showcase platform designed for boutique e-commerce brands and specialty physical product retailers.",
        badge: "Retail",
        features: [
          "Featured Products & Category Showcase",
          "Technical Specifications & Materials Table",
          "Stock Status & Quick WhatsApp Order",
          "Customer Reviews & Rating Widget",
          "Retina-Ready Mobile Optimized Gallery",
          "Core SEO & SSL Security Certificate"
        ]
      }
    }
  },
  {
    id: "prod-realestate",
    title: "Prestijli Gayrimenkul & Yatırım",
    sector: "Gayrimenkul & Emlak",
    slug: "veritas-luxury-realestate",
    tagline: "Antalya, Bodrum ve İstanbul'un en seçkin projelerini sunan emlak portalı.",
    description: "Gayrimenkul danışmanları, lüks konut projeleri ve yatırım ofisleri için döviz bazlı portföy sergileme ve müşteri toplama platformu.",
    priceEconomicTRY: 14000,
    priceProfessionalTRY: 21500,
    features: [
      "Lüks Konut, Villa ve Rezidans Portföyü",
      "Oda Sayısı, Metrekare ve Fiyat Filtreleri",
      "Yatırım & Vatandaşlık Danışmanlık Formu",
      "Konum, Harita ve Çevresel Özellikler",
      "WhatsApp Üzerinden Anında Bilgi Talebi",
      "Temel SEO & SSL Güvenlik Sertifikası"
    ],
    coverImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=70",
    galleryImages: [],
    videoUrl: "",
    isVideoLocal: false,
    badge: "Lüks",
    deliveryDays: 2,
    demoType: "realestate",
    isFeaturedInMegaMenu: true,
    active: true,
    translations: {
      en: {
        title: "Veritas Premium Real Estate & Assets",
        sector: "Real Estate & Investment",
        tagline: "High-Yield Trophy Properties & Trusted Asset Advisory",
        description: "Prestigious real estate portfolio showcase engineered for luxury property brokers, villa developments, and high-yield investment agencies.",
        badge: "Luxury",
        features: [
          "Luxury Villa, Residence & Asset Portfolio",
          "Bedrooms, Area & Price Tier Filters",
          "Citizenship & Investment Advisory Form",
          "Location, Map & Neighborhood Highlights",
          "Instant WhatsApp Property Inquiry",
          "Core SEO & SSL Security Certificate"
        ]
      }
    }
  },
  {
    id: "prod-fitness",
    title: "Elit Fitness & Personal Training",
    sector: "Spor & Sağlıklı Yaşam",
    slug: "pulse-elite-fitness",
    tagline: "Bilimsel antrenman programları ve üyelik paketleri sunan spor kulübü.",
    description: "Özel fitness stüdyoları, crossfit salonları, reformer pilates merkezleri ve personal trainerlar için motive edici dijital kulüp portalı.",
    priceEconomicTRY: 11500,
    priceProfessionalTRY: 18500,
    features: [
      "Üyelik Paketleri & Grup Dersleri Tarifesi",
      "Ücretsiz Deneme Dersi Randevu Formu",
      "Uzman Antrenör Kadrosu & Uzmanlıklar",
      "Stüdyo Ekipmanları & Atmosfer Galerisi",
      "Mobil Uyumlu Hızlı İletişim Altyapısı",
      "Temel SEO & SSL Güvenlik Sertifikası"
    ],
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=70",
    galleryImages: [],
    videoUrl: "",
    isVideoLocal: false,
    badge: "Aktif",
    deliveryDays: 2,
    demoType: "fitness",
    isFeaturedInMegaMenu: true,
    active: true,
    translations: {
      en: {
        title: "Pulse Elite Fitness & Personal Training",
        sector: "Fitness & Wellness",
        tagline: "Achieve peak conditioning with scientifically backed workout programs",
        description: "Motivational club portal designed for private fitness studios, functional training boxes, reformer pilates centers, and elite personal trainers.",
        badge: "Active",
        features: [
          "Membership Tier & Group Class Schedule",
          "Free Trial Class Booking Form",
          "Expert Trainer Roster & Specializations",
          "Studio Equipment & Atmosphere Gallery",
          "Mobile-Optimized Fast Communication Stack",
          "Core SEO & SSL Security Certificate"
        ]
      }
    }
  },
  {
    id: "prod-ufo",
    title: "UFO World & Kozmik Medya Portal",
    sector: "Teknoloji & Dijital Medya",
    slug: "ufo-world-cosmic-portal",
    tagline: "Yapay zeka analizli uydu telemetrileri ve siber uzay araştırmaları portalı.",
    description: "Geleceğin dijital medya mecraları ve teknoloji blogları için tasarlanmış karanlık mod odaklı, triptap içerik motorlu futuristik yayın şablonu.",
    priceEconomicTRY: 14000,
    priceProfessionalTRY: 22000,
    features: [
      "Tiptap Zengin İçerik Makale Yayın Motoru",
      "GEO (AI SEO) Optimizasyonu & AI Özet",
      "Telegram & Discord Topluluk Entegrasyonu",
      "Doğrulanmış UFO İhbar Formu",
      "Kozmik Siber-Tema Fütüristik Koyu Arayüz",
      "Çok Dilli Altyapı Desteği (TR / EN)"
    ],
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=70",
    galleryImages: [],
    videoUrl: "",
    isVideoLocal: false,
    badge: "AI Powered",
    deliveryDays: 2,
    demoType: "custom",
    isFeaturedInMegaMenu: true,
    active: true,
    translations: {
      en: {
        title: "UFO World & Cosmic Media Portal",
        sector: "Space & Digital Media",
        tagline: "AI-powered media portal unlocking universe mysteries & cyber theories",
        description: "Next-generation digital publication template captivating audiences with AI-analyzed satellite telemetries, verified UFO reports, and space research.",
        badge: "AI Powered",
        features: [
          "Tiptap Rich Content Article Publishing Engine",
          "GEO (AI SEO) Optimization & Automated AI Summary",
          "Telegram & Discord Community Hub Integration",
          "Verified UFO Sighting & Anomaly Submission Form",
          "Cosmic Cyber-Themed Futuristic Dark UI",
          "Built-In Multilingual Support (TR, EN)"
        ]
      }
    }
  }
];

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: "serv-01",
    number: "01",
    title: "Anahtar Teslim Sektörel Web Siteleri",
    subtitle: "48 Saat İçinde Canlıya Alınan Satış Odaklı Tasarımlar",
    description: "Küçük ve orta ölçekli işletmeler için bütçe dostu, yüksek dönüşüm oranına sahip sektörel şablonlar. Alan adı, sunucu, SSL ve içerik yerleşimi dahil eksiksiz teslim.",
    deliverables: [
      "Sektöre özel şablon adaptasyonu",
      "Doğrudan WhatsApp ve arama butonları",
      "Temiz, ultra hızlı kod mimarisi",
      "48 saatte özel domain adresinizde yayın"
    ],
    iconName: "Globe",
    isFeaturedInMegaMenu: true,
    translations: {
      en: {
        title: "Turnkey Industry Websites",
        subtitle: "High-Converting Digital Storefronts Live in 48 Hours",
        description: "Cost-effective, industry-tailored websites built specifically for SMEs. Delivered complete with domain setup, high-speed hosting, SSL, and ready-to-sell content.",
        deliverables: [
          "Industry-specific prototype adaptation",
          "Direct WhatsApp and click-to-call integration",
          "Clean, ultra-fast codebase architecture",
          "Live on your custom domain in 48 hours"
        ]
      }
    }
  },
  {
    id: "serv-02",
    number: "02",
    title: "Yönetilen Web Bakım & Güncelleme",
    subtitle: "Siz İşinize Odaklanın, Sitenizi Biz Yönetelim",
    description: "Yönetim paneliyle uğraşmak istemeyen ve ekstra personel tutamayan işletmeler için ekonomik model. Menü değişikliği, fiyat güncellemesi veya yeni fotoğraf eklemelerini tek bir mesajla bize iletin, aynı gün güncelleyelim.",
    deliverables: [
      "Panel öğrenme derdi olmadan zahmetsiz yönetim",
      "Aylık içerik, metin ve görsel güncellemeleri",
      "Düzenli yedekleme ve güvenlik gözetimi",
      "Yıllık hosting ve SSL sertifika idaresi"
    ],
    iconName: "Settings",
    isFeaturedInMegaMenu: true,
    translations: {
      en: {
        title: "Managed Web Maintenance & Updates",
        subtitle: "Focus on Your Business, We Manage Your Website",
        description: "An economic service model for businesses that prefer not to touch admin dashboards. Send us menu changes, pricing updates, or new photos via a single message, and we update it same day.",
        deliverables: [
          "Effortless management without learning CMS",
          "Monthly text, media, and content updates",
          "Regular cloud backups and security monitoring",
          "Annual hosting and SSL certificate administration"
        ]
      }
    }
  },
  {
    id: "serv-03",
    number: "03",
    title: "Vanguard Nexus VIP Teknik Danışmanlık",
    subtitle: "Özel Yazılım, Yapay Zeka Entegrasyonları ve Kurumsal Mimari",
    description: "Klasik web sitelerinin ötesine geçmek isteyen, özel LLM/AI model entegrasyonları, bulut ölçeklendirme veya karmaşık kurumsal veritabanı altyapıları talep eden işletmeler için üst düzey C-Level mühendislik danışmanlığı.",
    deliverables: [
      "Özel yazılım mimarisi ve API entegrasyonları",
      "Yapay zeka (LLM/AI) asistan ve otomasyonları",
      "KVKK & GDPR tam uyumlu kurumsal güvenlik",
      "Google Lighthouse 99+ hız ve performans optimizasyonu"
    ],
    iconName: "Cpu",
    isFeaturedInMegaMenu: true,
    translations: {
      en: {
        title: "Vanguard Nexus VIP Technical Advisory",
        subtitle: "Custom Software, AI Integrations & Enterprise Architecture",
        description: "High-level C-Level engineering advisory for businesses demanding custom LLM/AI integrations, cloud scalability, or complex enterprise database architectures.",
        deliverables: [
          "Custom software architecture & API integrations",
          "Artificial intelligence (LLM/AI) assistants & automation",
          "GDPR / KVKK fully compliant enterprise security",
          "Google Lighthouse 99+ speed & performance tuning"
        ]
      }
    }
  }
];

export const DEFAULT_REFERENCES: ReferenceItem[] = [
  {
    id: "ref-01",
    clientName: "Dr. Dt. Taha Furkan Başaran",
    sector: "Sağlık / İstanbul",
    year: "2026",
    metric: "+210% WhatsApp Randevu Talebi",
    quote: "12.500 TL gibi çok makul bir bütçeyle 2 gün içinde harika bir siteye kavuştuk. Hastalarım sitenin şıklığını ve doğrudan randevu butonunu çok beğeniyor.",
    author: "Dr. Dt. Taha Furkan Başaran",
    authorRole: "Kurucu Diş Hekimi",
    siteUrl: "#",
    isFeaturedInMegaMenu: true,
    translations: {
      en: {
        sector: "Healthcare / Istanbul",
        metric: "+210% WhatsApp Consultation Inquiries",
        quote: "With a modest budget, we received an exceptional clinic portal in just 2 days. Patients consistently praise its elegance and 1-tap booking.",
        authorRole: "Founder & Chief Dentist"
      }
    }
  },
  {
    id: "ref-02",
    clientName: "Öztürk Hukuk Bürosu",
    sector: "Hukuk / Antalya",
    year: "2026",
    metric: "Müvekkil Hacminde Büyüme",
    quote: "Hem Türkçe hem İngilizce dillerinde prestijli bir duruş yakaladık. Yönetim Bizde paketi sayesinde tek satır kodla uğraşmadan tüm güncellemelerimiz yapılıyor.",
    author: "Celil Öztürk",
    authorRole: "Kıdemli Ortak Avukat",
    siteUrl: "#",
    isFeaturedInMegaMenu: true,
    translations: {
      en: {
        sector: "Law / Antalya",
        metric: "Expanded Client Acquisition",
        quote: "We established a prestigious stance in both Turkish and English markets. Thanks to the managed plan, all updates are handled effortlessly.",
        authorRole: "Senior Partner Attorney"
      }
    }
  },
  {
    id: "ref-03",
    clientName: "Artisan Gastronomi Grubu",
    sector: "Gastronomi / İzmir",
    year: "2026",
    metric: "%100 Mobil Menü Erişimi",
    quote: "Karekod menü ve rezervasyon altyapımız kusursuz çalışıyor. Müşterilerimiz telefondan menüyü incelerken büyüleniyor.",
    author: "Mert Demir",
    authorRole: "İşletmeci & Şef",
    siteUrl: "#",
    isFeaturedInMegaMenu: true,
    translations: {
      en: {
        sector: "Gastronomy / Izmir",
        metric: "100% Mobile Menu Adoption",
        quote: "Our QR menu and reservation stack operate flawlessly. Customers are consistently captivated when browsing our offerings on mobile.",
        authorRole: "Restaurateur & Chef"
      }
    }
  }
];

export const DEFAULT_NAV_ITEMS: NavigationItem[] = [
  {
    id: "nav-m-health",
    title: "Dental & Estetik Klinik",
    url: "#portfolio-section",
    location: "header",
    locations: ["header"],
    order: 1,
    pageSlug: "aura-dental-clinic",
    translations: {
      en: {
        title: "Dental & Aesthetic Clinic"
      }
    }
  },
  {
    id: "nav-m-law",
    title: "Hukuk Bürosu & Müşavirlik",
    url: "#portfolio-section",
    location: "header",
    locations: ["header"],
    order: 2,
    pageSlug: "lexington-law-firm",
    translations: {
      en: {
        title: "Law Firm & Advisory"
      }
    }
  },
  {
    id: "nav-m-rest",
    title: "Artisanal Restoran & Kafe",
    url: "#portfolio-section",
    location: "header",
    locations: ["header"],
    order: 3,
    pageSlug: "artisan-roast-bistro",
    translations: {
      en: {
        title: "Artisanal Restaurant & Cafe"
      }
    }
  },
  {
    id: "nav-m-arch",
    title: "Mimarlık & İç Mekan Stüdyosu",
    url: "#portfolio-section",
    location: "header",
    locations: ["header"],
    order: 4,
    pageSlug: "hora-architecture-studio",
    translations: {
      en: {
        title: "Architecture & Interior Studio"
      }
    }
  },
  {
    id: "nav-m-log",
    title: "Global Lojistik & Kargo",
    url: "#portfolio-section",
    location: "header",
    locations: ["header"],
    order: 5,
    pageSlug: "nordic-global-logistics",
    translations: {
      en: {
        title: "Global Logistics & Freight"
      }
    }
  },
  {
    id: "nav-m-ecom",
    title: "Kentsel Bisiklet & Outdoor Butik",
    url: "#portfolio-section",
    location: "header",
    locations: ["header"],
    order: 6,
    pageSlug: "veloboutique-urban-store",
    translations: {
      en: {
        title: "Urban Cycling & Outdoor Store"
      }
    }
  },
  {
    id: "nav-m-est",
    title: "Prestijli Gayrimenkul & Yatırım",
    url: "#portfolio-section",
    location: "header",
    locations: ["header"],
    order: 7,
    pageSlug: "veritas-luxury-realestate",
    translations: {
      en: {
        title: "Luxury Real Estate & Assets"
      }
    }
  },
  {
    id: "nav-m-fit",
    title: "Elit Fitness & Personal Training",
    url: "#portfolio-section",
    location: "header",
    locations: ["header"],
    order: 8,
    pageSlug: "pulse-elite-fitness",
    translations: {
      en: {
        title: "Elite Fitness & Personal Training"
      }
    }
  },
  {
    id: "nav-m-ufo",
    title: "UFO World & Kozmik Medya Portal",
    url: "#portfolio-section",
    location: "header",
    locations: ["header"],
    order: 9,
    pageSlug: "ufo-world-cosmic-portal",
    translations: {
      en: {
        title: "UFO World & Cosmic Media Portal"
      }
    }
  },
  {
    id: "nav-m-serv-turnkey",
    title: "Anahtar Teslim Sektörel Siteler",
    url: "#services-section",
    location: "header",
    locations: ["header"],
    order: 10,
    translations: {
      en: {
        title: "Turnkey Industry Websites"
      }
    }
  },
  {
    id: "nav-m-serv-mgmt",
    title: "Yönetilen Web Bakım & Güncelleme",
    url: "#services-section",
    location: "header",
    locations: ["header"],
    order: 11,
    translations: {
      en: {
        title: "Managed Web Maintenance & Updates"
      }
    }
  },
  {
    id: "nav-m-serv-nexus",
    title: "Vanguard Nexus VIP Teknik Danışmanlık",
    url: "#tech-advisory",
    location: "header",
    locations: ["header"],
    order: 12,
    translations: {
      en: {
        title: "Vanguard Nexus VIP Technical Advisory"
      }
    }
  },
  {
    id: "nav-m-sup-faq",
    title: "Sıkça Sorulan Sorular (FAQ)",
    url: "#page-sss",
    location: "mega_support",
    locations: ["mega_support"],
    order: 1,
    pageSlug: "sss",
    translations: {
      en: {
        title: "Frequently Asked Questions (FAQ)"
      }
    }
  },
  {
    id: "nav-m-sup-help",
    title: "Yardım Merkezi (Help Desk)",
    url: "#page-yardim-merkezi",
    location: "mega_support",
    locations: ["mega_support"],
    order: 2,
    pageSlug: "yardim-merkezi",
    translations: {
      en: {
        title: "Help Desk & Guides"
      }
    }
  },
  {
    id: "nav-m-sup-payment",
    title: "Güvenli Ödeme & IBAN",
    url: "#payment",
    location: "mega_support",
    locations: ["mega_support"],
    order: 3,
    translations: {
      en: {
        title: "Payment & Wire"
      }
    }
  }
];

export const DEFAULT_PAGES: CustomPage[] = [
  {
    id: "page-kariyer",
    slug: "kariyer",
    title: "Kariyer & Remote Fırsatlar",
    category: "corporate",
    summary: "Vanguard Studio bünyesinde uzaktan (remote) çalışma imkanıyla yer alabileceğiniz performans pazarlama ve yazılım pozisyonları.",
    updatedAt: "2026-10-11",
    isPublished: true,
    content: "<h3 class=\"text-base sm:text-lg font-bold font-display text-neutral-950 dark:text-white pt-3 pb-1 border-b border-neutral-100 dark:border-neutral-800/80 text-left\">Performans Pazarlama Uzmanı & Media Buyer (Uzaktan / Remote)</h3>\n<p class=\"text-justify leading-relaxed\">Vanguard Studio bünyesinde, Türkiye ve Avrupa pazarlarındaki hazır sektörel web sitelerimiz ve kurumsal müşterilerimiz için dijital büyüme, müşteri edinimi (lead generation) ve performans reklamlarını yönetecek deneyimli <strong>Pazarlama Uzmanları ve Media Buyer'lar</strong> arıyoruz.</p>",
    translations: {
      en: {
        title: "Careers & Remote Opportunities",
        summary: "Global remote career opportunities for Performance Marketing Specialists and Media Buyers.",
        content: "<h3 class=\"text-base sm:text-lg font-bold font-display text-neutral-950 dark:text-white pt-3 pb-1 border-b border-neutral-100 dark:border-neutral-800/80 text-left\">Performance Marketing Specialist & Media Buyer (100% Remote)</h3>\n<p class=\"text-justify leading-relaxed\">Vanguard Studio is expanding its growth collective. We are actively recruiting experienced <strong>Marketing Specialists and Media Buyers</strong> to direct digital acquisition, paid traffic, and performance campaigns across Turkey and European markets.</p>"
      }
    },
    locations: ["corporate"],
    menuLocation: "corporate"
  },
  {
    id: "page-sss",
    slug: "sss",
    title: "Sıkça Sorulan Sorular (SSS / FAQ)",
    category: "corporate",
    summary: "Vanguard Studio teslimat modelleri, şeffaf bütçelendirme politikamız ve 48 saatlik teslimat sayacı kuralları hakkında en çok merak edilen sorular.",
    updatedAt: "2026-10-11",
    isPublished: true,
    content: "<p class=\"text-justify leading-relaxed\"><div style=\"text-align: center;\"><span style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif, &quot;Noto Color Emoji&quot;; font-weight: 700;\">Sıkça Sorulan Sorular (FAQ)</span></div></p>",
    translations: {
      en: {
        title: "Frequently Asked Questions (FAQ)",
        summary: "Find transparent, engineered answers regarding our turnkey delivery models, fixed pricing architecture, and 48-hour countdown mechanics.",
        content: "<p class=\"text-justify leading-relaxed\"><div style=\"text-align: center;\"><span style=\"font-family: &quot;Google Sans&quot;, Arial, sans-serif, &quot;Noto Color Emoji&quot;; font-weight: 700;\">Frequently Asked Questions (FAQ)</span></div></p>"
      }
    },
    locations: ["corporate"],
    menuLocation: "corporate"
  },
  {
    id: "page-48-saatte-teslim-ve-hizmet-garantisi",
    slug: "48-saatte-teslim-ve-hizmet-garantisi",
    title: "48 Saatte Teslim & Hizmet Şartları",
    category: "legal",
    summary: "İşbu hizmet ve teslimat koşulları; uluslararası ticaret hukukunun genel ilkeleri (UNCITRAL) ve AB E-Ticaret Direktifleri uyarınca düzenlenmiştir.",
    updatedAt: "2026-10-11",
    isPublished: true,
    content: "<div style=\"text-align: center;\"><span style=\"font-weight: bolder;\">Hukuki Dayanak ve Mevzuata Uyum Beyanı</span></div>",
    translations: {
      en: {
        title: "48-Hour Turnkey Deployment & Service Guarantee",
        summary: "These terms of service and delivery commitments are governed by international commercial law (UNCITRAL) and EU E-Commerce Directives.",
        content: "<div style=\"text-align: center;\"><b>Regulatory Compliance and Legal Framework Statement</b></div>"
      }
    },
    locations: ["legal"],
    menuLocation: "legal"
  },
  {
    id: "page-mesafeli-satis-sozlesmesi",
    slug: "mesafeli-satis-sozlesmesi",
    title: "Mesafeli Satış Sözleşmesi",
    category: "legal",
    summary: "İşbu Mesafeli Satış Sözleşmesi; uluslararası ticaret hukukunun genel ilkeleri ve 6502 sayılı Tüketicinin Korunması Hakkında Kanun uyarınca düzenlenmiştir.",
    updatedAt: "2026-10-11",
    isPublished: true,
    content: "<p class=\"MsoNormal text-justify leading-relaxed\" style=\"text-align: center;\"><b>Hukuki Dayanak ve Mevzuata Uyum Beyanı</b></p>",
    translations: {
      en: {
        title: "Distance Sales Agreement",
        summary: "This Distance Sales Agreement is governed by the general principles of international commercial law (UNCITRAL) and consumer protection regulations.",
        content: "<div style=\"text-align: center;\"><b>Regulatory Compliance and Legal Framework Statement</b></div>"
      }
    },
    locations: ["legal"],
    menuLocation: "legal"
  }
];

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Satın aldığım web sitesinin kaynak kodlarını ve tam mülkiyetini teslim alabiliyor muyum?",
    answer: "Profesyonel Paket modelini tercih eden müşterilerimiz tüm kaynak kodlarını ve bağımsız web paketini tek tıkla indirerek tam mülkiyet hakkını devralabilirler. Ekonomik Paket modelinde ise barındırma ve yazılım altyapısı Vanguard Studio güvencesinde kalır.",
    order: 1,
    active: true,
    translations: {
      en: {
        question: "Can I take delivery of the source code and full ownership of the website I purchased?",
        answer: "Clients who select the Professional Tier can download their full source codes and independent web bundle with a single click, taking over complete ownership rights."
      }
    }
  },
  {
    id: "faq-2",
    question: "48 saatte anahtar teslim garantisi nasıl çalışıyor, gecikme olursa süreç ne oluyor?",
    answer: "Hazır şablonlu ekonomik paketlerimiz için gerekli içeriklerin iletilmesiyle 48 saatlik süreç başlar. Bizden kaynaklanan gecikmelerde ilk yıl sunucu barındırma bedeli ücretsiz karşılanır.",
    order: 2,
    active: true,
    translations: {
      en: {
        question: "How does the 48-hour turnkey delivery guarantee work, and what happens if there is a delay?",
        answer: "Upon complete content delivery, the 48-hour deployment begins for economic packages. In the event of internal technical delays, the first year of hosting is fully covered."
      }
    }
  },
  {
    id: "faq-3",
    question: "Yıllık aidat, gizli yenileme maliyeti veya ek bir masraf var mı?",
    answer: "Hayır, hiçbir gizli masraf yoktur. Sitemizde ilan edilen bütçeler tek seferlik yazılım ve kurulum ücretidir. Sitenizin açık kalması için gereken tek periyodik maliyet yıllık hosting masrafıdır.",
    order: 3,
    active: true,
    translations: {
      en: {
        question: "Is there an annual fee, a hidden renewal cost, or any additional expense?",
        answer: "No, there are no hidden costs. Prices cover one-time software and setup fees. The only recurring cost is for cloud server hosting billed annually."
      }
    }
  },
  {
    id: "faq-4",
    question: "Sitenin içeriğinde fiyat, fotoğraf veya iletişim bilgilerini değiştirmek istediğimde ne yapacağım?",
    answer: "Yönetim Bizde paketinde değişiklik talebinizi WhatsApp üzerinden iletmeniz yeterlidir, aynı gün ücretsiz güncellenir. Tam Yetkili CMS paketinde ise kendi panelinizden dilediğiniz an güncelleyebilirsiniz.",
    order: 4,
    active: true,
    translations: {
      en: {
        question: "What should I do when I want to update pricing, photos, or contact info on my site?",
        answer: "In the Managed Plan, simply send your update request via WhatsApp and we update it same day. In the Full-Access CMS plan, you can update it instantly from your admin panel."
      }
    }
  }
];

const defaultBankAccounts: BankAccountInfo = {
  bankNameTR: "Garanti BBVA",
  accountHolderTR: "Vanguard Studio Dijital A.Ş.",
  ibanTR: "TR33 0006 2000 7500 0006 8599 12",
  stripeEnabled: true
};

export const DEFAULT_SETTINGS: AgencySettings = {
  "agencyName": "Vanguard Studio",
  "tagline": "Küçük İşletmeler İçin Elit & Anahtar Teslim Web Çözümleri",
  "phone": "+90 505 703 0194",
  "whatsapp": "+90 505 703 0194",
  "phoneTR": "+90 505 703 0194",
  "whatsappTR": "+90 505 703 0194",
  "email": "iletisim@vanguardstudio.digital",
  "locationTR": "Antalya, Türkiye",
  "adminPin": "admin123",
  "defaultCurrency": "TRY",
  "promoVideoUrl": "https://www.youtube.com/watch?v=UgifalO17dI",
  "advisoryService": DEFAULT_ADVISORY_SERVICE,
  "footerMotto": {
    "tr": "Kod ile İnşa Ediyor, Pazarlama ile Ölçeklendiriyoruz. Sınırların Ötesinde Dijital Gelecek.",
    "en": "Engineered through Code, Scaled through Marketing. The Digital Future Beyond Borders."
  },
  "bankAccounts": defaultBankAccounts,
  "bankAccountsList": [
    {
      id: "bank-1",
      title: "Garanti BBVA Kurumsal",
      bankName: "Garanti BBVA",
      accountHolder: "Vanguard Studio Dijital A.Ş.",
      iban: "TR33 0006 2000 7500 0006 8599 12",
      currency: "TRY",
      country: "TR",
      isPrimary: true,
      isActive: true
    }
  ],
  "legalTaxInfo": {
    companyTitleTR: "Vanguard Studio Dijital A.Ş.",
    taxOfficeTR: "Boğaziçi Kurumlar Vergi Dairesi",
    taxNumberTR: "9120485912",
    registeredAddressTR: "Levent Mah. Esentepe Cad. No: 14/8 Beşiktaş / İstanbul"
  }
};

export const DEFAULT_BANK_ACCOUNTS_LIST: BankAccountItem[] = [
  {
    id: "bank-1",
    title: "Garanti BBVA Kurumsal",
    bankName: "Garanti BBVA",
    accountHolder: "Vanguard Studio Dijital A.Ş.",
    iban: "TR33 0006 2000 7500 0006 8599 12",
    currency: "TRY",
    country: "TR",
    isPrimary: true,
    isActive: true
  }
];

export const DEFAULT_LEGAL_TAX_INFO: LegalTaxInfo = {
  companyTitleTR: "Vanguard Studio Dijital A.Ş.",
  taxOfficeTR: "Boğaziçi Kurumlar Vergi Dairesi",
  taxNumberTR: "9120485912",
  registeredAddressTR: "Levent Mah. Esentepe Cad. No: 14/8 Beşiktaş / İstanbul"
};

export const DEFAULT_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: "tx-1",
    type: "income",
    title: "Dental & Estetik Klinik Satış",
    clientOrVendor: "Dr. Taha Furkan Başaran",
    amount: 12500,
    currency: "TRY",
    amountTRY: 12500,
    category: "project_sale",
    paymentMethod: "bank_transfer",
    status: "completed",
    date: "2026-10-11",
    createdAt: "2026-10-11T10:00:00Z"
  }
];

export const DEFAULT_LANGUAGES: LanguageDef[] = [
  {
    code: "tr",
    name: "Türkçe",
    flag: "🇹🇷",
    isDefault: true,
    active: true
  },
  {
    code: "en",
    name: "English",
    flag: "🇬🇧",
    isDefault: false,
    active: true
  }
];

export const DEFAULT_TRANSLATIONS: TranslationDictionary = {
  tr: {
    // Nav & Header
    "nav.products": "Hazır Siteler",
    "nav.services": "Hizmetler",
    "nav.references": "Referanslar",
    "nav.pricing": "Fiyatlar",
    "nav.faq": "SSS",
    "nav.corporate": "Kurumsal",
    "nav.contact": "İletişim",
    "nav.admin": "Yönetim Paneli",
    "nav.techAdvisory": "Teknik Danışmanlık",
    "nav.home": "Ana Sayfa",
    "nav.turnkeySites": "Hazır Siteler",
    "nav.support": "Destek & SSS",
    "nav.advisory": "Teknik Danışmanlık",
    "nav.viewAll": "Tümünü Gör",
    "nav.viewAllSites": "Tüm Hazır Siteleri İncele",
    "nav.viewAllServices": "Tüm Hizmetleri Gör",
    "nav.viewAllReferences": "Tüm Referansları Gör",
    "nav.paymentPortal": "Güvenli Ödeme & Havale Portalı",
    "nav.about": "Hakkımızda",
    "nav.contactLink": "İletişim & Teklif",
    "header.customerPanel": "Müşteri Paneli",

    // Hero
    "hero.badge": "Küçük İşletmelere Özel · 48 Saatte Canlıda",
    "hero.kicker": "VIP Web Geliştirme & Dönüşüm Ajansı",
    "hero.title": "Bütçenizi Zorlamayan, Prestijli Hazır Web Siteleri.",
    "hero.subtitle": "Büyük ajanslara servet ödemeden; {{PRICE_10000}} – {{PRICE_20000}} aralığında, sektörünüze özel tasarlanmış, satış odaklı ve hemen teslim dijital varlıklar.",
    "hero.cta": "Hazır Siteleri İncele",
    "hero.ctaPrimary": "Hazır Siteleri Keşfet",
    "hero.ctaSecondary": "Hangi Paket Size Uygun?",
    "hero.secondary": "Teknik Danışmanlık Al",
    "hero.watchVideo": "Nasıl Çalışıyoruz? (Video)",
    "hero.stat1.val": "48 Saat",
    "hero.stat1.label": "Ortalama Teslimat Süresi",
    "hero.stat2.val": "{{PRICE_10000}}’den",
    "hero.stat2.label": "Başlayan Şeffaf Fiyatlar",
    "hero.stat3.val": "TR · EN",
    "hero.stat3.label": "Çok Dilli & Pazar Odaklı",

    // Products / Vitrin
    "products.sectionNumber": "01. Vitrin & Portföy",
    "products.sectionTitle": "Satışa Hazır Sektörel Siteler",
    "products.sectionSubtitle": "Özenle seçilmiş, test edilmiş ve anahtar teslim devreye alınmaya hazır maksimum 10 özel çözüm.",
    "products.listingCount": "Site Gösteriliyor (Vitrinde Maks 6)",
    "products.all": "Tüm Sektörler",
    "products.tab.all": "Tüm Sektörler",
    "products.tab.health": "Sağlık & Klinik",
    "products.tab.law": "Hukuk & Müşavirlik",
    "products.tab.restaurant": "Restoran & Kafe",
    "products.tab.architecture": "Mimarlık & Tasarım",
    "products.tab.logistics": "Lojistik & Kargo",
    "products.tab.ecommerce": "E-Ticaret & Butik",
    "products.tab.realestate": "Gayrimenkul",
    "products.tab.fitness": "Fitness & Spor",
    "products.tab.portfolio": "Portfolyo",
    "products.emptyCategory": "Bu kategoride şu anda listelenen hazır site bulunmuyor.",
    "products.viewAll": "Tüm Hazır Siteleri Gör",
    "products.viewAllCatalog": "Tüm Hazır Vitrin Sitelerini Gör",
    "products.viewDemo": "Canlı Önizleme",
    "products.viewDetails": "Detay & Satın Al",
    "products.liveSite": "Bağımsız Canlı Site",
    "products.manageWithCustomerPanel": "Müşteri Paneli",
    "products.deployButton": "Talep Halinde Canlıya Al & Bağla",
    "products.economicBadge": "Yönetim Bizde",
    "products.proBadge": "Profesyonel CMS",
    "products.readyIn": "Teslimat: 48 Saat",
    "products.videoAvailable": "Video Tanıtım Mevcut",

    // Delivery Models & Pricing
    "models.sectionNumber": "02. Ürün Paketleri",
    "models.sectionTitle": "Ürün Paketleri & İş Modelleri",
    "models.sectionSubtitle": "İster tüm teknik güncellemeleri bize devredip işinize bakın, ister tam yetkili panelinizle yönetin, isterseniz firmanıza özel sıfırdan mimari kuralım.",
    "pricing.sectionTitle": "Ürün Paketleri & İş Modelleri",
    "pricing.sectionSubtitle": "İster tüm teknik güncellemeleri bize devredip işinize bakın, ister tam yetkili panelinizle yönetin, isterseniz firmanıza özel sıfırdan mimari kuralım.",
    "models.mostPopular": "En Çok Tercih Edilen Model",
    "models.economic.title": "Ekonomik Paket (Yönetim Bizde)",
    "models.turnkey": "/ anahtar teslim",
    "models.economic.desc": "Web paneli öğrenmekle veya şifrelerle vakit kaybetmek istemeyen küçük işletmeler için idealdir. Sitenizi kurar, içeriklerinizi yükleriz. Değişiklik gerektiğinde bize iletirsiniz, biz yaparız.",
    "models.economic.feat1": "Müşteriye karmaşık panel verilmez; tam yönetim desteği ajanstadır",
    "models.economic.feat2": "Alan adı, hosting, SSL ve kurumsal e-posta kurulumu dahil",
    "models.economic.feat3": "Yılda 12 kez metin, fotoğraf ve fiyat güncelleme hakkı",
    "models.economic.feat4": "Hızlı WhatsApp ve doğrudan arama butonları entegrasyonu",
    "models.economic.feat5": "Süper hızlı açılış ve mobil kusursuzluk",
    "models.ctaStripe": "Stripe / Havale",
    "models.ctaQuote": "Teklif İste",
    "models.fullIndependence": "Tam Bağımsızlık & Kontrol",
    "models.advancedPanel": "Gelişmiş Panel Çözümü",
    "models.pro.title": "Profesyonel Paket (Tam Yetkili CMS)",
    "models.pro.desc": "Kendi ekibi olan, sık içerik/ürün girişi yapan veya sitenin her detayını bağımsız yönetmek isteyen büyüyen firmalar için tam yetkili profesyonel yönetim paneli.",
    "models.pro.feat1": "Müşteriye teslim edilen tam yetkili, sade profesyonel CMS",
    "models.pro.feat2": "Sınırsız ürün, yazı ve galeri içeriği ekleme imkanı",
    "models.pro.feat3": "Çok dilli içerik yönetimi ve otomatik çeviri motoru",
    "models.pro.feat4": "Gelişmiş analitik ve form bildirimleri entegrasyonu",
    "models.pro.feat5": "Ekibiniz için 1 saatlik canlı video eğitim ve rehber",
    "models.customArchitecture": "Özel Mimari & Büyüme",
    "models.customScope": "Özel Kapsam & Teklif Usulü",
    "models.custom.title": "Özel Mimari & Kurumsal Çözüm",
    "models.custom.badge": "Özel Mimari & Büyüme",
    "models.custom.priceTitle": "Özel Fiyatlandırma",
    "models.custom.priceSub": "/ projeye göre",
    "models.custom.price": "Özel Fiyatlandırma",
    "models.custom.desc": "Standart şablonların ötesinde; markanıza özel sıfırdan UI/UX tasarımı, harici API/ERP/CRM entegrasyonları, çoklu şube veya e-ticaret altyapısı gerektiren ileri seviye projeler.",
    "models.custom.feat1": "Markanıza ve sektörünüze özel sıfırdan Figma UI/UX tasarımı",
    "models.custom.feat2": "Özel backend mimarisi, API servisleri ve ERP/CRM entegrasyonları",
    "models.custom.feat3": "Çoklu dil, çoklu para birimi ve global ödeme ağ geçitleri",
    "models.custom.feat4": "Yüksek trafik yük dengelemesi ve özel cloud sunucu kurulumu",
    "models.custom.feat5": "Öncelikli 7/24 SLA desteği, kaynak kod teslimi ve dokümantasyon",

    // Services
    "services.sectionNumber": "03. Ajans Çözümleri",
    "services.sectionTitle": "Ajans Hizmetleri",
    "services.sectionSubtitle": "Hazır sitelerimizin ötesinde, büyümenizi destekleyecek uçtan uca dijital çözümler.",
    "services.viewAllText": "Tümünü Gör",
    "services.ctaQuote": "Bilgi & Teklif İste",

    // References
    "references.sectionNumber": "04. Kanıtlanmış Başarılar",
    "references.sectionTitle": "İş Birliklerimiz & Sonuçlar",
    "references.sectionSubtitle": "Türkiye ve global pazardaki küçük işletmelerin gerçek başarı deneyimleri.",
    "references.viewAllText": "Tümünü Gör",

    // Corporate Pages
    "corporate.vision": "Vizyonumuz",
    "corporate.mission": "Misyonumuz",
    "corporate.careers": "Kariyer & Uzaktan İş",

    // Mega Menu
    "megaMenu.productsSub": "Maksimum 10 hazır site portföyümüzden öne çıkan 4 anahtar teslim vitrin",
    "megaMenu.startingPrice": "Başlangıç Fiyatı",
    "megaMenu.examine": "İncele",
    "megaMenu.corporateTitle": "Kurumsal Ekosistem & Vizyon",
    "megaMenu.corporateSub": "Vanguard Studio hikayesi, üretim felsefemiz ve açık pozisyonlarımız",
    "megaMenu.aboutTitle": "Hakkımızda",
    "megaMenu.aboutDesc": "Vanguard Studio'nun kuruluş hikayesi, dijital üretim felsefesi ve tutkulu ekip kültürü.",
    "megaMenu.visionTitle": "Vizyonumuz",
    "megaMenu.visionDesc": "Bürokrasisiz 48 saatlik hızlı teslimat ve kusursuz React & Tailwind yazılım altyapısı.",
    "megaMenu.missionTitle": "Misyonumuz",
    "megaMenu.missionDesc": "KOBİ ve iştiraklerin fahiş ajans bütçelerinden ve kronik gecikmelerden kurtarılması.",
    "megaMenu.careerTitle": "Kariyer & Uzaktan Başvuru",
    "megaMenu.careerDesc": "Açık Performans Pazarlama & Media Buyer pozisyonları ve uzaktan çalışma olanakları.",
    "megaMenu.supportTitle": "Destek, Müşteri Rehberi & Ödeme",
    "megaMenu.supportSub": "Sıkça sorulan sorular, yardım rehberleri, IBAN hesapları ve hizmet garantisi",
    "megaMenu.faqTitle": "Sıkça Sorulan Sorular (FAQ)",
    "megaMenu.faqDesc": "Müşterilerimizin en çok merak ettiği sorular ve akordeon yapıda şeffaf yanıt havuzu.",
    "megaMenu.helpTitle": "Yardım Merkezi (Help Desk)",
    "megaMenu.helpDesc": "Teknik dokümantasyon, kurumsal e-posta kurulum kılavuzları ve canlı destek hattı.",
    "megaMenu.paymentTitle": "Güvenli Ödeme & IBAN",
    "megaMenu.paymentDesc": "Stripe altyapısı, Garanti BBVA / İş Bankası ve SBP resmi transfer kanalları.",
    "megaMenu.guaranteeTitle": "Hizmet Garantisi",
    "megaMenu.guaranteeDesc": "48 saatlik sayaç kuralları, %100 canlıya alma taahhüdü ve 7 günlük ücretsiz revizyon.",
    "megaMenu.servicesSub": "Özel yazılım, tasarım ve büyüme odaklı ajans servislerimiz",
    "megaMenu.viewDetails": "Detayları İncele",
    "megaMenu.referencesSub": "KOBİ’ler ve kurumsal müşterilerimizle ulaştığımız somut sonuçlar",

    // Detail Modal
    "detail.featuresIncluded": "Dahil Olan Özellikler & Fonksiyonlar",
    "detail.packageOptions": "Bu Tasarım İçin Teslimat Seçenekleri (3 Model)",
    "detail.economicOption": "Ekonomik Seçenek",
    "detail.economicManaged": "Yönetim Bizde (Sıfır Zahmet)",
    "detail.economicDesc": "Sitenizi kurarız, güncellemeleri bize WhatsApp'tan iletirsiniz, biz yaparız.",
    "detail.proOption": "Profesyonel Seçenek",
    "detail.proTitle": "Tam Yetkili Profesyonel CMS",
    "detail.proDesc": "Kendi modern yönetim panelinizle sınırsız içerik, fotoğraf ve yazı girişi.",
    "detail.selectPackage": "Bu Paketi Seç",
    "detail.buyStripeWire": "Stripe / Havale İle Satın Al",

    // Form & Common
    "form.title": "Projeniz İçin Teklif & Bilgi Alın",
    "form.subtitle": "48 saatte anahtar teslim yayına alma garantisi",
    "form.successTitle": "Talebiniz Başarıyla Alındı!",
    "form.success": "Talebiniz başarıyla alındı! En geç 2 saat içinde sizinle iletişime geçeceğiz.",
    "form.whatsappDirect": "WhatsApp'tan Hemen Yaz",
    "form.productSelect": "İlgilendiğiniz Hazır Site",
    "form.undecided": "Genel Danışmanlık / Kararsızım",
    "form.packageSelect": "Tercih Ettiğiniz Model",
    "contact.onlyWhatsapp": "Sadece WhatsApp",
    "common.close": "Tamam",

    // Footer
    "footer.brandName": "Vanguard Studio",
    "footer.tagline": "Küçük İşletmeler İçin Elit & Anahtar Teslim Web Çözümleri",
    "footer.acceptingClients": "Yeni Müşteri Kabulü Açık",
    "footer.hubTurkey": "Türkiye & Genel",
    "footer.whatsappNote": "Sadece WhatsApp",
    "footer.locationTR": "Antalya, Türkiye",
    "footer.email": "iletisim@vanguardstudio.digital",
    "footer.corporateTitle": "KURUMSAL",
    "footer.modelsTitle": "HAZIR SİTELER & PAKETLER",
    "footer.legalTitle": "YASAL BİLDİRİMLER",
    "footer.motto": "“Kodla İnşa Ediyor, Pazarlamayla Büyütüyoruz. Sınırların Ötesinde Dijital Gelecek.”",
    "footer.hubLocations": "🇹🇷 TR Antalya & 🇪🇺 EU Frankfurt Hub",
    "footer.copyrightOwner": "Vanguard Studio",
    "footer.allRights": "Tüm hakları saklıdır.",
    "footer.turnaround": "48 Saatte Anahtar Teslim",
    "footer.turnaroundUrl": "#page-48-saatte-teslim-ve-hizmet-garantisi",
    "footer.aboutLinkText": "Hakkımızda",
    "footer.privacyLinkText": "Gizlilik & KVKK",
    "footer.badgeHiring": "İlan",
    "footer.catalogLink": "Hazır Siteler Kataloğu"
  },
  en: {
    // Nav & Header
    "nav.products": "Turnkey Sites",
    "nav.services": "Services",
    "nav.references": "References",
    "nav.pricing": "Pricing",
    "nav.faq": "FAQ",
    "nav.corporate": "Corporate",
    "nav.contact": "Contact",
    "nav.admin": "Admin Panel",
    "nav.techAdvisory": "Tech Advisory",
    "nav.home": "Home",
    "nav.turnkeySites": "Turnkey Sites",
    "nav.support": "Support & FAQ",
    "nav.advisory": "Tech Advisory",
    "nav.viewAll": "View All",
    "nav.viewAllSites": "Explore All Turnkey Sites",
    "nav.viewAllServices": "View All Services",
    "nav.viewAllReferences": "View All References",
    "nav.paymentPortal": "Secure Payment & Wire Transfer",
    "nav.about": "About Us",
    "nav.contactLink": "Contact & Quote",
    "header.customerPanel": "Client Panel",

    // Hero
    "hero.badge": "Tailored for Small Businesses · Live in 48 Hours",
    "hero.kicker": "VIP Web Development & Conversion Agency",
    "hero.title": "Prestigious Turnkey Websites That Won’t Strain Your Budget.",
    "hero.subtitle": "Without paying fortunes to big agencies: sales-driven, bespoke industry websites live on your domain within {{PRICE_10000}} – {{PRICE_20000}} range.",
    "hero.cta": "Explore Turnkey Sites",
    "hero.ctaPrimary": "Explore Turnkey Sites",
    "hero.ctaSecondary": "Which Package Fits You?",
    "hero.secondary": "Get Tech Advisory",
    "hero.watchVideo": "How We Work (Video)",
    "hero.stat1.val": "48 Hours",
    "hero.stat1.label": "Average Turnaround Time",
    "hero.stat2.val": "From {{PRICE_10000}}",
    "hero.stat2.label": "Transparent Fixed Pricing",
    "hero.stat3.val": "TR · EN",
    "hero.stat3.label": "Multilingual & Market-Focused",

    // Products / Showcase
    "products.sectionNumber": "01. Showcase & Portfolio",
    "products.sectionTitle": "Ready-to-Deploy Industry Websites",
    "products.sectionSubtitle": "Carefully engineered, battle-tested, and ready for 48-hour turnkey deployment.",
    "products.listingCount": "Sites Displayed (Max 6 on Showcase)",
    "products.all": "All Sectors",
    "products.tab.all": "All Sectors",
    "products.tab.health": "Healthcare & Clinic",
    "products.tab.law": "Law & Advisory",
    "products.tab.restaurant": "Restaurant & Cafe",
    "products.tab.architecture": "Architecture & Design",
    "products.tab.logistics": "Logistics & Cargo",
    "products.tab.ecommerce": "E-Commerce & Store",
    "products.tab.realestate": "Real Estate",
    "products.tab.fitness": "Fitness & Sports",
    "products.tab.portfolio": "Portfolio",
    "products.emptyCategory": "No turnkey sites currently listed in this category.",
    "products.viewAll": "View All Turnkey Sites",
    "products.viewAllCatalog": "View All Showcase Sites",
    "products.viewDemo": "Live Preview",
    "products.viewDetails": "Details & Buy",
    "products.liveSite": "Live Standalone Site",
    "products.manageWithCustomerPanel": "Client Panel",
    "products.deployButton": "Deploy Turnkey Site (48h)",
    "products.economicBadge": "Managed Setup",
    "products.proBadge": "Professional CMS",
    "products.readyIn": "Turnkey: 48 Hours",
    "products.videoAvailable": "Video Walkthrough Available",

    // Delivery Models & Pricing
    "models.sectionNumber": "02. Delivery Packages",
    "models.sectionTitle": "Product Tiers & Business Models",
    "models.sectionSubtitle": "Whether you delegate all technical maintenance to us, manage it independently with a full CMS, or let us architect a bespoke enterprise solution.",
    "pricing.sectionTitle": "Product Tiers & Business Models",
    "pricing.sectionSubtitle": "Whether you delegate all technical maintenance to us, manage it independently with a full CMS, or let us architect a bespoke enterprise solution.",
    "models.mostPopular": "Most Popular Model",
    "models.economic.title": "Economic Tier (Managed by Us)",
    "models.turnkey": "/ turnkey delivery",
    "models.economic.desc": "Ideal for small businesses that do not want to spend time learning admin panels or passwords. We build your site and upload your content. When updates are needed, simply send them to us and we update it.",
    "models.economic.feat1": "No complex CMS for the client; full agency management support",
    "models.economic.feat2": "Domain name, hosting, SSL, and corporate email setup included",
    "models.economic.feat3": "12 text, photo, and pricing updates included per year",
    "models.economic.feat4": "Instant WhatsApp and direct call buttons integration",
    "models.economic.feat5": "Ultra-fast load speed and mobile perfection",
    "models.ctaStripe": "Stripe / Wire Transfer",
    "models.ctaQuote": "Request a Quote",
    "models.fullIndependence": "Full Independence & Control",
    "models.advancedPanel": "Advanced CMS Solution",
    "models.pro.title": "Professional Tier (Full-Access CMS)",
    "models.pro.desc": "A full-access professional management panel for growing businesses with their own team, publishing regular content, or desiring total control over every detail.",
    "models.pro.feat1": "Clean, full-access professional CMS handed over to client",
    "models.pro.feat2": "Unlimited products, blog posts, and gallery items",
    "models.pro.feat3": "Multilingual content management and automatic translation engine",
    "models.pro.feat4": "Advanced analytics and instant inquiry notifications",
    "models.pro.feat5": "1-hour live onboarding video session and guide for your team",
    "models.customArchitecture": "Custom Architecture & Scale",
    "models.customScope": "Bespoke Scope & Custom Quote",
    "models.custom.title": "Custom Architecture & Enterprise Solution",
    "models.custom.badge": "Custom Architecture & Scale",
    "models.custom.priceTitle": "Custom Pricing",
    "models.custom.priceSub": "/ per project",
    "models.custom.price": "Custom Pricing",
    "models.custom.desc": "Beyond standard templates: custom bespoke UI/UX design, external API/ERP/CRM integrations, multi-branch, or enterprise e-commerce infrastructures.",
    "models.custom.feat1": "Bespoke Figma UI/UX design tailored specifically to your brand",
    "models.custom.feat2": "Custom backend architecture, API services, and ERP/CRM integrations",
    "models.custom.feat3": "Multilingual, multi-currency, and international payment gateways",
    "models.custom.feat4": "High-traffic load balancing and dedicated cloud hosting deployment",
    "models.custom.feat5": "Priority 24/7 SLA support, full source code handover, and docs",

    // Services
    "services.sectionNumber": "03. Agency Solutions",
    "services.sectionTitle": "Agency Services",
    "services.sectionSubtitle": "Beyond our ready-made websites, end-to-end digital solutions to support your growth.",
    "services.viewAllText": "View All",
    "services.ctaQuote": "Request Info & Quote",

    // References
    "references.sectionNumber": "04. Proven Achievements",
    "references.sectionTitle": "Partnerships & Proven Results",
    "references.sectionSubtitle": "Real-life success stories of small businesses in local and global markets.",
    "references.viewAllText": "View All",

    // Corporate Pages
    "corporate.vision": "Our Vision",
    "corporate.mission": "Our Mission",
    "corporate.careers": "Careers & Remote Roles",

    // Mega Menu
    "megaMenu.productsSub": "4 featured turnkey storefronts from our 10-site portfolio",
    "megaMenu.startingPrice": "Starting Price",
    "megaMenu.examine": "Explore",
    "megaMenu.corporateTitle": "Corporate Ecosystem & Vision",
    "megaMenu.corporateSub": "Vanguard Studio story, engineering philosophy, and open opportunities",
    "megaMenu.aboutTitle": "About Us",
    "megaMenu.aboutDesc": "Vanguard Studio foundation story, engineering philosophy, and passionate team culture.",
    "megaMenu.visionTitle": "Our Vision",
    "megaMenu.visionDesc": "Frictionless 48-hour turnkey deployments on clean React & Tailwind codebase.",
    "megaMenu.missionTitle": "Our Mission",
    "megaMenu.missionDesc": "Liberating SMEs from exorbitant agency budgets and chronic delivery delays.",
    "megaMenu.careerTitle": "Careers & Remote Roles",
    "megaMenu.careerDesc": "Open Performance Marketing & Media Buyer roles and global remote opportunities.",
    "megaMenu.supportTitle": "Support, Guides & Payment",
    "megaMenu.supportSub": "Frequently asked questions, guides, bank accounts, and service guarantees",
    "megaMenu.faqTitle": "Frequently Asked Questions (FAQ)",
    "megaMenu.faqDesc": "Transparent answers to the most common questions in an accordion knowledge base.",
    "megaMenu.helpTitle": "Help Desk & Guides",
    "megaMenu.helpDesc": "Technical documentation, corporate email setup guides, and live support desk.",
    "megaMenu.paymentTitle": "Secure Payment & Wire",
    "megaMenu.paymentDesc": "Stripe checkout, official Garanti BBVA / Is Bankasi and international wire accounts.",
    "megaMenu.guaranteeTitle": "Service Guarantee",
    "megaMenu.guaranteeDesc": "48-hour countdown SLA, 100% turnkey deployment commitment, and 7-day free revisions.",
    "megaMenu.servicesSub": "Custom software, design, and conversion-focused agency services",
    "megaMenu.viewDetails": "Explore Details",
    "megaMenu.referencesSub": "Tangible growth achievements delivered for SMEs and corporate clients",

    // Detail Modal
    "detail.featuresIncluded": "Included Features & Capabilities",
    "detail.packageOptions": "Deployment Options for This Showcase (3 Models)",
    "detail.economicOption": "Economic Option",
    "detail.economicManaged": "Managed by Us (Zero Hassle)",
    "detail.economicDesc": "We set up your site, upload your content. Send changes via WhatsApp and we handle it.",
    "detail.proOption": "Professional Option",
    "detail.proTitle": "Full-Access Professional CMS",
    "detail.proDesc": "Manage your site independently with an intuitive, modern administration panel.",
    "detail.selectPackage": "Select This Package",
    "detail.buyStripeWire": "Buy via Stripe / Wire Transfer",

    // Form & Common
    "form.title": "Request a Quote & Project Info",
    "form.subtitle": "Guaranteed 48-hour turnkey deployment SLA",
    "form.successTitle": "Inquiry Received Successfully!",
    "form.success": "Your request has been received! Our team will contact you within 2 hours.",
    "form.whatsappDirect": "Message via WhatsApp",
    "form.productSelect": "Selected Turnkey Showcase",
    "form.undecided": "General Consultation / Undecided",
    "form.packageSelect": "Preferred Business Model",
    "contact.onlyWhatsapp": "WhatsApp Only",
    "common.close": "Close",

    // Footer
    "footer.brandName": "Vanguard Studio",
    "footer.tagline": "Elite & Turnkey Web Solutions for Small Businesses",
    "footer.acceptingClients": "Accepting New Clients",
    "footer.hubTurkey": "Turkey & Global Desk",
    "footer.whatsappNote": "WhatsApp Only",
    "footer.locationTR": "Antalya, Turkey",
    "footer.email": "contact@vanguardstudio.digital",
    "footer.corporateTitle": "CORPORATE",
    "footer.modelsTitle": "TURNKEY SITES & TIERS",
    "footer.legalTitle": "LEGAL & COMPLIANCE",
    "footer.motto": "“Engineered through Code, Scaled through Marketing. Digital Future Beyond Borders.”",
    "footer.hubLocations": "🇹🇷 TR Antalya & 🇪🇺 EU Frankfurt Hub",
    "footer.copyrightOwner": "Vanguard Studio",
    "footer.allRights": "All rights reserved.",
    "footer.turnaround": "48-Hour Turnkey Deployment",
    "footer.turnaroundUrl": "#page-48-saatte-teslim-ve-hizmet-garantisi",
    "footer.aboutLinkText": "About Us",
    "footer.privacyLinkText": "Privacy & GDPR",
    "footer.badgeHiring": "Hiring",
    "footer.catalogLink": "Turnkey Sites Catalog"
  }
};

export const DEFAULT_NAVIGATION = DEFAULT_NAV_ITEMS;

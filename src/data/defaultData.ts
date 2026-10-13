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
    "nav.products": "Hazır Siteler",
    "nav.services": "Hizmetler",
    "nav.references": "Referanslar",
    "nav.pricing": "Fiyatlar",
    "nav.faq": "SSS",
    "nav.corporate": "Kurumsal",
    "nav.contact": "İletişim",
    "nav.admin": "Yönetim Paneli",
    "nav.techAdvisory": "Teknik Danışmanlık",
    "hero.kicker": "VIP Web Geliştirme & Dönüşüm Ajansı",
    "hero.title": "Kod ile İnşa Ediyor, Pazarlama ile Ölçeklendiriyoruz.",
    "hero.subtitle": "Küçük ve orta ölçekli işletmeler için en yüksek performanslı, SEO uyumlu ve satışa hazır sektörel web siteleri.",
    "hero.cta": "Hazır Siteleri İncele",
    "hero.secondary": "Teknik Danışmanlık Al",
    "products.sectionNumber": "01. Vitrin & Portföy",
    "products.sectionTitle": "Satışa Hazır Sektörel Siteler",
    "products.sectionSubtitle": "Özenle seçilmiş, test edilmiş ve anahtar teslim devreye alınmaya hazır maksimum 10 özel çözüm.",
    "products.listingCount": "Site Listeleniyor (Maksimum 10)",
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
    "products.viewAll": "Tüm Hazır Siteleri Gör"
  },
  en: {
    "nav.products": "Turnkey Sites",
    "nav.services": "Services",
    "nav.references": "References",
    "nav.pricing": "Pricing",
    "nav.faq": "FAQ",
    "nav.corporate": "Corporate",
    "nav.contact": "Contact",
    "nav.admin": "Admin Panel",
    "nav.techAdvisory": "Tech Advisory",
    "hero.kicker": "VIP Web Development & Conversion Agency",
    "hero.title": "Engineered through Code, Scaled through Marketing.",
    "hero.subtitle": "High-performance, SEO-optimized, and ready-to-sell industry websites built for businesses.",
    "hero.cta": "Explore Turnkey Sites",
    "hero.secondary": "Get Tech Advisory",
    "products.sectionNumber": "01. Showcase & Portfolio",
    "products.sectionTitle": "Ready-to-Sell Industry Websites",
    "products.sectionSubtitle": "Carefully crafted, tested, and turnkey-ready solutions for maximum conversion.",
    "products.listingCount": "Sites Listed (Maximum 10)",
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
    "products.viewAll": "View All Turnkey Sites"
  }
};

export const DEFAULT_NAVIGATION = DEFAULT_NAV_ITEMS;

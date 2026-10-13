export type CurrencyCode = 'TRY' | 'USD' | 'EUR';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToTRY: number;
}

export interface CentralBankRate {
  pair: string;
  rate: number;
  change: string;
  source: 'TCMB' | 'CBR' | string;
}

export interface BankAccountInfo {
  bankNameTR: string;
  accountHolderTR: string;
  ibanTR: string;
  stripeEnabled: boolean;
}

export interface BankAccountItem {
  id: string;
  title: string;
  bankName: string;
  accountHolder: string;
  accountNumber?: string;
  iban: string;
  currency: CurrencyCode;
  branchName?: string;
  branchCode?: string;
  swiftBic?: string;
  sbpPhone?: string;
  country: 'TR' | 'INT';
  isActive: boolean;
  isPrimary?: boolean;
  notes?: string;
}

export interface LegalTaxInfo {
  companyTitleTR?: string;
  taxOfficeTR?: string;
  taxNumberTR?: string; // VKN / Vergi No
  registeredAddressTR?: string;
}

export type FinancialTransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'project_sale'       // Hazır Web Sitesi Satışı
  | 'deposit'            // Ön Ödeme / Kapora
  | 'maintenance'        // Bakım & Destek
  | 'custom_feature'     // Özel Yazılım / Eklenti
  | 'hosting_domain'     // Sunucu / Hosting / Domain
  | 'freelance'          // Freelance Tasarım & Kod
  | 'advertising'        // Dijital Reklam
  | 'software_license'   // Yazılım / Lisans Araçları
  | 'tax_legal'          // Vergi & Harç & Muhasebe
  | 'operational'        // Operasyonel & Ofis
  | 'other';

export interface FinancialTransaction {
  id: string;
  type: FinancialTransactionType;
  title: string;
  clientOrVendor: string;
  amount: number;
  currency: CurrencyCode;
  amountTRY: number;
  category: TransactionCategory;
  paymentMethod: 'bank_transfer' | 'stripe' | 'fast' | 'cash' | 'sbp' | 'other';
  status: 'completed' | 'pending' | 'cancelled';
  date: string; // YYYY-MM-DD
  relatedProductId?: string;
  invoiceNumber?: string;
  notes?: string;
  createdAt: string;
}

export type PricingTier = 'economic' | 'professional';

export interface ProductTranslation {
  title?: string;
  sector?: string;
  tagline?: string;
  description?: string;
  features?: string[];
  badge?: string;
}

export interface CustomerOpeningHours {
  weekdays: string;
  saturday: string;
  sunday: string;
  acceptingOrders: boolean;
}

export interface CustomerServiceItem {
  id: string;
  title: string;
  price: string;
  description: string;
}

export interface CustomerBusinessInfo {
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  openingHours?: CustomerOpeningHours;
  servicesList?: CustomerServiceItem[];
}

export interface TurnkeyProduct {
  id: string;
  title: string;
  sector: string;
  slug: string;
  slug_tr?: string;
  slug_en?: string;
  tagline: string;
  description: string;
  priceEconomicTRY: number;
  priceProfessionalTRY: number;
  features: string[];
  coverImage: string;
  galleryImages: string[];
  videoUrl?: string;
  isVideoLocal?: boolean;
  badge?: string;
  deliveryDays: number;
  demoType: 'medical' | 'law' | 'restaurant' | 'architecture' | 'logistics' | 'ecommerce' | 'realestate' | 'fitness' | 'portfolio' | 'custom';
  externalDemoUrl?: string;
  isFeaturedInMegaMenu: boolean;
  active: boolean;
  translations?: Record<string, ProductTranslation>;
  customerBusinessInfo?: CustomerBusinessInfo;
}

export interface AdvisoryTranslation {
  badge?: string;
  packageName?: string;
  priceText?: string;
  priceSubtext?: string;
  features?: string[];
  buttonText?: string;
  description?: string;
}

export interface AdvisoryServiceConfig {
  id: string;
  badge: string;
  packageName: string;
  priceText: string;
  priceSubtext: string;
  basePriceTRY: number;
  features: string[];
  buttonText: string;
  buttonLink: string;
  description: string;
  isActive: boolean;
  translations?: Record<string, AdvisoryTranslation>;
}

export interface ServiceTranslation {
  title?: string;
  subtitle?: string;
  description?: string;
  deliverables?: string[];
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  iconName: string;
  isFeaturedInMegaMenu: boolean;
  slug?: string;
  slug_tr?: string;
  slug_en?: string;
  translations?: Record<string, ServiceTranslation>;
}

export interface ReferenceTranslation {
  clientName?: string;
  sector?: string;
  metric?: string;
  quote?: string;
  author?: string;
  authorRole?: string;
}

export interface ReferenceItem {
  id: string;
  clientName: string;
  sector: string;
  year: string;
  metric: string;
  quote: string;
  author: string;
  authorRole: string;
  siteUrl?: string;
  coverImage?: string;
  isFeaturedInMegaMenu: boolean;
  slug?: string;
  slug_tr?: string;
  slug_en?: string;
  translations?: Record<string, ReferenceTranslation>;
}

export interface LeadInquiry {
  id: string;
  createdAt: string;
  clientName: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  companyName: string;
  productId?: string;
  productTitle?: string;
  preferredPackage: 'economic' | 'professional' | 'custom' | 'advisory';
  budgetTRY?: number;
  message: string;
  status: 'new' | 'contacted' | 'proposal_sent' | 'completed' | 'cancelled';
  notes?: string;
  attachmentName?: string;
  attachmentSize?: number;
  attachmentData?: string;
}

export interface LanguageDef {
  code: string;
  name: string;
  flag: string;
  isDefault: boolean;
  active: boolean;
}

export type TranslationDictionary = Record<string, Record<string, string>>;

export type NavigationLocation =
  | 'header'
  | 'footer_corporate'
  | 'footer_products'
  | 'footer_legal'
  | 'mega_corporate'
  | 'mega_support'
  | 'sidebar';

export interface NavigationItemTranslation {
  title?: string;
}

export interface NavigationItem {
  id: string;
  title: string;
  url: string;
  location: NavigationLocation;
  locations?: NavigationLocation[];
  order: number;
  isOpenNewTab?: boolean;
  pageSlug?: string;
  parentId?: string;
  translations?: Record<string, NavigationItemTranslation>;
}

export interface CustomPageTranslation {
  title?: string;
  summary?: string;
  content?: string;
}

export interface FaqTranslation {
  question?: string;
  answer?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  active: boolean;
  translations?: Record<string, FaqTranslation>;
}

export type PageLocation =
  | 'legal'
  | 'corporate'
  | 'info'
  | 'support'
  | 'header'
  | 'sidebar'
  | 'footer_corporate'
  | 'footer_legal'
  | 'footer_products'
  | 'mega_corporate'
  | 'mega_support'
  | string;

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  summary?: string;
  content: string;
  category: 'legal' | 'corporate' | 'info' | 'support' | string;
  locations?: PageLocation[];
  menuLocation?: string;
  updatedAt: string;
  isPublished: boolean;
  translations?: Record<string, CustomPageTranslation>;
}

export interface AgencySettings {
  agencyName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  phoneTR?: string;
  whatsappTR?: string;
  email: string;
  locationTR: string;
  adminPin: string;
  defaultCurrency: CurrencyCode;
  customCss?: string;
  promoVideoUrl?: string;
  heroBgImage?: string;
  footerMotto?: {
    tr: string;
    en: string;
  };
  bankAccounts: BankAccountInfo;
  bankAccountsList?: BankAccountItem[];
  legalTaxInfo?: LegalTaxInfo;
  advisoryService?: AdvisoryServiceConfig;
}

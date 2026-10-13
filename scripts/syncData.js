import fs from 'fs';
import path from 'path';

const backupPath = path.resolve('public/vanguard-studio-backup.json');
const targetPath = path.resolve('src/data/defaultData.ts');

const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));

const fileContent = `import {
  TurnkeyProduct,
  ServiceItem,
  ReferenceItem,
  AgencySettings,
  FinancialTransaction,
  NavigationItem,
  CustomPage,
  FaqItem,
  LanguageDef,
  TranslationDictionary,
  BankAccountItem,
  LegalTaxInfo,
  CurrencyInfo,
  CentralBankRate
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

export const DEFAULT_PRODUCTS: TurnkeyProduct[] = ${JSON.stringify(backupData.products || [], null, 2)};

export const DEFAULT_SERVICES: ServiceItem[] = ${JSON.stringify(backupData.services || [], null, 2)};

export const DEFAULT_REFERENCES: ReferenceItem[] = ${JSON.stringify(backupData.references || [], null, 2)};

export const DEFAULT_LANGUAGES: LanguageDef[] = ${JSON.stringify(backupData.languages || [], null, 2)};

export const DEFAULT_TRANSLATIONS: TranslationDictionary = ${JSON.stringify(backupData.translations || {}, null, 2)};

export const DEFAULT_SETTINGS: AgencySettings = ${JSON.stringify(backupData.settings || {}, null, 2)};

export const DEFAULT_BANK_ACCOUNTS_LIST: BankAccountItem[] = ${JSON.stringify(backupData.bankAccountsList || [], null, 2)};

export const DEFAULT_LEGAL_TAX_INFO: LegalTaxInfo = ${JSON.stringify(backupData.legalTaxInfo || {}, null, 2)};

export const DEFAULT_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = ${JSON.stringify(backupData.financialTransactions || [], null, 2)};

export const DEFAULT_NAVIGATION: NavigationItem[] = ${JSON.stringify(backupData.navigationItems || [], null, 2)};

export const DEFAULT_PAGES: CustomPage[] = ${JSON.stringify(backupData.customPages || [], null, 2)};

export const DEFAULT_FAQS: FaqItem[] = ${JSON.stringify(backupData.faqs || [], null, 2)};
`;

fs.writeFileSync(targetPath, fileContent, 'utf8');
console.log('Successfully synced defaultData.ts from backup JSON!');

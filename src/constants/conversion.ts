import { CurrencyMeta } from '../types/reducers';

export const CONVERSION_DEBOUNCED_DELAY = 1000;

export const SOURCE_CURRENCIES: Record<string, CurrencyMeta> = {
  SGD: { code: 'SGD', name: 'Singapore Dollar', countryCode: 'SG' },
  USD: { code: 'USD', name: 'US Dollar', countryCode: 'US' },
  AUD: { code: 'AUD', name: 'Australian Dollar', countryCode: 'AU' },
  EUR: { code: 'EUR', name: 'Euro', countryCode: 'EU' },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', countryCode: 'MY' },
  JPY: { code: 'JPY', name: 'Japanese Yen', countryCode: 'JP' },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', countryCode: 'HK' },
  GBP: { code: 'GBP', name: 'British Pound', countryCode: 'GB' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', countryCode: 'CA' },
  INR: { code: 'INR', name: 'Indian Rupee', countryCode: 'IN' },
};

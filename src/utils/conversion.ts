import { SOURCE_CURRENCIES } from '../constants/conversion';

export const countryCodeToFlag = (countryCode: string): string => {
  if (!countryCode) {
    return '';
  }

  if (countryCode === 'EU') {
    return '🇪🇺';
  }

  return countryCode
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65)
    );
};

export const getCurrencyDisplay = (currencyCode: string) => {
  const meta = SOURCE_CURRENCIES[currencyCode];

  if (!meta) {
    return {
      label: currencyCode,
      flag: '',
    };
  }

  return {
    label: `${meta.name} (${meta.code})`,
    flag: countryCodeToFlag(meta.countryCode),
  };
};

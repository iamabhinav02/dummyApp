import CommonReduxStore from '../store/commonStore';
import { CurrencyMeta, IConversionHistoryItem, IConversionReducer, ICurrency } from '../types/reducers';
import { CONVERSION, COUNTER } from '../reducers/actions';
import { fetchAllCurrency, fetchLiveExchangeRate } from './apis/currency';
import { AsyncStorageController } from './AsyncStorageController';
import { STORAGE_KEYS } from '../constants/storage';

export interface IConversionController {
  setSourceCurrency: (val: string) => Promise<void>;
  getSourceCurrency: () => string | undefined;
  setDestinationCurrency: (val: string| undefined) => Promise<void>;
  getDestinationCurrency: () => string | undefined;
  setDestinationCurrencies: (val: string) => Promise<Record<string, CurrencyMeta>>;
  setLiveExchangeRate: () => Promise<number>;
  setAmount: (val: number) => void;
  getAmount: () => number;
  setIsLoading: (val: boolean) => void;
  getIsLoading: () => boolean;
  swapCurrencies: () => Promise<void>;
  addToHistory: (rate: number, amount: number) => Promise<void>;
}

const ConversionController: IConversionController = {
  setSourceCurrency: async (currency) => {
    try {
      CommonReduxStore.getInstance().dispatch({
        type: CONVERSION.SET_SOURCE_CURRENCY,
        payload: { sourceCurrency: currency },
      });

      await ConversionController.setDestinationCurrencies(currency);
    } catch (err) {
      console.error('Error setting source currency:', err);
    }
  },

  getSourceCurrency: () => {
    const { sourceCurrency } = CommonReduxStore.getInstance().getState().conversionReducer as IConversionReducer;
    return sourceCurrency || undefined;
  },

  setDestinationCurrency: async (currency) => {
    CommonReduxStore.getInstance().dispatch({
      type: CONVERSION.SET_DESTINATION_CURRENCY,
      payload: { destinationCurrency: currency },
    });

    await ConversionController.setLiveExchangeRate();
  },

  getDestinationCurrency: () => {
    const { destinationCurrency } = CommonReduxStore.getInstance().getState().conversionReducer as IConversionReducer;
    return destinationCurrency || undefined;
  },

  setDestinationCurrencies: async (currency) => {
    const response = await fetchAllCurrency(currency);

    const destinationCurrencies: Record<string, CurrencyMeta> = {};

    if (response[currency]?.length > 0) {
      response[currency].forEach((currencyItem: ICurrency) => {
        destinationCurrencies[currencyItem.destination_currency_code] = {
          code: currencyItem.destination_currency_code,
          name: currencyItem.destination_currency_name,
          countryCode: currencyItem.destination_currency_code,
        };
      });
    }

    CommonReduxStore.getInstance().dispatch({
      type: CONVERSION.SET_DESTINATION_CURRENCIES,
      payload: { destinationCurrencies },
    });

    return destinationCurrencies;
  },

  setAmount: (amount) => {
    CommonReduxStore.getInstance().dispatch({
      type: CONVERSION.SET_AMOUNT,
      payload: { amount },
    });
  },

  getAmount: () => {
    const { amount } = CommonReduxStore.getInstance().getState().conversionReducer as IConversionReducer;
    return amount || 0;
  },

  setIsLoading: (isLoading) => {
    CommonReduxStore.getInstance().dispatch({
      type: COUNTER.IS_LOADING,
      payload: { isLoading },
    });
  },

  getIsLoading: () => {
    const { isLoading } = CommonReduxStore.getInstance().getState().conversionReducer as IConversionReducer;
    return isLoading;
  },

  swapCurrencies: async () => {
    CommonReduxStore.getInstance().dispatch({
      type: CONVERSION.SET_IS_LOADING,
      payload: { isLoading: true },
    });

    const sourceCurrency = ConversionController.getSourceCurrency() || '';
    const destinationCurrency = ConversionController.getDestinationCurrency() || '';

    const destinationCurrencies = await ConversionController.setDestinationCurrencies(destinationCurrency);
    if (destinationCurrencies && Object.keys(destinationCurrencies).length > 0) {
      ConversionController.setDestinationCurrency(sourceCurrency);
    } else {
      ConversionController.setDestinationCurrency(undefined);
    }

    await ConversionController.setSourceCurrency(destinationCurrency);

    CommonReduxStore.getInstance().dispatch({
      type: CONVERSION.SET_IS_LOADING,
      payload: { isLoading: false },
    });
  },

  setLiveExchangeRate: async () => {
    const sourceCurrency = ConversionController.getSourceCurrency() || '';
    const destinationCurrency = ConversionController.getDestinationCurrency() || '';

    if (!sourceCurrency || !destinationCurrency) {
      return 0;
    }

    const response = await fetchLiveExchangeRate(sourceCurrency, destinationCurrency);

    if (response?.current_rate?.rate) {
      CommonReduxStore.getInstance().dispatch({
        type: CONVERSION.SET_LIVE_EXCHANGE_RATE,
        payload: { rate: Number(response.current_rate.rate.toFixed(2)) },
      });

      return Number(response.current_rate.rate.toFixed(2));
    }

    return 0;
  },

  addToHistory: async (rate: number, amount: number) => {
    const sourceCurrency = ConversionController.getSourceCurrency() || '';
    const destinationCurrency = ConversionController.getDestinationCurrency() || '';

    const convertedAmount = Math.round(amount * rate * 100) / 100;
    const conversionHistoryItems: IConversionHistoryItem[] = CommonReduxStore.getInstance().getState().conversionReducer.conversionHistory;
    conversionHistoryItems.sort((a, b) => b.timestamp - a.timestamp);

    const lastItem = conversionHistoryItems[0];
    const newItem: IConversionHistoryItem = {
      id: Math.random() * 100,
      amount,
      rate,
      convertedAmount,
      sourceCurrency,
      destinationCurrency,
      timestamp: Date.now(),
    };

    if (
      lastItem &&
      lastItem.amount === newItem.amount &&
      lastItem.rate === newItem.rate &&
      lastItem.sourceCurrency === newItem.sourceCurrency &&
      lastItem.destinationCurrency === newItem.destinationCurrency
    ) {
      return;
    }

    const newItems = [
      newItem,
      ...conversionHistoryItems,
    ].slice(0, 10);

    CommonReduxStore.getInstance().dispatch({
      type: CONVERSION.ADD_TO_HISTORY,
      payload: { conversionHistory: newItems },
    });

    await AsyncStorageController.set(STORAGE_KEYS.CONVERSION_HISTORY, newItems);
  },
};

export default ConversionController;

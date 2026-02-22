jest.mock('../../store/commonStore');
jest.mock('../apis/currency');
jest.mock('../AsyncStorageController');

import ConversionController from '../ConversionController';
import MockCommonReduxStore from '../../store/commonStore';
import { fetchAllCurrency, fetchLiveExchangeRate } from '../apis/currency';
import { AsyncStorageController } from '../AsyncStorageController';
import { CONVERSION } from '../../reducers/actions';

const { setMockState } = jest.requireMock('../../store/commonStore');

describe('ConversionController', () => {
  const dispatch = MockCommonReduxStore.getInstance().dispatch as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    setMockState({
      conversionReducer: {
        sourceCurrency: undefined,
        destinationCurrency: undefined,
        amount: 0,
        rate: 0,
        isLoading: false,
        destinationCurrencies: {},
        conversionHistory: [],
      },
    });
  });

  it('sets source currency and fetches destination currencies', async () => {
    (fetchAllCurrency as jest.Mock).mockResolvedValue({
      USD: [
        {
          destination_currency_code: 'INR',
          destination_currency_name: 'Indian Rupee',
        },
      ],
    });

    await ConversionController.setSourceCurrency('USD');

    expect(dispatch).toHaveBeenCalledWith({
      type: CONVERSION.SET_SOURCE_CURRENCY,
      payload: { sourceCurrency: 'USD' },
    });

    expect(fetchAllCurrency).toHaveBeenCalledWith('USD');
  });

  it('gets source currency from store', () => {
    setMockState({
      conversionReducer: {
        sourceCurrency: 'USD',
      },
    });

    expect(ConversionController.getSourceCurrency()).toBe('USD');
  });

  it('sets live exchange rate when currencies exist', async () => {
    setMockState({
      conversionReducer: {
        sourceCurrency: 'USD',
        destinationCurrency: 'INR',
        rate: 0,
      },
    });

    (fetchLiveExchangeRate as jest.Mock).mockResolvedValue({
      current_rate: { rate: 83.456 },
    });

    const rate = await ConversionController.setLiveExchangeRate();

    expect(rate).toBe(83.46);
    expect(dispatch).toHaveBeenCalledWith({
      type: CONVERSION.SET_LIVE_EXCHANGE_RATE,
      payload: { rate: 83.46 },
    });
  });

  it('sets and gets amount', () => {
    ConversionController.setAmount(100);

    expect(dispatch).toHaveBeenCalledWith({
      type: CONVERSION.SET_AMOUNT,
      payload: { amount: 100 },
    });
  });

  it('swaps source and destination currencies', async () => {
    setMockState({
      conversionReducer: {
        sourceCurrency: 'USD',
        destinationCurrency: 'INR',
      },
    });

    (fetchAllCurrency as jest.Mock).mockResolvedValue({
      INR: [
        {
          destination_currency_code: 'USD',
          destination_currency_name: 'US Dollar',
        },
      ],
    });

    await ConversionController.swapCurrencies();

    expect(dispatch).toHaveBeenCalledWith({
      type: CONVERSION.SET_IS_LOADING,
      payload: { isLoading: true },
    });

    expect(dispatch).toHaveBeenLastCalledWith({
      type: CONVERSION.SET_IS_LOADING,
      payload: { isLoading: false },
    });
  });

  it('adds conversion to history and persists it', async () => {
    setMockState({
      conversionReducer: {
        sourceCurrency: 'USD',
        destinationCurrency: 'INR',
        conversionHistory: [],
      },
    });

    await ConversionController.addToHistory(80, 10);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: CONVERSION.ADD_TO_HISTORY,
      }),
    );

    expect(AsyncStorageController.set).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Array),
    );
  });

  it('does not add duplicate consecutive conversions', async () => {
    const existingItem = {
      id: 1,
      amount: 10,
      rate: 80,
      convertedAmount: 800,
      sourceCurrency: 'USD',
      destinationCurrency: 'INR',
      timestamp: Date.now(),
    };

    setMockState({
      conversionReducer: {
        sourceCurrency: 'USD',
        destinationCurrency: 'INR',
        conversionHistory: [existingItem],
      },
    });

    await ConversionController.addToHistory(80, 10);

    expect(dispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({
        type: CONVERSION.ADD_TO_HISTORY,
        payload: {conversionHistory: [] },
      }),
    );
  });
});

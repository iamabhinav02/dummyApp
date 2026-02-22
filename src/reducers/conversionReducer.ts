import { IActionState } from '../types/actions';
import { IConversionReducer } from '../types/reducers';
import { CONVERSION } from './actions';

const initialState: IConversionReducer = {
  sourceCurrency: undefined,
  destinationCurrency: undefined,
  amount: 0,
  rate: 0,
  isLoading: false,
  destinationCurrencies: {},
  conversionHistory: [],
};

export const conversionReducer = (state = initialState, action: IActionState<IConversionReducer>) => {

  switch (action.type) {
    case CONVERSION.SET_IS_LOADING:
      return { ...state, isLoading: action.payload?.isLoading || false };

    case CONVERSION.SET_SOURCE_CURRENCY:
      return { ...state, sourceCurrency: action.payload?.sourceCurrency || '' };

    case CONVERSION.SET_DESTINATION_CURRENCY:
      return { ...state, destinationCurrency: action.payload?.destinationCurrency || '' };

    case CONVERSION.SET_AMOUNT:
      return { ...state, amount: action.payload?.amount || 0 };

    case CONVERSION.SET_DESTINATION_CURRENCIES:
      return { ...state, destinationCurrencies: action.payload?.destinationCurrencies || [] };

    case CONVERSION.SET_LIVE_EXCHANGE_RATE:
      return { ...state, rate: action.payload?.rate || 0 };

    case CONVERSION.ADD_TO_HISTORY:
      return { ...state, conversionHistory: action.payload?.conversionHistory || [] };

    default:
      return state;
  }
};

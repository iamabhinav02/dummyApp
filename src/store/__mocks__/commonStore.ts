let state: any = {
  conversionReducer: {
    sourceCurrency: undefined,
    destinationCurrency: undefined,
    amount: 0,
    rate: 0,
    isLoading: false,
    destinationCurrencies: {},
    conversionHistory: [],
  },
};

const dispatch = jest.fn();

export const setMockState = (partialState: any) => {
  state = {
    ...state,
    ...partialState,
    conversionReducer: {
      ...state.conversionReducer,
      ...partialState?.conversionReducer,
    },
  };
};

class MockCommonReduxStore {
  static getInstance() {
    return {
      dispatch,
      getState: () => state,
    };
  }
}

export default MockCommonReduxStore;

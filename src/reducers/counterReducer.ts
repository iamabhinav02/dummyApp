import { IActionState } from '../types/actions';
import { ICounterReducer } from '../types/reducers';
import { COUNTER } from './actions';

const initialState: ICounterReducer = {
  count: 0,
  isLoading: false,
};

export const counterReducer = (state = initialState, action: IActionState<ICounterReducer>) => {
  const { isLoading, count } = action.payload || state;

  switch (action.type) {
    case COUNTER.INCREMENT:
      return { ...state, count: state.count + count };

    case COUNTER.DECREMENT:
      return { ...state, count: state.count - count };

    case COUNTER.IS_LOADING:
      return { ...state, isLoading };

    default:
      return state;
  }
};

import CommonReduxStore from '../store/commonStore';
import { ICounterReducer } from '../types/reducers';
import { COUNTER } from '../reducers/actions';

export interface ICounterController {
  increment: (val: number) => void;
  decrement: (val: number) => void;
  setIsLoading: (val: boolean) => void;
  getIsLoading: () => boolean;
  getCount: () => number;
}

const CounterController: ICounterController = {
  increment: (val) => {
    CommonReduxStore.getInstance().dispatch({
      type: COUNTER.INCREMENT,
      payload: { count: val },
    });
  },

  decrement: (val) => {
    CommonReduxStore.getInstance().dispatch({
      type: COUNTER.DECREMENT,
      payload: { count: val },
    });
  },

  setIsLoading: (val) => {
    CommonReduxStore.getInstance().dispatch({
      type: COUNTER.IS_LOADING,
      payload: { isLoading: val },
    });
  },

  getIsLoading: () => {
    const { isLoading } = CommonReduxStore.getInstance().getState().counterReducer as ICounterReducer;
    return isLoading;
  },

  getCount: () => {
    const { count } = CommonReduxStore.getInstance().getState().counterReducer as ICounterReducer;
    return count;
  },
};

export default CounterController;

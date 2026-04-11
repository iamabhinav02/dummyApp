import { IActionState } from '../types/actions';
import { IExpensesReducer } from '../types/reducers';
import { EXPENSES } from './actions';

const initialState: IExpensesReducer = {
  items: [],
};

export const expensesReducer = (state = initialState, action: IActionState<IExpensesReducer>) => {
  switch (action.type) {
    case EXPENSES.SET_ITEMS:
      return { ...state, items: action.payload?.items || [] };

    case EXPENSES.ADD_ITEM:
      if (!action.payload?.items?.[0]) {
        return state;
      }
      return {
        ...state,
        items: [action.payload.items[0], ...state.items],
      };

    case EXPENSES.REMOVE_ITEM:
      if (!action.payload?.items?.[0]) {
        return state;
      }
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload?.items?.[0]?.id),
      };

    default:
      return state;
  }
};

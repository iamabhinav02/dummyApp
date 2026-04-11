import { IActionState } from '../types/actions';
import { IGoalsReducer } from '../types/reducers';
import { GOALS } from './actions';

const initialState: IGoalsReducer = {
  items: [],
};

export const goalsReducer = (state = initialState, action: IActionState<IGoalsReducer>) => {
  switch (action.type) {
    case GOALS.SET_ITEMS:
      return { ...state, items: action.payload?.items || [] };

    case GOALS.UPSERT_ITEM:
      if (!action.payload?.items?.[0]) {
        return state;
      }
      return {
        ...state,
        items: [
          action.payload.items[0],
          ...state.items.filter((item) => item.id !== action.payload?.items?.[0]?.id),
        ],
      };

    case GOALS.REMOVE_ITEM:
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

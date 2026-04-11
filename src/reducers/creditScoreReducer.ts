import { IActionState } from '../types/actions';
import { ICreditScoreReducer } from '../types/reducers';
import { CREDIT_SCORE } from './actions';

const initialState: ICreditScoreReducer = {
  score: 720,
  tips: [
    {
      id: 'tip-credit-1',
      title: 'Pay bills on time',
      description: 'Payment history has a major impact on your score.',
    },
    {
      id: 'tip-credit-2',
      title: 'Keep utilization low',
      description: 'Try to keep total card usage under 30% of available credit.',
    },
  ],
};

export const creditScoreReducer = (state = initialState, action: IActionState<ICreditScoreReducer>) => {
  switch (action.type) {
    case CREDIT_SCORE.SET_DASHBOARD:
      return {
        ...state,
        score: action.payload?.score ?? state.score,
        tips: action.payload?.tips || state.tips,
      };

    default:
      return state;
  }
};

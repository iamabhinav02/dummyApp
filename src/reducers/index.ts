import { expensesReducer } from './expensesReducer';
import { creditScoreReducer } from './creditScoreReducer';
import { goalsReducer } from './goalsReducer';
import { MODULES } from '../constants/modules';

const appReducers = {
  [MODULES.EXPENSES.reducerKey]: expensesReducer,
  [MODULES.CREDITSCORE.reducerKey]: creditScoreReducer,
  [MODULES.GOALS.reducerKey]: goalsReducer,
};

export default appReducers;

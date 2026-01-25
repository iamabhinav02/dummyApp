import { combineReducers } from 'redux';
import reducers from '../reducers';

const appReducer = combineReducers({ ...reducers });

const rootReducer = (state: any, action: any) => {
  if (action.type === 'RESET_STORE') {
    // this resets store to initial state
    state = undefined;
  }

  return appReducer(state, action);
};

export default rootReducer;

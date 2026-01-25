import { createStore } from 'redux';
import rootReducers from './rootReducers';
import CommonReduxStore from './commonStore';

const commonStore = createStore(rootReducers);
CommonReduxStore.setInstance(commonStore);

export type ICombinedAppState = ReturnType<typeof commonStore.getState>;
export default commonStore;

import { Store } from 'redux';

class CommonReduxStore {
  static Instance: Store;

  static setInstance(store: Store) {
    CommonReduxStore.Instance = store;
  }

  static getInstance() {
    return CommonReduxStore.Instance;
  }
}

export default CommonReduxStore;

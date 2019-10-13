import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';

import { toastsReducer } from './reducers/toast-reducers';
import { dialogPopupReducer } from './reducers/dialog-popup-reducers';
import { globalState } from './reducers/global-state-reducers';

const combiner = combineReducers({
  toastsReducer,
  dialogPopupReducer,
  globalState
});

const middleware = applyMiddleware(thunk);

export const store = createStore(
  combiner,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  middleware,
);

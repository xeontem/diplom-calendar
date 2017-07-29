import { createStore, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import combineReducers from './reducers/combineReducers';
import thunk from 'redux-thunk';

const middleware = applyMiddleware(thunk, logger);

const store = createStore(combineReducers, middleware);

window.store = store;

export default store;

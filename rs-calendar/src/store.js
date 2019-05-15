import { createStore, applyMiddleware, combineReducers } from 'redux';
import { logger } from 'redux-logger';
import thunk from 'redux-thunk';
import { routerReducer } from 'react-router-redux'
import toastMonthReducer from './reducers/toastMonthReducer';

const combiner = combineReducers({
    toastMonthReducer,
    routerReducer
});

const middleware = applyMiddleware(thunk, logger);

const store = createStore(combiner, middleware);

window.store = store;

export default store;

import { createStore, applyMiddleware, combineReducers } from 'redux';
import { logger } from 'redux-logger';
import thunk from 'redux-thunk';
import toastMonthReducer from './reducers/toastMonthReducer';

const combiner = combineReducers({
    toastMonthReducer,
});

const middleware = applyMiddleware(thunk, logger);

const store = createStore(combiner, middleware);

export default store;

import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import WebFontLoader from 'webfontloader';
import store from './store';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter } from 'react-router-redux';

const history = createHistory()
WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ReactDOM.render((
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App/>
        </ConnectedRouter>
    </Provider>),
    document.getElementById('root')
);

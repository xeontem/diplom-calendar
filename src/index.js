import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import WebFontLoader from 'webfontloader';
import store from './store';
import { createBrowserHistory } from 'history';
import { ConnectedRouter } from 'react-router-redux';

const history = createBrowserHistory()
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

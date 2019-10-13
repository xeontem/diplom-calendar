import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedApp } from './App';
import WebFontLoader from 'webfontloader';
import { store } from './store';

import './index.css';

WebFontLoader.load({
  google: {
  families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ReactDOM.render((
  <Provider store={store}>
    <ConnectedApp />
  </Provider>),
  document.getElementById('root')
);

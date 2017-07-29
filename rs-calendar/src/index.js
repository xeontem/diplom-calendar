import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import WebFontLoader from 'webfontloader';

import store from './store';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ReactDOM.render((
    <Provider store={store}>
    	<BrowserRouter>
    	    <div>
    	        <Route path="/" component={App} />
    	        <Redirect to="/month"/>
    	    </div>
    	</BrowserRouter>
    </Provider>),
	document.getElementById('root')
);

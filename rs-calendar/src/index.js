import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import App from './App';
import './index.css';
import WebFontLoader from 'webfontloader';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ReactDOM.render((
	<BrowserRouter>
	    <div>
	        <Route path="/" component={App} />
	        <Redirect to="/month"/>
	    </div>
	</BrowserRouter>),
	document.getElementById('root')
);

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

// let events;

// fetch('http://128.199.53.150/events')
//   .then(function(response) {
//   if(response.ok) {
//     return response.json();
//   }
// }).then(function(myJson){
// 	events = myJson;

	// class myApp extends React.Component {
	// 	constructor(props) {
	// 		super(props);
	// 	}

	// 	render() {
	// 		return <App events={events} />
	// 	}
	// }
	ReactDOM.render((
		<BrowserRouter>
	        <div>
	            <Route path="/" component={App} />
	            <Redirect to="/agenda"/>
	        </div>
	    </BrowserRouter>),
	  document.getElementById('root')
	);

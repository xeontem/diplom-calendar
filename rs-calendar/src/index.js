import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import events from './events';

ReactDOM.render(<App
	events={events}
 />, document.getElementById('root'));
registerServiceWorker();

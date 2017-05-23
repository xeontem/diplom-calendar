import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import Events from './events';
import Calendar from './calendar/main';

let events = new Events();

export default class App extends React.Component {
  constructor(...args) {
    super(...args);
  }
  
  render() {
    return ( <Calendar /> )
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

import React from 'react';
import moment from 'moment';

import BigCalendar from './lib/index';
import Events from './events';

let events = new Events();
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

export default class App extends React.Component {
  constructor(...args) {
    super(...args);
  }
  
  render () {
    return ( <BigCalendar
          selectable
          events={events}
          defaultView='week'
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2015, 3, 12)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={(slotInfo) => alert(
            `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
            `\nend: ${slotInfo.end.toLocaleString()}`
          )}
        /> )
  }
}

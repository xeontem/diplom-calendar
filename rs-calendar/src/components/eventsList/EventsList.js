import React from 'react';
import { connect } from 'react-redux';
import ExpansionList from 'react-md/lib/ExpansionPanels/ExpansionList';

import PhoneSizeDemo from '../PhoneSizeDemo';
import TripNamePanel from './TripNamePanel';
import DestinationsPanel from './DestinationsPanel';
import TravelDatesPanel from './TravelDatesPanel';
import CarrierPanel from './CarrierPanel';
import MealPreferencesPanel from './MealPreferencesPanel';

import './eventsList.css';

export default class EventsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let events = this.props.events.slice(0, 10);
    console.dir(events);
    let mobile = typeof window.orientation !== 'undefined';
    return (
      <div>
        <ExpansionList style={{ padding: 16 }}>
            { events.map((event) => (<TravelDatesPanel key={event.id} mobile={mobile} event={event}/>)) }
        </ExpansionList>
        <ExpansionList style={{ padding: 16 }}>
          <TripNamePanel mobile={mobile}/>
          <DestinationsPanel mobile={mobile} />
          <TravelDatesPanel mobile={mobile} />
          <CarrierPanel mobile={mobile} />
          <MealPreferencesPanel mobile={mobile} />
        </ExpansionList>
      </div>  
    )
  } 
}

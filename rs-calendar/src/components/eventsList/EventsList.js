import React from 'react';
import { connect } from 'react-redux';
import ExpansionList from 'react-md/lib/ExpansionPanels/ExpansionList';

import TripNamePanel from './TripNamePanel';
import DestinationsPanel from './DestinationsPanel';
import TravelDatesPanel from './TravelDatesPanel';
import CarrierPanel from './CarrierPanel';
import MealPreferencesPanel from './MealPreferencesPanel';

export default class EventsList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let events = this.props.events.slice(0, 10);
    let mobile = typeof window.orientation !== 'undefined';
    return (
        <ExpansionList style={{ padding: 16 }}>
            { events.map((event) => (<TravelDatesPanel key={event.id} mobile={mobile} event={event}/>)) }
        </ExpansionList>
    )
  } 
}

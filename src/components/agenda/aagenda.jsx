import React from 'react';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Snackbar from 'react-md/lib/Snackbars';
import SelectField from 'react-md/lib/SelectFields';
import ExpansionList from 'react-md/lib/ExpansionPanels/ExpansionList';

import EventsList from './events-list';
import EventsListAdmin from './events-list-admin';
import { _filterByFromDate, _filterByToDate, _filterByType } from '../../instruments/filters';
import { apiCallForHerokuDB } from '../../instruments/fetching';
import { _closeSaveTableAgenda } from '../../instruments/emptyEventOpenClose';

export class Agenda extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      fetching: true,
      eventTypes: ['All', 'deadline', 'event', 'lecture', 'webinar', 'workshop'],
      toasts: [{text: "events successfully loaded"}],
      value: 'All',
      from: 'All',
      to: 'All'
    }
    this._filterByType = _filterByType.bind(this);
    this._filterByToDate = _filterByToDate.bind(this);
    this._filterByFromDate = _filterByFromDate.bind(this);
    apiCallForHerokuDB.call(this, '/events')
      .then(events => {
        this.setState({
          events,
          filtered: events,
          fetching: false
        });
      });
  }

  _removeToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }

  render() {
    const mobile = typeof window.orientation !== 'undefined';
    return (
      <div className="agenda-wrapper">
        {this.state.fetching && <LinearProgress className="loading-bar" key="progress" id="contentLoadingProgress" style={mobile ? {top: 40} : {top: 47}}/>}
        {!this.state.fetching && <Snackbar toasts={this.state.toasts} onDismiss={this._removeToast}/>}
        <div className="md-grid no-padding">
          <DatePicker
            id="local-ru-RU0"
            label="Select from date"
            locales="ru-RU"
            className="md-cell"
            onChange={this._filterByFromDate}
            autoOk
          />
          <DatePicker
            id="local-ru-RU1"
            label="Select to date"
            locales="ru-RU"
            className="md-cell"
            onChange={this._filterByToDate}
            autoOk
          />
          <SelectField
            id="statesControlled"
            label="Select type of event"
            placeholder="event type"
            value={this.state.value}
            menuItems={this.state.eventTypes}
            onChange={this._filterByType}
            errorText="A state is required"
            className="md-cell"
          />
        </div>
        <div>
          <ExpansionList style={{ padding: 16 }}>
            { this.props.isAdmin ?
              this.state.filtered.map((event, index) => (<EventsListAdmin key={event.id} eventIndex={index} mobile={mobile} event={event} agenda={this} eventTypes={this.state.eventTypes}/>)) :
              this.state.filtered.map((event) => (<EventsList key={event.id} mobile={mobile} event={event}/>))}
          </ExpansionList>
        </div>
      </div>
    )
  }
}

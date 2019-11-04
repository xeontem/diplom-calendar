import React from 'react';
import { FontIcon, DatePicker, ExpansionPanel, LinearProgress, Snackbar, SelectField, ExpansionList } from 'react-md';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { _filterByFromDate, _filterByToDate, _filterByType } from '../../instruments/filters';
import { apiCallForHerokuDB } from '../../instruments/fetching';
import { _closeSaveTableAgenda } from '../../instruments/emptyEventOpenClose';

export class Agenda extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filtered: [],
      fetching: true,
      events: [],
      eventTypes: ['All', 'deadline', 'event', 'lecture', 'webinar', 'workshop'],
      toasts: [{text: "events successfully loaded"}],
      value: 'All',
      from: 'All',
      to: 'All'
    };

    this._filterByType = _filterByType.bind(this);
    this._filterByToDate = _filterByToDate.bind(this);
    this._filterByFromDate = _filterByFromDate.bind(this);
  }

  componentDidMount() {
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

  getLabel(event) {
    return this.props.isMobile
      ? `Starts: ${new Date(event.start).toString().slice(4, 24)}`
      : `Starts: ${new Date(event.start).toString().slice(4, 24)} Ends: ${new Date(Number(new Date(event.start)) + Number(new Date(event.duration))).toString().slice(4, 24)}`;
  }

  openDialog = event => e => {
    if (event) {
      const [{ pageX, pageY }] = e.changedTouches || [e];
      this.props.toggleDialog({ isOpen: true, pageX, pageY, event });
    }
  }

  render() {
    return (
      <div className="agenda-wrapper">
        {this.state.fetching && <LinearProgress className="loading-bar" key="progress" id="contentLoadingProgress" style={this.props.isMobile ? {top: 40} : {top: 47}}/>}
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
            {this.state.filtered.map(event =>
              <ExpansionPanel
                key={event.id}
                expanderIcon={<FontIcon>{this.props.isMobile ? '' : 'keyboard_arrow_down'}</FontIcon>}
                label={this.getLabel(event)}
                secondaryLabel={`Starts: ${new Date(event.start).toString().slice(4, 24)}`}
                headerClassName={event.type}
                contentClassName="md-grid"
                cancelLabel="FOLD"
                saveLabel={this.props.isAdmin ? 'EDIT' : 'OPEN'}
                onSave={this.openDialog(event)}
                onExpandToggle={this._expand}
                closeOnSave={false}
              >
                <CSSTransitionGroup
                  component="section"
                  className="md-cell md-cell--7"
                  transitionName="opacity"
                  transitionEnterTimeout={1000}
                  transitionLeave={false}
                >
                  <h5 className="md-subheading-1">Description:</h5>
                  <p className="md-body-1">{event.description}</p>
                  {/*event.speakers.map((speaker, i) => (
                    <Chip
                      className="chip"
                      key={i}
                      label={speaker.name}
                      avatar={<Avatar src={speaker.avatar} alt="Avat" role="presentation" random />}
                    />
                  ))*/}
                </CSSTransitionGroup>
              </ExpansionPanel>
            )}
          </ExpansionList>
        </div>
      </div>
    )
  }
}

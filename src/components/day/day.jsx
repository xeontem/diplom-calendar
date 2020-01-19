import React from 'react';// eslint-disable-next-line
import { SelectField, Snackbar, LinearProgress, DatePicker, FontIcon, Button } from 'react-md';
import smile from './legosmile.svg';
import scroll from '../../instruments/scroll';
import { Filter } from '../bottom-filter/filter';
import { EventSelector } from '../event-type-selector/selector';

import { _closeSaveDay } from '../../instruments/emptyEventOpenClose';
import { setStartTime, setEndTime } from '../../instruments/initResize';
import { getStyles } from '../../instruments/utils';
import { EVENT_TYPES, AVAIL_MONTHES, AVAIL_YEARS } from '../../instruments/constants';

export class Day extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      day: {
        weekday: this._calculateWeekNum(new Date(Date.now()).getDay()),
        date: new Date(Date.now()),
        today: true,
        events: []
      },
      avalDays: [],
      curMonth: (new Date()).toString().slice(4, 7),
      curYear: new Date(Date.now()).getFullYear(),
      appliedEventsMonth: this._applyEventsOnDates(this.props.events)[0],
      dayIndex: new Date(Date.now()).getDate() - 1,
      backupDayEvents: [],
      filtered: [],
      toastsToDeleteZone: [],
      value: 'All',
      top: 0
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.events.length !== this.props.events.length) {
      this.updateState();
    }
  }

  componentDidMount() {
    scroll();
    setTimeout(this._slideDown, 500);
    this.updateState();
  }

  updateState() {
    const [appliedEventsMonth, avalDays, backupDayEvents] = this._applyEventsOnDates(this.props.events);
    const day = appliedEventsMonth[this.state.dayIndex];
    this.setState({
      avalDays,
      day,
      filtered: this.props.events,
      backupDayEvents,
      appliedEventsMonth,
    });
  }

  _slideDown = () => {
    let curTimeHours = (new Date()).toString().slice(16, 18);
    let curTimeMins = (new Date()).toString().slice(19, 21);
    let top = 34 + 55*curTimeHours;
    top += curTimeMins*0.9;
    this.setState({ top });
  }

  _applyEventsOnDates(events, date = new Date(Date.now())) {
    let month = this._calculateMonthArr(date);
    let avaldays = [];
    let backupDayEvents = [];
    month.forEach((day, dayIndex) => {
      if(!day.events) day.events = [];
      if(!day.eventIndexes) day.eventIndexes = [];
      avaldays.push(dayIndex + 1);
      events.forEach((event, eventIndex) => {

        const eventDate = new Date(event.start);

        if(
          eventDate.getFullYear() === day.date.getFullYear() &&
          eventDate.getMonth() === day.date.getMonth() &&
          eventDate.getDate() === day.date.getDate()
        ) {
          backupDayEvents.push(event);
          day.events.push(event);
          day.eventIndexes.push(eventIndex);
        }
      });
    });
    return [month, avaldays, backupDayEvents];
  }

  _calculateMonthArr(date = new Date(Date.now())) {
    let monthDayNum = 1;
    date.setDate(monthDayNum);
    let monthArr = [];
    let curMonthNumber = date.getMonth();
    let monthNumber = date.getMonth();

    while(curMonthNumber === monthNumber) {
      let weekday = this._calculateWeekNum(date.getDay());
      let today = false;
      if(date.getDate() === (new Date(Date.now())).getDate()) {
        today = true;
      }
      let curDate = new Date(date.toString());
      monthArr.push({weekday, date: curDate, today});
      monthDayNum++;
      date.setDate(monthDayNum);
      monthNumber = date.getMonth();
    }
    return monthArr;
  }

  _calculateWeekNum(weekDay) {
    switch(weekDay) {
      case 1: return "Mon";
      case 2: return "Tue";
      case 3: return "Wed";
      case 4: return "Thu";
      case 5: return "Fri";
      case 6: return "Sat";
      case 0: return "Sun";
      default: return "Mon";
    }
  }

  _removeToast = () => {
    this.setState({ toasts: [] });
  }

  _filterByType = (value) => {
    let day = this.state.day;
    if(day.events.length) {
      day.events = this.state.backupDayEvents.filter((event) => {
      if(value === 'All') return true;
      return event.type === value});
    }

    this.setState({ day, value });
  }

  _changeYear = (curYear) => {
    let dateToShow = new Date(this.state.day.date.toString());
    let backupDayNumber = dateToShow.getDate();
    dateToShow.setDate(1);
    dateToShow.setFullYear(curYear);
    // check if more then numbers in month
    let [appliedEventsMonth, avalDays, backupDayEvents] = this._applyEventsOnDates(this.state.filtered, dateToShow);
    if(backupDayNumber > avalDays.length - 1) backupDayNumber = avalDays.length - 1;
    dateToShow.setDate(backupDayNumber);
    let dayIndex = backupDayNumber;
    let day = appliedEventsMonth[dayIndex];
    this.setState({ avalDays, day, backupDayEvents, appliedEventsMonth, dayIndex });
  }

  _changeMonth = (curMonth) => {
    let dateToShow = new Date(this.state.day.date).toString();
    dateToShow = new Date(`${dateToShow.slice(0, 4)}${curMonth}${dateToShow.slice(7)}`);
    let backupDayNumber = dateToShow.getDate();

    // check if more then numbers in month
    let [appliedEventsMonth, avalDays, backupDayEvents] = this._applyEventsOnDates(this.state.filtered, dateToShow);
    if(backupDayNumber > avalDays.length-1) backupDayNumber = avalDays.length-1;
    dateToShow.setDate(backupDayNumber);
    let dayIndex = backupDayNumber;
    let day = appliedEventsMonth[dayIndex];
    this.setState({ curMonth, avalDays, day, backupDayEvents, appliedEventsMonth, dayIndex });
  }

  _changeDay = selectedDay => {
    const dayIndex = selectedDay - 1;
    const day = this.state.appliedEventsMonth[dayIndex];
    this.setState({ dayIndex, day });
  }

  _toggle = (e) => {
    e.nativeEvent.path.forEach(el => {
      if(el.classList && el.classList.contains('action')) {
        this._filterByType(this.state.value === el.dataset.type ? 'All' : el.dataset.type);
      }
    });
  }

  _prevMonth = () => {
    let dateToShow = this.state.day.date;
    dateToShow.setDate(0);
    let [appliedEventsMonth, avalDays, backupDayEvents] = this._applyEventsOnDates(this.state.filtered, dateToShow);
    let dayIndex = appliedEventsMonth.length-1;
    let day = appliedEventsMonth[dayIndex];
    this.setState({ avalDays, day, backupDayEvents, appliedEventsMonth, dayIndex });
  }

  _nextMonth = () => {
    let dateToShow = new Date(this.state.day.date.toString());
    dateToShow.setDate(this.state.dayIndex + 2);
    let [appliedEventsMonth, avalDays, backupDayEvents] = this._applyEventsOnDates(this.state.filtered, dateToShow);
    let dayIndex = 0;
    let day = appliedEventsMonth[dayIndex];
    this.setState({ avalDays, day, backupDayEvents, appliedEventsMonth, dayIndex });
  }

  _prevDay = () => {
    let dayIndex = this.state.dayIndex-1;

    if(dayIndex === -1) {
      this._prevMonth();
      return;
    }
    let day = this.state.appliedEventsMonth[dayIndex];
    let backupDayEvents = [];
    if(day.events) backupDayEvents = day.events.slice();
    this.setState({ dayIndex, day, backupDayEvents });
  }

  _nextDay = () => {
    let dayIndex = this.state.dayIndex + 1;
    if (dayIndex === this.state.appliedEventsMonth.length) {
      this._nextMonth();
      return;
    }
    let day = this.state.appliedEventsMonth[dayIndex];
    let backupDayEvents = [];
    if (day.events) {
      backupDayEvents = day.events.slice();
    }
    this.setState({ dayIndex, day, backupDayEvents });
  }

  openDialog = (event, eventIndex) => e => {
    if (event) {
      const [{ pageX, pageY }] = e.changedTouches || [e];
      this.props.toggleDialog({ isOpen: true, pageX, pageY, event, eventIndex });
    }
  }

  timeSliderMouseDown(e) {
    console.log(e.target);
  }

  render() {
    return (
      <div className="agenda-wrapper">
        <h3>Events Selector:</h3>
        <div className="md-grid no-padding box">
          <EventSelector
            value={this.state.value}
            onChange={this._filterByType}
          />
        </div>
        <h3>Calendar Selector:</h3>
        <div className="md-grid no-padding box">
          <SelectField
            id="statesControlled3"
            label="Select day"
            placeholder="Some State"
            value={this.state.day.date.getDate()}
            menuItems={this.state.avalDays}
            onChange={this._changeDay}
            errorText="A state is required"
            className="md-cell"
          />
          <SelectField
            id="statesControlled2"
            label="Select month"
            placeholder="Some State"
            value={this.state.day.date.toString().slice(4, 7)}
            menuItems={AVAIL_MONTHES}
            onChange={this._changeMonth}
            errorText="A state is required"
            className="md-cell"
            itemLabel="name"
            itemValue="abbreviation"
          />
          <SelectField
            id="statesControlled2"
            label="Select year"
            placeholder="Some State"
            value={this.state.day.date.getFullYear().toString()}
            menuItems={AVAIL_YEARS}
            onChange={this._changeYear}
            errorText="A state is required"
            className="md-cell"
          />
        </div>
        <div style={{maxWidth: 750, margin: 'auto', overflow: 'hidden'}}>
          <div className="navigation">
            <Button className="navigate-button" onClick={this._prevDay} icon>navigate_before</Button>
            <Button raised className="action date-container" children={`${this.state.day.date.getDate()} ${this.state.day.date.toString().slice(4, 7)} ${this.state.day.date.getFullYear()}, ${this.state.day.weekday}`} />
            <Button className="navigate-button" onClick={this._nextDay} icon>navigate_next</Button>
          </div>
          <div className="header-day">
            <div className="column-week"><Button icon style={{ marginTop: -7 }}>access_time</Button></div>
            <p><span className="agenda">Agenda:</span></p>
            <div></div>
          </div>
          <div className="body-day">
            <div className="time">
              <section style={{ top: this.state.top }} className="current-time">
                <div className="dot-current-time"></div>
              </section>
              {(new Array(24).fill(0)).map((val, i) =>
                <div key={i}>{`${i < 10 ? '0' : ''}${i}:00`}<div className="time-divider"></div></div>
              )}
            </div>
            {this.state.day.events.length
              ? this.state.day.events.map((event, index) =>
              <div
                key={event.title}
                style={getStyles(event)}
                className={`${event.type} event-column event-column__day`}
                onClick={this.openDialog(event, this.state.day.eventIndexes[index])}
              >
                {this.props.isAdmin &&
                  <div style={{position: 'relative', height: '100%'}}>
                    <div className="drag-up" onMouseDown={setStartTime(event)} onTouchStart={setStartTime} ></div>
                    <div className="show-changed-starttime"></div>
                    <FontIcon className="drag-up-icon">fast_rewind</FontIcon>
                    <div className="drag-down" onMouseDown={setEndTime(event)} onTouchStart={setEndTime} ></div>
                    <div className="show-changed-endtime"></div>
                    <FontIcon className="drag-down-icon">fast_rewind</FontIcon>
                  </div>
                }
              </div>)
              : <div className="freedom">
                <p style={{fontSize: '16pt'}}>You are free today!</p>
                <img style={{margin: '0 auto', width: 100}} src={smile} alt="smile" />
              </div>
            }
          </div>
        </div>
        <Filter toggleValue={this.state.toggleValue} _filterByType={this._filterByType} />
      </div>
    )
  }
}

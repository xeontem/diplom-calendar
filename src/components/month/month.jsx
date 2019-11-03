import React from 'react';// eslint-disable-next-line
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';

import DeleteZone from '../DeleteZone';

import { EVENT_TYPES } from '../../instruments/constants';
import { handleDropDeleteZone } from '../../instruments/dragMonth';
import { _filterByFromDate, _filterByToDate, _filterByType } from '../../instruments/filters';
import { handleDragStart, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleDragEnd } from '../../instruments/dragMonth';

export class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addNew: false,
      dateToShow: Date.now(),
      avalMonthes: [
        { abbreviation: 'Jan', name: 'January' },
        { abbreviation: 'Feb', name: 'February' },
        { abbreviation: 'Mar', name: 'March' },
        { abbreviation: 'Apr', name: 'April' },
        { abbreviation: 'May', name: 'May' },
        { abbreviation: 'Jun', name: 'June' },
        { abbreviation: 'Jul', name: 'July' },
        { abbreviation: 'Aug', name: 'August' },
        { abbreviation: 'Sep', name: 'September' },
        { abbreviation: 'Oct', name: 'October' },
        { abbreviation: 'Nov', name: 'November' },
        { abbreviation: 'Dec', name: 'December' }
      ],
      avalYears: ['2022', '2021', '2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'],
      curMonth: (new Date()).toString().slice(4, 7),
      curYear: (new Date()).getFullYear(),
      appliedEventsMonth: this._applyEventsOnDates(this.props.events),
      filtered: this.props.events,
      toasts: [{text: "events successfully loaded"}],
      toastsToDeleteZone: [],
      value: 'All',
      from: 'All',
      to: 'All'
    };

    this._filterByType = _filterByType.bind(this);
    this._filterByToDate = _filterByToDate.bind(this);
    this._filterByFromDate = _filterByFromDate.bind(this);
    this._removeToast = this.props.removeToast;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.eventsUpdated && !this.props.eventsUpdated) {
      const appliedEventsMonth = this._applyEventsOnDates(this.props.events);
      this.setState({ appliedEventsMonth });
    }
  }

  _applyEventsOnDates(events, date = Date.now()) {
    let month = this._calculateMonthArr(date);
    events.forEach((event, eventIndex) => {
      let eventDate = new Date(event.start);
      month.forEach((week, weekIndex) => {
        week.forEach((day, dayIndex) => {
          if(eventDate.toString().slice(0, 15) === day.curDate.toString().slice(0, 15)){
            day.event = event;
            day.eventIndex = eventIndex;
          };
        });
      });
    });
    return month;
  }

  _calculateMonthArr(date = Date.now()) {
    let currentDate = new Date(date);
    let rollDownDate = new Date(date);
    let rollDownNumber = Number(rollDownDate.toString().slice(8, 11));
    let rollDownWeekday = rollDownDate.toString().slice(0, 3);

    while(rollDownNumber !== 1) {
      date -= 1000*60*60*24;
      rollDownDate = new Date(date);
      rollDownNumber = Number(rollDownDate.toString().slice(8, 11));
      rollDownWeekday = rollDownDate.toString().slice(0, 3);
    }

    while(rollDownWeekday !== "Mon") {
      date -= 1000*60*60*24;
      rollDownDate = new Date(date);
      rollDownWeekday = rollDownDate.toString().slice(0, 3);
    }

    let arrOfWeeks = [];
    let weekArr = [];
    let curMonthNumber = currentDate.getMonth();
    let nextDate = date;
    let curDate = new Date(nextDate);
    let monthNumber = curDate.getMonth();
    let weekday = curDate.toString().slice(0, 3);
    let weekNumber = this._calculateWeekNum(weekday);


    while(curMonthNumber === monthNumber || weekNumber !== 6) {
      let dayNumber = Number(curDate.toString().slice(8, 10));
      let weekday = curDate.toString().slice(0, 3);
      let yearNumber = Number(curDate.toString().slice(11, 15));
      let isCurrentMonth = curMonthNumber === monthNumber;
      weekNumber = this._calculateWeekNum(weekday);
      let today = false;
      if(curDate.toString().slice(0, 15) === (new Date()).toString().slice(0, 15)) today = true;
      weekArr.push({dayNumber, weekNumber, monthNumber, yearNumber, weekday, isCurrentMonth, curDate, today});
      nextDate += 1000*60*60*24;
      curDate = new Date(nextDate);
      monthNumber = curDate.getMonth();
      if(weekNumber === 6) {
        arrOfWeeks.push(weekArr);
        weekArr = [];
      }
    }
    return arrOfWeeks;
  }

  _calculateWeekNum(weekDay) {
    switch(weekDay) {
      case "Mon": return 0;
      case "Tue": return 1;
      case "Wed": return 2;
      case "Thu": return 3;
      case "Fri": return 4;
      case "Sat": return 5;
      case "Sun": return 6;
      default: return 0;
    }
  }

  _progressBarShower = () => {
    const top = this.props.isMobile ? 40 : 47;
    const opacity = this.state.notLoaded;
    return { opacity, top };
  }

  _changeYear = (curYear) => {
    let dateToShow = new Date(this.state.dateToShow).toString();
    dateToShow = `${dateToShow.slice(0, 11)}${curYear}${dateToShow.slice(15)}`;
    dateToShow = new Date(dateToShow).valueOf();
    let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
    this.setState({curYear, dateToShow, appliedEventsMonth});
  }

  _changeMonth = (curMonth) => {
    let dateToShow = new Date(this.state.dateToShow).toString();
    dateToShow = `${dateToShow.slice(0, 4)}${curMonth}${dateToShow.slice(7)}`;
    dateToShow = new Date(dateToShow).valueOf();
    let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
    this.setState({curMonth, dateToShow, appliedEventsMonth});
  }

  _toggle = (e) => {
    e.nativeEvent.path.forEach(el => {
      if(el.classList && el.classList.contains('action')) {
        if(this.state.toggleValue === el.dataset.type) this._filterByType('All');
        else this._filterByType(el.dataset.type);
      }
    });
  }

  _prevMonth = () => {
    let curYear = this.state.curYear;
    let dateToShow = this.state.dateToShow - 1000*60*60*24*30;
    let curMonth = new Date(dateToShow).toString().slice(4, 7);
    if(curMonth === "Dec") curYear--;
    let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
    this.setState({curYear, curMonth, dateToShow, appliedEventsMonth});
  }

  _nextMonth = () => {
    let curYear = this.state.curYear;
    let dateToShow = this.state.dateToShow + 1000*60*60*24*30;
    let curMonth = new Date(dateToShow).toString().slice(4, 7);
    if(curMonth === "Jan") curYear++;
    let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
    this.setState({curYear, curMonth, dateToShow, appliedEventsMonth});
  }

  _rerender = () => {this.setState({addNew: true})}

  _openDialog = event => e => {
    if (event) {
      const [{ pageX, pageY }] = e.changedTouches || [e];
      this.props.toggleDialog({ isOpen: true, pageX, pageY, event });
    }
  }

  render() {
    return (
      <div className="agenda-wrapper">
        {this.props.isAdmin && <DeleteZone parent={this} toasts={this.state.toastsToDeleteZone} handleDropDeleteZone={handleDropDeleteZone(this)}/> }
        <h3>Events Selector:</h3>
        <div className="md-grid no-padding box">
          <DatePicker
            id="local-ru-RU-from"
            label="Select from date"
            locales="ru-RU"
            className="md-cell"
            onChange={this._filterByFromDate}
            autoOk
          />
          <DatePicker
            id="local-ru-RU-"
            label="Select to date"
            locales="ru-RU"
            className="md-cell"
            onChange={this._filterByToDate}
            autoOk
          />
          <SelectField
            id="statesControlled"
            label="Select type of event"
            value={this.state.value}
            placeholder="Some State"
            menuItems={EVENT_TYPES}
            onChange={this._filterByType}
            errorText="A state is required"
            className="md-cell"
          />
        </div>
        <h3>Calendar Selector:</h3>
        <div className="md-grid no-padding box">
          <SelectField
            id="statesControlled2"
            label="Select month"
            placeholder="Some State"
            value={this.state.curMonth}
            menuItems={this.state.avalMonthes}
            onChange={this._changeMonth}
            errorText="A state is required"
            className="md-cell"
            itemLabel="name"
            itemValue="abbreviation"
          />
          <SelectField
            id="statesControlled1"
            label="Select year"
            placeholder="Some State"
            value={this.state.curYear.toString()}
            menuItems={this.state.avalYears}
            onChange={this._changeYear}
            errorText="A state is required"
            className="md-cell"
            itemLabel="name"
            itemValue="name"
          />
        </div>
        <div style={{maxWidth: 750, margin: 'auto'}}>
          <div className="navigation">
            <Button className="navigate-button" onClick={this._prevMonth} icon>navigate_before</Button>
            <Button raised className="action date-container" children={`${this.state.curMonth} ${this.state.curYear}`} />
            <Button className="navigate-button" onClick={this._nextMonth} icon>navigate_next</Button>
          </div>
          <div className="header-week">
            <div className="column-month">{this.props.isMobile ? 'Mon' : 'Monday'}</div>
            <div className="column-month">{this.props.isMobile ? 'Tue' : 'Tuesday'}</div>
            <div className="column-month">{this.props.isMobile ? 'Wed' : 'Wednesday'}</div>
            <div className="column-month">{this.props.isMobile ? 'Thu' : 'Thursday'}</div>
            <div className="column-month">{this.props.isMobile ? 'Fri' : 'Friday'}</div>
            <div className="column-month">{this.props.isMobile ? 'Sat' : 'Saturday'}</div>
            <div className="column-month">{this.props.isMobile ? 'Sun' : 'Sunday'}</div>
          </div>
          { this.state.appliedEventsMonth.map((week, i) =>
            <div className="body-month" key={i}>
              {week.map((day, index) =>
                <Button
                  key={index*30}
                  className={`table-cell ${day.event ? day.event.type : ''} ${day.today ? 'today' : ''} ${day.isCurrentMonth ? '' : 'disabled-cell'}`}
                  onDragStart={handleDragStart(this, day.event, day.eventIndex)}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop(this, day.curDate)}
                  onDragEnd={handleDragEnd(this, this.props.isMobile)}
                  onClick={this._openDialog(day.event)}
                  floating
                  draggable={true}
                >
                  <p className="day-number">{day.dayNumber}</p>
                  {day.event && day.today && <div className={`event-cell ${day.event.type}`}></div>}
                </Button>
              )}
            </div>)
          }
        </div>
        <h3>Legend:</h3>
        <div className="md-grid no-padding box" onClick={this._toggle}>
          <Button raised data-type="deadline" className={this.state.toggleValue === 'deadline' ? "action today" : "action"}><div className="event-cell deadline"></div><p>deadline</p></Button>
          <Button raised data-type="webinar" className={this.state.toggleValue === 'webinar' ? "action today" : "action"}><div className="event-cell webinar"></div><p>webinar</p></Button>
          <Button raised data-type="lecture" className={this.state.toggleValue === 'lecture' ? "action today" : "action"}><div className="event-cell lecture"></div><p>lecture</p></Button>
          <Button raised data-type="workshop" className={this.state.toggleValue === 'workshop' ? "action today" : "action"}><div className="event-cell workshop"></div><p>workshop</p></Button>
          <Button raised data-type="event" className={this.state.toggleValue === 'event' ? "action today" : "action"}><div className="event-cell event"></div><p>event</p></Button>
        </div>
      </div>
    )
  }
}

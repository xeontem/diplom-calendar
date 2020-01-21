import React from 'react';// eslint-disable-next-line
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';
import { Filter } from '../bottom-filter/filter';
import { EventSelector } from '../event-type-selector/selector';

import DeleteZone from '../DeleteZone';

import { AVAIL_DAYS, AVAIL_MONTHES, AVAIL_YEARS } from '../../instruments/constants';
import { handleDropDeleteZone } from '../../instruments/dragMonth';
import { _filterByFromDate, _filterByToDate, _filterByType } from '../../instruments/filters';
import { handleDragStart, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleDragEnd } from '../../instruments/dragMonth';

export class Month extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addNew: false,
      dateToShow: Date.now(),
      curMonth: (new Date()).toString().slice(4, 7),
      curYear: (new Date()).getFullYear(),
      appliedEventsMonth: this._applyEventsOnDates(this.props.events),
      filtered: [],
      toastsToDeleteZone: [],
      toggleValue: 'All',
      value: 'All',
      from: 'All',
      to: 'All'
    };

    this._filterByType = _filterByType.bind(this, false);
    this._filterByToDate = _filterByToDate.bind(this);
    this._filterByFromDate = _filterByFromDate.bind(this);
    this._removeToast = this.props.removeToast;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.eventsUpdated && !this.props.eventsUpdated) {
      this.updateState();
    }
  }

  componentDidMount() {
    this.updateState();
  }

  updateState() {
    const appliedEventsMonth = this._applyEventsOnDates(this.props.events);
    this.setState({ appliedEventsMonth, filtered: this.props.events });
  }

  _applyEventsOnDates(events, date = Date.now()) {
    let month = this._calculateMonthArr(date);
    events.forEach((event, eventIndex) => {
      let eventDate = new Date(event.start);
      month.forEach((week, weekIndex) => {
        week.forEach((day, dayIndex) => {
          if (eventDate.toString().slice(0, 15) === day.curDate.toString().slice(0, 15)) {
            day.event = event;
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
    return AVAIL_DAYS.indexOf(weekDay);
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



  _prevMonth = () => {
    let curYear = this.state.curYear;
    let dateToShow = this.state.dateToShow - 1000*60*60*24*30;
    let curMonth = new Date(dateToShow).toString().slice(4, 7);
    if(curMonth === "Dec") curYear--;
    let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
    this.setState({ curYear, curMonth, dateToShow, appliedEventsMonth });
  }

  _nextMonth = () => {
    let curYear = this.state.curYear;
    let dateToShow = this.state.dateToShow + 1000*60*60*24*30;
    let curMonth = new Date(dateToShow).toString().slice(4, 7);
    if(curMonth === "Jan") curYear++;
    let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
    this.setState({curYear, curMonth, dateToShow, appliedEventsMonth});
  }

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
          <EventSelector
            value={this.state.value}
            onChange={this._filterByType}
          />
        </div>
        <h3>Calendar Selector:</h3>
        <div className="md-grid no-padding box">
          <SelectField
            id="statesControlled2"
            label="Select month"
            placeholder="Some State"
            value={this.state.curMonth}
            menuItems={AVAIL_MONTHES}
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
            menuItems={AVAIL_YEARS}
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
            { AVAIL_DAYS.map(day =>
              <div key={day} className="column-month">{day}</div>
            ) }
          </div>
          { this.state.appliedEventsMonth.map((week, i) =>
            <div className="body-month" key={i}>
              {week.map((day, index) =>
                <Button
                  key={day.curDate}
                  className={`table-cell ${day.event ? day.event.type : ''} ${day.today ? 'today' : ''} ${day.isCurrentMonth ? '' : 'disabled-cell'}`}
                  onDragStart={handleDragStart(this, day.event, index)}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop(day.curDate.getTime())}
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
        <Filter toggleValue={this.state.toggleValue} _filterByType={this._filterByType} />
      </div>
    )
  }
}

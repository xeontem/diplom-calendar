import React from 'react';// eslint-disable-next-line
import { Button, SelectField, FontIcon, DatePicker } from 'react-md';

import DeleteZone from '../DeleteZone';
import { handleDropDeleteZone } from '../../instruments/dragWeek';
import { _filterByFromDate, _filterByToDate, _filterByType } from '../../instruments/filters';
import { _loadEvents } from '../../instruments/fetching';
import { _closeSaveWeek } from '../../instruments/emptyEventOpenClose';
import { handleDragStart, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleDragEnd } from '../../instruments/dragWeek';
import { getStyles } from '../../instruments/utils';

export class Week extends React.Component {
  constructor(props) {
    super(props);
    let weekToShow = [];
    weekToShow.curWeek = false;
    weekToShow.weekCounter = 0;
    this.state = {
      ...this._applyEventsOnDates(this.props.events),
      filtered: this.props.events,
      dateToShow: Date.now(),
      avalMonthes: [
        {name: 'January', abbreviation: 'Jan'},
        {name: 'February', abbreviation: 'Feb'},
        {name: 'March', abbreviation: 'Mar'},
        {name: 'April', abbreviation: 'Apr'},
        {name: 'May', abbreviation: 'May'},
        {name: 'June', abbreviation: 'Jun'},
        {name: 'July', abbreviation: 'Jul'},
        {name: 'August', abbreviation: 'Aug'},
        {name: 'September', abbreviation: 'Sep'},
        {name: 'October', abbreviation: 'Oct'},
        {name: 'November', abbreviation: 'Nov'},
        {name: 'December', abbreviation: 'Dec'}
      ],
      avalYears: ['2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'],
      eventTypes: ['All', 'deadline', 'event', 'lecture', 'webinar', 'workshop'],
      curMonth: (new Date()).toString().slice(4, 7),
      curYear: (new Date()).getFullYear(),
      stateItems: [
        {name: 'All', abbreviation: 'All'},
        {name: 'deadline', abbreviation: 'deadline'},
        {name: 'event', abbreviation: 'event'},
        {name: 'lecture', abbreviation: 'lecture'},
        {name: 'webinar', abbreviation: 'webinar'},
        {name: 'workshop', abbreviation: 'workshop'}
      ],
      toastsToDeleteZone: [],
      value: 'All',
      from: 'All',
      to: 'All',
      top: 0
    }
    this._filterByType = _filterByType.bind(this);
    this._filterByToDate = _filterByToDate.bind(this);
    this._filterByFromDate = _filterByFromDate.bind(this);

    this.handleDragStart = handleDragStart.bind(this);
    this.handleDragEnter = handleDragEnter.bind(this);
    this.handleDragLeave = handleDragLeave.bind(this);
    this.handleDragOver = handleDragOver.bind(this);
    this.handleDrop = handleDrop.bind(this);
    this.handleDragEnd = handleDragEnd.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.events.length !== this.props.events.length) {
      this.setState({ ...this._applyEventsOnDates(this.props.events), filtered: this.props.events });
    }
  }

  componentDidMount() {
    setTimeout(this._slideDown, 500);
  }

  _slideDown = () => {
    let curTimeHours = (new Date()).toString().slice(16, 18);
    let curTimeMins = (new Date()).toString().slice(19, 21);
    let top = 34 + 55*curTimeHours;
    top += curTimeMins*0.9;
    this.setState({top});
  }

  _applyEventsOnDates(events, date = Date.now()) {
    let weekToShow;
    let avalWeeks = [];
    let appliedEventsMonth = this._calculateMonthArr(date);
    events.forEach((event, eventIndex) => {
      let eventDate = new Date(event.start.seconds * 1000);
      appliedEventsMonth.forEach((week, weekIndex) => {
        week.forEach((day, dayIndex) => {
          if (eventDate.toString().slice(0, 15) === day.curDate.toString().slice(0, 15)) {
            day.event = event;
            day.eventIndex = eventIndex;
          }
        });

        if (week.curWeek) {
          weekToShow = [...week];
          weekToShow.weekCounter = weekIndex;
        }

        avalWeeks.push({ name: weekIndex, abbreviation: weekIndex + 1 });
      });
    });
    if (!weekToShow) {
      weekToShow = appliedEventsMonth[0];
      weekToShow.weekCounter = 0;
    }
    return { appliedEventsMonth, weekToShow, avalWeeks };
  }

  _calculateMonthArr(date = Date.now(), toWeek) {
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
    let weekCounter = 0;
    while(curMonthNumber === monthNumber || weekNumber !== 6) {
      let dayNumber = Number(curDate.toString().slice(8, 10));
      let weekday = curDate.toString().slice(0, 3);
      let yearNumber = Number(curDate.toString().slice(11, 15));
      let isCurrentMonth = curMonthNumber === monthNumber;
      weekNumber = this._calculateWeekNum(weekday);
      let today = false;
      weekArr.curWeek = false;
      if(curDate.toString().slice(0, 15) === (new Date()).toString().slice(0, 15)) {
        today = true;
        weekArr.curWeek = true;
      }
      weekArr.push({ dayNumber, weekNumber, monthNumber, yearNumber, weekday, isCurrentMonth, curDate, today });
      nextDate += 1000*60*60*24;
      curDate = new Date(nextDate);
      monthNumber = curDate.getMonth();
      if(weekNumber === 6) {
        weekArr.weekCounter = weekCounter;
        if(toWeek && weekArr.curWeek) return weekArr;
        arrOfWeeks.push(weekArr);
        weekArr = [];
        weekCounter++;
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

  _removeToast = () => {
    const [, ...toasts] = this.state.toasts;
    this.setState({ toasts });
  }

  _changeYear = (curYear) => {
    let dateToShow = new Date(this.state.dateToShow).toString();
    dateToShow = `${dateToShow.slice(0, 11)}${curYear}${dateToShow.slice(15)}`;
    dateToShow = new Date(dateToShow).valueOf();
    let month = this._calculateMonthArr(dateToShow);
    let { appliedEventsMonth } = this._applyEventsOnDates(this.state.filtered, dateToShow);
    let avalWeeks = [];
    for(let i = 0; i < appliedEventsMonth.length; i++) avalWeeks.push({name: i, abbreviation: i+1});
    this.setState({curYear, dateToShow, month, appliedEventsMonth, avalWeeks});
  }

  _changeMonth = (curMonth) => {
    let dateToShow = new Date(this.state.dateToShow).toString();
    dateToShow = `${dateToShow.slice(0, 4)}${curMonth}${dateToShow.slice(7)}`;
    dateToShow = new Date(dateToShow).valueOf();
    let month = this._calculateMonthArr(dateToShow);
    let { appliedEventsMonth } = this._applyEventsOnDates(this.state.filtered, dateToShow);
    let avalWeeks = [];
    for(let i = 0; i < appliedEventsMonth.length; i++) avalWeeks.push({name: i, abbreviation: i+1});
    this.setState({ curMonth, dateToShow, month, appliedEventsMonth, avalWeeks });
  }

  _changeWeek = (selectedWeek) => {
    let weekToShow = this.state.weekToShow;
    weekToShow.weekCounter = selectedWeek;
    this.setState({weekToShow});
  }

  _toggle = (e) => {
    e.nativeEvent.path.forEach(el => {
      if(el.classList && el.classList.contains('action')) {
        if(this.state.toggleValue === el.dataset.type) this._filterByType('All');
        else this._filterByType(el.dataset.type);
      }
    });
  }

  _prevMonth = (_prevWeek) => {
    let curYear = this.state.curYear;
    let dateToShow = this.state.dateToShow - 1000*60*60*24*30;
    let curMonth = new Date(dateToShow).toString().slice(4, 7);
    if(curMonth === "Dec") curYear--;
    let month = this._calculateMonthArr(dateToShow);
    let { appliedEventsMonth } = this._applyEventsOnDates(this.state.filtered, dateToShow);
    let weekToShow = this.state.weekToShow;
    if(_prevWeek === '_prevWeek') {
      weekToShow = appliedEventsMonth[appliedEventsMonth.length-1];
      weekToShow.weekCounter = appliedEventsMonth.length-1;
    }
    this.setState({weekToShow, curYear, curMonth, dateToShow, month, appliedEventsMonth});
  }

  _nextMonth = (_nextWeek) => {
    let curYear = this.state.curYear;
    let dateToShow = this.state.dateToShow + 1000*60*60*24*30;
    let curMonth = new Date(dateToShow).toString().slice(4, 7);
    if(curMonth === "Jan") curYear++;
    let month = this._calculateMonthArr(dateToShow);
    let { appliedEventsMonth } = this._applyEventsOnDates(this.state.filtered, dateToShow);
    let weekToShow = this.state.weekToShow;
    if(_nextWeek === '_nextWeek') {
      weekToShow = appliedEventsMonth[0];
      weekToShow.weekCounter = 0;
    }
    this.setState({weekToShow, curYear, curMonth, dateToShow, month, appliedEventsMonth});
  }

  _prevWeek = () => {
    let weekToShow = this.state.weekToShow;
    if(weekToShow.weekCounter === 0) this._prevMonth('_prevWeek');
    else {
      weekToShow.weekCounter--;
      this.setState({weekToShow});
    }
  }

  _nextWeek = () => {
    let weekToShow = this.state.weekToShow;
    if(weekToShow.weekCounter === this.state.appliedEventsMonth.length-1) this._nextMonth('_nextWeek');
    else {
      weekToShow.weekCounter++;
      this.setState({weekToShow});
    }
  }

 openDialog = (event, eventIndex) => e => {
    if (event) {
      const [{ pageX, pageY }] = e.changedTouches || [e];
      this.props.toggleDialog({ isOpen: true, pageX, pageY, event, eventIndex });
    }
  }

  render() {
    let today = false;
    let isInCurMonth = [];
    let NumDayArr = [];
    console.log(this.state);
    this.state.appliedEventsMonth[this.state.weekToShow.weekCounter].forEach(day => {
      isInCurMonth.push({ isCurrentMonth: day.isCurrentMonth, weekday: day.weekday });
      NumDayArr.push(day.dayNumber)
      if (day.today) {
        today = (new Date()).toString().slice(0, 3);
      }
    });
    return (
      <div className="agenda-wrapper">
        {false && <DeleteZone parent={this} toasts={this.state.toastsToDeleteZone} handleDropDeleteZone={handleDropDeleteZone}/> }
        <h3>Events Selector:</h3>
        <div className="md-grid no-padding box">
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
            placeholder="Some State"
            value={this.state.value}
            menuItems={this.state.stateItems}
            onChange={this._filterByType}
            errorText="A state is required"
            className="md-cell"
            itemLabel="name"
            itemValue="abbreviation"
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
          />
          <SelectField
            id="statesControlled1"
            label="Select week"
            placeholder="Some State"

            value={this.state.weekToShow.weekCounter}
            menuItems={this.state.avalWeeks}
            onChange={this._changeWeek}
            errorText="A state is required"
            className="md-cell"
            itemLabel="abbreviation"
            itemValue="name"
          />
        </div>
        <div style={{maxWidth: 750, margin: 'auto', overflow: 'hidden'}}>
          <div className="navigation">
            <Button className="navigate-button" onClick={this._prevWeek} icon>navigate_before</Button>
            <Button raised className="action date-container" children={`${this.state.curMonth} ${this.state.curYear}, ${this.state.weekToShow.weekCounter+1} week`} />
            <Button className="navigate-button" onClick={this._nextWeek} icon>navigate_next</Button>
          </div>

          <div className="header-week">
            <div className="column-week"><Button icon style={{marginTop: -7}}>access_time</Button></div>
            <div className={today === 'Mon' ? "column-week today-week-day today" : !isInCurMonth[0].isCurrentMonth ? "disabled column-week" : "column-week"}>
              <p><span className="week-day-number">{NumDayArr[0]}</span>Mon</p>
            </div>
            <div className={today === 'Tue' ? "column-week today-week-day today" : !isInCurMonth[1].isCurrentMonth ? "disabled column-week" : "column-week"}>
              <p><span className="week-day-number">{NumDayArr[1]}</span>Tue</p>
            </div>
            <div className={today === 'Wed' ? "column-week today-week-day today" : !isInCurMonth[2].isCurrentMonth ? "disabled column-week" : "column-week"}>
              <p><span className="week-day-number">{NumDayArr[2]}</span>Wed</p>
            </div>
            <div className={today === 'Thu' ? "column-week today-week-day today" : !isInCurMonth[3].isCurrentMonth ? "disabled column-week" : "column-week"}>
              <p><span className="week-day-number">{NumDayArr[3]}</span>Thu</p>
            </div>
            <div className={today === 'Fri' ? "column-week today-week-day today" : !isInCurMonth[4].isCurrentMonth ? "disabled column-week" : "column-week"}>
              <p><span className="week-day-number">{NumDayArr[4]}</span>Fri</p>
            </div>
            <div className={today === 'Sat' ? "column-week today-week-day today" : !isInCurMonth[5].isCurrentMonth ? "disabled column-week" : "column-week"}>
              <p><span className="week-day-number">{NumDayArr[5]}</span>Sat</p>
            </div>
            <div className={today === 'Sun' ? "column-week today-week-day today" : !isInCurMonth[6].isCurrentMonth ? "disabled column-week" : "column-week"}>
              <p><span className="week-day-number">{NumDayArr[6]}</span>Sun</p>
            </div>
          </div>
          <div className="body-week">
            <div className="time">
              <section style={{top: this.state.top}} className="current-time">
                <div className="dot-current-time"></div>
              </section>
              {(new Array(24).fill(0)).map((val, i) => <div key={i}>{i < 10 ? `0${i}:00` : `${i}:00`}<div className="time-divider"></div></div>)}
            </div>
            {this.state.appliedEventsMonth[this.state.weekToShow.weekCounter].map((day, index) =>
              <div
                key={day.weekday}
                style={day.event ? getStyles(day.event) : {}}
                className={`${day.event ? day.event.type : ''} event-column-week`}
                onDragStart={this.handleDragStart}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
                onDragEnd={this.handleDragEnd}
                onClick={this.openDialog(day.event, index)}
                draggable={true}
              >
                {this.props.isAdmin &&
                  <div style={{ borderRadius: '5px', position: 'relative', height: '100%' }}>
                    <div className="drag-up" onMouseDown={this.setStartTime} onTouchStart={this.setStartTime} onClick={(e)=>{e.stopPropagation()}}></div>
                    <div className="show-changed-starttime"></div>
                    <FontIcon className="drag-up-icon">fast_rewind</FontIcon>
                    <div className="drag-down" onMouseDown={this.setEndTime} onTouchStart={this.setEndTime} onClick={(e)=>{e.stopPropagation()}}></div>
                    <FontIcon className="drag-down-icon">fast_rewind</FontIcon>
                    <div className="show-changed-endtime"></div>
                  </div>
                }
              </div>
            )}
          </div>
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

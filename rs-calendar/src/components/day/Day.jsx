import React from 'react';// eslint-disable-next-line
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Snackbar from 'react-md/lib/Snackbars';// eslint-disable-next-line
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';

import Column from './column';
import ColumnAdmin from './columnAdmin';
import CardAdminEmpty from '../eventCard/CardAdminEmpty';
import smile from './legosmile.svg';
import scroll from '../../instruments/scroll';
import globalScope from '../../globalScope';
import { _closeSaveDay } from '../../instruments/emptyEventOpenClose';

export default class Day extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            day: {weekday: this._calculateWeekNum(new Date(Date.now()).getDay()), date: new Date(Date.now()), today: true},
            avalDays: [1,2,3],
            avalMonthes: [{name: 'January', abbreviation: 0},
                          {name: 'February', abbreviation: 1},
                          {name: 'March', abbreviation: 2},
                          {name: 'April', abbreviation: 3},
                          {name: 'May', abbreviation: 4},
                          {name: 'June', abbreviation: 5},
                          {name: 'July', abbreviation: 6},
                          {name: 'August', abbreviation: 7},
                          {name: 'September', abbreviation: 8},
                          {name: 'October', abbreviation: 9},
                          {name: 'November', abbreviation: 10},
                          {name: 'December', abbreviation: 11}],
            avalYears: ['2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'],
            eventTypes: ['All', 'deadline', 'event', 'lecture', 'webinar', 'workshop'],
            curMonth: new Date(Date.now()).getMonth(),
            curYear: new Date(Date.now()).getFullYear(),
            appliedEventsMonth: this._calculateMonthArr(),
            dayIndex: new Date(Date.now()).getDate()-1,
            stateItems: [{name: 'All', abbreviation: 'All'},
                         {name: 'deadline', abbreviation: 'deadline'},
                         {name: 'event', abbreviation: 'event'},
                         {name: 'lecture', abbreviation: 'lecture'},
                         {name: 'webinar', abbreviation: 'webinar'},
                         {name: 'workshop', abbreviation: 'workshop'}],
            backupDayEvents: [],
            filtered: [],
            fetching: true,
            toasts: [{text: "events successfully loaded"}],
            value: 'All',
            top: 0
        }

        fetch('http://128.199.53.150/events')
          .then(response => response.json())
          .then(events => {
            let [appliedEventsMonth, avalDays, backupDayEvents] = this._applyEventsOnDates(events);
            let day = appliedEventsMonth[this.state.dayIndex];
            this.setState({
                avalDays,
                day,
                filtered: events,
                backupDayEvents,
                appliedEventsMonth,
                fetching: false
            });
        });
    }

    componentDidMount() {
        scroll();
        setTimeout(this._slideDown, 1000);
    }

    _slideDown = () => {
        let curTimeHours = (new Date).toString().slice(16, 18);
        let curTimeMins = (new Date).toString().slice(19, 21);
        let top = 34 + 55*curTimeHours;
        top += curTimeMins*0.9;
        this.setState({top});
    }

    _applyEventsOnDates(events, date = new Date(Date.now())) {
        let month = this._calculateMonthArr(date);
        let avaldays = [];
        let backupDayEvents = [];
        month.map((day, dayIndex) => {
            avaldays.push(dayIndex + 1);
            events.map((event, eventIndex) => {
                
                let eventDate = new Date(event.start);
                
                if(date.getFullYear() === eventDate.getFullYear() &&
                       date.getMonth() === eventDate.getMonth() &&
                       date.getDate() === eventDate.getDate()) {
                           backupDayEvents.push(event);

                }
                
                if(eventDate.getFullYear() === day.date.getFullYear() &&
                   eventDate.getMonth() === day.date.getMonth() &&
                   eventDate.getDate() === day.date.getDate()) {
                       if(!day.events) day.events = [];
                       if(!day.eventIndexes) day.eventIndexes = [];
                       day.events.push(event);
                       day.eventIndexes.push(eventIndex);
                };
            })    
        });
        return [month, avaldays, backupDayEvents];
    }

    _calculateMonthArr(date = new Date(Date.now())) {
        let monthDayNum = 1;
        date.setDate(monthDayNum);
        let monthArr = [];
        let curMonthNumber = date.getMonth();
        let monthNumber = date.getMonth();
        while(curMonthNumber == monthNumber) {
            let weekday = this._calculateWeekNum(date.getDay());
            let today = false;
            if(date.getDate() == (new Date(Date.now())).getDate()) {
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
        }
    }

    _calculateMonthes(monthNumber) {
        switch(monthNumber) {
            case 0: return "Jan";
            case 1: return "Feb";
            case 2: return "Mar";
            case 3: return "Apr";
            case 4: return "May";
            case 5: return "Jun";
            case 6: return "Jul";
            case 7: return "Aug";
            case 8: return "Sep";
            case 9: return "Oct";
            case 10: return "Nov";
            case 11: return "Dec";
        }
    }

    _removeToast = () => {
        const [, ...toasts] = this.state.toasts;
        this.setState({ toasts: [] });
    }

    _filterByType = (value) => {
        let day = this.state.day;//asdassssssssssssssssssss
        if(day.events) {
                day.events = this.state.backupDayEvents.filter((event) => {
                if(value === 'All') return true;
                return event.type === value});
        }

        this.setState({day, value});
    }

    _changeYear = (curYear) => {
        let dateToShow = new Date(this.state.day.date.toString());
        let backupDayNumber = dateToShow.getDate();
        dateToShow.setDate(1);
        dateToShow.setFullYear(curYear);
        // check if more then numbers in month
        let [appliedEventsMonth, avalDays, backupDayEvents] = this._applyEventsOnDates(this.state.filtered, dateToShow);
        if(backupDayNumber > avalDays.length-1) backupDayNumber = avalDays.length-1;
        dateToShow.setDate(backupDayNumber);
        let dayIndex = backupDayNumber;
        let day = appliedEventsMonth[dayIndex];
        this.setState({avalDays, day, backupDayEvents, appliedEventsMonth, dayIndex});
    }

    _changeMonth = (curMonth) => {
        let dateToShow = new Date(this.state.day.date.toString());
        let backupDayNumber = dateToShow.getDate();
        dateToShow.setDate(1);
        dateToShow.setMonth(curMonth);
        // check if more then numbers in month
        let [appliedEventsMonth, avalDays, backupDayEvents] = this._applyEventsOnDates(this.state.filtered, dateToShow);
        if(backupDayNumber > avalDays.length-1) backupDayNumber = avalDays.length-1;
        dateToShow.setDate(backupDayNumber);
        let dayIndex = backupDayNumber;
        let day = appliedEventsMonth[dayIndex];
        this.setState({avalDays, day, backupDayEvents, appliedEventsMonth, dayIndex});
    }

    _changeDay = (selectedDay) => {
        let dayIndex = selectedDay-1;
        let day = this.state.appliedEventsMonth[dayIndex];//sweeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeet
        this.setState({dayIndex, day});
    }

    _toggle = (value) => {
        if(this.state.value == value) value = 'All';
        this._filterByType(value);
    }

    _prevMonth = () => {
        let dateToShow = this.state.day.date;
        dateToShow.setDate(0);
        let [appliedEventsMonth, avalDays, backupDayEvents] = this._applyEventsOnDates(this.state.filtered, dateToShow);
        let dayIndex = appliedEventsMonth.length-1;
        let day = appliedEventsMonth[dayIndex];
        this.setState({avalDays, day, backupDayEvents, appliedEventsMonth, dayIndex});
    }

    _nextMonth = (_nextDay) => {
        let dateToShow = new Date(this.state.day.date.toString());
        dateToShow.setDate(this.state.dayIndex+2);
        let [appliedEventsMonth, avalDays, backupDayEvents] = this._applyEventsOnDates(this.state.filtered, dateToShow);
        let dayIndex = 0;
        let day = appliedEventsMonth[dayIndex];
        this.setState({avalDays, day, backupDayEvents, appliedEventsMonth, dayIndex});
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
        this.setState({dayIndex, day, backupDayEvents});
    }

    _nextDay = () => {
        let dayIndex = this.state.dayIndex+1;
        if(dayIndex === this.state.appliedEventsMonth.length) {
            this._nextMonth();
            return;
        }
        let day = this.state.appliedEventsMonth[dayIndex];
        let backupDayEvents = [];
        if(day.events) backupDayEvents = day.events.slice();
        this.setState({dayIndex, day, backupDayEvents});
    }

    render() {
        
        const mobile = typeof window.orientation !== 'undefined';
        let todayEvents = [];
        let eventIndexes = [];
        if(this.state.day.events) {
            todayEvents = this.state.day.events;
            eventIndexes = this.state.day.eventIndexes;
        }
        return (
            <div className="agenda-wrapper">
                {globalScope.isAdmin && <CardAdminEmpty day={this} _closeSave={_closeSaveDay} eventTypes={this.state.eventTypes} mobile={mobile}/> }
                {this.state.fetching && <LinearProgress className="loading-bar" key="progress" id="contentLoadingProgress" style={mobile ? {top: 40} : {top: 47}}/>}
                {!this.state.fetching && <Snackbar toasts={this.state.toasts} onDismiss={this._removeToast}/>}
                <h3>Events Selector:</h3>
                <div className="md-grid no-padding box">    
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
                      value={this._calculateMonthes(this.state.day.date.getMonth())}
                      menuItems={this.state.avalMonthes}
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
                      value={this.state.day.date.getFullYear()}
                      menuItems={this.state.avalYears}
                      onChange={this._changeYear}
                      errorText="A state is required"
                      className="md-cell"
                    />
                    
                </div>  
                <div style={{maxWidth: 750, margin: 'auto', overflow: 'hidden'}}>
                    <div className="navigation">
                        <Button className="navigate-button" onClick={this._prevDay} icon>navigate_before</Button>
                        <Button raised className="action date-container" label={`${this.state.day.date.getDate()} ${this._calculateMonthes(this.state.day.date.getMonth())} ${this.state.day.date.getFullYear()}, ${this.state.day.weekday}`} />
                        <Button className="navigate-button" onClick={this._nextDay} icon>navigate_next</Button>
                    </div>
                        
                    <div className="header-day">
                        <div className="column-week"><Button icon style={{marginTop: -7}}>access_time</Button></div>
                        <p><span className="agenda">Agenda:</span></p>
                        <div></div>
                    </div>
                    <div className="body-day">
                        <div className="time">
                            <section style={{top: this.state.top}} className="current-time">
                                <div className="dot-current-time"></div>
                            </section>
                            {(new Array(24).fill(0)).map((val, i) => <div key={i}>{i < 10 ? `0${i}:00` : `${i}:00`}<div className="time-divider"></div></div>)}
                        </div>
                        {todayEvents.length ? globalScope.isAdmin ? 
                            todayEvents.map((event, index) => 
                                <ColumnAdmin key={index*30} day={this} event={event} eventIndex={eventIndexes[index]} eventTypes={this.state.eventTypes} index={index} mobile={mobile}/>) :
                            todayEvents.map((event, index) => 
                                <Column key={index*30} day={this.state.day} event={event} eventTypes={this.state.eventTypes} index={index} mobile={mobile}/>) :
                            <div className="freedom">
                                <p style={{fontSize: '16pt'}}>You are free today!</p>
                                <img style={{margin: '0 auto', width: 100}} src={smile}/>
                            </div>}
                    </div>
                </div>
                <h3>Legend:</h3>
                <div className="md-grid no-padding box">
                    <Button raised className={this.state.value === 'deadline' ? "action today" : "action"} onClick={this._toggle.bind(this, 'deadline')}><div className="event-cell deadline"></div><p>deadline</p></Button>
                    <Button raised className={this.state.value === 'webinar' ? "action today" : "action"} onClick={this._toggle.bind(this, 'webinar')}><div className="event-cell webinar"></div><p>webinar</p></Button>
                    <Button raised className={this.state.value === 'lecture' ? "action today" : "action"} onClick={this._toggle.bind(this, 'lecture')}><div className="event-cell lecture"></div><p>lecture</p></Button>
                    <Button raised className={this.state.value === 'workshop' ? "action today" : "action"} onClick={this._toggle.bind(this, 'workshop')}><div className="event-cell workshop"></div><p>workshop</p></Button>
                    <Button raised className={this.state.value === 'event' ? "action today" : "action"} onClick={this._toggle.bind(this, 'event')}><div className="event-cell event"></div><p>event</p></Button>
                </div>
            </div>  
        )
    }
}

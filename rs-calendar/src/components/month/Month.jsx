import React from 'react';// eslint-disable-next-line
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Snackbar from 'react-md/lib/Snackbars';// eslint-disable-next-line
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';

import Column from './column';
import ColumnAdmin from './columnAdmin';

import { _filterByFromDate, _filterByToDate, _filterByType } from '../../instruments/filters';
import globalScope from '../../globalScope';
import { _loadEvents } from '../../instruments/fetching';
import { tempEventGet, tempEventSet, eventBackupGet, eventBackupSet, speakersBackupGet, speakersBackupSet, speakersTempGet, speakersTempSet } from '../eventsBackup';

export default class Month extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            dateToShow: Date.now(),
            avalMonthes: [{name: 'January', abbreviation: 'Jan'},
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
                          {name: 'December', abbreviation: 'Dec'}],
            avalYears: ['2020', '2019', '2018', '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010'],
            curMonth: (new Date).toString().slice(4, 7),
            curYear: (new Date).getFullYear(),
            appliedEventsMonth: this._calculateMonthArr(),
            eventTypes: ['All', 'deadline', 'event', 'lecture', 'webinar', 'workshop'],
            events: [],
            filtered: [],
			fetching: true,
			toasts: [{text: "events successfully loaded"}],
            value: 'All',
            from: 'All',
            to: 'All'
		}
        this._filterByType = _filterByType.bind(this);
        this._filterByToDate = _filterByToDate.bind(this);
        this._filterByFromDate = _filterByFromDate.bind(this);
        
        _loadEvents.call(this, 'http://128.199.53.150/events')
            .then(events => {
                let appliedEventsMonth = this._applyEventsOnDates(events);
                this.setState({
                    events,
                    filtered: events,
                    appliedEventsMonth,
                    fetching: false
                });    
            });
	}
	
    _applyEventsOnDates(events, date = Date.now()) {
        // alert('_applyEventsOnDates');
        let month = this._calculateMonthArr(date);
        events.map((event, eventIndex) => {
            let eventDate = new Date(event.start);
            month.map((week, weekIndex) => {
                week.map((day, dayIndex) => {
                    if(eventDate.toString().slice(0, 15) == day.curDate.toString().slice(0, 15)){
                        day.event = event;
                        day.eventIndex = eventIndex;
                    };
                })
            })    
        });
        return month;
    }

    _calculateMonthArr(date = Date.now()) {
        // alert('_calculateMonthArr');
        let currentDate = new Date(date);
        let rollDownDate = new Date(date);
        let rollDownNumber = Number(rollDownDate.toString().slice(8, 11));
        let rollDownWeekday = rollDownDate.toString().slice(0, 3);

        while(rollDownNumber != 1) {
            date -= 1000*60*60*24;
            rollDownDate = new Date(date);
            rollDownNumber = Number(rollDownDate.toString().slice(8, 11));
            rollDownWeekday = rollDownDate.toString().slice(0, 3);
        }

        while(rollDownWeekday != "Mon") {
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
        

        while(curMonthNumber == monthNumber || weekNumber != 6) {
            let dayNumber = Number(curDate.toString().slice(8, 10));
            let weekday = curDate.toString().slice(0, 3);
            let yearNumber = Number(curDate.toString().slice(11, 15));
            let isCurrentMonth = curMonthNumber == monthNumber;
            weekNumber = this._calculateWeekNum(weekday);
            let today = false;
            if(curDate.toString().slice(0, 15) == (new Date).toString().slice(0, 15)) today = true; 
            weekArr.push({dayNumber, weekNumber, monthNumber, yearNumber, weekday, isCurrentMonth, curDate, today});
            nextDate += 1000*60*60*24;
            curDate = new Date(nextDate);
            monthNumber = curDate.getMonth();
            if(weekNumber == 6) {
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
        }
    }

    _progressBarShower = () => {
        // alert('_progressBarShower');
        const mobile = typeof window.orientation !== 'undefined';
        let top = 47;
        let opacity = this.state.notLoaded;
        if(mobile) top = 40;
		return {opacity, top};
	}

	_snackBarShower = () => {
        // alert('_snackBarShower');
		if(!this.state.notLoaded) return <Snackbar toasts={this.state.toasts} onDismiss={this._removeToast}/>;
	}


  	_removeToast = () => {
        // alert('_removeToast');
    	const [, ...toasts] = this.state.toasts;
    	this.setState({ toasts });
  	}

    _changeYear = (curYear) => {
        // alert('_changeYear');
        let dateToShow = new Date(this.state.dateToShow).toString();
        dateToShow = `${dateToShow.slice(0, 11)}${curYear}${dateToShow.slice(15)}`;
        dateToShow = new Date(dateToShow).valueOf();
        let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
        this.setState({curYear, dateToShow, appliedEventsMonth});
    }

    _changeMonth = (curMonth) => {
        // alert('_changeMonth');
        let dateToShow = new Date(this.state.dateToShow).toString();
        dateToShow = `${dateToShow.slice(0, 4)}${curMonth}${dateToShow.slice(7)}`;
        dateToShow = new Date(dateToShow).valueOf();
        let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
        this.setState({curMonth, dateToShow, appliedEventsMonth});
    }

    _toggle = (value) => {
        // alert('_toggle');
        if(this.state.toggleValue == value) value = 'All';
        this._filterByType(value);
    }

    _prevMonth = () => {
        // alert('_prevMonth');
        let curYear = this.state.curYear;
        let dateToShow = this.state.dateToShow - 1000*60*60*24*30;
        let curMonth = new Date(dateToShow).toString().slice(4, 7);
        if(curMonth === "Dec") curYear--;
        let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
        this.setState({curYear, curMonth, dateToShow, appliedEventsMonth});
    }

    _nextMonth = () => {
        // alert('_nextMonth');
        let curYear = this.state.curYear;
        let dateToShow = this.state.dateToShow + 1000*60*60*24*30;
        let curMonth = new Date(dateToShow).toString().slice(4, 7);
        if(curMonth === "Jan") curYear++;
        let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
        this.setState({curYear, curMonth, dateToShow, appliedEventsMonth});
    }

    _rerender = () => {this._filterByType('All')}

	render() {
        // alert('render month');
        const mobile = typeof window.orientation !== 'undefined';
		return (
			<div className="agenda-wrapper">
                {globalScope.isAdmin && <Button
                    tooltipPosition="top"
                    tooltipLabel="add event"
                    onClick={this._rerender}
                    floating
                    secondary
                    fixed>add
                </Button>}
				{this.state.fetching && <LinearProgress className="loading-bar" key="progress" id="contentLoadingProgress" style={mobile ? {top: 40} : {top: 47}}/>}
                {!this.state.fetching && <Snackbar toasts={this.state.toasts} onDismiss={this._removeToast}/>}
                <h3>Events Selector:</h3>
                <div className="md-grid no-padding box">    
                    <DatePicker
                        id="local-ru-RU"
                        label="Select from date"
                        locales="ru-RU"
                        className="md-cell"
                        onChange={this._filterByFromDate}
                        autoOk
                    />
                    <DatePicker
                        id="local-ru-RU"
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
                      menuItems={this.state.eventTypes}
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
                        <Button raised className="action date-container" label={`${this.state.curMonth} ${this.state.curYear}`} />
                        <Button className="navigate-button" onClick={this._nextMonth} icon>navigate_next</Button>
                    </div>
                    <div className="header-week">
                        <div className="column-month">{mobile ? 'Mon' : 'Monday'}</div>
                        <div className="column-month">{mobile ? 'Tue' : 'Tuesday'}</div>
                        <div className="column-month">{mobile ? 'Wed' : 'Wednesday'}</div>
                        <div className="column-month">{mobile ? 'Thu' : 'Thursday'}</div>
                        <div className="column-month">{mobile ? 'Fri' : 'Friday'}</div>
                        <div className="column-month">{mobile ? 'Sat' : 'Saturday'}</div>
                        <div className="column-month">{mobile ? 'Sun' : 'Sunday'}</div>
                    </div>
                    { this.state.appliedEventsMonth.map((week, i) => 
                        <div className="body-month" key={i}>
                            {week.map((day, index) => 
                                day.event ? globalScope.isAdmin ?
                                    <ColumnAdmin
                                        month={this}
                                        eventTypes={this.state.eventTypes}
                                        key={index*30}
                                        eventIndex={day.eventIndex}
                                        day={day}
                                        event={day.event}
                                        index={index}
                                        mobile={mobile}/> : 
                                    <Column
                                        eventTypes={this.state.eventTypes}
                                        key={index*30}
                                        day={day}
                                        index={index}
                                        mobile={mobile}/>    
                                    : <Button 
                                            className={`table-cell ${day.today ? 'today' : !day.isCurrentMonth && 'disabled-cell'}`} 
                                            key={index*30}
                                            floating 
                                            ><p className="day-number">{day.dayNumber}</p>
                                    </Button>
                                )}
                        </div>)
                    }
                </div>
                <h3>Legend:</h3>
                <div className="md-grid no-padding box">
                    <Button raised className={this.state.toggleValue === 'deadline' ? "action today" : "action"} onClick={this._toggle.bind(this, 'deadline')}><div className="event-cell deadline"></div><p>deadline</p></Button>
                    <Button raised className={this.state.toggleValue === 'webinar' ? "action today" : "action"} onClick={this._toggle.bind(this, 'webinar')}><div className="event-cell webinar"></div><p>webinar</p></Button>
                    <Button raised className={this.state.toggleValue === 'lecture' ? "action today" : "action"} onClick={this._toggle.bind(this, 'lecture')}><div className="event-cell lecture"></div><p>lecture</p></Button>
                    <Button raised className={this.state.toggleValue === 'workshop' ? "action today" : "action"} onClick={this._toggle.bind(this, 'workshop')}><div className="event-cell workshop"></div><p>workshop</p></Button>
                    <Button raised className={this.state.toggleValue === 'event' ? "action today" : "action"} onClick={this._toggle.bind(this, 'event')}><div className="event-cell event"></div><p>event</p></Button>
                </div>
            </div>  
        )
    }
}
              

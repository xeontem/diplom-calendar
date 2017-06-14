import React from 'react';// eslint-disable-next-line
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Snackbar from 'react-md/lib/Snackbars';// eslint-disable-next-line
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';
import FontIcon from 'react-md/lib/FontIcons';

import Row from './column';
import smile from './legosmile.svg';
import scroll from './scroll';


export default class Week extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            dateToShow: Date.now(),
            avalDays: [],
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
			dayToShow: 0,
            backup: {},
            stateItems: [{name: 'All', abbreviation: 'All'},
                         {name: 'deadline', abbreviation: 'deadline'},
                         {name: 'event', abbreviation: 'event'},
                         {name: 'lecture', abbreviation: 'lecture'},
                         {name: 'webinar', abbreviation: 'webinar'},
                         {name: 'workshop', abbreviation: 'workshop'}],
			events: [],
            filtered: [],
			notLoaded: 1,
			toasts: [{text: "events successfully loaded"}],
            value: 'All',
		}
	}


    componentWillMount() {
        let [avalDays, dayToShow] = this._defineListOfDays(this.state.appliedEventsMonth, true);
        this.setState({avalDays, dayToShow});
        if(!this.state.events.length) {
        let that = this;
        fetch('http://128.199.53.150/events')
          .then(function(response) {
          if(response.ok) {
            return response.json();
          }
        }).then(function(events){
            let appliedEventsMonth = that._applyEventsOnDates(events);
            let curIndexOfWeek;
            let avalDays = [];
            for(let i = 0; i < appliedEventsMonth.length; i++) {
                for(let j = 0; j < appliedEventsMonth[i].length; j++){
                    avalDays.push({dayNumber: j, weekNumber: i});
                }
            }
            that.setState({
                events,
                filtered: events,
                appliedEventsMonth,
                curIndexOfWeek,
                notLoaded: 0
            });
        });
        }
    }

    componentDidMount() {
        scroll();
    }
    
    _defineListOfDays(month, firstInit) {
        let avalDays = [];

        let dayToShow = this.state.dayToShow;
        month.map((day, i) => {
            if(day.today && firstInit) dayToShow = i;
            avalDays.push(day.dayNumber);
        });
        if(dayToShow > month.length-1) dayToShow = month.length-1;
        return [avalDays, dayToShow];
    }

    _applyEventsOnDates(events, date = Date.now()) {
        let month = this._calculateMonthArr(date);
        events.map((event, eventIndex) => {
            let eventDate = new Date(event.start);
            month.map((day, weekIndex) => {
                    if(eventDate.toString().slice(0, 15) == day.curDate.toString().slice(0, 15)){
                        if(!day.events) day.events = [];
                        day.events.push(event);
                    };
            })    
        });
        return month;
    }

    _calculateMonthArr(date = Date.now()) {
        let currentDate = new Date(date);
        let rollDownDate = new Date(date);
        let rollDownNumber = Number(rollDownDate.toString().slice(8, 11));

        while(rollDownNumber != 1) {
            date -= 1000*60*60*24;
            rollDownDate = new Date(date);
            rollDownNumber = Number(rollDownDate.toString().slice(8, 11));
        }

        let monthArr = [];
        let curMonthNumber = currentDate.getMonth();
        let nextDate = date;
        let curDate = new Date(nextDate);
        let monthNumber = curDate.getMonth();
        let dayNumber = Number(curDate.toString().slice(8, 10));
        while(curMonthNumber == monthNumber) {
            let weekday = curDate.toString().slice(0, 3);
            let today = false;
            if(curDate.toString().slice(0, 15) == (new Date).toString().slice(0, 15)) {
                today = true;
            }
            monthArr.push({dayNumber, monthNumber, weekday, curDate, today});
            nextDate += 1000*60*60*24;
            curDate = new Date(nextDate);
            monthNumber = curDate.getMonth();
            dayNumber = Number(curDate.toString().slice(8, 10));
        }
        return monthArr;
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
        const mobile = typeof window.orientation !== 'undefined';
        let top = 47;
        let opacity = this.state.notLoaded;
        if(mobile) top = 40;
        return {opacity, top};
    }

	_snackBarShower = () => {
		if(!this.state.notLoaded) return <Snackbar toasts={this.state.toasts} onDismiss={this._removeToast}/>;
	}


  	_removeToast = () => {
    	const [, ...toasts] = this.state.toasts;
    	this.setState({ toasts: [] });
  	}

    _filterByType = (value) => {
        let day = this.state.appliedEventsMonth[this.state.dayToShow];
        if(day.events) {
            day.events = this.state.backup.events.filter((event) => {
                if(value === 'All') return true;
                return event.type === value});
        }

        this.setState({value});
    }

    _changeYear = (curYear) => {
        let dateToShow = new Date(this.state.dateToShow).toString();
        dateToShow = `${dateToShow.slice(0, 11)}${curYear}${dateToShow.slice(15)}`;
        dateToShow = new Date(dateToShow).valueOf();
        let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
        // let avalWeeks = [];
        // for(let i = 0; i < appliedEventsMonth.length; i++) avalWeeks.push({name: i, abbreviation: i+1});
        let [avalDays, dayToShow] = this._defineListOfDays(appliedEventsMonth);
        this.setState({avalDays, dayToShow, curYear, dateToShow, appliedEventsMonth});
    }

    _changeMonth = (curMonth) => {
        let dateToShow = new Date(this.state.dateToShow).toString();
        dateToShow = `${dateToShow.slice(0, 4)}${curMonth}${dateToShow.slice(7)}`;
        dateToShow = new Date(dateToShow).valueOf();
        let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
        // let avalWeeks = [];
        // for(let i = 0; i < appliedEventsMonth.length; i++) avalWeeks.push({name: i, abbreviation: i+1});
        let [avalDays, dayToShow] = this._defineListOfDays(appliedEventsMonth);
        this.setState({avalDays, dayToShow, curMonth, dateToShow, appliedEventsMonth});
    }

    _changeDay = (selectedDay) => {
        this.setState({dayToShow: selectedDay-1});
    }

    _toggle = (value) => {
        if(this.state.value == value) value = 'All';
        this._filterByType(value);
    }

    _prevMonth = (_prevDay) => {
        let curYear = this.state.curYear;
        let dateToShow = this.state.dateToShow - 1000*60*60*24*30;
        let curMonth = new Date(dateToShow).toString().slice(4, 7);
        if(curMonth === "Dec") curYear--;
        let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
        // let dayToShow = this.state.dayToShow;
        let [avalDays, dayToShow] = this._defineListOfDays(appliedEventsMonth); 
        if(_prevDay === '_prevDay') {
            dayToShow = appliedEventsMonth.length-1;
        }
        this.setState({avalDays, dayToShow, curYear, curMonth, dateToShow, appliedEventsMonth});
    }

    _nextMonth = (_nextDay) => {
        let curYear = this.state.curYear;
        let dateToShow = this.state.dateToShow + 1000*60*60*24*30;
        let curMonth = new Date(dateToShow).toString().slice(4, 7);
        if(curMonth === "Jan") curYear++;
        let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, dateToShow);
        // let dayToShow = this.state.dayToShow;
        let [avalDays, dayToShow] = this._defineListOfDays(appliedEventsMonth);
        if(_nextDay === '_nextDay') {
            dayToShow = 0;
        }   
        this.setState({avalDays, dayToShow, curYear, curMonth, dateToShow, appliedEventsMonth});
    }

    _prevDay = () => {
        let dayToShow = this.state.dayToShow;
        
        if(dayToShow === 0) {
            this._prevMonth('_prevDay');
            return;
        }
        else dayToShow--;
        let day = this.state.appliedEventsMonth[dayToShow];
        let backup = this.state.backup;
        if(day.events) backup.events = day.events.map((event) => event); 
        this.setState({dayToShow, backup});
    }

    _nextDay = () => {
        let dayToShow = this.state.dayToShow;
        
        if(dayToShow === this.state.appliedEventsMonth.length-1) {
            this._nextMonth('_nextDay');
            return;
        }
        else dayToShow++;
        let day = this.state.appliedEventsMonth[dayToShow];
        let backup = this.state.backup;
        if(day.events) backup.events = day.events.map((event) => event); 
        this.setState({dayToShow, backup});
    }

	render() {
        let curTimeHours = (new Date).toString().slice(16, 18);
        let curTimeMins = (new Date).toString().slice(19, 21);
        let top = 34 + 55*curTimeHours;
        top += curTimeMins*0.9;
        const mobile = typeof window.orientation !== 'undefined';
        let dayToShow = this.state.appliedEventsMonth[this.state.dayToShow];
		return (
			<div className="agenda-wrapper">
				<LinearProgress className="loading-bar" key="progress" id="contentLoadingProgress" style={this._progressBarShower()} />
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
                      value={this.state.dayToShow+1}
                      menuItems={this.state.avalDays}
                      onChange={this._changeDay}
                      errorText="A state is required"
                      className="md-cell"
                    />
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
                      id="statesControlled2"
                      label="Select year"
                      placeholder="Some State"
                      value={this.state.curYear.toString()}
                      menuItems={this.state.avalYears}
                      onChange={this._changeYear}
                      errorText="A state is required"
                      className="md-cell"
                    />
                    
                </div>  
                <div style={{maxWidth: 750, margin: 'auto', overflow: 'hidden'}}>
                    <div className="navigation">
                        <Button className="navigate-button" onClick={this._prevDay} icon>navigate_before</Button>
                        <Button raised className="action date-container" label={`${dayToShow.dayNumber} ${this.state.curMonth} ${this.state.curYear}, ${dayToShow.weekday}`} />
                        <Button className="navigate-button" onClick={this._nextDay} icon>navigate_next</Button>
                    </div>
                        
                    <div className="header-day">
                        <div className="column-week"><Button icon style={{marginTop: -7}}>access_time</Button></div>
                        <p><span className="agenda">Agenda:</span></p>
                        <div></div>
                    </div>
                    <div className="body-day">
                        <div className="time">
                            <section style={{top}} className="current-time">
                                <div className="dot-current-time"></div>
                            </section>
                            {(new Array(24).fill(0)).map((val, i) => <div key={i}>{i < 10 ? `0${i}:00` : `${i}:00`}<div className="time-divider"></div></div>)}
                        </div>
                        {dayToShow.events ? dayToShow.events.map((event, index) => 
                        <Row  key={index*30} day={dayToShow} event={event} index={index} mobile={mobile}/>) : <div className="freedom"><p style={{fontSize: '16pt'}}>You are free today!</p><img style={{margin: '0 auto', width: 100}} src={smile}/></div>}
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
                {this._snackBarShower()}
            </div>  
        )
    }
}

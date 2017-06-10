import React from 'react';// eslint-disable-next-line
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Snackbar from 'react-md/lib/Snackbars';// eslint-disable-next-line
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';

import Row from './column';



export default class Week extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            dateToShow: Date.now(),
            avalWeeks: [],
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
            month: this._calculateMonthArr(),
            appliedEventsMonth: this._calculateMonthArr(),
			weekToShow: this._calculateMonthArr(Date.now(), true),
            curIndexOfWeek: 0,
            stateItems: [{name: 'All', abbreviation: 'All'},
                         {name: 'deadline', abbreviation: 'deadline'},
                         {name: 'event', abbreviation: 'event'},
                         {name: 'lecture', abbreviation: 'lecture'},
                         {name: 'webinar', abbreviation: 'webinar'},
                         {name: 'workshop', abbreviation: 'workshop'}],
			events: [],
            filtered: [],
			loaded: 1,
			toasts: [{text: "events successfully loaded"}],
            value: 'All',
            from: 'All',
            to: 'All'
		}
	}
	componentWillMount() {
        if(!this.state.events.length) {
		console.log('fetching events');
        let that = this;
		fetch('http://128.199.53.150/events')
		  .then(function(response) {
		  if(response.ok) {
		    return response.json();
		  }
		}).then(function(events){
            console.log('events successfully fetched');
            let appliedEventsMonth = that._applyEventsOnDates(events);
            let month = that._calculateMonthArr(that.state.dateToShow);
            let weekToShow;
            let curIndexOfWeek;
            let avalWeeks = [];
            for(let i = 0; i < appliedEventsMonth.length; i++) {
                for(let j = 0; j < appliedEventsMonth[i].length; j++){
                    if(appliedEventsMonth[i][j].today) {
                        weekToShow = appliedEventsMonth[i];
                    }    
                }
                avalWeeks.push({name: i, abbreviation: i+1});
            }
			that.setState({
				events,
                avalWeeks,
                filtered: events,
                month,
                appliedEventsMonth,
                weekToShow,
                curIndexOfWeek,
				loaded: 0
			});
		});
        }
	}

    _applyEventsOnDates(events, month = this.state.month) {
        events.map((event, eventIndex) => {
            let eventDate = new Date(event.start);
            month.map((week, weekIndex) => {
                week.map((day, dayIndex) => {
                    if(eventDate.toString().slice(0, 15) == day.curDate.toString().slice(0, 15)){
                        day.event = event;
                    };
                })
            })    
        });
        return month;
    }

    _calculateMonthArr(date = Date.now(), toWeek) {
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
        let weekCounter = 0;
        while(curMonthNumber == monthNumber || weekNumber != 6) {
            let dayNumber = Number(curDate.toString().slice(8, 10));
            let weekday = curDate.toString().slice(0, 3);
            let yearNumber = Number(curDate.toString().slice(11, 15));
            let isCurrentMonth = curMonthNumber == monthNumber;
            weekNumber = this._calculateWeekNum(weekday);
            let today = false;
            if(curDate.toString().slice(0, 15) == (new Date).toString().slice(0, 15)) {
                today = true;
                weekArr.curWeek = true;
            }
            weekArr.push({dayNumber, weekNumber, monthNumber, yearNumber, weekday, isCurrentMonth, curDate, today});
            nextDate += 1000*60*60*24;
            curDate = new Date(nextDate);
            monthNumber = curDate.getMonth();
            if(weekNumber == 6) {
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
        }
    }

    _progressBarShower = () => {
        const mobile = typeof window.orientation !== 'undefined';
        let top = 47;
        let opacity = this.state.loaded;
        if(mobile) top = 40;
        return {opacity, top};
    }

	_snackBarShower = () => {
		if(this.state.loaded) return <Snackbar toasts={this.state.toasts} onDismiss={this._removeToast}/>;
	}


  	_removeToast = () => {
    	const [, ...toasts] = this.state.toasts;
    	this.setState({ toasts });
  	}

    _filterByFromDate = (from) => {
        let yearFrom = from.slice(6, 10);
        let monthFrom = from.slice(3, 5);
        let dayFrom = from.slice(0, 2);
        let yearTo = this.state.to.slice(6, 10);
        let monthTo = this.state.to.slice(3, 5);
        let dayTo = this.state.to.slice(0, 2);

        let filtered = this.state.events.filter((event) => {
            let year = event.start.slice(0, 4);
            let month = event.start.slice(5, 7);
            let day = event.start.slice(8, 10);
            if(year >= yearFrom && month > monthFrom) return true;
            if(month == monthFrom && day >= dayFrom) return true;
            return false;      
        });
        filtered = filtered.filter((event) => {
            let year = event.start.slice(0, 4);
            let month = event.start.slice(5, 7);
            let day = event.start.slice(8, 10);
            if(this.state.to === 'All') return true;
            if(year <= yearTo && month < monthTo) return true;
            if(month == monthTo && day <= dayTo) return true;
            return false;
        });
        filtered = filtered.filter((event) => {
            if(this.state.value === 'All') return true;
            return event.type === this.state.value;
        });
        let appliedEventsMonth = this._applyEventsOnDates(filtered);
        let month = this._calculateMonthArr(this.state.dateToShow);
        this.setState({filtered, from, month, appliedEventsMonth});
    }

    _filterByToDate = (to) => {
        let yearFrom = this.state.from.slice(6, 10);
        let monthFrom = this.state.from.slice(3, 5);
        let dayFrom = this.state.from.slice(0, 2);
        let yearTo = to.slice(6, 10);
        let monthTo = to.slice(3, 5);
        let dayTo = to.slice(0, 2);

        let filtered = this.state.events.filter((event) => {
            let year = event.start.slice(0, 4);
            let month = event.start.slice(5, 7);
            let day = event.start.slice(8, 10);
            if(this.state.from === 'All') return true;
            if(year >= yearFrom && month > monthFrom) return true;
            if(month == monthFrom && day >= dayFrom) return true;
            return false;      
        });
        filtered = filtered.filter((event) => {
            let year = event.start.slice(0, 4);
            let month = event.start.slice(5, 7);
            let day = event.start.slice(8, 10);
            if(year <= yearTo && month < monthTo) return true;
            if(month == monthTo && day <= dayTo) return true;
            return false;
        });
        filtered = filtered.filter((event) => {
            if(this.state.value === 'All') return true;
            return event.type === this.state.value;
        });
        let appliedEventsMonth = this._applyEventsOnDates(filtered);
        let month = this._calculateMonthArr(this.state.dateToShow);
        this.setState({filtered, to, month, appliedEventsMonth});
    }

    _filterByType = (value) => {

        let yearFrom = this.state.from.slice(6, 10);
        let monthFrom = this.state.from.slice(3, 5);
        let dayFrom = this.state.from.slice(0, 2);
        let yearTo = this.state.to.slice(6, 10);
        let monthTo = this.state.to.slice(3, 5);
        let dayTo = this.state.to.slice(0, 2);
        
        let filtered = this.state.events.filter((event) => {
            if(value === 'All') return true;
            return event.type === value});
        //from filter
        filtered = filtered.filter((event) => {
            let year = event.start.slice(0, 4);
            let month = event.start.slice(5, 7);
            let day = event.start.slice(8, 10);
            if(this.state.from === 'All') return true;
            if(year >= yearFrom && month > monthFrom) return true;
            if(month == monthFrom && day >= dayFrom) return true;
            return false;
        });
        //to filter
        filtered = filtered.filter((event) => {
            let year = event.start.slice(0, 4);
            let month = event.start.slice(5, 7);
            let day = event.start.slice(8, 10);
            if(this.state.to === 'All') return true;
            if(year <= yearTo && month < monthTo) return true;
            if(month == monthTo && day <= dayTo) return true;
            return false;
        });
        let appliedEventsMonth = this._applyEventsOnDates(filtered);
        let month = this._calculateMonthArr(this.state.dateToShow);
        this.setState({filtered, value, toggleValue: value, month, appliedEventsMonth});
    }

    _changeYear = (curYear) => {
        let dateToShow = new Date(this.state.dateToShow).toString();
        dateToShow = `${dateToShow.slice(0, 11)}${curYear}${dateToShow.slice(15)}`;
        dateToShow = new Date(dateToShow).valueOf();
        let month = this._calculateMonthArr(dateToShow);
        let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, month);
        let avalWeeks = [];
        for(let i = 0; i < appliedEventsMonth.length; i++) avalWeeks.push({name: i, abbreviation: i+1});
        this.setState({curYear, dateToShow, month, appliedEventsMonth, avalWeeks});
    }

    _changeMonth = (curMonth) => {
        let dateToShow = new Date(this.state.dateToShow).toString();
        dateToShow = `${dateToShow.slice(0, 4)}${curMonth}${dateToShow.slice(7)}`;
        dateToShow = new Date(dateToShow).valueOf();
        let month = this._calculateMonthArr(dateToShow);
        let appliedEventsMonth = this._applyEventsOnDates(this.state.filtered, month);
        let avalWeeks = [];
        for(let i = 0; i < appliedEventsMonth.length; i++) avalWeeks.push({name: i, abbreviation: i+1});
        this.setState({curMonth, dateToShow, month, appliedEventsMonth, avalWeeks});
    }

    _changeWeek = (selectedWeek) => {
        let weekToShow = this.state.weekToShow;
        weekToShow.weekCounter = selectedWeek;
        this.setState({weekToShow});
    }

    _toggle = (value) => {
        if(this.state.toggleValue == value) value = 'All';
        this._filterByType(value);
    }

	render() {
        let curTimeHours = (new Date).toString().slice(16, 18);
        let curTimeMins = (new Date).toString().slice(19, 21);
        let top = 34 + 55*curTimeHours;
        top += curTimeMins*0.9;
        console.log(curTimeHours, curTimeMins);
        const mobile = typeof window.orientation !== 'undefined';
        let week = this.state.appliedEventsMonth[this.state.weekToShow.weekCounter];
        let today = false;
        let NumDayArr = [];
        for(let i = 0; i < week.length; i++){
            NumDayArr.push(week[i].dayNumber)
            if(week[i].today) today = (new Date).toString().slice(0, 3);
        }
		return (
			<div className="agenda-wrapper">
				<LinearProgress className="loading-bar" key="progress" id="contentLoadingProgress" style={this._progressBarShower()} />
                <h3>Events Selector:</h3>
                <div className="md-grid no-padding box">    
                    <DatePicker
                        id="local-ru-RU"
                        label="Select from date"
                        locales="ru-RU"
                        className="md-cell"
                        onChange={this._filterByFromDate}
                    />
                    <DatePicker
                        id="local-ru-RU"
                        label="Select to date"
                        locales="ru-RU"
                        className="md-cell"
                        onChange={this._filterByToDate}
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
                      id="statesControlled1"
                      label="Select year"
                      placeholder="Some State"
                      menuItems={this.state.avalYears}
                      onChange={this._changeYear}
                      errorText="A state is required"
                      className="md-cell"
                      itemLabel="name"
                      itemValue="name"
                    />
                    <SelectField
                      id="statesControlled2"
                      label="Select month"
                      placeholder="Some State"
                      menuItems={this.state.avalMonthes}
                      onChange={this._changeMonth}
                      errorText="A state is required"
                      className="md-cell"
                      itemLabel="name"
                      itemValue="abbreviation"
                    />
                    <SelectField
                      id="statesControlled1"
                      label="Select week"
                      placeholder="Some State"
                      menuItems={this.state.avalWeeks}
                      onChange={this._changeWeek}
                      errorText="A state is required"
                      className="md-cell"
                      itemLabel="abbreviation"
                      itemValue="name"
                    />
                </div>  
                <div style={{maxWidth: 750, margin: 'auto', overflow: 'hidden'}}>
                    <Button raised className="action date-container" label={`${this.state.curYear} ${this.state.curMonth}, ${this.state.weekToShow.weekCounter+1} week`} />
                        
                    <div className="header-week">
                        <div className="column-week"><Button icon style={{marginTop: -7}}>access_time</Button></div>
                        <div className={today === 'Mon' ? "column-week today-week-day" : "column-week"}>
                            <p><span className="week-day-number">{NumDayArr[0]}</span>Mon</p>
                        </div>
                        <div className={today === 'Tue' ? "column-week today-week-day" : "column-week"}>
                            <p><span className="week-day-number">{NumDayArr[1]}</span>Tue</p>
                        </div>
                        <div className={today === 'Wed' ? "column-week today-week-day" : "column-week"}>
                            <p><span className="week-day-number">{NumDayArr[2]}</span>Wed</p>
                        </div>
                        <div className={today === 'Thu' ? "column-week today-week-day" : "column-week"}>
                            <p><span className="week-day-number">{NumDayArr[3]}</span>Thu</p>
                        </div>
                        <div className={today === 'Fri' ? "column-week today-week-day" : "column-week"}>
                            <p><span className="week-day-number">{NumDayArr[4]}</span>Fri</p>
                        </div>
                        <div className={today === 'Sat' ? "column-week today-week-day" : "column-week"}>
                            <p><span className="week-day-number">{NumDayArr[5]}</span>Sat</p>
                        </div>
                        <div className={today === 'Sun' ? "column-week today-week-day" : "column-week"}>
                            <p><span className="week-day-number">{NumDayArr[6]}</span>Sun</p>
                        </div>
                    </div>
                    <div className="body-week">
                        <div className="time">
                            <section style={{top}} className="current-time">
                                <div className="dot-current-time"></div>
                            </section>
                            {(new Array(24).fill(0)).map((val, i) => <div key={i}>{i < 10 ? `0${i}:00` : `${i}:00`}<div className="time-divider"></div></div>)}
                        </div>
                        {this.state.appliedEventsMonth[this.state.weekToShow.weekCounter].map((day, index) => 
                        <Row  key={index*30} day={day} index={index} mobile={mobile}/>)}
                    </div>
                </div>
                <h3>Legend:</h3>
                <div className="md-grid no-padding box">
                    <Button raised className={this.state.toggleValue === 'deadline' ? "action today" : "action"} onClick={this._toggle.bind(this, 'deadline')}><div className="event-cell deadline"></div><p>deadline</p></Button>
                    <Button raised className={this.state.toggleValue === 'webinar' ? "action today" : "action"} onClick={this._toggle.bind(this, 'webinar')}><div className="event-cell webinar"></div><p>webinar</p></Button>
                    <Button raised className={this.state.toggleValue === 'lecture' ? "action today" : "action"} onClick={this._toggle.bind(this, 'lecture')}><div className="event-cell lecture"></div><p>lecture</p></Button>
                    <Button raised className={this.state.toggleValue === 'workshop' ? "action today" : "action"} onClick={this._toggle.bind(this, 'workshop')}><div className="event-cell workshop"></div><p>workshop</p></Button>
                    <Button raised className={this.state.toggleValue === 'event' ? "action today" : "action"} onClick={this._toggle.bind(this, 'event')}><div className="event-cell event"></div><p>event</p></Button>
                </div>
                {this._snackBarShower()}
            </div>  
        )
    }
}

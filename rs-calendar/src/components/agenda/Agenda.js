import React from 'react';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Snackbar from 'react-md/lib/Snackbars';
import EventsList from '../eventsList/EventsList';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';

export default class Agenda extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],
            filtered: [],
			loaded: false,
			toasts: [{text: "events successfully loaded"}],
            value: 'All',
            from: 'All',
            to: 'All'
		}
	}
	componentDidMount() {
        if(!this.state.events.length) {
		let that = this;
		fetch('http://128.199.53.150/events')
		  .then(function(response) {
		  if(response.ok) {
		    return response.json();
		  }
		}).then(function(events){
            console.dir(events);
			that.setState({
				events,
                filtered: events,
				loaded: true
			});
		});
        }
	}

	_progressBarShower = () => {
		if(!this.state.loaded) return {opacity: 1};
		else return {opacity: 0};
	}

	_snackBarShower = () => {
		if(this.state.loaded) return <Snackbar toasts={this.state.toasts} onDismiss={this._removeToast}/>;
	}


  	_removeToast = () => {
    	const [, ...toasts] = this.state.toasts;
    	this.setState({ toasts });
  	}


    _filterByFromDate = (from) => {
        let yearCompare = from.slice(6, 10);
        let monthCompare = from.slice(3, 5);
        let dayCompare = from.slice(0, 2);

        console.log(yearCompare, monthCompare, dayCompare);
        let filtered = this.state.events.filter((event) => {
            let year = event.start.slice(0, 4);
            let month = event.start.slice(5, 7);
            let day = event.start.slice(8, 10);
            console.log(year, month, day);
            if(from === 'All') return true;
            if(year >= yearCompare && month >= monthCompare && day >= dayCompare) return true;
        });
        this.setState({filtered, from});
    }

    _filterByToDate = (to) => {
        let yearCompare = to.slice(6, 10);
        let monthCompare = to.slice(3, 5);
        let dayCompare = to.slice(0, 2);

        console.log(yearCompare, monthCompare, dayCompare);
        let filtered = this.state.events.filter((event) => {
            let year = event.start.slice(0, 4);
            let month = event.start.slice(5, 7);
            let day = event.start.slice(8, 10);
            console.log(year, month, day);
            if(to === 'All') return true;
            if(year <= yearCompare && month <= monthCompare && day <= dayCompare) return true;
        });
        this.setState({filtered, to});
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
            if(year >= yearFrom && month >= monthFrom && day >= dayFrom) return true;
        });
        //to filter
        filtered = filtered.filter((event) => {
            let year = event.start.slice(0, 4);
            let month = event.start.slice(5, 7);
            let day = event.start.slice(8, 10);
            if(this.state.to === 'All') return true;
            if(year >= yearTo && month >= monthTo && day >= dayTo) return true;
        });

        this.setState({filtered, value});
    }

	render() {
		const to = new Date();
		const from = new Date(to - 1000 * 60 * 60 * 24 * 30) ;
        const stateItems = [{name: 'All', abbreviation: 'All'},
                            {name: 'deadline', abbreviation: 'deadline'},
                            {name: 'event', abbreviation: 'event'},
                            {name: 'lecture', abbreviation: 'lecture'},
                            {name: 'webinar', abbreviation: 'webinar'},
                            {name: 'workshop', abbreviation: 'workshop'}]
		return (
			<div className="agenda-wrapper">
				<LinearProgress className="loading-bar" key="progress" id="contentLoadingProgress" style={this._progressBarShower()} />
				<div className="md-grid no-padding">
					<DatePicker
						id="local-ru-RU"
				        label="Select from date"
				        locales="ru-RU"
				        defaultValue={from}
				        className="md-cell"
                        onChange={this._filterByFromDate}
					/>
					<DatePicker
						id="local-ru-RU"
				        label="Select to date"
				        locales="ru-RU"
				        defaultValue={to}
				        className="md-cell"
                        onChange={this._filterByToDate}
					/>
                    <SelectField
                      id="statesControlled"
                      label="Select type of event"
                      placeholder="Some State"
                      menuItems={stateItems}
                      value={this.state.value}
                      onChange={this._filterByType}
                      errorText="A state is required"
                      className="md-cell"
                      itemLabel="name"
                      itemValue="abbreviation"
                    />
                </div>
                    <Button className="md-cell--right" flat label="Filter" onClick={this._filter}/>
				<div>
					<EventsList events={this.state.filtered}/>
				</div>
				{this._snackBarShower()}
			</div>
		)
	}
}

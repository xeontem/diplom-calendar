import React from 'react';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Snackbar from 'react-md/lib/Snackbars';
import EventsList from '../eventsList/eventsList';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons';
import ExpansionList from 'react-md/lib/ExpansionPanels/ExpansionList';

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
        this.setState({filtered, from});
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

        this.setState({filtered, value});
    }

	render() {
        const stateItems = [{name: 'All', abbreviation: 'All'},
                            {name: 'deadline', abbreviation: 'deadline'},
                            {name: 'event', abbreviation: 'event'},
                            {name: 'lecture', abbreviation: 'lecture'},
                            {name: 'webinar', abbreviation: 'webinar'},
                            {name: 'workshop', abbreviation: 'workshop'}]
        const mobile = typeof window.orientation !== 'undefined';
		return (
			<div className="agenda-wrapper">
				<LinearProgress className="loading-bar" key="progress" id="contentLoadingProgress" style={this._progressBarShower()} />
				<div className="md-grid no-padding">	
					<DatePicker
						id="local-ru-RU"
				        label="Select from date"
				        locales="ru-RU"
				        defaultValue={this.state.from}
				        className="md-cell"
                        onChange={this._filterByFromDate}
					/>
					<DatePicker
						id="local-ru-RU"
				        label="Select to date"
				        locales="ru-RU"
				        defaultValue={this.state.to}
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
				<div>
					<ExpansionList style={{ padding: 16 }}>
                        { this.state.filtered.map((event) => (<EventsList key={event.id} mobile={mobile} event={event}/>)) }
                    </ExpansionList>
				</div>
				{this._snackBarShower()}
			</div>	
		)
	}
}

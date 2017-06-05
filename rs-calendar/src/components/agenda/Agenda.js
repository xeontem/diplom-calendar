import React from 'react';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Snackbar from 'react-md/lib/Snackbars';
import EventsList from '../eventsList/EventsList';

export default class Agenda extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],
			loaded: false,
			toasts: [{text: "events successfully loaded"}]
		}
	}
	componentDidMount() {
		let that = this;
		fetch('http://128.199.53.150/events')
		  .then(function(response) {
		  if(response.ok) {
		    return response.json();
		  }
		}).then(function(events){
			that.setState({
				events,
				loaded: true
			});
		});
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

	render() {
		const to = new Date();
		const from = new Date(to - 1000 * 60 * 60 * 24 * 30) ;
		return (
			<div className="agenda-wrapper">
				<LinearProgress key="progress" id="contentLoadingProgress" style={this._progressBarShower()} />
				<div className="md-grid no-padding">
					<DatePicker
						id="local-ru-RU"
				        label="Select from date"
				        locales="ru-RU"
				        defaultValue={from}
				        className="md-cell"
					/>
					<DatePicker
						id="local-ru-RU"
				        label="Select to date"
				        locales="ru-RU"
				        defaultValue={to}
				        className="md-cell"
					/>
				</div>
				<div>
					<EventsList events={this.state.events}/>
				</div>
				{this._snackBarShower()}
			</div>
		)
	}
}
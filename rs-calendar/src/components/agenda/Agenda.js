import React from 'react';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';

import EventsList from '../eventsList/EventsList';

export default class Agenda extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const to = new Date();
		const from = new Date(to - 1000 * 60 * 60 * 24 * 30) ;
		return (
			<div style={{width: '100%'}}>
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
					<EventsList events={this.props.events}/>
				</div>
			</div>
		)
	}
}
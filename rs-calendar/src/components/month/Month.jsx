import React from 'react';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import EventsList from '../eventsList/EventsList';

export default class Month extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const to = new Date();
		const from = new Date(to - 1000 * 60 * 60 * 24 * 30) ;
		return (
			<div style={{width: '100%'}}>
				<div className="md-grid no-padding">	
					<List><ListItem primaryText="Month" /></List>
				</div>	
			</div>	
		)
	}
}
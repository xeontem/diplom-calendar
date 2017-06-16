import React from 'react';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';
import Snackbar from 'react-md/lib/Snackbars';
import SelectField from 'react-md/lib/SelectFields';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Button from 'react-md/lib/Buttons';

import EventsRow from './eventsRow';
import EventsRowAdmin from './eventsRowAdmin';
import globalScope from '../../globalScope';
import { _filterByFromDate, _filterByToDate, _filterByType } from '../../instruments/filters';
import { _loadEvents } from '../../instruments/fetching';

export default class Agenda extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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
        _loadEvents.apply(this);
	}

  	_removeToast = () => {
    	const [, ...toasts] = this.state.toasts;
    	this.setState({ toasts });
  	}

	render() {
        let mobile = typeof window.orientation !== 'undefined';
		return (
			<div className="agenda-wrapper">
                {globalScope.isAdmin ? <Button
                    tooltipPosition="top"
                    tooltipLabel="add event"
                    onClick={this._rerender}
                    floating
                    secondary
                    fixed>add
                </Button> : null}
				{this.state.fetching && <LinearProgress className="loading-bar" key="progress" id="contentLoadingProgress" style={mobile ? {top: 40} : {top: 47}}/>}
                {!this.state.fetching && <Snackbar toasts={this.state.toasts} onDismiss={this._removeToast}/>}
				<div className="md-grid no-padding">	
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
                        itemLabel="name"
                        itemValue="abbreviation"
                    />
                </div>  
				<div>
					<DataTable plain onClick={this._showInfo}>
				        <TableHeader>
				            <TableRow>
    				            <TableColumn>type</TableColumn>
                                <TableColumn>title</TableColumn>
    				            <TableColumn>description</TableColumn>
    				            <TableColumn>location</TableColumn>
				            </TableRow>
				        </TableHeader>
				        <TableBody>
				          { globalScope.isAdmin ?
                                this.state.filtered.map((event) => (<EventsRowAdmin key={event.id} mobile={mobile} event={event} eventTypes={this.state.eventTypes}/>)) :
                                this.state.filtered.map((event) => (<EventsRow key={event.id} mobile={mobile} event={event}/>))}
				        </TableBody>
				    </DataTable>
				</div>
			</div>	
		)
	}
}
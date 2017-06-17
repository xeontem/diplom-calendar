import React from 'react';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Toolbar from 'react-md/lib/Toolbars';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons/Button';

import Card from '../eventCard/Card';
import { _loadSpeakers } from '../../instruments/fetching';

export default class EventsRow extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
	        speakers: [{name: "Please wait", src: ""}],
	      	start: false,
	      	visible: false,
	      	pageX: null,
	      	pageY: null
	    };
	    this._loadSpeakers = _loadSpeakers.bind(this);
	}

	_openDialog = (e, pressed) => {
	        let { pageX, pageY } = e;
	        if (e.changedTouches) {
	        	const [touch] = e.changedTouches;
	        	pageX = touch.pageX;
	        	pageY = touch.pageY;
	        }
	    this.setState({ visible: true, pageX, pageY });
	}

	_closeDialog = () => {
	    this.setState({ visible: false });
	}

	render() {
		return (
			<TableRow onClick={this._openDialog} className="pointer">
			<Dialog
	            id="fullPageExample"
	            visible={this.state.visible}
	            pageX={this.state.pageX}
	            pageY={this.state.pageY}
	            onHide={this._closeDialog}
	            fullPage
	            aria-label="New Event">
	            <Toolbar
		            	className={this.props.event.type}
		            	colored
		            	nav={<Button icon onClick={this._closeDialog}>close</Button>}
		            	actions={<Button flat label="OK" onClick={this._closeDialog} />}
		            	title={`${this.props.event.type.toUpperCase()}: ${this.props.event.title.toUpperCase()}`}
		           		fixed/>
	          <Card event={this.props.event} speakers={this.state.speakers} mobile={this.props.mobile}/>
	        </Dialog>
		        <TableColumn>{this.props.event.type.toUpperCase()}</TableColumn>
		        <TableColumn>{this.props.event.title.toUpperCase()}</TableColumn>
		        <TableColumn>{this.props.event.description.slice(0, 45)+'...'}</TableColumn>
		        <TableColumn>{this.props.event.location}</TableColumn>
	        </TableRow>
		)
	}
}

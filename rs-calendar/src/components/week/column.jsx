import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import Toolbar from 'react-md/lib/Toolbars';
import TableColumn from 'react-md/lib/DataTables/TableColumn';

import Card from '../eventCard/Card';

export default class Column extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			speakers: [
	        	{name: "Please wait",
	         	 src: ""}],
			visible: false,
            pageX: null,
            pageY: null,
            notLoaded: true
		}
	}

	_loadSpeakers() {
	    if(this.state.notLoaded){
	      let urls = [];
	      this.props.day.event.speakers.map(id => urls.push('https://damp-earth-84904.herokuapp.com/trainers/' + id));
	      Promise.all(urls.map(url => fetch(url)))
	        .then(resp => Promise.all( resp.map(r => r.json()) ))
	        .then(speakers => {
	        	let notLoaded = false;
	            this.setState({speakers, notLoaded})
	        });
	    }
	}
	_openDialog = (e, pressed, speakers) => {
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
		let	startHours = new Date(this.props.event.start).getHours();
		let	startMins = new Date(this.props.event.start).getMinutes();
		let	marginTop = 24 + 55 * startHours;
			marginTop += startMins * 0.9;
		let	endHours = new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).getHours();
		let	endMins = new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).getMinutes();
		let startDate = new Date(this.props.event.start).getDate();
		let endDate = new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).getDate();
		let	marginBottom = 28 + (23 - endHours) * 55;
			marginBottom -= endMins * 0.9;
			if(startDate !== endDate) marginBottom = -20;
		return (
			<div style={{marginTop, marginBottom}} className={this.props.day.event ? `${this.props.day.event.type} event-column-week` : 'event-column-week'} onClick={this._openDialog}>
				<Dialog 
					id={`calendarEvent${this.props.index}`}
	                visible={this.state.visible}
	       			pageX={this.state.pageX}
	                pageY={this.state.pageY}
	                onHide={this._closeDialog}
	                fullPage
	                aria-label="New Event">
			            <Toolbar
			               className={this.props.day.event.type}
			               colored
			               nav={<Button icon onClick={this._closeDialog}>close</Button>}
			               actions={<Button flat label="OK" onClick={this._closeDialog} />}
			               title={`${this.props.day.event.type.toUpperCase()}: ${this.props.day.event.title.toUpperCase()}`}
			               fixed
			            />
			            {this._loadSpeakers()}
	                	<Card event={this.props.day.event} speakers={this.state.speakers} mobile={this.props.mobile}/>
	            </Dialog>
            </div>					
		)
	}
}

import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import Toolbar from 'react-md/lib/Toolbars';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';

import CardAdmin from '../eventCard/CardAdmin';
import { _loadSpeakers } from '../../instruments/fetching';
import { tempEventGet, tempEventSet, eventBackupGet, eventBackupSet, speakersBackupGet, speakersBackupSet, speakersTempGet, speakersTempSet } from '../eventsBackup';

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
		}
		this._loadSpeakers = _loadSpeakers.bind(this);
		this._loadSpeakers();
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

    _closeDiscard = () => {
    	this.props.event = eventBackupGet();
    	tempEventSet(eventBackupGet());
    	// let speakers = speakersBackupGet();
        
        this.setState({ visible: false, promptVisibility: !this.state.promptVisibility/*, speakers */});
    	// console.log('this.props.event');
        // console.dir(this.props.event);
    }

    _closeSave = () => {
    	let speakers = speakersTempGet();
        this.setState({ visible: false, speakers, promptVisibility: !this.state.promptVisibility});
        // console.dir(this.props.event);
    }


    _changeType = (type) => {
    	let tempEvent = tempEventGet();
    	tempEvent.type = type;
    	tempEventSet(tempEvent);
    	this.setState({type});
    }

    _changeTitle = (title) => {
    	let tempEvent = tempEventGet();
    	tempEvent.title = title;
    	tempEventSet(tempEvent);
    	this.setState({title});
    }
    
    _togglePropmpt = () => {
    	this.setState({ promptVisibility: !this.state.promptVisibility });
    }

	render() {
		let startHours;
		let startMins;
		let marginTop = 0;
		let endHours;
		let endMins;
		let height = 0;
		if(this.props.event) {
			startHours = new Date(this.props.event.start).toString().slice(16, 18);
			startMins = new Date(this.props.event.start).toString().slice(19, 21);
			marginTop = 24 + 55 * startHours;
			marginTop += startMins * 0.9;
			endHours = new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).toString().slice(16, 18);
			endMins = new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).toString().slice(19, 21);
			let startDate = this.props.event.start.slice(9, 10);
			let endDate = new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).toString().slice(9, 10);
			height = (endHours - startHours) * 55;
			height -= startMins * 0.9;
			height += endMins * 0.9;
			if(startDate !== endDate) height = 1340;
		}
		let actions = [<Button flat label="Cancel" onClick={this._closeDiscard} />, <Button flat label="Save" onClick={this._closeSave} />];
		let dialog = null;
		if(this.props.mobile) {
			actions = [<Button flat label="Back" onClick={this._togglePropmpt} />];
			dialog = <Dialog
			          id="promptaction"
			          visible={this.state.promptVisibility}
			          title="Save changes?"
			          aria-labelledby="promptdescription"
			          modal
			          actions={[{
			            onClick: this._closeSave,
			            primary: true,
			            label: 'Save',
			          }, {
			            onClick: this._closeDiscard,
			            primary: false,
			            label: 'Discard',
			          }]}
			        >
			          <p id="promptdescription" className="md-color--secondary-text">
			            Save changes?
			          </p>
			        </Dialog>;
    	}
		return (
			<div style={{marginTop, height}} className={`${this.props.event.type} event-column-day`} onClick={this._openDialog}>
				<Dialog 
						id={`calendarEvent${this.props.index}`}
		                visible={this.state.visible}
		       			pageX={this.state.pageX}
		                pageY={this.state.pageY}
		                onHide={this._closeDialog}
		                fullPage
		                aria-label="New Event">
				            <Toolbar
				               className={`md-cell--right ${this.props.event.type}`}
				               colored
				               actions={actions}
				               fixed
				            >
				            <div className="container">
				            {this.props.mobile ? null : <p className="name-field">Type:</p>}
					            <SelectField
					            	className="title-selector"
								    key="titleMenu"
								    id={`titleItem${this.props.index}`}
								    value={this.props.event.type}
								    onChange={this._changeType}
								    menuItems={this.props.eventTypes}
								/>
							{this.props.mobile ? null : <p className="name-field">Title:</p>}
								<TextField
									style={{fontSize: 20}}
								    className="md-cell md-cell--bottom text-title"
							        id="singleRightTitle"
								    value={this.props.event.title}
								    onChange={this._changeTitle}
								    size={8}
								    customSize="title"
								    lineDirection="right"
							      />
							</div>     
							</Toolbar>	
							{dialog}
			                <CardAdmin event={this.props.event} speakers={this.state.speakers} speakersReady={this.state.speakersReady} mobile={this.props.mobile}/> 
		            </Dialog>
            </div>					
		)
	}
}

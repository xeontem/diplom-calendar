import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import Toolbar from 'react-md/lib/Toolbars';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';


import CardAdmin from '../eventCard/CardAdmin';
import globalScope from '../../globalScope';
import { _loadSpeakers } from '../../instruments/fetching';
import { tempEventGet, tempEventSet, eventBackupGet, eventBackupSet, speakersBackupGet, speakersBackupSet, speakersTempGet, speakersTempSet } from '../../instruments/eventsBackup';

export default class Column extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			event: this.props.event, 
			type: this.props.event.type,
			title: this.props.event.title,
			speakers: [{name: "Please wait"}],
			visible: false,
            pageX: null,
            pageY: null,
            speakersReady: false,
            promptVisibility: false
		}
		_loadSpeakers.call(this, this.props.event.speakers);
	}

	_openDialog = (e, pressed) => {
		// console.log('this.props.event');
		// console.dir(this.props.event);
        let { pageX, pageY } = e;
        if (e.changedTouches) {
            const [touch] = e.changedTouches;
            pageX = touch.pageX;
            pageY = touch.pageY;
        }
        this.setState({ visible: true, pageX, pageY });
    }

    _closeDiscard = () => {

	    let filtered = this.props.month.state.filtered.slice(0, eventBackupGet().eventIndex);
	    filtered.push(eventBackupGet());
	    filtered = filtered.concat(this.props.month.state.filtered.slice(eventBackupGet().eventIndex+1));
	    let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
  		
  		// // clear backup container
  		// let tempEvent = {};
  		// let eventBackup = {};
  		// let speakersBackup = {};
  		// let speakersTemp = {};
	   //  tempEventSet(tempEvent);
  		// eventBackupSet(eventBackup);
  		// speakersBackupSet(speakersBackup);
  		// speakersTempSet(speakersTemp);

        this.setState({ visible: false, promptVisibility: !this.state.promptVisibility, speakers: speakersBackupGet()});
	    this.props.month.setState({appliedEventsMonth, filtered});
    }

    _closeSave = () => {

    	let filtered = this.props.month.state.filtered.slice(0, tempEventGet().eventIndex);
	    filtered.push(tempEventGet());
	    filtered = filtered.concat(this.props.month.state.filtered.slice(tempEventGet().eventIndex+1));
	    let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
	    
	   //  // clear backup container
  		// let tempEvent = {};
  		// let eventBackup = {};
  		// let speakersBackup = {};
  		// let speakersTemp = {};
	   //  tempEventSet(tempEvent);
  		// eventBackupSet(eventBackup);
  		// speakersBackupSet(speakersBackup);
  		// speakersTempSet(speakersTemp);

  		this.setState({ visible: false, promptVisibility: !this.state.promptVisibility, speakers: speakersTempGet()});
	    this.props.month.setState({appliedEventsMonth, filtered});

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
			<Button 
				className={ `${this.props.day.event.type} table-cell ${this.props.day.today ? 'today' : this.props.day.isCurrentMonth ? null : 'disabled-cell'}`}
				onClick={this._openDialog}
				draggable="true"
				floating>
					
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
				            {!this.props.mobile && <p className="name-field">Type:</p>}
					            <SelectField
					            	className="title-selector"
								    key="titleMenu"
								    id={`titleItem${this.props.index}`}
								    value={this.props.event.type}
								    onChange={this._changeType}
								    menuItems={this.props.eventTypes}
								/>
							{!this.props.mobile && <p className="name-field">Title:</p>}
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
			                <CardAdmin eventIndex={this.props.eventIndex} event={this.props.event} speakers={this.state.speakers} speakersReady={this.state.speakersReady} mobile={this.props.mobile}/> 
		            </Dialog>
                    <p className="day-number">{this.props.day.dayNumber}</p>
                    {this.props.event && this.props.day.today && <div className={`event-cell ${this.props.event.type}`}></div>}
            </Button>
		)
	}
}

import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Avatar from 'react-md/lib/Avatars';
import ExpansionPanel from 'react-md/lib/ExpansionPanels';
import Chip from 'react-md/lib/Chips';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons/Button';
import Toolbar from 'react-md/lib/Toolbars';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';

import CardAdmin from '../eventCard/CardAdmin';
import { _loadSpeakers, sendToBackend } from '../../instruments/fetching';
import { tempEventGet, tempEventSet, eventBackupGet, eventBackupSet, speakersBackupGet, speakersBackupSet, speakersTempGet, speakersTempSet } from '../../instruments/eventsBackup';

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

    _closeDiscard = () => {
        let filtered = this.props.table.state.filtered.slice(0, eventBackupGet().eventIndex);
        filtered.push(eventBackupGet());
        filtered = filtered.concat(this.props.table.state.filtered.slice(eventBackupGet().eventIndex+1));
        this.setState({ visible: false, promptVisibility: !this.state.promptVisibility, speakers: speakersBackupGet()});
        this.props.table.setState({filtered});
    }

    _closeSave = () => {
        let filtered = this.props.table.state.filtered.slice(0, tempEventGet().eventIndex);
        filtered.push(tempEventGet());
        filtered = filtered.concat(this.props.table.state.filtered.slice(tempEventGet().eventIndex+1));
        this.setState({ visible: false, promptVisibility: !this.state.promptVisibility, speakers: speakersTempGet()});
        this.props.table.setState({filtered});
        sendToBackend(tempEventGet());
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
		let actions = [<Button flat children="Cancel" onClick={this._closeDiscard} />, <Button flat children="Save" onClick={this._closeSave} />];
        let dialog = null;
        if(this.props.mobile) {
            actions = [<Button flat children="Back" onClick={this._togglePropmpt} />];
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
			<TableRow onClick={this._openDialog} className="pointer">
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
                    <CardAdmin event={this.props.event} eventIndex={this.props.eventIndex} speakers={this.state.speakers} speakersReady={this.state.speakersReady} mobile={this.props.mobile}/> 
            </Dialog>
		        <TableColumn>{this.props.event.type.toUpperCase()}</TableColumn>
		        <TableColumn>{this.props.event.title.toUpperCase()}</TableColumn>
		        <TableColumn>{this.props.event.description.slice(0, 45)+'...'}</TableColumn>
		        <TableColumn>{this.props.event.location}</TableColumn>
	        </TableRow>
		)
	}
}

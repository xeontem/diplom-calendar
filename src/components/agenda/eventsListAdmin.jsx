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

import CardAdmin from '../eventCard/CardAdmin';
import { _loadSpeakers, sendToBackend } from '../../instruments/fetching';
import { tempEventGet, tempEventSet, eventBackupGet, speakersBackupGet, speakersTempGet } from '../../instruments/eventsBackup';

export default class EventsList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      speakers: [{name: "Please wait", src: ""}],
      start: false,
      visible: false,
      pageX: null,
      pageY: null
    };
    this._loadSpeakers = _loadSpeakers.bind(this, this.props.event.speakers);
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

  _deleteEvent = () => {
    let filtered = this.props.agenda.state.filtered.slice(0, this.props.eventIndex);
    filtered = filtered.concat(this.props.agenda.state.filtered.slice(this.props.eventIndex+1));
    this.setState({ visible: false, promptVisibility: !this.state.promptVisibility, speakers: speakersTempGet()});
    this.props.agenda.setState({filtered});
    let deleteInfo = {delete: true, id: this.props.event.id };
    sendToBackend(deleteInfo);
  }

  _closeDiscard = () => {
    let filtered = this.props.agenda.state.filtered.slice(0, eventBackupGet().eventIndex);
    filtered.push(eventBackupGet());
    filtered = filtered.concat(this.props.agenda.state.filtered.slice(eventBackupGet().eventIndex+1));
    this.setState({ visible: false, promptVisibility: !this.state.promptVisibility, speakers: speakersBackupGet()});
    this.props.agenda.setState({filtered});
  }

  _closeSave = () => {
    let filtered = this.props.agenda.state.filtered.slice(0, tempEventGet().eventIndex);
    filtered.push(tempEventGet());
    filtered = filtered.concat(this.props.agenda.state.filtered.slice(tempEventGet().eventIndex+1));
    this.setState({ visible: false, promptVisibility: !this.state.promptVisibility, speakers: speakersTempGet()});
    this.props.agenda.setState({filtered});
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
    const { columnWidths, mobile } = this.props;

    let secLabel;
    if(mobile) secLabel = `Starts: ${new Date(this.props.event.start).toString().slice(4, 24)}`;
    else secLabel = `Starts: ${new Date(this.props.event.start).toString().slice(4, 24)} Ends: ${new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).toString().slice(4, 24)}`
    return (
      <div>
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
          <CardAdmin event={this.props.event} eventIndex={this.props.eventIndex} speakers={this.state.speakers} speakersReady={this.state.speakersReady} mobile={this.props.mobile}/>
      </Dialog>
      <ExpansionPanel
        expandIconChildren={!mobile && 'keyboard_arrow_down'}
        label={`${this.props.event.type.toUpperCase()}: ${this.props.event.title.toUpperCase()}`}
        secondaryLabel={secLabel}
        headerClassName={this.props.event.type}
        columnWidths={columnWidths}
        contentClassName="md-grid"
        cancelLabel="Delete"
        saveLabel="Edit"
        onSave={this._openDialog}
        onCancel={this._deleteEvent}
        onExpandToggle={this._loadSpeakers}
        closeOnSave={false}>
        <CSSTransitionGroup
            component="section"
            className="md-cell md-cell--7"
            transitionName="opacity"
            transitionEnterTimeout={1000}
            transitionLeave={false}>
            <h5 className="md-subheading-1">Description:</h5>
            <p className="md-body-1" key='0'>{this.props.event.description}</p>
            {this.state.speakers.map((speaker, i) => (
              <Chip
                className="chip"
                key={i}
                label={speaker.name}
                avatar={<Avatar src={speaker.avatar} alt="Avat" role="presentation" random />}/>
            ))}
        </CSSTransitionGroup>
      </ExpansionPanel>
    </div>
    );
  }
}


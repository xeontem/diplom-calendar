import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import Toolbar from 'react-md/lib/Toolbars';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import Card from 'react-md/lib/Cards/Card';
import Divider from 'react-md/lib/Dividers';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import TimePicker from 'react-md/lib/Pickers/TimePickerContainer';
import Media, { MediaOverlay } from 'react-md/lib/Media';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Avatar from 'react-md/lib/Avatars';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { ExpansionList, ExpansionPanel } from 'react-md/lib/ExpansionPanels';
import { tempEventGet, tempEventSet } from '../../instruments/eventsBackup';

import { _loadEvents } from '../../instruments/fetching';
import { EVENT_TYPES } from '../../instruments/constants';
import deleteAvatar from '../eventCard/delete.png';

let uriAPI = 'https://www.google.com/maps/embed/v1/search?key=AIzaSyDeGEZBSlUTpIxfJYlcw5gZNvQ532UCml4&q=';
let defaultLocation = '';

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


export default class Empty extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    type: EVENT_TYPES[1],
    title: '',
    description: 'description...',
    duration: 1000*60*60,
    id: getRandomArbitrary(0.1, 0.9)*1000000000000000000,
    location: 'location...',
    resources: [{type: ''}],
    speakers: [],
    speakersReadyArr: [],
    start: new Date(),
    avatars: [],
    end: new Date(),
    showingLocation: defaultLocation,
    avalSpeakers: [],
    visible: false,
      pageX: null,
      pageY: null,
      speakersReady: false,
      promptVisibility: false
  }

  this._closeSave = this.props._closeSave.bind(this);


  }

  _openDialog = (e, pressed) => {
    let { pageX, pageY } = e;
    if (e.changedTouches) {
      const [touch] = e.changedTouches;
      pageX = touch.pageX;
      pageY = touch.pageY;
    }
    this.setState({
    type: EVENT_TYPES[1],
    title: '',
    description: 'description...',
    duration: 1000*60*60,
    id: getRandomArbitrary(0.1, 0.9)*1000000000000000000,
    location: 'location...',
    resources: [{type: ''}],
    speakers: [],
    speakersReadyArr: [],
    start: new Date(),
    avatars: [],
    end: new Date(),
    showingLocation: defaultLocation,
    avalSpeakers: [],
    visible: true,
      pageX,
      pageY,
      speakersReady: false,
      promptVisibility: false
  });
  tempEventSet({type: this.state.type,
      title: this.state.title,
      description: this.state.description,
      duration: this.state.duration,
      id: this.state.id,
      location: this.state.location,
      resources: this.state.resources,
      speakers: this.state.speakers,
      start: this.state.start});
  _loadEvents.call(this, '/trainers')
    .then(avalSpeakers => {
    avalSpeakers = avalSpeakers.slice(0, 10);
    avalSpeakers = avalSpeakers.map(speaker => { return {name: speaker.name, id: speaker.id}})
    this.setState({avalSpeakers});
  });
    // this.setState({ visible: true, pageX, pageY });
  }

  _closeDiscard = () => {
    let empty = {};
    tempEventSet(empty);
    defaultLocation = '';
    this.setState({ visible: false, pageX: null, pageY: null, speakersReady: false, promptVisibility: !this.state.promptVisibility });
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

  _changeDescription = (description) => {
  let tempEvent = tempEventGet();
    tempEvent.description = description;
    tempEventSet(tempEvent);
  this.setState({description});
  }

  _changeFromDate = (date) => {
  let dateDay = date.slice(0, 2);
  let dateMonth = date.slice(3, 5)-1;
  let dateYear = date.slice(6);
  let curDate = new Date(this.state.start.valueOf());
  curDate.setDate(dateDay);
  curDate.setMonth(dateMonth);
  curDate.setFullYear(dateYear);

  let tempEvent = tempEventGet();
  tempEvent.start = new Date(curDate);
  tempEventSet(tempEvent);
  this.setState({start: curDate});
  }

  _changeFromTime = (time) => {

  let colonIndex = time.indexOf(':');
  let hours = Number(time.slice(0, colonIndex));
  let minutes = Number(time.slice(colonIndex+1));
  let curDate = new Date(this.state.start.valueOf());
  curDate.setHours(hours);
  curDate.setMinutes(minutes);

  let tempEvent = tempEventGet();
  tempEvent.start = new Date(curDate);
  tempEventSet(tempEvent);
  this.setState({start: curDate});
  }

  _changeToDate = (date) => {
  let dateDay = date.slice(0, 2);
  let dateMonth = date.slice(3, 5)-1;
  let dateYear = date.slice(6);

  let curDate = new Date(this.state.end.valueOf());
  curDate.setDate(dateDay);
  curDate.setMonth(dateMonth);
  curDate.setFullYear(dateYear);
  let duration = curDate - this.state.start;
  if(curDate < this.state.start) {
    alert('Set end Date more than start');
    return;
  }
    let end = new Date(curDate.valueOf() + duration.valueOf());

    let tempEvent = tempEventGet();
  tempEvent.duration = duration;
  tempEventSet(tempEvent);
  this.setState({end, duration});
  }

  _changeToTime = (time) => {
  let colonIndex = time.indexOf(':');
  let hours = Number(time.slice(0, colonIndex));
  let minutes = Number(time.slice(colonIndex+1));
  let curDate = new Date(this.state.end.valueOf());
  curDate.setHours(hours);
  curDate.setMinutes(minutes);
  let duration = curDate - this.state.start;
  if(curDate < this.state.start) {
    alert('Set end Date more than start');
    return;
  }
    let end = new Date(curDate.valueOf() + duration.valueOf());

    let tempEvent = tempEventGet();
  tempEvent.duration = duration;
  tempEventSet(tempEvent);
  this.setState({end, duration});
  }

  _changeLocation = (location) => {
  let tempEvent = tempEventGet();
    tempEvent.location = location;
    tempEventSet(tempEvent);
  this.setState({location});
  }

  _changeShowingLocation = (location) => {
  let tempEvent = tempEventGet();
    tempEvent.showingLocation = uriAPI + location;
    tempEventSet(tempEvent);
  this.setState({showingLocation: uriAPI + location});
  }

  _changeResources = (index, type) => {
  let tempEvent = tempEventGet();
    tempEvent.resources[index].type = type;
    tempEventSet(tempEvent);
  let resources = this.state.resources;
  resources[index].type = type;
  this.setState({resources});
  }

  _changeResourceDescription = (index, description) => {
  let tempEvent = tempEventGet();
    tempEvent.resources[index].description = description;
    tempEventSet(tempEvent);
  let resources = this.state.resources;
  resources[index].description = description;
  this.setState({resources});
  }

  _changeResourcesResource = (index, resource) => {
  let tempEvent = tempEventGet();
    tempEvent.resources[index].resource = resource;
    tempEventSet(tempEvent);
  let resources = this.state.resources;
  resources[index].resource = resource;
  this.setState({resources});
  }

  _addResource = () => {

  }

  _addSpeaker = (id) => {
  _loadEvents(`/trainers/${id}`)
    .then(speaker => {
    let speakersReadyArr = this.state.speakersReadyArr;
    let speakers = this.state.speakers;
    speakers.push(id);
    speakersReadyArr.push(speaker);
    this.setState({speakersReadyArr, speakers});
  });
  }

  _removeSpeaker =(index) => {
  // arr of id speakers
  // let event = this.state.event;
  let speakers = this.state.speakers.slice(0, index);
  speakers = speakers.concat(this.state.speakers.slice(index+1));

  // ready arr of speakers
    let speakersReadyArr = this.state.speakersReadyArr;
  speakersReadyArr = this.state.speakersReadyArr.slice(0, index);
  speakersReadyArr = speakersReadyArr.concat(this.state.speakersReadyArr.slice(index+1));
  this.setState({speakersReadyArr, speakers});
  }

  _togglePropmpt = () => {
    this.setState({ promptVisibility: !this.state.promptVisibility });
  }

  _onMouseEnter = (i) => {
  let avatars = this.state.avatars;
  avatars[i] = deleteAvatar;
  this.setState({avatars});
  }

  _onMouseLeave = (i) => {
  let avatars = this.state.avatars;
  avatars[i] = this.state.speakers[i].avatar;
  this.setState({avatars});
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
    let locationNode = <TextField
          id="_changeLocation"
          value={this.state.location}
          rows={1}
          onChange={this._changeLocation}
          style={{width: '99%'}}
        />;
  let view = { maxWidth: '70%' };
  if(this.props.mobile) view = { maxWidth: '95%' };

  return (
    <Button tooltipPosition="top" tooltipLabel="add event" onClick={this._openDialog} floating secondary fixed>
      <Dialog
      id={`calendarEvent${this.props.index}`}
          visible={this.state.visible}
        pageX={this.state.pageX}
          pageY={this.state.pageY}
          onHide={this._closeDialog}
          fullPage
          aria-label="New Event">
          <Toolbar
             className={`md-cell--right ${this.state.type}`}
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
          value={this.state.type}
          onChange={this._changeType}
          menuItems={EVENT_TYPES}
        />
        {!this.props.mobile && <p className="name-field">Title:</p>}
        <TextField
          style={{fontSize: 20}}
          className="md-cell md-cell--bottom text-title"
            id="singleRightTitle"
          value={this.state.title}
          onChange={this._changeTitle}
          size={8}
          customSize="title"
          lineDirection="right"
          />
        </div>
        </Toolbar>
        {dialog}
      <Card style={view} className="md-block-expanded md-block-centered">
    <div style={{marginLeft: 15, marginTop: 80}}>
      <div style={{display: 'flex'}}>
      <Button icon>description</Button>
      <h3 style={{padding: 10}}>Description:</h3>
      </div>
      <TextField
        id="singleMultiline"
        value={this.state.description}
        rows={1}
        maxRows={8}
        onChange={this._changeDescription}
        style={{width: '99%'}}
      />
    </div>
    <Divider/>
    <div className="md-grid">
      <DatePicker
            id="local-ru-RU0"
            className="md-cell"
            label={`${this.state.start.getDate()}.${this.state.start.getMonth() < 10 ? '0': ''}${this.state.start.getMonth()+1}.${this.state.start.getFullYear()}`}
            locales="ru-RU"
            onChange={this._changeFromDate}
            autoOk
          />
          <TimePicker
        id="appointmentPortrait"
        className="md-cell"
        label={`${this.state.start.getHours() < 10 ? '0' : ''}${this.state.start.getHours()}:${this.state.start.getMinutes() < 10 ? '0' : ''}${this.state.start.getMinutes()}`}
        displayMode="portrait"
        onChange={this._changeFromTime}
        autoOk
      />
          <DatePicker
            id="local-ru-RU1"
            label={`${this.state.end.getDate()}.${this.state.end.getMonth() < 10 ? '0' : ''}${this.state.end.getMonth()+1}.${this.state.end.getFullYear()}`}
            locales="ru-RU"
            className="md-cell"
            onChange={this._changeToDate}
            autoOk
          />
          <TimePicker
        id="appointmentPortrait"
        className="md-cell"
        label={`${this.state.end.getHours() < 10 ? '0' : ''}${this.state.end.getHours()}:${this.state.end.getMinutes() < 10 ? '0' : ''}${this.state.end.getMinutes()}`}
        displayMode="portrait"
        onChange={this._changeToTime}
        autoOk
      />
    </div>
    <Divider/>
    <Media>
      <iframe src={this.state.showingLocation} frameBorder="0" style={{border: 0}} allowFullScreen></iframe>
      <MediaOverlay>
      <CardTitle  className="location-wrapper" title="Location" subtitle={locationNode}>
        <Button className="md-cell--right" onClick={this._changeShowingLocation.bind(this, this.state.location)} icon>place</Button>
      </CardTitle>
      </MediaOverlay>
    </Media>
    <div className="md-grid">
    {this.state.speakersReadyArr.map((speaker, i) => {
      this.state.avatars.push(speaker.avatar);
      return (
      <CardTitle
      key={i}
      title="Speaker"
      subtitle={speaker.name}
      avatar={<Avatar style={{cursor: 'pointer'}}src={this.state.avatars[i]} alt="Avat" role="presentation" onMouseEnter={this._onMouseEnter.bind(this, i)} onMouseLeave={this._onMouseLeave.bind(this, i)} onClick={this._removeSpeaker.bind(this, i)} random/>}
      />
    )})}
    <SelectField
            id="statesControlled"
            label="Add speaker"
            menuItems={this.state.avalSpeakers}
            onChange={this._addSpeaker}
            errorText="A state is required"
            className="md-cell"
            itemLabel="name"
            itemValue="id"
          />
    </div>
    <ExpansionList style={{ padding: 16 }}>
      <ExpansionPanel
          label="Resourses"
          contentClassName="md-grid expander"
          closeOnSave={false}
          onSave={this._addResource}
          saveLabel="ADD"
          cancelLabel="HIDE">
          <CSSTransitionGroup
              component="section"
              transitionName="opacity"
              transitionEnterTimeout={1000}
              transitionLeave={false}>
        {this.state.resources.map((resource, i) => (
          <div key={i*365} className="md-grid" >
          <p className="resource-field">Type:</p>
          <TextField
            id={`_changeResources${i}`}
            className="md-cell md-cell--bottom text-title"
            value={resource.type}
            onChange={this._changeResources.bind(this, i)}
            size={8}
            customSize="title"
            style={{fontSize: 20}}
            />
          <TextField
            id={`_changeResourceDescription${i}`}
            value={resource.description}
            rows={1}
            maxRows={8}
            onChange={this._changeResourceDescription.bind(this, i)}
            style={{width: '99%'}}
            />
            <div className="container-resource" >
            <p className="resource-field">Link:</p>
            <TextField
              id={`_changeResourcesResource${i}`}
              className="text-title"
              value={resource.resource}
              onChange={this._changeResourcesResource.bind(this, i)}
              size={8}
              customSize="title"
            />
            <Button className="md-cell--right" flat children="Link" href={resource.resource} target="_blank"/>
          </div>
          <Divider/>
          </div>
        ))}
          </CSSTransitionGroup>
        </ExpansionPanel>
        </ExpansionList>
    <Button
      tooltipPosition="top"
      tooltipLabel="send feedback"
      href="mailto:xeontem@gmail.com"
      floating
      secondary
      fixed>mail_outline
    </Button>
    </Card>

        </Dialog>
        add
      </Button>
  )
  }
}

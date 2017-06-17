import React from 'react';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import { ExpansionList, ExpansionPanel } from 'react-md/lib/ExpansionPanels';
import Media, { MediaOverlay } from 'react-md/lib/Media';
import Avatar from 'react-md/lib/Avatars';
import Button from 'react-md/lib/Buttons';
import Divider from 'react-md/lib/Dividers';
import TextField from 'react-md/lib/TextFields';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import TimePicker from 'react-md/lib/Pickers/TimePickerContainer';
import SelectField from 'react-md/lib/SelectFields';
import { tempEventGet, tempEventSet, eventBackupGet, eventBackupSet, speakersBackupGet, speakersBackupSet, speakersTempGet, speakersTempSet } from '../eventsBackup';
import deleteAvatar from './delete.png';

let defaultLocation = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d698.4331681038012!2d27.68178244677689!3d53.92748365509798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbcebc7c83cb35%3A0xc659f43cf70964d5!2zdnVs0ZbRgWEgQWthZNC1bdGWa2EgS3VwctC1dtGWxI1hIDEvMiwgTWluc2sgMjIwMTQx!5e0!3m2!1sen!2sby!4v1496747626981';
let uriAPI = 'https://www.google.com/maps/embed/v1/search?key=AIzaSyDeGEZBSlUTpIxfJYlcw5gZNvQ532UCml4&q=';
export default class ExpandableMediaCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			avatars: [],
			description: this.props.event.description,
			start: this.props.event.start,
			end: new Date(this.props.event.start).valueOf()+this.props.event.duration,
			showingLocation: this.props.event.showingLocation || defaultLocation,
			location: this.props.event.location,
			speakers: this.props.speakers,
			avalSpeakers: [],
			resources: this.props.event.resources
		}
		console.log(this.state.showingLocation);
		this._backupData();
		// initial mutable copy of event
		let tempEvent = this.props.event;
		tempEventSet(tempEvent);

		// initial mutable copy of speakers
		let tempSpeakers = this.props.speakers;
		speakersTempSet(tempSpeakers);
	}

	_backupData = () => {
		if(this.props.speakersReady){
			// console.log('this.props.speakers');
			// console.dir(this.props.speakers);
			// backup ready arr of speakers for discard changes
			let speakersBackup = speakersBackupGet();
			for(let i = 0; i < this.props.speakers.length; i++) {
				speakersBackup[i] = {};
				for(let key in this.props.speakers[i]) {
					speakersBackup[i][key] = this.props.speakers[i][key];
				}
			}
			speakersBackupSet(speakersBackup);
			// console.log('ready speakers backupped');
			// console.dir(speakersBackupGet());
		}
		// backup event for discard changes
		let eventBackup = eventBackupGet();
			// console.log('backup this.props.event');
			// console.dir(this.props.event);
		for(let key in this.props.event) {
			if(this.props.event[key].push) {
				eventBackup[key] = [];
				for(let i = 0; i < this.props.event[key].length; i++) {
					if(Object.prototype.toString.call(this.props.event[key][i]).slice(8, -1) === "Object") {
						eventBackup[key][i] = {};
						if(!this.props.event[key][i].toUpperCase) for(let resourceKey in this.props.event[key][i]) {
							eventBackup[key][i][resourceKey] = this.props.event[key][i][resourceKey];
						}
					} else eventBackup[key][i] = this.props.event[key][i];
				}
			} else eventBackup[key] = this.props.event[key];
		}
		// store index of event in backupped event that appllied when press cancel button
		eventBackup.eventIndex = this.props.eventIndex;
		eventBackupSet(eventBackup);
		// store index of event in temp event that appllied when press save button
		let temp = {};
		temp.eventIndex = this.props.eventIndex;
		tempEventSet(temp);
		// console.log('event backupped');
		// console.dir(eventBackupGet().eventIndex);
	}

	componentWillMount() {
		let that = this;
		fetch('http://128.199.53.150/trainers')
		  .then(function(response) {
		  if(response.ok) {
		    return response.json();
		  }
		}).then(function(avalSpeakers){
			avalSpeakers = avalSpeakers.slice(0, 10);
			avalSpeakers = avalSpeakers.map(speaker => { return {name: speaker.name, id: speaker.id}})
			that.setState({avalSpeakers});
		});
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
		let curDate = this.props.event.start;
		curDate = new Date(curDate);
		curDate.setDate(dateDay);
		curDate.setMonth(dateMonth);
		curDate.setFullYear(dateYear);
		// console.log(curDate);

		let tempEvent = tempEventGet();
    	tempEvent.start = curDate;
    	tempEventSet(tempEvent);
		this.setState({start: curDate});
	}

	_changeFromTime = (time) => {
		// console.log(time);
	}

	_changeToDate = (date) => {
		// console.log(date);
	}

	_changeToTime = (time) => {
		// console.log(time);
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
		let tempEvent = tempEventGet();
    	tempEvent.speakers.push(id);
    	tempEventSet(tempEvent);

		let that = this;
		fetch(`http://128.199.53.150/trainers/${id}`)
		  .then(function(response) {
		  if(response.ok) {
		    return response.json();
		  }
		}).then(function(speaker){
			// let tempSpeakers = speakersTempGet();
			// tempSpeakers.push(speaker);
			// speakersTempSet(tempSpeakers);

			let speakers = that.state.speakers;
			speakers.push(speaker);
			that.setState({speakers});
		});
	}

	_removeSpeaker =(index) => {
		// arr of id speakers
		let tempEvent = tempEventGet();
		tempEvent.speakers = this.props.event.speakers.slice(0, index);
		tempEvent.speakers = tempEvent.speakers.concat(this.props.event.speakers.slice(index+1));
		tempEventSet(tempEvent);
		console.log('tempEventGet');
		console.dir(tempEventGet());

		let event = this.props.event;
		event.speakers = this.props.event.speakers.slice(0, index);
		event.speakers = event.speakers.concat(this.props.event.speakers.slice(index+1));
		console.log('event');
		console.dir(this.props.event);
		// ready arr ofspeakers
		let tempSpeakers = speakersTempGet();
    	tempSpeakers = this.state.speakers.slice(0, index);
    	tempSpeakers = tempSpeakers.concat(this.state.speakers.slice(index+1));
    	speakersTempSet(tempSpeakers);
    	console.log('speakersTempSet(tempSpeakers);');
		console.dir(speakersTempGet());
		
    	let speakers = this.state.speakers;
		speakers = this.state.speakers.slice(0, index);
		speakers = speakers.concat(this.state.speakers.slice(index+1));
		this.setState({speakers});
		console.log('this.setState({speakers});');
		console.dir(this.state.speakers);
	}

	_showTempEvent = () => {
		// console.dir(eventBackupGet());
		// console.dir(this.props.event);
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
                        id="local-ru-RU"
                        className="md-cell"
                        label={`${new Date(this.state.start).getDate()}.${new Date(this.state.start).getMonth() > 9 ? null : '0'}${new Date(this.state.start).getMonth()+1}.${new Date(this.state.start).getFullYear()}`}
                        locales="ru-RU"
                        onChange={this._changeFromDate}
                        autoOk
                    />
                    <TimePicker
				      id="appointmentPortrait"
				      className="md-cell"
				      label={`${new Date(this.state.start).getHours()}:${new Date(this.state.start).getMinutes()}`}
				      displayMode="portrait"
				      onChange={this._changeFromTime}
				      autoOk
				    />
                    <DatePicker
                        id="local-ru-RU"
                        label={`${new Date(this.state.end).getDate()}.${new Date(this.state.end).getMonth() > 9 ? null : '0'}${new Date(this.state.end).getMonth()+1}.${new Date(this.state.end).getFullYear()}`}
                        locales="ru-RU"
                        className="md-cell"
                        onChange={this._changeToDate}
                        autoOk
                    />
                    <TimePicker
				      id="appointmentPortrait"
				      className="md-cell"
				      label={`${new Date(this.state.end).getHours()}:${new Date(this.state.end).getMinutes()}`}
				      displayMode="portrait"
				      onChange={this._changeToTime}
				    />
				</div>
				<Divider/>
				<Media>
					<iframe src={this.state.showingLocation} frameBorder="0" style={{border: 0}} allowFullScreen></iframe>
					<MediaOverlay>
						<CardTitle	className="location-wrapper" title="Location" subtitle={locationNode}>
							<Button className="md-cell--right" onClick={this._changeShowingLocation.bind(this, this.state.location)} icon>place</Button>
						</CardTitle>
					</MediaOverlay>
				</Media>
				<div className="md-grid">
				{this.state.speakers.map((speaker, i) => {
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
											<Button className="md-cell--right" flat label="Link" href={resource.resource} target="_blank"/>
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
					onClick={this._showTempEvent}
					floating
					secondary
					fixed>mail_outline
				</Button>
			</Card>
	)}
}
					// href="mailto:xeontem@gmail.com"

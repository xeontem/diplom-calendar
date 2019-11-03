import React from 'react';
import Card from 'react-md/lib/Cards/Card';
import CardTitle from 'react-md/lib/Cards/CardTitle';
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
import { YOUTUBE_DOMAIN, GMAPS_API } from '../../instruments/constants';
import deleteAvatar from './delete.png';

export default class ExpandableMediaCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      speakerToRemove: null,
    };
  }

  setSpeakerToRemove = speakerToRemove => () => {
    this.setState({ speakerToRemove });
  }

  changeDate = date => {
    const oldDate = new Date(this.props.event.start);
    const newDate = new Date(date);
    newDate.setHours(oldDate.getHours());
    newDate.setMinutes(oldDate.getMinutes());
    this.props.changeEventProp('start')(newDate.getTime());
  }

  changeTime = time => {
    const ampm = time.slice(-2);
    const timeValues = time.slice(0, -3);
    const [newHours, newMinutes] = timeValues.split(':');
    const newDate = new Date(this.props.event.start);
    const AMPMHours = ampm === 'PM' ? (+newHours + 12) : newHours;
    newDate.setHours(AMPMHours);
    newDate.setMinutes(newMinutes);
    this.props.changeEventProp('start')(newDate.getTime());
  }

  getDateLabel = date =>
    `${date.getDate()}.${date.getMonth() < 10 ? '0': ''}${date.getMonth()+1}.${date.getFullYear()}`

  getTimeLabel = date =>
    `${date.getHours() < 10 ? '0' : ''}${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`

  render() {
    return (
      <Card style={{ maxWidth: this.props.mobile ? '95%' : '70%' }} className="md-block-expanded md-block-centered">
        <div style={{marginLeft: 15, marginTop: 80}}>
          <div style={{display: 'flex'}}>
            <Button icon>description</Button>
            <h3 style={{padding: 10}}>Description:</h3>
          </div>
          <TextField
            id="description-input"
            value={this.props.event.description}
            rows={1}
            onChange={this.props.changeEventProp('description')}
            style={{width: '99%'}}
          />
        </div>
        <Divider/>
          <div className="md-grid">
          <DatePicker
            id="start-date-picker"
            className="md-cell"
            label={this.getDateLabel(new Date(this.props.event.start))}
            locales="en-EN"
            onChange={this.changeDate}
            autoOk
          />
          <TimePicker
            id="start-time-picker"
            className="md-cell"
            label={this.getTimeLabel(new Date(this.props.event.start))}
            displayMode="portrait"
            onChange={this.changeTime}
            autoOk
          />
        </div>
        {/* TODO: add duration range here */}
        <Divider/>
        <Media className="iframe-wrapper">
          <iframe
            className="move-on-top"
            src={YOUTUBE_DOMAIN + this.props.event.videoId}
            frameBorder="0"
            style={{border: 0}}
            allowFullScreen
          ></iframe>
          <MediaOverlay>
            <CardTitle
              title="Video ID for the lesson:"
              subtitle={
                <TextField
                  id="video-id-input"
                  value={this.props.event.videoId}
                  placeholder="insert video id here"
                  rows={1}
                  onChange={this.props.changeEventProp('videoId')}
                />
              }
            />
          </MediaOverlay>
        </Media>
        <Media className="iframe-wrapper">
          <iframe
            className="move-on-top"
            src={GMAPS_API + this.props.event.location}
            frameBorder="0"
            style={{border: 0}}
            allowFullScreen
          ></iframe>
          <MediaOverlay>
            <CardTitle
              className="location-wrapper"
              title="Location"
              subtitle={
                <TextField
                  id="location-input"
                  defaultValue={this.props.event.location}
                  rows={1}
                  onChange={this.props.changeEventProp('location')}
                />
              }
            />
          </MediaOverlay>
        </Media>
        <div className="md-grid">
          {this.props.event.speakers.map((speaker, i) => (
            <CardTitle
              className="speaker-card"
              key={`${speaker.name}_${i}`}
              title={this.props.speakers[i].name}
              subtitle={speaker.name}
              avatar={
                <Avatar
                  style={{cursor: 'pointer'}}
                  src={this.state.speakerToRemove === i ?
                    deleteAvatar : this.props.speakers[i].avatar}
                  alt="speaker avatar"
                  role="presentation"
                  onClick={this.props.deleteSpeaker(i)}
                  onMouseEnter={this.setSpeakerToRemove(i)}
                  onMouseLeave={this.setSpeakerToRemove(null)}
                />
              }
            />
          ))}
          <SelectField
            id="select-speaker"
            label="Add speaker"
            menuItems={this.props.avalSpeakers}
            onChange={this.props.addSpeaker}
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
            onSave={this.props.addNewResource}
            saveLabel="ADD"
            cancelLabel="HIDE"
          >
            <CSSTransitionGroup
              component="section"
              transitionName="opacity"
              transitionEnterTimeout={1000}
              transitionLeave={false}
            >
              {this.props.event.resources.map((resource, i) => (
                <div key={resource.resource} className="md-grid" >
                  <p className="resource-field">Type:</p>
                  <TextField
                    id={`resource-type-input-${i}`}
                    className="md-cell md-cell--bottom text-title"
                    value={resource.type}
                    onChange={this.props.changeResource('type', i)}
                    size={8}
                    customSize="title"
                    style={{fontSize: 20}}
                  />
                  <TextField
                    id={`resource-description-input-${i}`}
                    value={resource.description}
                    rows={1}
                    onChange={this.props.changeResource('description', i)}
                    style={{width: '99%'}}
                  />
                  <div className="container-resource" >
                    <TextField
                      id={`_changeResourcesResource${i}`}
                      className="text-title"
                      value={resource.resource}
                      onChange={this.props.changeResource('resource', i)}
                      size={8}
                      customSize="title"
                    />
                    <Button
                      className="md-cell--right"
                      flat
                      children="Delete"
                      onClick={this.props.deleteResource(i)}
                    />
                  </div>
                  <Divider/>
                </div>
              ))}
            </CSSTransitionGroup>
          </ExpansionPanel>
        </ExpansionList>
      </Card>
    );
  }
}

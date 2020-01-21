import React from 'react';
import { Toolbar, Button, DialogContainer, SelectField, TextField } from 'react-md';

import Card from '../event-card/acard';
import CardAdmin from '../event-card/acard-admin';
import { EventSelector } from '../event-type-selector/selector';

import { _loadSpeakers, apiCallForHerokuDB } from '../../instruments/fetching';
import { LECTURES_TYPES, EVENT_TYPES, DEFAULT_AVATAR } from '../../instruments/constants';
import { getEmptyEvent } from '../../instruments/utils';
import { updateEvent, createNewEvent } from '../../services/firebase.service';

const mapSpeaker = () => ({
  name: 'loading speaker...',
  avatar: DEFAULT_AVATAR,
  id: null
})

export class DialogPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avalSpeakers: [],
      promptVisibility: false,
      speakers: props.event ?
        props.event.speakers.map(mapSpeaker) : null,
      isSpeakersLoading: false,
      newEvent: getEmptyEvent()
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.event && !this.props.event) {
      this.setState({
        speakers: null,
        newEvent: getEmptyEvent(),
      });
    } else if (
      (!prevProps.event && this.props.event) ||
      (this.props.event &&
      (this.props.event.speakers.length !== prevProps.event.speakers.length ||
      !this.props.event.speakers.every(id => prevProps.event.speakers.includes(id))))
    ) {
      this.setState({
        newEvent: this.props.event,
        speakers: this.props.event.speakers.map(mapSpeaker),
        isSpeakersLoading: true
      });

      _loadSpeakers(this.props.event.speakers).then(speakers => {
        this.setState({ speakers, isSpeakersLoading: false });
      });

      if (!this.state.avalSpeakers.length) {
        apiCallForHerokuDB.call(this, '/trainers').then(avalSpeakers => {
          this.setState({ avalSpeakers: avalSpeakers.slice(0, 10) });
        });
      }
    }
  }

  _closeDiscard = () => {
    this.props.closeDialog();
    this.setState({ promptVisibility: false });
  }

  _closeSave = () => {
    this.props.closeDialog();
    this.setState({ promptVisibility: false });

    if (this.state.newEvent.id) {
      updateEvent(this.state.newEvent);
    } else {
      createNewEvent(this.state.newEvent);
    }
  }


  changeEventProp = prop => value => {
    this.setState({ newEvent: { ...this.state.newEvent, [prop]: value } });
  }

  deleteSpeaker = index => (e) => {
    this.changeEventProp('speakers')(this.state.newEvent.speakers
      .filter((_, i) => i !== index));
    this.setState({ speakers: this.state.speakers.filter((_, i) => i !== index) });
  }

  addSpeaker = id => {
    const newSpeaker = this.state.avalSpeakers.find(s => s.id === id);
    this.changeEventProp('speakers')([
      ...this.state.newEvent.speakers,
      newSpeaker.id
    ]);
    this.setState({ speakers: [...this.state.speakers, newSpeaker] });
  }

  _togglePropmpt = () => {
    this.setState({ promptVisibility: !this.state.promptVisibility });
  }

  getActionButtons() {
    return (this.props.isAdmin
      ? this.props.isMobile
        ? [{ title: 'Back', handler: this._togglePropmpt }]
        : [{ title: 'Cancel', handler: this._closeDiscard }, { title: 'Save', handler: this._closeSave }]
      : [{ title: 'OK', handler: this.props.closeDialog }])
      .map(btnData =>
        <Button flat children={btnData.title} onClick={btnData.handler} />);
  }

  addNewResource = () => {
    this.changeEventProp('resources')([
      ...this.state.newEvent.resources,
      { type: '', resource: '', description: '' }
    ]);
  }

  changeResource = (prop, index) => value => {
    this.changeEventProp('resources')(this.state.newEvent.resources
      .map((resource, i) => i === index
        ? ({
          ...resource,
          [prop]: value,
        })
        : resource));
  }

  deleteResource = index => () => {
    this.changeEventProp('resources')(this.state.newEvent.resources
      .filter((_, i) => i !== index));
  }

  render() {
    const title = this.props.isAdmin
      ? null
      : `${this.state.newEvent.type.toUpperCase()}: ${this.state.newEvent.title.toUpperCase()}`;
    const nav = this.props.isAdmin
      ? <div className="container">
        <p className="name-field">Type:</p>
        <EventSelector
          value={this.state.newEvent.type}
          onChange={this.changeEventProp('type')}
        />
        <p className="name-field">Title:</p>
        <SelectField
          id="type-selector"
          value={this.state.newEvent.title}
          onChange={this.changeEventProp('title')}
          menuItems={LECTURES_TYPES}
          itemLabel="label"
          itemValue="value"
        />
      </div>
      : null;
    const CardComponent = this.props.isAdmin ? CardAdmin : Card;
    return (
      <DialogContainer
        id="calendarEvent"
        visible={this.props.isOpen}
        pageX={this.props.pageX}
        pageY={this.props.pageY}
        onHide={this.props.closeDialog}
        fullPage
        aria-label="New Event"
      >
        <Toolbar
          className={`md-cell--right ${this.state.newEvent.type}`}
          nav={nav}
          actions={this.getActionButtons()}
          title={title}
          colored
          fixed
        />
        {this.props.isMobile &&
          <DialogContainer
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
            <p id="promptdescription" className="md-color--secondary-text">Save changes?</p>
          </DialogContainer>
        }
        <CardComponent
          event={this.state.newEvent}
          speakers={this.state.speakers}
          isSpeakersLoading={this.state.isSpeakersLoading}
          mobile={this.props.isMobile}
          deleteSpeaker={this.deleteSpeaker}
          deleteResource={this.deleteResource}
          addSpeaker={this.addSpeaker}
          addNewResource={this.addNewResource}
          changeEventProp={this.changeEventProp}
          changeResource={this.changeResource}
          avalSpeakers={this.state.avalSpeakers}
        />
      </DialogContainer>
    );
  }
};

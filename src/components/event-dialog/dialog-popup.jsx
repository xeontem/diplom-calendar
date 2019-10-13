import React from 'react';
import { Toolbar, Button, DialogContainer, SelectField, TextField } from 'react-md';

import Card from '../eventCard/Card';
import CardAdmin from '../eventCard/CardAdmin';

import { _loadSpeakers } from '../../instruments/fetching';
import { EVENT_TYPES } from '../../instruments/constants';

export class DialogPopup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      promptVisibility: false,
      speakers: [{name: "Please wait"}],
      speakersReady: false,
      type: '',
      title: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.event && !this.props.event) {
      this.setState({ speakers: [{name: "Please wait"}], type: '' });
    } else if (
      (!prevProps.event && this.props.event) ||
      (this.props.event &&
      (this.props.event.speakers.length !== prevProps.event.speakers.length ||
      !this.props.event.speakers.every(id => prevProps.event.speakers.includes(id))))
    ) {
      _loadSpeakers(this.props.event.speakers)
        .then(speakers => {
          this.setState({ speakers, speakersReady: true });
        });
    }
  }

  _closeDiscard = () => {
    this.props.closeDialog();
    this.setState({ promptVisibility: false });
    // let filtered = this.props.month.state.filtered.slice(0, eventBackupGet().eventIndex);
    // filtered.push(eventBackupGet());
    // filtered = filtered.concat(this.props.month.state.filtered.slice(eventBackupGet().eventIndex+1));
    // let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
    // this.setState({ visible: false, promptVisibility: !this.state.promptVisibility, speakers: speakersBackupGet()});
    // this.props.month.setState({appliedEventsMonth, filtered});
  }

  _closeSave = () => {
    this.props.closeDialog();
    this.setState({ promptVisibility: false });
    // console.dir(this.props.month.state.filtered);
    // let filtered = this.props.month.state.filtered.slice(0, tempEventGet().eventIndex);
    // filtered.push(tempEventGet());
    // filtered = filtered.concat(this.props.month.state.filtered.slice(tempEventGet().eventIndex+1));
    // // console.dir(tempEventGet().eventIndex);
    // // console.dir(filtered[tempEventGet().eventIndex]);

    // let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
    // this.setState({ visible: false, promptVisibility: !this.state.promptVisibility, speakers: speakersTempGet()});
    // this.props.month.setState({appliedEventsMonth, filtered});
    // sendToBackend(tempEventGet());

  }


  _changeType = (type) => {
    // let tempEvent = tempEventGet();
    // tempEvent.type = type;
    // tempEventSet(tempEvent);
    this.setState({ type });
  }

  _changeTitle = (title) => {
    // let tempEvent = tempEventGet();
    // tempEvent.title = title;
    // tempEventSet(tempEvent);
    this.setState({ title });
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

  render() {
    const type = this.state.type || (this.props.event && this.props.event.type);
    const title = this.props.isAdmin
      ? null
      : this.props.event
        ? `${this.props.event.type.toUpperCase()}: ${this.props.event.title.toUpperCase()}`
        : '';
    const nav = this.props.isAdmin
      ? null
      : <Button icon onClick={this.props.closeDialog}>close</Button>;

    return (
      <DialogContainer
        id="calendarEvent"
        visible={this.props.isOpen}
        pageX={this.props.pageX}
        pageY={this.props.pageY}
        onHide={this.props.closeDialog}
        fullPage
        aria-label="New Event">
          <Toolbar
            className={`md-cell--right ${type}`}
            nav={nav}
            actions={this.getActionButtons()}
            title={title}
            colored
            fixed
          >
          {this.props.isAdmin && this.props.event &&
            <div className="container">
              {!this.props.isMobile && <p className="name-field">Type:</p>}
              <SelectField
                className="title-selector"
                key="titleMenu"
                id={`titleItem${this.props.index}`}
                value={this.props.event.type}
                onChange={this._changeType}
                menuItems={EVENT_TYPES} />
              {!this.props.isMobile && <p className="name-field">Title:</p>}
              <TextField
                id="singleRightTitle"
                className="md-cell md-cell--bottom text-title"
                style={{fontSize: 20}}
                value={this.state.title || this.props.event.title}
                onChange={this._changeTitle}
                size={8}
                customSize="title"
                lineDirection="right" />
            </div>
          }
          </Toolbar>
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
          {this.props.isOpen
            ? this.props.isAdmin
              ? <CardAdmin eventIndex={this.props.eventIndex} event={this.props.event} speakers={this.state.speakers} speakersReady={this.state.speakersReady} mobile={this.props.isMobile}/>
              : <Card event={this.props.event} speakers={this.state.speakers} mobile={this.props.isMobile}/>
            : null
          }
        </DialogContainer>
    );
  }
};

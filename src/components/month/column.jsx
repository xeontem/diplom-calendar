import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import Toolbar from 'react-md/lib/Toolbars';

import Card from '../eventCard/Card';
import { handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleDragEnd } from '../../instruments/dragMonth';

export default class Column extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.day.event.title,
      speakers: [{name: "Please wait"}],
      visible: false,
        pageX: null,
        pageY: null,
        notLoaded: true
    };
    this.handleDragEnter = handleDragEnter.bind(this);
    this.handleDragLeave = handleDragLeave.bind(this);
    this.handleDragOver = handleDragOver.bind(this);
    this.handleDrop = handleDrop.bind(this);
    this.handleDragEnd = handleDragEnd.bind(this);
    this._loadSpeakers();
  }

  _loadSpeakers() {
    const urls = this.props.day.event.speakers
      .map(id => 'https://damp-earth-84904.herokuapp.com/trainers/' + id);
    Promise.all(urls.map(url => fetch(url)))
      .then(resp => Promise.all( resp.map(r => r.json()) ))
      .then(speakers => this.setState({speakers}));
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

  _closeDialog = () => {
    this.setState({ visible: false });
  }

  _changeTitle = title => {
    this.setState({ title });
  }

  _changeType = () => {

  }

  render() {
    return (
      <Button
        className={ `${this.props.day.event.type} table-cell ${this.props.day.today ? 'today' : this.props.day.isCurrentMonth ? null : 'disabled-cell'}`}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        onDragEnd={this.handleDragEnd}
        onClick={this._openDialog}
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
            className={this.props.day.event.type}
            colored
            nav={<Button icon onClick={this._closeDialog}>close</Button>}
            actions={<Button flat label="OK" onClick={this._closeDialog} />}
            title={`${this.props.day.event.type.toUpperCase()}: ${this.props.day.event.title.toUpperCase()}`}
            fixed />
          <Card event={this.props.day.event} speakers={this.state.speakers} mobile={this.props.mobile}/>
        </Dialog>
        <p className="day-number">{this.props.day.dayNumber}</p>
        {this.props.day.event && this.props.day.today ? <div className={`event-cell ${this.props.day.event.type}`}></div> : null}
      </Button>
    );
  }
}

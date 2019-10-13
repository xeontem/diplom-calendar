import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import Toolbar from 'react-md/lib/Toolbars';
import Card from '../eventCard/Card';

export default class Column extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speakers: [
        {
          name: "Please wait",
         src: ""
        }
      ],
      visible: false,
      pageX: null,
      pageY: null,
      notLoaded: true
    }
  }

  _loadSpeakers() {
    if(this.state.notLoaded){
    let urls = [];
    this.props.event.speakers.map(id => urls.push('https://damp-earth-84904.herokuapp.com/trainers/' + id));
    Promise.all(urls.map(url => fetch(url)))
      .then(resp => Promise.all( resp.map(r => r.json()) ))
      .then(speakers => {
      let notLoaded = false;
        this.setState({speakers, notLoaded})
      });
    }
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

  _closeDialog = () => {
    this.setState({ visible: false });
  }

  render() {
    let startHours;
    let startMins;
    let marginTop = 0;
    let endHours;
    let endMins;
    let marginBottom = 0;
    if(this.props.event) {
      startHours = new Date(this.props.event.start).toString().slice(16, 18);
      startMins = new Date(this.props.event.start).toString().slice(19, 21);
      marginTop = 24 + 55 * startHours;
      marginTop += startMins * 0.9;
      endHours = new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).toString().slice(16, 18);
      endMins = new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).toString().slice(19, 21);
      let startDate = this.props.event.start.slice(9, 10);
      let endDate = new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).toString().slice(9, 10);
      marginBottom = 28 + (23 - endHours) * 55;
      marginBottom -= endMins * 0.9;
      if(startDate !== endDate) marginBottom = -20;
    }

    return (
      <div style={{marginTop, marginBottom}} className={this.props.event ? `${this.props.event.type} event-column-day` : 'event-column-day'} onClick={this._openDialog}>
      {this.props.event ?
      <Dialog
        id={`calendarEvent${this.props.index}`}
        visible={this.state.visible}
        pageX={this.state.pageX}
        pageY={this.state.pageY}
        onHide={this._closeDialog}
        fullPage
        aria-label="New Event">
          <Toolbar
            className={this.props.event.type}
            colored
            nav={<Button icon onClick={this._closeDialog}>close</Button>}
            actions={<Button flat children="OK" onClick={this._closeDialog} />}
            title={`${this.props.event.type.toUpperCase()}: ${this.props.event.title.toUpperCase()}`}
            fixed
          />
            {this._loadSpeakers()}
            <Card event={this.props.event} speakers={this.state.speakers} mobile={this.props.mobile}/>
          </Dialog> : null}
        </div>
    );
  }
}

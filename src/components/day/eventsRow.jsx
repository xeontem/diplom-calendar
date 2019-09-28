import React from 'react';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Toolbar from 'react-md/lib/Toolbars';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons/Button';

import Card from '../eventCard/Card';

export default class EventsRow extends React.Component {
  constructor(props) {
  super(props);
  this.state = {
    speakers: [
      {name: "Please wait",
       src: ""}],
    start: false,
    visible: false,
    pageX: null,
    pageY: null
    };
  }

  componentDidMount() {
    if(this.props.event) {
    let urls = [];
    this.props.event.speakers.map(id => urls.push('https://damp-earth-84904.herokuapp.com/trainers/' + id));
    Promise.all(urls.map(url => fetch(url)))
      .then(resp => Promise.all( resp.map(r => r.json()) ))
      .then(speakers => {
        this.setState({speakers})
      });
    }
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

  render() {
    return (
      <TableRow onClick={this._openDialog} className="pointer">
        <Dialog
          id="fullPageExample"
          visible={this.state.visible}
          pageX={this.state.pageX}
          pageY={this.state.pageY}
          onHide={this._closeDialog}
          fullPage
          aria-label="New Event"
        >
          <Toolbar
            colored
            nav={<Button icon onClick={this._closeDialog}>close</Button>}
            actions={<Button flat children="OK" onClick={this._closeDialog} />}
            title={`${this.props.event.type}: ${this.props.event.title}`}
            fixed
          />
          <Card event={this.props.event} speakers={this.state.speakers} mobile={this.props.mobile}/>
        </Dialog>
        <TableColumn>{this.props.event.type}</TableColumn>
        <TableColumn>{this.props.event.title}</TableColumn>
        <TableColumn>{this.props.event.description.slice(0, 45)+'...'}</TableColumn>
        <TableColumn>{this.props.event.location}</TableColumn>
      </TableRow>
    );
  }
}

import React from 'react';
import { _loadSpeakers } from '../../instruments/fetching';
import { setStartTime, setEndTime } from '../../instruments/initResize';
import { handleDragStart, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleDragEnd } from '../../instruments/dragWeek';

export default class Column extends React.Component {
  constructor(props) {
    super(props);
    this.setStartTime = setStartTime.bind(this);
    this.setEndTime = setEndTime.bind(this);

    this.handleDragStart = handleDragStart.bind(this);
    this.handleDragEnter = handleDragEnter.bind(this);
    this.handleDragLeave = handleDragLeave.bind(this);
    this.handleDragOver = handleDragOver.bind(this);
    this.handleDrop = handleDrop.bind(this);
    this.handleDragEnd = handleDragEnd.bind(this);
  }

  render() {
    return (
      <div
        style={{width: 40}}
        onDragEnter={this.handleDragEnter}
        onDragLeave={this.handleDragLeave}
        onDragOver={this.handleDragOver}
        onDrop={this.handleDrop}
        onDragEnd={this.handleDragEnd}
      ></div>
    );
  }
}

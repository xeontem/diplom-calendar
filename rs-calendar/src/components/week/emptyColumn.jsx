import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import Toolbar from 'react-md/lib/Toolbars';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import FontIcon from 'react-md/lib/FontIcons';

import CardAdmin from '../eventCard/CardAdmin';
import { _loadSpeakers } from '../../instruments/fetching';
import { tempEventGet, tempEventSet, eventBackupGet, eventBackupSet, speakersBackupGet, speakersBackupSet, speakersTempGet, speakersTempSet } from '../../instruments/eventsBackup';
import { setStartTime, setEndTime } from '../../instruments/initResize';
import { handleDragStart, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleDragEnd } from '../../instruments/dragWeek';

let initialClientY = 0;
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
				onDragEnd={this.handleDragEnd}></div>					
		)
	}
}

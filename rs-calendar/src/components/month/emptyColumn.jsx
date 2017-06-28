import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import Toolbar from 'react-md/lib/Toolbars';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';


import CardAdmin from '../eventCard/CardAdmin';
import globalScope from '../../globalScope';
import { _loadSpeakers } from '../../instruments/fetching';
import { tempEventGet, tempEventSet, eventBackupGet, eventBackupSet, speakersBackupGet, speakersBackupSet, speakersTempGet, speakersTempSet } from '../../instruments/eventsBackup';
import { handleDragStart, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleDragEnd } from '../../instruments/dragMonth';

export default class Column extends React.Component {
	constructor(props) {
		super(props);
		this.handleDragStart = handleDragStart.bind(this);
		this.handleDragEnter = handleDragEnter.bind(this);
		this.handleDragLeave = handleDragLeave.bind(this);
		this.handleDragOver = handleDragOver.bind(this);
		this.handleDrop = handleDrop.bind(this);
		this.handleDragEnd = handleDragEnd.bind(this);
	}

	render() {
		return (
			<Button 

                    className={`table-cell ${this.props.day.today ? 'today' : !this.props.day.isCurrentMonth && 'disabled-cell'}`} 
                    onDragStart={this.handleDragStart}
					onDragEnter={this.handleDragEnter}
					onDragLeave={this.handleDragLeave}
					onDragOver={this.handleDragOver}
					onDrop={this.handleDrop}
					onDragEnd={this.handleDragEnd}
                    floating 
                    ><p className="day-number">{this.props.day.dayNumber}</p>
            </Button>
		)
	}
}

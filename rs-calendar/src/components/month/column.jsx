import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import Toolbar from 'react-md/lib/Toolbars';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import SelectField from 'react-md/lib/SelectFields';
import TextField from 'react-md/lib/TextFields';
import FontIcon from 'react-md/lib/FontIcons';


import Card from '../eventCard/Card';

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
		}
		this._loadSpeakers();
	}

	_loadSpeakers() {
	      let urls = [];
	      this.props.day.event.speakers.map(id => urls.push('http://128.199.53.150/trainers/' + id));
	      Promise.all(urls.map(url => fetch(url)))
	        .then(resp => Promise.all( resp.map(r => r.json()) ))
	        .then(speakers => {
	            this.setState({speakers})
	        });
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

    _changeTitle = (value) => {
    	this.setState({title: value})
    }

    _changeType = () => {

    }

	render() {
		return (
			<Button 
				className={ `${this.props.day.event.type} table-cell ${this.props.day.today ? 'today' : this.props.day.isCurrentMonth ? null : 'disabled-cell'}`}
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
				               fixed
				            />
			                <Card event={this.props.day.event} speakers={this.state.speakers} mobile={this.props.mobile}/> 
		            </Dialog>
                    <p className="day-number">{this.props.day.dayNumber}</p>
                    {this.props.day.event && this.props.day.today ? <div className={`event-cell ${this.props.day.event.type}`}></div> : null}
            </Button>
		)
	}
}

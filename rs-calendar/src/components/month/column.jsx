import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons';
import Toolbar from 'react-md/lib/Toolbars';
import TableColumn from 'react-md/lib/DataTables/TableColumn';

import Card from '../eventCard/Card';

export default class Column extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			speakers: [{name: "Please wait"}],
			visible: false,
            pageX: null,
            pageY: null,
            notLoaded: true
		}
	}

	_loadSpeakers() {
	    if(this.state.notLoaded){
	      let urls = [];
	      this.props.day.event.speakers.map(id => urls.push('http://128.199.53.150/trainers/' + id));
	      Promise.all(urls.map(url => fetch(url)))
	        .then(resp => Promise.all( resp.map(r => r.json()) ))
	        .then(speakers => {
	        	let notLoaded = false;
	        	console.dir('speakers loaded');
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
		return (
			<Button floating className={ this.props.day.today ? 'today table-cell' : 'table-cell'} onClick={this._openDialog}>
			{this.props.day.event ?
			<Dialog 
				id={`calendarEvent${this.props.index}`}
                visible={this.state.visible}
       			pageX={this.state.pageX}
                pageY={this.state.pageY}
                onHide={this._closeDialog}
                fullPage
                aria-label="New Event">
		            <Toolbar
		               colored
		               nav={<Button icon onClick={this._closeDialog}>close</Button>}
		               actions={<Button flat label="OK" onClick={this._closeDialog} />}
		               title={`${this.props.day.event.type}: ${this.props.day.event.title}`}
		               fixed
		            />
		            {this._loadSpeakers()}
	                <Card event={this.props.day.event} speakers={this.state.speakers} mobile={this.props.mobile}/>
            </Dialog> : null}
                    <p className="day-number">{this.props.day.dayNumber}</p>
                    {this.props.day.event ? <div className={`event-cell ${this.props.day.event.type}`}></div> : null}
            </Button>					
		)
	}
}

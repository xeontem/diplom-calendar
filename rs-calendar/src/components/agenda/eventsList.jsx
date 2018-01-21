import React from 'react';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Avatar from 'react-md/lib/Avatars';
import ExpansionPanel from 'react-md/lib/ExpansionPanels';
import Chip from 'react-md/lib/Chips';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons/Button';
import Toolbar from 'react-md/lib/Toolbars';

import Card from '../eventCard/Card';
import { _loadSpeakers } from '../../instruments/fetching';

export default class EventsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            speakers: [{name: "Please wait", src: ""}],
            start: false,
            visible: false,
            pageX: null,
            pageY: null
        };
        this._loadSpeakers = _loadSpeakers.bind(this, this.props.event.speakers);
    }

    _expand = () => {
        if(this.props.event) this._loadSpeakers();
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
        const { columnWidths, focused, mobile } = this.props;
        
        let secLabel;
        if(mobile) secLabel = `Starts: ${new Date(this.props.event.start).toString().slice(4, 24)}`;
        else secLabel = `Starts: ${new Date(this.props.event.start).toString().slice(4, 24)} Ends: ${new Date(Number(new Date(this.props.event.start)) + Number(new Date(this.props.event.duration))).toString().slice(4, 24)}`
        return (
            <div>
            <Dialog
                    id="fullPageDialog"
                    visible={this.state.visible}
                    pageX={this.state.pageX}
                    pageY={this.state.pageY}
                    onHide={this._closeDialog}
                    fullPage
                    aria-label="New Event">
                    <Toolbar
                        colored
                        className={this.props.event.type}
                        nav={<Button icon onClick={this._closeDialog}>close</Button>}
                        actions={<Button flat children="OK" onClick={this._closeDialog} />}
                        title={`${this.props.event.type.toUpperCase()}: ${this.props.event.title.toUpperCase()}`}
                        fixed/>
                    <Card event={this.props.event} speakers={this.state.speakers} mobile={this.props.mobile}/>
                </Dialog>
            <ExpansionPanel
                expandIconChildren={!mobile && 'keyboard_arrow_down'}
                label={`${this.props.event.type.toUpperCase()}: ${this.props.event.title.toUpperCase()}`}
                secondaryLabel={secLabel}
                headerClassName={this.props.event.type}
                columnWidths={columnWidths}
                contentClassName="md-grid"
                cancelLabel="HIDE"
                saveLabel="OPEN"
                onSave={this._openDialog}
                onExpandToggle={this._expand}
                closeOnSave={false}>


                <CSSTransitionGroup
                        component="section"
                        className="md-cell md-cell--7"
                        transitionName="opacity"
                        transitionEnterTimeout={1000}
                        transitionLeave={false}>
                        <h5 className="md-subheading-1">Description:</h5>
                        <p className="md-body-1" key='0'>{this.props.event.description}</p>
                        {this.state.speakers.map((speaker, i) => (
                            <Chip
                                className="chip"
                                key={i}
                                label={speaker.name}
                                avatar={<Avatar src={speaker.avatar} alt="Avat" role="presentation" random />}/>
                        ))}
                </CSSTransitionGroup>
            </ExpansionPanel>
        </div>  
        );
    }
}
         

/* TravelDatesPanel.jsx */
import React from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-addons-css-transition-group';
import Avatar from 'react-md/lib/Avatars';
import ExpansionPanel from 'react-md/lib/ExpansionPanels';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import Chip from 'react-md/lib/Chips';

export default class TravelDatesPanel extends React.Component {
  // static propTypes = {
  //   focused: PropTypes.bool,
  //   columnWidths: PropTypes.arrayOf(PropTypes.number),

  //   mobile: PropTypes.bool.isRequired,
  // };

  constructor(props) {
    super(props);
    this.state = {
      speakers: [
        {name: "Please wait",
         src: ""
        }
      ]
    };
  }

  componentDidMount() {
    if(this.props.event){
      let urls = [];
      this.props.event.speakers.map(id => urls.push('http://128.199.53.150/trainers/' + id));
      Promise.all(urls.map(url => fetch(url)))
        .then(resp => Promise.all( resp.map(r => r.json()) ))
        .then(speakers => {
            console.dir(speakers);
            this.setState({speakers})
        });
    }
  }

  componentWillUpdate() {
    
  }

  _expand = () => {
    // alert('opened');
  };

  render() {
    const { formattedStartDate, tempStartDate, formattedEndDate, tempEndDate, minEndDate } = this.state;
    const { columnWidths, focused, mobile } = this.props;

    let padd;
    if (mobile) padd = { paddingRight: 16 };
    else padd = {paddingRight: 0};
    if(this.props.event){
    let Mentor = () => {
      let arr = [];
      for(let i = 0; i < this.state.speakers.length; i++){
        arr.push(<Chip
            key={i}
            label={this.state.speakers[i].name}
            avatar={<Avatar 
              src={this.state.speakers[i].avatar}
              alt="Avat"
              role="presentation"
              random
            />}
          />);
      }
      return arr;
    }  
  
    return (
      <ExpansionPanel
        style={padd}
        focused={focused}
        columnWidths={columnWidths}
        label={`Title: ${this.props.event.title}`}
        secondaryLabel={`Starts: ${new Date(this.props.event.start).toString().slice(4, 24)}`}
        contentClassName="md-grid"
        cancelLabel="HIDE"
        onCancel={this._resetDates}
        saveLabel="OPEN"
        onSave={this._saveDates}
        onExpandToggle={this._expand}
      >
        <CSSTransitionGroup
            component="section"
            className="md-cell md-cell--7"
            transitionName="opacity"
            transitionEnterTimeout={1000}
            transitionLeave={false}
          >
            <h5 className="md-subheading-1">Description:</h5>
            <p className="md-body-1" key='0'>bla bla</p>
          </CSSTransitionGroup>
          {Mentor().map((speaker) => speaker)}
        </ExpansionPanel>
    );
    }else return null;
  }
}
     
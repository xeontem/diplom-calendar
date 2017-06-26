import { tempEventGet, tempEventSet } from './eventsBackup';   
let defaultLocation = '';

export function _closeSaveMonth() {
    let filtered = this.props.month.state.filtered.slice();
    filtered.push(tempEventGet());
    let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
    defaultLocation = '';
    this.setState({
            type: this.props.eventTypes[1],
            title: '',
            description: 'description...',
            duration: 0,
            id: 0,
            location: 'location...',
            resources: [{type: ''}],
            speakers: [],
            speakersReadyArr: [],
            start: new Date,
            avatars: [],
            end: new Date,
            showingLocation: defaultLocation,
            avalSpeakers: [], 
            visible: false,
            pageX: null,
            pageY: null,
            speakersReady: false,
            promptVisibility: !this.state.promptVisibility
        });
    this.props.month.setState({appliedEventsMonth, filtered});
    let empty = {};
    tempEventSet(empty);
}

export function _closeSaveWeek() {
    let filtered = this.props.week.state.filtered.slice();
    filtered.push(tempEventGet());
    let appliedEventsMonth = this.props.week._applyEventsOnDates(filtered, this.props.week.state.dateToShow);
    defaultLocation = '';
    this.setState({
            type: this.props.eventTypes[1],
            title: '',
            description: 'description...',
            duration: 0,
            id: 0,
            location: 'location...',
            resources: [{type: ''}],
            speakers: [],
            speakersReadyArr: [],
            start: new Date,
            avatars: [],
            end: new Date,
            showingLocation: defaultLocation,
            avalSpeakers: [], 
            visible: false,
            pageX: null,
            pageY: null,
            speakersReady: false,
            promptVisibility: !this.state.promptVisibility
        });
    this.props.week.setState({appliedEventsMonth, filtered});
    let empty = {};
    tempEventSet(empty);
}

export function _closeSaveDay() {
    let filtered = this.props.day.state.filtered.slice();
    filtered.push(tempEventGet());
    let [appliedEventsMonth, avalDays, backupDayEvents] = this.props.day._applyEventsOnDates(filtered);
    let day = appliedEventsMonth[this.props.day.state.dayIndex];
    defaultLocation = '';
    this.setState({
            type: this.props.eventTypes[1],
            title: '',
            description: 'description...',
            duration: 0,
            id: 0,
            location: 'location...',
            resources: [{type: ''}],
            speakers: [],
            speakersReadyArr: [],
            start: new Date,
            avatars: [],
            end: new Date,
            showingLocation: defaultLocation,
            avalSpeakers: [], 
            visible: false,
            pageX: null,
            pageY: null,
            speakersReady: false,
            promptVisibility: !this.state.promptVisibility
        });
    this.props.day.setState({filtered, day});
    let empty = {};
    tempEventSet(empty);
}

export function _closeSaveTable() {
    let filtered = this.props.month.state.filtered.slice();
    filtered.push(tempEventGet());
    let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
    defaultLocation = '';
    this.setState({
            type: this.props.eventTypes[1],
            title: '',
            description: 'description...',
            duration: 0,
            id: 0,
            location: 'location...',
            resources: [{type: ''}],
            speakers: [],
            speakersReadyArr: [],
            start: new Date,
            avatars: [],
            end: new Date,
            showingLocation: defaultLocation,
            avalSpeakers: [], 
            visible: false,
            pageX: null,
            pageY: null,
            speakersReady: false,
            promptVisibility: !this.state.promptVisibility
        });
    this.props.month.setState({appliedEventsMonth, filtered});
    let empty = {};
    tempEventSet(empty);
}

export function _closeSaveAgenda() {
    let filtered = this.props.month.state.filtered.slice();
    filtered.push(tempEventGet());
    let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
    defaultLocation = '';
    this.setState({
            type: this.props.eventTypes[1],
            title: '',
            description: 'description...',
            duration: 0,
            id: 0,
            location: 'location...',
            resources: [{type: ''}],
            speakers: [],
            speakersReadyArr: [],
            start: new Date,
            avatars: [],
            end: new Date,
            showingLocation: defaultLocation,
            avalSpeakers: [], 
            visible: false,
            pageX: null,
            pageY: null,
            speakersReady: false,
            promptVisibility: !this.state.promptVisibility
        });
    this.props.month.setState({appliedEventsMonth, filtered});
    let empty = {};
    tempEventSet(empty);
}

import { tempEventGet, tempEventSet } from './eventsBackup';   

export function _closeSaveMonth() {
    let filtered = this.props.month.state.filtered.slice();
    filtered.push(tempEventGet());
    let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
    this.setState({ visible: false, promptVisibility: !this.state.promptVisibility});
    this.props.month.setState({appliedEventsMonth, filtered});
    let empty = {};
    tempEventSet(empty);
}

export function _closeSaveWeek() {
    let filtered = this.props.week.state.filtered.slice();
    filtered.push(tempEventGet());
    let appliedEventsMonth = this.props.week._applyEventsOnDates(filtered, this.props.week.state.dateToShow);
    this.setState({ visible: false, promptVisibility: !this.state.promptVisibility});
    this.props.week.setState({appliedEventsMonth, filtered});
    let empty = {};
    tempEventSet(empty);
}

export function _closeSaveDay() {
    let filtered = this.props.day.state.filtered.slice();
    filtered.push(tempEventGet());
    let [appliedEventsMonth, avalDays, backupDayEvents] = this.props.day._applyEventsOnDates(filtered);
    let day = appliedEventsMonth[this.props.day.state.dayIndex];
    this.setState({ visible: false, promptVisibility: !this.state.promptVisibility});
    this.props.day.setState({filtered, day});
    let empty = {};
    tempEventSet(empty);
}

export function _closeSaveTable() {
    let filtered = this.props.month.state.filtered.slice();
    filtered.push(tempEventGet());
    let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
    this.setState({ visible: false, promptVisibility: !this.state.promptVisibility});
    this.props.month.setState({appliedEventsMonth, filtered});
    let empty = {};
    tempEventSet(empty);
}

export function _closeSaveAgenda() {
    let filtered = this.props.month.state.filtered.slice();
    filtered.push(tempEventGet());
    let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
    this.setState({ visible: false, promptVisibility: !this.state.promptVisibility});
    this.props.month.setState({appliedEventsMonth, filtered});
    let empty = {};
    tempEventSet(empty);
}

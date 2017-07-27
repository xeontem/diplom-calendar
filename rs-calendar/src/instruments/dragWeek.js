import { sendToBackend } from './fetching';

let initElementEvent = null;
let initElementEventIndex = 0;

export function handleDragStart(e) {
  e.target.style.opacity = '0.4';  // this / e.target is the source node.
  initElementEvent = this.props.day.event;
  initElementEventIndex = this.props.eventIndex;
}

export function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }

  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

  return false;
}

export function handleDragEnter(e) {
  // this / e.target is the current hover target.
  e.target.classList.add('over');
}

export function handleDragLeave(e) {
    // e.target.style.opacity = '1';
  e.target.classList.remove('over');  // this / e.target is previous target element.
  // if(e.target.className === "day-number") e.target.parentElement.parentElement.classList.remove('over');
}

export function handleDrop(e) {
  // this / e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  initElementEvent.start = this.props.day.curDate;

  let filtered = this.props.week.state.filtered.slice(0, initElementEventIndex);
  filtered = filtered.concat(this.props.week.state.filtered.slice(initElementEventIndex+1));
  filtered.push(initElementEvent);
  let appliedEventsMonth = this.props.week._applyEventsOnDates(filtered, this.props.week.state.dateToShow);
  this.props.week.setState({appliedEventsMonth, filtered});
  sendToBackend(initElementEvent);
  return false;
}

export function handleDragEnd(e) {
  // this/e.target is the source node.
  e.target.style.opacity = '1';
  // e.target.classList.remove('over');
}
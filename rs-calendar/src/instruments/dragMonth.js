import { sendToBackend } from './fetching';

let initElementEvent = null;
let initElementEventIndex = 0;

export function handleDragStart(month, e) {
  e.target.style.opacity = '0.4';  // this / e.target is the source node.
  e.target.style.width = '45px';
  e.target.style.height = '45px';
  initElementEvent = this.props.day.event;
  initElementEventIndex = this.props.eventIndex;
  if(!month.state.toastsToDeleteZone[0]) month.setState({toastsToDeleteZone: [{text: 'Drag here to delete'}]});
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
  if(e.target.tagName === "BUTTON") e.target.classList.add('over');
  if(e.target.className === "day-number") {
    // alert('day');
    e.target.parentElement.parentElement.classList.add('over-fromP');
  }
  if(e.target.id === "snackbarAlert") {
    // this.setState({toastsToDeleteZone: [{text: 'Drag here to delete'}]});
    e.target.innerHTML = '<i class="material-icons">delete_forever</i> Delete forever';
  }
}

export function handleDragLeave(e) {
    // e.target.style.opacity = '1';
  e.target.classList.remove('over');  // this / e.target is previous target element.
  if(e.target.className === "day-number") {
    // alert('day');
    e.target.parentElement.parentElement.classList.remove('over-fromP');
  }
}

export function handleDrop(e) {
  // this / e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  
  initElementEvent.start = this.props.day.curDate;

  let filtered = this.props.parent.state.filtered.slice(0, initElementEventIndex);
  filtered = filtered.concat(this.props.parent.state.filtered.slice(initElementEventIndex+1));
  filtered.push(initElementEvent);
  let appliedEventsMonth = this.props.parent._applyEventsOnDates(filtered, this.props.parent.state.dateToShow);
  this.props.parent.setState({appliedEventsMonth, filtered, toastsToDeleteZone: []});
  sendToBackend(initElementEvent);
  return false;
}

export function handleDragEnd(month, e) {
  // this/e.target is the source node.
  e.target.style.opacity = '1';
  e.target.style.width = '56px';
  e.target.style.height = '56px';
  // e.target.classList.remove('over');
  month.setState({toastsToDeleteZone: []});
}


//------------------ delete handlers --------------------

export function handleDropDeleteZone(month, e) {
  // this / e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  
  if(e.target.id === "snackbarAlert") {
    let event = month.state.filtered[initElementEventIndex];
    let filtered = month.state.filtered.slice(0, initElementEventIndex);
    filtered = filtered.concat(month.state.filtered.slice(initElementEventIndex+1));
    // filtered.push(initElementEvent);
    let appliedEventsMonth = month._applyEventsOnDates(filtered, month.state.dateToShow);
    month.setState({appliedEventsMonth, filtered, toastsToDeleteZone: []});
    let deleteInfo = {delete: true, id: event.id };
    sendToBackend(deleteInfo);
    return false;
  }
}

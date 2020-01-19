import { sendToBackend } from './fetching';
import { updateEvent } from '../services/firebase.service';

let initElementEvent = null;
let initElementEventIndex = 0;

export function handleDragStart(e, week, event) {
  e.target.style.opacity = '0.4';
  initElementEvent = event;

  if (!week.state.toastsToDeleteZone[0]) {
    week.setState({toastsToDeleteZone: [{ text: 'Drag here to delete' }]});
  }
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

export const handleDrop = start => e => {
  return updateEvent({ ...initElementEvent, start });
}

export function handleDragEnd(e) {
  // this/e.target is the source node.
  e.target.style.opacity = '1';
  // e.target.classList.remove('over');
}

//------------------ delete handlers --------------------

export function handleDropDeleteZone(week, e) {
  // this / e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  if(e.target.id === "snackbarAlert") {
    let event = week.state.filtered[initElementEventIndex];
    let filtered = week.state.filtered.slice(0, initElementEventIndex);
    filtered = filtered.concat(week.state.filtered.slice(initElementEventIndex+1));
    // filtered.push(initElementEvent);
    let appliedEventsMonth = week._applyEventsOnDates(filtered, week.state.dateToShow);
    week.setState({appliedEventsMonth, filtered, toastsToDeleteZone: []});
    let deleteInfo = {delete: true, id: event.id };
    sendToBackend(deleteInfo);
    return false;
  }
}

import { sendToBackend } from './fetching';
import { updateEvent } from '../services/firebase.service';

let initElementEvent = null;
let initElementEventIndex = 0;

export const handleDragStart = (component, event, eventIndex) => e => {
  e.target.style.opacity = '0.4';  // this / e.target is the source node.
  e.target.style.width = '45px';
  e.target.style.height = '45px';
  initElementEvent = event;
  initElementEventIndex = eventIndex;
  if(!component.state.toastsToDeleteZone.length) {
    component.setState({toastsToDeleteZone: [{text: 'Drag here to delete'}]});
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

export const handleDrop = start => e => {
  return updateEvent({ ...initElementEvent, start });
}

export const handleDragEnd = (component, isMobile) => e => {
  // this/e.target is the source node.
  e.target.style.opacity = '1';
  e.target.style.width = isMobile ? '48px' : '56px';
  e.target.style.height = isMobile ? '48px' : '56px';
  // e.target.classList.remove('over');
  component.setState({toastsToDeleteZone: []});
}


//------------------ delete handlers --------------------

export const handleDropDeleteZone = component => e => {
  // this / e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }

  if(e.target.id === "snackbarAlert") {
    let event = component.state.filtered[initElementEventIndex];
    let filtered = component.state.filtered.slice(0, initElementEventIndex);
    filtered = filtered.concat(component.state.filtered.slice(initElementEventIndex+1));
    // filtered.push(initElementEvent);
    let appliedEventsMonth = component._applyEventsOnDates(filtered, component.state.dateToShow);
    component.setState({appliedEventsMonth, filtered, toastsToDeleteZone: []});
    let deleteInfo = {delete: true, id: event.id };
    sendToBackend(deleteInfo);
    return false;
  }
}

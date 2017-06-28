let initElementEvent = null;
let initElementEventIndex = 0;

export function handleDragStart(e) {
  e.target.style.opacity = '0.4';  // this / e.target is the source node.
  e.target.style.width = '45px';
  e.target.style.height = '45px';
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
  console.dir(e.target);
  if(e.target.tagName === "BUTTON") e.target.classList.add('over');
  if(e.target.className === "day-number") {
    // alert('day');
    e.target.parentElement.parentElement.classList.add('over-fromP');
  }
}

export function handleDragLeave(e) {
    // e.target.style.opacity = '1';
  e.target.classList.remove('over');  // this / e.target is previous target element.
  if(e.target.className === "day-number") {
    // alert('day');
    e.target.parentElement.parentElement.classList.remove('over-fromP');
  }
  // if(e.target.className === "day-number") e.target.parentElement.parentElement.classList.remove('over');
}

export function handleDrop(e) {
  // this / e.target is current target element.

  if (e.stopPropagation) {
    e.stopPropagation(); // stops the browser from redirecting.
  }
  console.dir(this.props.day.curDate);
  console.dir(initElementEvent.start);
  initElementEvent.start = this.props.day.curDate;

  let filtered = this.props.month.state.filtered.slice(0, initElementEventIndex);
  filtered = filtered.concat(this.props.month.state.filtered.slice(initElementEventIndex+1));
  filtered.push(initElementEvent);
  let appliedEventsMonth = this.props.month._applyEventsOnDates(filtered, this.props.month.state.dateToShow);
  this.props.month.setState({appliedEventsMonth, filtered});
  return false;
}

export function handleDragEnd(e) {
  // this/e.target is the source node.
  e.target.style.opacity = '1';
  e.target.style.width = '56px';
  e.target.style.height = '56px';
  // e.target.classList.remove('over');
}

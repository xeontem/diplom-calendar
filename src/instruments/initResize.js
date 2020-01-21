import { updateEvent } from '../services/firebase.service';

export const setStartTime = eventProps => e => {
  let event = e.target.parentElement.parentElement;
  let startY = e.clientY;
  if (e.changedTouches) {
      const [touch] = e.changedTouches;
      startY = touch.pageY;
    }
  let startTop = parseInt(event.style.marginTop, 10);

  function doDrag(e) {
    let clientY = e.clientY;
     if (e.changedTouches) {
      document.body.style.overflowY = 'hidden';
      const [touch] = e.changedTouches;
      clientY = touch.pageY;
    }
    event.style.marginTop = (startTop + clientY - startY) + 'px';
    event.children[0].children[1].style.opacity = 1;
    let hours = parseInt((parseInt(event.style.marginTop, 10) - 24)/55, 10);
    if(hours < 0)hours = 0;
    let mins = parseInt(((parseInt(event.style.marginTop, 10) - 24)/55 - parseInt((parseInt(event.style.marginTop, 10) - 24)/55, 10))*60, 10);
    if(mins < 0) mins = 0;
    event.children[0].children[1].innerHTML = `start: ${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`;

    eventProps.start = new Date(eventProps.start).setHours(hours);
    eventProps.start = new Date(eventProps.start).setMinutes(mins);
  }

  function stopDrag(e) {
    document.body.style.overflowY = 'auto';
    event.children[0].children[1].style.opacity = 0;
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('touchmove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
    document.documentElement.removeEventListener('touchend', stopDrag, false);
    updateEvent(eventProps);
  }

  document.documentElement.addEventListener('mousemove', doDrag, false);
  document.documentElement.addEventListener('touchmove', doDrag, false);

  document.documentElement.addEventListener('mouseup', stopDrag, false);
  document.documentElement.addEventListener('touchend', stopDrag, false);
  e.preventDefault();
  e.stopPropagation();
}

export const setEndTime = eventProps => e => {
  let event = e.target.parentElement.parentElement;
  let startY = e.clientY;
  if (e.changedTouches) {
      const [touch] = e.changedTouches;
      startY = touch.pageY;
    }
  let startBottom = parseInt(event.style.marginBottom, 10);

  function doDrag(e) {
    let clientY = e.clientY;
     if (e.changedTouches) {
      document.body.style.overflowY = 'hidden';
      const [touch] = e.changedTouches;
      clientY = touch.pageY;
    }
    event.style.marginBottom = (startBottom - (clientY - startY)) + 'px';
    event.children[0].children[4].style.opacity = 1;
    let hours = parseInt(23 - ((parseInt(event.style.marginBottom, 10) - 28)/55), 10);
    if(hours < 0)hours = 0;
    let mins = parseInt(((23 - (parseInt(event.style.marginBottom, 10) - 28)/55) - parseInt(23 - (parseInt(event.style.marginBottom, 10) - 28)/55, 10)) * 60, 10);
    if(mins < 0) mins = 0;
    event.children[0].children[4].innerHTML= `end: ${hours < 10 ? '0' : ''}${hours}:${mins < 10 ? '0' : ''}${mins}`;
    hours -= new Date(eventProps.start).getHours() - 3;// timezonecorrection
    mins -= new Date(eventProps.start).getMinutes();// timezonecorrection
    eventProps.duration = Number(new Date(19*60*60*1000).setHours(hours));//-10800000
    eventProps.duration = Number(new Date(eventProps.duration).setMinutes(mins));//-10800000
  }

  function stopDrag(e) {
    document.body.style.overflowY = 'auto';
    event.children[0].children[4].style.opacity = 0;
    document.documentElement.removeEventListener('mousemove', doDrag, false);
    document.documentElement.removeEventListener('touchmove', doDrag, false);
    document.documentElement.removeEventListener('mouseup', stopDrag, false);
    document.documentElement.removeEventListener('touchend', stopDrag, false);
    updateEvent(eventProps);
  }

  document.documentElement.addEventListener('mousemove', doDrag, false);
  document.documentElement.addEventListener('touchmove', doDrag, false);

  document.documentElement.addEventListener('mouseup', stopDrag, false);
  document.documentElement.addEventListener('touchend', stopDrag, false);
  e.preventDefault();
  e.stopPropagation();
}

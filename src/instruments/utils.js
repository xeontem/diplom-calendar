import { EVENT_TYPES, DEFAULT_VIDEO_ID, DEFAULT_LOCATION } from './constants';

export const capitalise = str => str ? str[0].toUpperCase() + str.slice(1) : '';

export const rand = (min, max) => Math.random() * (max - min) + min;

export const getEmptyEvent = () => ({
  id: null,
  description: '',
  duration: 1000 * 60 * 60,
  location: DEFAULT_LOCATION,
  resources: [],
  speakers: [],
  start: Date.now(),
  title: '',
  type: EVENT_TYPES[1].value,
  videoId: DEFAULT_VIDEO_ID,
});

export const getStyles = event => {
  let startHours = new Date(event.start).getHours();
  let startMins = new Date(event.start).getMinutes();
  let marginTop = 24 + 55 * startHours;
  marginTop += startMins * 0.9;
  let endHours = new Date(Number(new Date(event.start)) + Number(new Date(event.duration))).getHours();
  let endMins = new Date(Number(new Date(event.start)) + Number(new Date(event.duration))).getMinutes();
  let startDate = new Date(event.start).getDate();
  let endDate = new Date(Number(new Date(event.start)) + Number(new Date(event.duration))).getDate();
  let marginBottom = 28 + (23 - endHours) * 55;
  marginBottom -= endMins * 0.9;
  if(startDate !== endDate) marginBottom = -20;
  return { marginTop, marginBottom }
}

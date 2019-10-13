import { EVENT_TYPES } from './constants';

export const capitalise = str => str ? str[0].toUpperCase() + str.slice(1) : '';

export const rand = (min, max) => Math.random() * (max - min) + min;

export const getEmptyEvent = () => ({
  type: EVENT_TYPES[1],
  title: '',
  description: 'description...',
  duration: 1000*60*60,
  id: rand(0.1, 0.9)*1000000000000000000,
  location: 'location...',
  resources: [],
  speakers: [],
  start: new Date(),
  end: new Date(),
});

export const getStyles = event => {
  let startHours = new Date(event.start.seconds * 1000).getHours();
  let startMins = new Date(event.start.seconds * 1000).getMinutes();
  let marginTop = 24 + 55 * startHours;
  marginTop += startMins * 0.9;
  let endHours = new Date(Number(new Date(event.start.seconds * 1000)) + Number(new Date(event.duration))).getHours();
  let endMins = new Date(Number(new Date(event.start.seconds * 1000)) + Number(new Date(event.duration))).getMinutes();
  let startDate = new Date(event.start.seconds * 1000).getDate();
  let endDate = new Date(Number(new Date(event.start.seconds * 1000)) + Number(new Date(event.duration))).getDate();
  let marginBottom = 28 + (23 - endHours) * 55;
  marginBottom -= endMins * 0.9;
  if(startDate !== endDate) marginBottom = -20;
  return { marginTop, marginBottom }
}

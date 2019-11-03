import { createAction } from './';

export const toggleAdmin = createAction('TOGGLE_ADMIN');

export const startFetching = createAction('START_FETCHING');

export const unmarkEventsUpdated = createAction('UNMARK_EVENTS_UPDATED');

export const setEvents = createAction('SET_EVENTS');

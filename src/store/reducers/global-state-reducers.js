import defaultAvatar from '../../img/avatar.png';

const getInitialState = () => ({
  isAdmin: false,
  discard: false,
  isMobile: true,
  defaultAvatar,
  eventsLoading: false,
  eventsUpdated: false,
  events: [],
});

export const globalState = (state = getInitialState(), { type, payload }) => {
  switch(type) {
    case 'TOGGLE_ADMIN': return { ...state, isAdmin: payload };
    case 'START_FETCHING': return { ...state, eventsLoading: true };
    case 'UNMARK_EVENTS_UPDATED': return { ...state, eventsUpdated: false };
    case 'SET_EVENTS': return { ...state, eventsLoading: false, eventsUpdated: true, events: payload };
    default: return state;
  }
};

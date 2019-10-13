import defaultAvatar from '../../img/avatar.png';

const getInitialState = () => ({
  isAdmin: true,
  discard: false,
  isMobile: true,
  defaultAvatar,
  fetching: false,
  events: [],
});

export const globalState = (state = getInitialState(), { type, payload }) => {
  switch(type) {
    case 'TOGGLE_ADMIN': return { ...state, isAdmin: !!payload || !state.isAdmin };
    case 'START_FETCHING': return { ...state, fetching: true };
    case 'SET_EVENTS': return { ...state, fetching: false, events: payload };
    default: return state;
  }
};

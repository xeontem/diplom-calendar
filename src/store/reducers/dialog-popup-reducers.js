const getInitialState = () => ({
  isOpen: false,
  pageX: null,
  pageY: null,
  event: null,
  eventIndex: null,
});

export const dialogPopupReducer = (state = getInitialState(), { type, payload }) => {
  switch(type) {
    case 'TOGGLE': return payload.isOpen
      ? { ...state, ...payload }
      : getInitialState();
    default: return state;
  }
};

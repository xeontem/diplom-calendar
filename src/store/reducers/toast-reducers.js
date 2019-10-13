const initialState = {
  toasts: []
};

export const toastsReducer = (state = initialState, { type, payload }) => {
  switch(type) {
    case 'REMOVE': return { ...state, toasts: state.toasts.slice(1) };
    case 'ADD_TOAST': return { ...state, toasts: [ ...state.toasts, payload ] };
    default: return state;
  }
};

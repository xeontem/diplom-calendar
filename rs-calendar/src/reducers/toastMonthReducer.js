import Immutable from 'immutable';

const initialState = Immutable.Map({toasts: [{text: "events successfully loaded"}]});

export default function toastsReducer(state = initialState, action) {
    switch(action.type) {
        case 'REMOVE': {
            let newState = state.set('toasts', []);
            return newState;
        }
        default: return state
    }
}

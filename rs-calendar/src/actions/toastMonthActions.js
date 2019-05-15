
export function removeToast() {
  return function(dispatch) {
    dispatch({type: 'REMOVE'});
  };
}
// export function prevMonth() {
//     return function(dispatch) {
//         dispatch({type: 'SET_PREV'});
//     };
// }

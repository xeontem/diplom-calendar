import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleDialog } from '../../store/actions/dialog-popup-actions';
import { removeToast } from '../../store/actions/toast-actions';

import { Day } from './day';

const mapStateToProps = state => ({
  toasts: state.toastsReducer.toasts,
  isMobile: state.globalState.isMobile,
  isAdmin: state.globalState.isAdmin,
  events: state.globalState.events
});

const mapDispatchToProps = dispatch => ({
  removeToast: bindActionCreators(removeToast, dispatch),
  toggleDialog: bindActionCreators(toggleDialog, dispatch)
});

export const ConnectedDay = connect(mapStateToProps, mapDispatchToProps)(Day);

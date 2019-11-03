import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleDialog } from '../../store/actions/dialog-popup-actions';
import { removeToast } from '../../store/actions/toast-actions';

import { Month } from './month';

const mapStateToProps = state => ({
  isMobile: state.globalState.isMobile,
  events: state.globalState.events,
  eventsLoading: state.globalState.eventsLoading,
  eventsUpdated: state.globalState.eventsUpdated
});

const mapDispatchToProps = dispatch => ({
  removeToast: bindActionCreators(removeToast, dispatch),
  toggleDialog: bindActionCreators(toggleDialog, dispatch)
});

export const ConnectedMonth = connect(mapStateToProps, mapDispatchToProps)(Month);

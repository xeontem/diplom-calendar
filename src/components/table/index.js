import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleDialog } from '../../store/actions/dialog-popup-actions';
import { Table } from './table';

const mapStateToProps = state => ({
  ...state.dialogPopupReducer,
  isAdmin: state.globalState.isAdmin,
  isMobile: state.globalState.isMobile,
  events: state.globalState.events
});

const mapDispatchToProps = dispatch => ({
  closeDialog: () => bindActionCreators(toggleDialog, dispatch)({ isOpen: false }),
  toggleDialog: bindActionCreators(toggleDialog, dispatch)
});

export const ConnectedTable = connect(mapStateToProps, mapDispatchToProps)(Table);

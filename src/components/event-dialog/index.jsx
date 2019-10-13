import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleDialog } from '../../store/actions/dialog-popup-actions';
import { DialogPopup } from './dialog-popup';

const mapStateToProps = state => ({
  ...state.dialogPopupReducer,
  isAdmin: state.globalState.isAdmin,
  isMobile: state.globalState.isMobile
});

const mapDispatchToProps = dispatch => ({
  closeDialog: () => bindActionCreators(toggleDialog, dispatch)({ isOpen: false })
});

export const EventDialog = connect(mapStateToProps, mapDispatchToProps)(DialogPopup);

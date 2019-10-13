import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleAdmin } from '../../store/actions/global-state-actions';
import { LoginDialog } from './login-dialog';

const mapStateToProps = state => ({
  isAdmin: state.globalState.isAdmin
});

const mapDispatchToProps = dispatch => ({
  toggleAdmin: bindActionCreators(toggleAdmin, dispatch)
});

export const LoginPopup = connect(mapStateToProps, mapDispatchToProps)(LoginDialog);

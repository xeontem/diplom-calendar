import React from 'react';
import Dialog from 'react-md/lib/Dialogs';
import TextField from 'react-md/lib/TextFields';
import md5 from 'md5';

import { sendToBackend } from '../../instruments/fetching';

export class LoginDialog extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      login: '',
      password: '',
      avatar: 'https://www.timeshighereducation.com/sites/default/files/byline_photos/default-avatar.png'
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({visible: nextProps.visible});
  }

  closeDialog = () => {
    this.props.app.setState({ visible: false });
  };

  _storeLogin = (login) => {
    this.setState({login});
  }

  _storePassword = (password) => {
    let cripted = md5(password);
    this.setState({password: cripted});
  }

  _login = () => {
    if(this.props.isAdmin) {
      this.props.toggleAdmin(false);
      this.props.app.setState({
        avatar: '',
        user: 'user',
        visible: false,
        toast: [{text: 'logged out'}]
      });
      return
    }

    sendToBackend({
      login: this.state.login,
      password: this.state.password
    })
    .then(res => res.json())
    .then(res => {
      const user = res.isAdmin ? this.state.login : 'user';
      const avatar = res.avatar || '';

      this.props.toggleAdmin(res.isAdmin);

      this.props.app.setState({
        visible: false,
        toast: [{text: res.message}],
        user,
        avatar
      });
    });
  }

  render() {
    let button = !this.props.isAdmin ? {
            onClick: this._login,
            primary: true,
            label: 'Log In',
          } :
          {
            onClick: this._login,
            primary: true,
            label: 'Log Out',
          }
    return (
      <div>
        <Dialog
          id="speedBoost"
          visible={this.state.visible}
          title="Log In"
          onHide={this.closeDialog}
          aria-labelledby="speedBoostDescription"
          modal
          actions={[
          button,
          {
            onClick: this.closeDialog,
            primary: true,
            label: 'Cancel',
          }]}
        >
          <p id="speedBoostDescription" className="md-color--secondary-text">
             Log In to get access to edit events and save them on server.</p>
          <p className="md-color--secondary-text">Hint! login: xeontem, password: rollingscopes</p>
          <TextField
            id="floatingLogin"
            label="Nickname"
            lineDirection="center"
            placeholder="name"
            className="md-cell md-cell--bottom"
            style={{minWidth: '200px'}}
            onChange={this._storeLogin}
            required
          />
          <TextField
            id="floatingPassword"
            label="Enter your password"
            type="password"
            className="md-cell md-cell--bottom"
            style={{minWidth: '200px'}}
            onChange={this._storePassword}
            required
          />
        </Dialog>
      </div>
    );
  }
}



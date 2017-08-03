import React, { PureComponent } from 'react';
import Dialog from 'react-md/lib/Dialogs';
import Button from 'react-md/lib/Buttons/Button';
import TextField from 'react-md/lib/TextFields';
import FileInput from 'react-md/lib/FileInputs';
import md5 from 'md5';

import globalScope from '../../globalScope';
import { sendToBackend } from '../../instruments/fetching';

export default class ModalDialogExamples extends PureComponent {
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

  _storeAvatar = (avatar) => {
    this.setState({avatar});
  }

  _login = () => {
    if(this.props.app.state.isAdmin) {
      globalScope.isAdmin = false;
      this.props.app.setState({
        avatar: globalScope.defaultAvatar,
        user: 'user',
        isAdmin: false,
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
      let user = res.isAdmin ? this.state.login : 'user'; 
      let avatar = globalScope.defaultAvatar;
      if(res.avatar) avatar = res.avatar;
      globalScope.isAdmin = res.isAdmin;
      this.props.app.setState({
        isAdmin: res.isAdmin,
        visible: false,
        toast: [{text: res.message}],
        user,
        avatar 
      });
    });
  }

  _signin = () => {
    sendToBackend({
      signin: true,
      login: this.state.login,
      password: this.state.password,
      avatar: this.state.avatar
    })
    .then(res => res.json())
    .then(res => {
      this.props.app.setState({
        toast: [{text: res.message}]
      })
    });
  }

  render() {
    let button = !this.props.app.state.isAdmin ? {
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
          title="Log In or Register"
          onHide={this.closeDialog}
          aria-labelledby="speedBoostDescription"
          modal
          actions={[{
            onClick: this._signin,
            primary: true,
            label: 'Register',
          },
          button,
          {
            onClick: this.closeDialog,
            primary: true,
            label: 'Cancel',
          }]}
        >
          <p id="speedBoostDescription" className="md-color--secondary-text">
            Sign In or Log In to get access to edit events and save them on server. Avatar is not required(optional)</p>
          <p className="md-color--secondary-text">Hint! login: xeontem, password: rollingscopes
          </p>
          <TextField
            id="floatingLogin"
            label="Title"
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
          <TextField
            id="floatingPassword"
            label="Enter url to avatar"
            className="md-cell md-cell--bottom"
            style={{minWidth: '200px'}}
            onChange={this._storeAvatar}
          />
        </Dialog>
      </div>
    );
  }
}



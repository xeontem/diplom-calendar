import React, { PureComponent } from 'react';
import Dialog from 'react-md/lib/Dialogs';
import TextField from 'react-md/lib/TextFields';
import md5 from 'md5';

import { sendToBackend } from '../../instruments/fetching';

export default class ModalDialogExamples extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: this.props.visible,
      login: '',
      password: '',
      repassword: '',
      avatar: 'https://www.timeshighereducation.com/sites/default/files/byline_photos/default-avatar.png'
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({visible: nextProps.visible});
  }

  closeDialog = () => {
    this.props.app.setState({ signInvisible: false });
  };

  _storeLogin = (login) => {
    this.setState({login});
  }

  _storePassword = (password) => {
    let cripted = md5(password);
    this.setState({password: cripted});
  }

  _storeRepassword = (repassword) => {
    let cripted = md5(repassword);
    this.setState({repassword: cripted});
  }

  _storeAvatar = (avatar) => {
    this.setState({avatar});
  }

  _signin = () => {
    if(this.state.password === this.state.repassword) {
      sendToBackend({
        signin: true,
        login: this.state.login,
        password: this.state.password,
        avatar: this.state.avatar
      })
      .then(res => res.json())
      .then(res => {
        let signInvisible = false;
        if(res.notregister) signInvisible = true;
        this.props.app.setState({
          signInvisible,
          toast: [{text: res.message}]
        })
      });
    } else {
      this.props.app.setState({toast: [{text: 'missmatch passwords'}]});
    }
  }

  render() {
    return (
      <div>
        <Dialog
          id="speedBoost"
          visible={this.state.visible}
          title="Registration"
          onHide={this.closeDialog}
          aria-labelledby="speedBoostDescription"
          modal
          actions={[{
            onClick: this._signin,
            primary: true,
            label: 'Register',
          },
          {
            onClick: this.closeDialog,
            primary: true,
            label: 'Cancel',
          }]}
        >
          <p id="speedBoostDescription" className="md-color--secondary-text">
            Register to get access to edit events and save them on server. Avatar is not required(optional)
          </p>
          <TextField
            id="floatingSignin"
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
          <TextField
            id="floatingPassword"
            label="Repeat your password"
            type="password"
            className="md-cell md-cell--bottom"
            style={{minWidth: '200px'}}
            onChange={this._storeRepassword}
            required
          />
          <TextField
            id="floatingRepassword"
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



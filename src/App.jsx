import React, { PureComponent } from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'react-md/lib/Buttons/Button';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import Snackbar from 'react-md/lib/Snackbars'; // eslint-disable-next-line
import Avatar from 'react-md/lib/Avatars';

import { removeToast } from './actions/toastMonthActions';
import Month from './components/month/Month';
import Week from './components/week/Week';
import Day from './components/day/Day';
import Table from './components/table/Table';
import Agenda from './components/agenda/Agenda';
import globalScope from './globalScope';
import LoginDialog from './components/login/loginDialog';
import SigninDialog from './components/login/signinDialog';

import { capitalise } from './instruments/utils';
import { _loadEvents } from './instruments/fetching';
import './App.css';

import FontIcon from 'react-md/lib/FontIcons';
import ListItem from 'react-md/lib/Lists/ListItem';

const selectLink = link => link === window.location.pathname;
const pages = [
  { pageName: 'month', icon: 'date_range' },
  { pageName: 'week', icon: 'event' },
  { pageName: 'day', icon: 'content_paste' },
  { pageName: 'table', icon: 'list' },
  { pageName: 'agenda', icon: 'view_agenda' }
];

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: this.getTitle(),
      isAdmin: false,
      toast: [],
      visible: false,
      signInvisible: false,
      user: 'user',
      avatar: globalScope.defaultAvatar
    }
    this.month = () => (<Month removeToast={this.props.removeToast} _toastMonthReducer={this.props._toastMonthReducer}/>)
  }

  resetColorLink = e => {
    let elements = document.querySelectorAll('[id^=link]');
    elements.forEach(element => {
      if(element.classList.contains('active')) element.classList.remove('active');
    });
  }

  _handleChange = () => {
    globalScope.isAdmin = !this.state.isAdmin;
    this.setState({isAdmin: !this.state.isAdmin});

  }

  _resetEvents = () => {
    _loadEvents('/reset').then(res => {
      this.setState({resetted: true,
        toast: [{text: res.mess}]});
    });
  }

  _removeToast = () => {
    this.setState({ toast: [] });
  }

  _openLoginDialog = () => {
    let visible = !this.state.visible;
    this.setState({visible});
  }

  _openSigninDialog = () => {
    let signInvisible = !this.state.signInvisible;
    this.setState({signInvisible});
  }

  routerLinkHandler = name => e => {
    this.refs[`LINK_${name}`].handleClick(e);
    this.setState({ title: this.getTitle() });
  }

  getTitle() {
    return capitalise(window.location.pathname.slice(1));
  }

  render() {
    const buttons = [
      <Avatar src={this.state.avatar} role="presentation" />,
      <Button flat children={this.state.user} />,
      <Button icon tooltipLabel="sign in" onClick={this._openSigninDialog}>assignment</Button>,
      <Button icon tooltipLabel="log in" onClick={this._openLoginDialog}>assignment_ind</Button>,
      <Button icon tooltipLabel="reset events" onClick={this._resetEvents}>refresh</Button>
    ];

    const links = pages.map(({ pageName, icon }, i) => (
      <ListItem
        key={pageName}
        className={selectLink(`/${pageName}`) ? 'active' : ''}
        leftIcon={<FontIcon>{icon}</FontIcon>}
        onClick={this.routerLinkHandler(pageName.toUpperCase())}
        primaryText={capitalise(pageName)} />
    )).concat({ key: 'divider', divider: true });

    return (
        <NavigationDrawer
          navItems={links}
          drawerTitle="Select view:"
          contentClassName="md-grid"
          toolbarTitle={this.state.title}
          toolbarTitleClassName="page-title"
          toolbarActions={buttons}
          onClick={this.resetColorLink}>
          <LoginDialog visible={this.state.visible} app={this}></LoginDialog>
          <SigninDialog visible={this.state.signInvisible} app={this}></SigninDialog>
          <Snackbar toasts={this.state.toast} autohide={true} onDismiss={this._removeToast}/>

          <BrowserRouter>
          <div>
            {pages.map(({ pageName }) => <Link ref={`LINK_${pageName.toUpperCase()}`} key={pageName} to={`/${pageName}`} />)}
            <Switch>
              <Route path="/month" component={this.month} />
              <Route path="/week" component={Week} />
              <Route path="/day" component={Day} />
              <Route path="/agenda" component={Agenda} />
              <Route path="/table" component={Table} />
            </Switch>
          </div>
          </BrowserRouter>
        </NavigationDrawer>
    );
  }
}

const mapStateToProps = state => ({
    _toastMonthReducer: state.toastMonthReducer
  });

const mapDispatchToProps = dispatch => ({
    removeToast: bindActionCreators(removeToast, dispatch)
  });

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import FontIcon from 'react-md/lib/FontIcons';
import ListItem from 'react-md/lib/Lists/ListItem';
import Button from 'react-md/lib/Buttons/Button';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import Snackbar from 'react-md/lib/Snackbars'; // eslint-disable-next-line
import Avatar from 'react-md/lib/Avatars';
import LinearProgress from 'react-md/lib/Progress/LinearProgress';

import { ConnectedMonth } from './components/month';
import { ConnectedWeek } from './components/week';
import { ConnectedDay } from './components/day';
import { ConnectedTable } from './components/table';
import { ConnectedAgenda } from './components/agenda';
import { LoginPopup } from './components/login';
import SigninDialog from './components/login/signinDialog';
import { EventDialog } from './components/event-dialog';

import { toggleDialog } from './store/actions/dialog-popup-actions';
import { setEvents, startFetching } from './store/actions/global-state-actions';
import { showToast, removeToast } from './store/actions/toast-actions';

import { _closeSaveMonth } from './instruments/emptyEventOpenClose';
import { capitalise, getEmptyEvent } from './instruments/utils';
import { _loadEvents } from './instruments/fetching';
import { getEvents } from './services/firebase.service';
import './App.css';

const PAGES = [
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
      links: PAGES.map(link => ({ ...link, active: window.location.href.includes(link.pageName) })),
      visible: false,
      signInvisible: false,
      user: 'user',
      avatar: ''
    };
  }

  componentDidMount(prevProps) {
    this.props.startFetching();
    getEvents(events => {
      this.props.showToast({text: "events successfully loaded"})
      this.props.setEvents(events);
    });
  }

  _handleChange = () => {
    this.props.toggleAdmin();
  }

  _resetEvents = () => {
    _loadEvents('/reset').then(res => {
      this.setState({resetted: true,
        toast: [{text: res.mess}]});
    });
  }

  _openLoginDialog = () => {
    let visible = !this.state.visible;
    this.setState({ visible });
  }

  _openSigninDialog = () => {
    let signInvisible = !this.state.signInvisible;
    this.setState({ signInvisible });
  }

  routerLinkHandler = name => e => {
    this.refs[`LINK_${name.toUpperCase()}`].handleClick(e);
    this.setState({
      links: this.state.links.map(link => ({
        ...link,
        active: link.pageName === name,
      })),
    });
  }

  getTitle() {
    return capitalise(this.state.links.find(l => l.active).pageName);
  }

  openDialog = e => {
    const event = getEmptyEvent();
    const [{ pageX, pageY }] = e.changedTouches || [e];
    this.props.toggleDialog({ isOpen: true, pageX, pageY, event, eventIndex: 0 });
  }

  render() {
    const buttons = [
      <Avatar src={this.state.avatar} role="presentation" />,
      <Button flat children={this.state.user} />,
      <Button icon tooltipLabel="sign in" onClick={this._openSigninDialog}>assignment</Button>,
      <Button icon tooltipLabel="log in" onClick={this._openLoginDialog}>assignment_ind</Button>,
      <Button icon tooltipLabel="reset events" onClick={this._resetEvents}>refresh</Button>,
      this.props.fetching ? <LinearProgress id="progress" className="loading-bar" style={{top: '50px'}} /> : null
    ].filter(x => x);

    return (
        <NavigationDrawer
          navItems={this.state.links.map(({ pageName, icon, active }) => (
            <ListItem
              key={pageName}
              className={active ? 'active' : ''}
              leftIcon={<FontIcon>{icon}</FontIcon>}
              onClick={this.routerLinkHandler(pageName)}
              primaryText={capitalise(pageName)} />
          )).concat({ key: 'divider', divider: true })}
          drawerTitle="Select view:"
          contentClassName="md-grid"
          toolbarTitle={this.getTitle()}
          toolbarTitleClassName="page-title"
          toolbarActions={buttons}
        >
          <LoginPopup visible={this.state.visible} app={this} />
          <SigninDialog visible={this.state.signInvisible} app={this}></SigninDialog>

          <BrowserRouter>
          <div>
            {PAGES.map(({ pageName }) => <Link ref={`LINK_${pageName.toUpperCase()}`} key={pageName} to={`/${pageName}`} />)}
            <Switch>
              <Route path="/week" component={ConnectedWeek} />
              <Route path="/day" component={ConnectedDay} />
              <Route path="/agenda" component={ConnectedAgenda} />
              <Route path="/table" component={ConnectedTable} />
              <Route path="/month" component={ConnectedMonth} />
            </Switch>
            {this.props.isAdmin &&
              <Button tooltipPosition="top" tooltipLabel="add event" onClick={this.openDialog} floating secondary fixed>add</Button>
            }
          </div>
          </BrowserRouter>

          <EventDialog />
          <Snackbar toasts={this.props.toasts} autohide={true} onDismiss={this.props.removeToast} />
        </NavigationDrawer>
    );
  }
}

const mapStateToProps = state => ({
  isAdmin: state.globalState.isAdmin,
  isMobile: state.globalState.isMobile,
  fetching: state.globalState.fetching,
  toasts: state.toastsReducer.toasts,
});

const mapDispatchToProps = dispatch => ({
  toggleDialog: bindActionCreators(toggleDialog, dispatch),
  setEvents: bindActionCreators(setEvents, dispatch),
  startFetching: bindActionCreators(startFetching, dispatch),
  showToast: bindActionCreators(showToast, dispatch),
  removeToast: bindActionCreators(removeToast, dispatch)
});

export const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

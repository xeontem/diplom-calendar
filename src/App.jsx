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
import { EventDialog } from './components/event-dialog';

import { toggleDialog } from './store/actions/dialog-popup-actions';
import { setEvents, startFetching, unmarkEventsUpdated, toggleAdmin } from './store/actions/global-state-actions';
import { showToast, removeToast } from './store/actions/toast-actions';

import { _closeSaveMonth } from './instruments/emptyEventOpenClose';
import { capitalise, getEmptyEvent } from './instruments/utils';
import { apiCallForHerokuDB } from './instruments/fetching';
import { getEvents, login, logout, onAuthStateChanged } from './services/firebase.service';
import './App.css';

const PAGES = [
  { pageName: 'month', icon: 'date_range' },
  { pageName: 'week', icon: 'event' },
  { pageName: 'day', icon: 'content_paste' },
  { pageName: 'table', icon: 'list' },
  { pageName: 'agenda', icon: 'view_agenda' }
];

export class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      links: PAGES.map(link => ({ ...link, active: window.location.href.includes(link.pageName) })),
      user: null,
    };
  }

  componentDidMount(prevProps) {
    this.props.startFetching();
    getEvents(events => {
      this.props.showToast({ text: 'events successfully loaded' });
      this.props.setEvents(events);
      this.props.unmarkEventsUpdated();
    });

    this.onLoginStateChange(onAuthStateChanged);
  }

  _resetEvents = () => {
    apiCallForHerokuDB('/reset').then(res => {
      this.setState({resetted: true,
        toast: [{text: res.mess}]});
    });
  }

  onLoginStateChange(promise) {
    return promise.then(user => {
      this.props.toggleAdmin(!!user);
      this.setState({ user });
    });
  }

  logIn = () => {
    this.onLoginStateChange(login())
  }

  logOut = () => {
    logout().then(user => {
      this.props.toggleAdmin(false);
      this.setState({ user });
    });
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
    return capitalise((this.state.links.find(l => l.active) || { pageName: '333' }).pageName);
  }

  openDialog = e => {
    const event = getEmptyEvent();
    const [{ pageX, pageY }] = e.changedTouches || [e];
    this.props.toggleDialog({ isOpen: true, pageX, pageY, event });
  }

  render() {
    const isAddEventButton = this.props.isAdmin && !this.props.isDialogOpen;
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
          toolbarActions={[
              <Avatar src={this.state.user ? this.state.user.photoURL : ''} style={{ display: this.state.user ? 'inline-block' : 'none' }} role="presentation" />,
              <Button flat style={{ display: this.state.user ? 'inline-block' : 'none' }} children={this.state.user ? this.state.user.displayName : ''} />,
              <Button icon tooltipLabel={this.state.user ? 'log out' : 'log in'} onClick={this.state.user ? this.logOut : this.logIn}>assignment_ind</Button>,
              <Button icon tooltipLabel="reset events" onClick={this._resetEvents}>refresh</Button>,
              <LinearProgress
                id="progress"
                className="loading-bar"
                style={{ display: this.props.eventsLoading ? 'block' : 'none', top: '50px' }}
              />
          ]}
        >
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
            <Button
              className="global-action-button"
              tooltipPosition="top"
              tooltipLabel={isAddEventButton ? 'add event' : 'send feedback'}
              onClick={isAddEventButton ? this.openDialog : this.sendFeedback}
              floating secondary fixed
            >
              {isAddEventButton ? 'add' : 'mail_outline'}
            </Button>
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
  eventsLoading: state.globalState.eventsLoading,
  toasts: state.toastsReducer.toasts,
  isDialogOpen: state.dialogPopupReducer.isOpen,
});

const mapDispatchToProps = dispatch => ({
  toggleAdmin: bindActionCreators(toggleAdmin, dispatch),
  toggleDialog: bindActionCreators(toggleDialog, dispatch),
  setEvents: bindActionCreators(setEvents, dispatch),
  startFetching: bindActionCreators(startFetching, dispatch),
  showToast: bindActionCreators(showToast, dispatch),
  removeToast: bindActionCreators(removeToast, dispatch),
  unmarkEventsUpdated: bindActionCreators(unmarkEventsUpdated, dispatch)
});

export const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

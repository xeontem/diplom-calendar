import React, { PureComponent } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'react-md/lib/Buttons/Button';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import Switcher from 'react-md/lib/SelectionControls/Switch';
import Snackbar from 'react-md/lib/Snackbars';// eslint-disable-next-line
import Avatar from 'react-md/lib/Avatars';

import { removeToast } from './actions/toastMonthActions';
import inboxListItems from './inboxListItems';
import Month from './components/month/Month';
import Week from './components/week/Week';
import Day from './components/day/Day';
import Table from './components/table/Table';
import Agenda from './components/agenda/Agenda';
import globalScope from './globalScope';
import LoginDialog from './components/login/loginDialog';

import { _loadEvents } from './instruments/fetching';
import gitLogo from './github-logo.svg';
import './App.css';


class App extends PureComponent {
    constructor(props) {
        super(props);
        this.title = 'Month';
        this._navItems = inboxListItems.map(item => {
          if (!item.divider) {
            item.onClick = () => this._setPage(item);
          }
          return item;
        });
        this.state = {
            isAdmin: false,
            toast: [],
            visible: false,
            user: 'user',
            avatar: globalScope.defaultAvatar
        }
        this.month = () => (<Month removeToast={this.props.removeToast} _toastMonthReducer={this.props._toastMonthReducer}/>)
    }

    _setPage = (item) => { // eslint-disable-next-line
        inboxListItems.map(it => {
          if (!it.divider) it.active = false;
        });
        item.active = true;
        switch(item.key) {
            case "Month": {
                this.title = "Month";
                return;
            }
            case "Week": {
                this.title = "Week";
                return;
            }
            case "Day": {
                this.title = "Day";
                return;
            }
            case "Table": {
                this.title = "Table";
                return;
            }
            case "Agenda": {
                this.title = "Agenda";
                return;
            }
            default: {
                this.title = "Month";
                return;
            }
        }
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

    render() {
        const buttons = ([
            <Avatar src={this.state.avatar} role="presentation" />,
            <Button flat label={this.state.user} />,
            <Button icon tooltipLabel="log in" onClick={this._openLoginDialog}>assignment_ind</Button>,
            <Button icon tooltipLabel="reset events" onClick={this._resetEvents}>refresh</Button>
        ]);
        return (
            <NavigationDrawer
                navItems={this._navItems}
                drawerTitle="Select view:"
                contentClassName="md-grid"
                toolbarTitle={this.title}
                toolbarActions={buttons}
            >
            <LoginDialog visible={this.state.visible} app={this}></LoginDialog>
            <Snackbar toasts={this.state.toast} autohide={true} onDismiss={this._removeToast}/>
            <Switch>
                <Route exact path="/month" component={this.month} />
                <Route path="/week" component={Week} />
                <Route path="/day" component={Day} />
                <Route path="/agenda" component={Agenda} />
                <Route path="/table" component={Table} />
            </Switch>

            </NavigationDrawer>
        );
    }
}

function mapStateToProps(state) {
    return {
        _toastMonthReducer: state.toastMonthReducer
    };
}

function mapDispatchToProps(dispatch) {
    return {
        removeToast: bindActionCreators(removeToast, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, { PureComponent } from 'react';
import { Switch, Route, Link, Redirect } from 'react-router-dom';
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
import SigninDialog from './components/login/signinDialog';

import { _loadEvents } from './instruments/fetching';
import gitLogo from './github-logo.svg';
import './App.css';

import FontIcon from 'react-md/lib/FontIcons';

class App extends PureComponent {
    constructor(props) {
        super(props);
        this.title = '';
        this._navItems = inboxListItems;
        this.state = {
            isAdmin: false,
            toast: [],
            visible: false,
            signInvisible: false,
            user: 'user',
            avatar: globalScope.defaultAvatar
        }
        this.month = () => (<Month removeToast={this.props.removeToast} _toastMonthReducer={this.props._toastMonthReducer}/>)
    }

    _resetColorLink = (e) => {
        let elements = document.querySelectorAll('[id^=link]');
        elements.forEach(element => {
            if(element.classList.contains('active')) element.classList.remove('active');
        });

        e.nativeEvent.path.map(el => {
            if(el.classList && el.tagName === 'A') {

                el.classList.add('active');
            }
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

    render() {
        const mobile = typeof window.orientation !== 'undefined';
        const pathname = window.location.pathname;
        if(!mobile && pathname.length > 1) this.title = pathname.slice(1)[0].toUpperCase() + pathname.slice(2);
         // this.title = '';
        const buttons = ([
            <Avatar src={this.state.avatar} role="presentation" />,
            <Button flat label={this.state.user} />,
            <Button icon tooltipLabel="sign in" onClick={this._openSigninDialog}>assignment</Button>,
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
                onClick={this._resetColorLink}
            >
                <LoginDialog visible={this.state.visible} app={this}></LoginDialog>
                <SigninDialog visible={this.state.signInvisible} app={this}></SigninDialog>
                <Snackbar toasts={this.state.toast} autohide={true} onDismiss={this._removeToast}/>

                <Route exact path="/month" component={this.month} />
                <Route exact path="/week" component={Week} />
                <Route exact path="/day" component={Day} />
                <Route exact path="/agenda" component={Agenda} />
                <Route exact path="/table" component={Table} />
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

import React, { PureComponent } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from 'react-md/lib/Buttons/Button';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import Switcher from 'react-md/lib/SelectionControls/Switch';

import { removeToast } from './actions/toastMonthActions';
import inboxListItems from './inboxListItems';
import Month from './components/month/Month';
import Week from './components/week/Week';
import Day from './components/day/Day';
import Table from './components/table/Table';
import Agenda from './components/agenda/Agenda';
import globalScope from './globalScope';

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
            isAdmin: false
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

    render() {
        const buttons = ([
            <h3 className={`admin-${this.state.isAdmin}`}>SUDO</h3>,
            <Switcher id="switch1" style={{display: 'inline-flex'}} name="controlledSwitch" checked={this.state.isAdmin} onChange={this._handleChange} />,
            <Button icon tooltipLabel="Open in Github" href="https://github.com/xeontem"><img style={{width: 25}} src={gitLogo}/></Button>,
            <Button icon tooltipLabel="Add to favorite">favorite</Button>
        ]);
        return (
            <NavigationDrawer
                navItems={this._navItems}
                drawerTitle="Select view:"
                contentClassName="md-grid"
                toolbarTitle={this.title}
                toolbarActions={buttons}
            >
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

import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import Button from 'react-md/lib/Buttons/Button';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';

import inboxListItems from './inboxListItems';
import Month from './components/month/Month';
import Week from './components/week/Week';
import Day from './components/day/Day';
import Agenda from './components/agenda/Agenda.jsx';

import gitLogo from './github-logo.svg';
import './App.css';


export default class App extends PureComponent {
    constructor(props) {
        super(props);
        this.title = 'Month';
        this._navItems = inboxListItems.map(item => {
          if (!item.divider) {
            item.onClick = () => this._setPage(item);
          }
          return item;
        });
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


    render() {
        const buttons = ([
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
                <Route exact path="/month" component={Month} />
                <Route path="/week" component={Week} />
                <Route path="/day" component={Day} />
                <Route path="/agenda" component={Agenda} />
            </Switch>
            </NavigationDrawer>
        );
    }
}

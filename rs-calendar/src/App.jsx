import React, { PureComponent } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import FontIcon from 'react-md/lib/FontIcons';
import Button from 'react-md/lib/Buttons/Button';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import SelectField from 'react-md/lib/SelectFields';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';

import inboxListItems from './components/constants/inboxListItems';
import Month from './components/month/Month';
import Week from './components/week/Week';
import Day from './components/day/Day';
import Agenda from './components/agenda/Agenda.jsx';

import './App.css';


export default class App extends PureComponent {
    constructor(props) {
        super(props);
        this.title = 'Agenda';
        this.state = {
            key: 0,
            count: 3,
            view: [Month, Week, Day, Agenda]
        };

        this._navItems = inboxListItems.map(item => {
          if (!item.divider) {
            item.onClick = () => this._setPage(item);
          }
          return item;
        });
    }

    _setPage = (item) => {
        inboxListItems.map(it => {
          if (!it.divider) it.active = false;
        });
        item.active = true;
        switch(item.key) {
            case "Month": {
                this.title = "Month";
                this.setState({count: 0});
                return;
            }
            case "Week": {
                this.title = "Week";
                this.setState({count: 1});
                return;
            }
            case "Day": {
                this.title = "Day";
                this.setState({count: 2});
                return;
            }
            case "Agenda": {
                this.title = "Agenda";
                this.setState({count: 3});
                return;
            }
            default: {
                this.title = "Agenda";
                this.setState({count: 3});
                return;
            }
        }
    }



    render() {
        let count = this.state.count;
        let View = this.state.view[count];
        let link = () => (
            <Link to="/month">Month</Link>
            )
        const buttons = ([
            <Button icon tooltipLabel="Open in Github" href="https://github.com/xeontem" iconClassName="fa fa-github" />,
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
                // drawerChildren={drawerHeaderChildren}

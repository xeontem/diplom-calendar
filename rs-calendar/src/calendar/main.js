import React from 'react';

import Toolbar from './toolbar';
import Month from './month';

export default class Calendar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Toolbar />
                <Month   />
            </div>
        );
    }    
}

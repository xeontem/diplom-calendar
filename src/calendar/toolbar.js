import React from 'react';

export default class Toolbar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="toolbar">
            	<nav>
            		<button>TODAY</button>
            		<button>PREVIOUS</button>
            		<button>NEXT</button>
            	</nav>
            	<div><p>Date to show</p></div>
            	<nav>
            		<button>MONTH</button>
            		<button>WEEK</button>
            		<button>DAY</button>
            		<button>AGENDA</button>
            	</nav>
            </section>
        );
    }
}

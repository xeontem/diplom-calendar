import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Calendar from './calendar/main';

export default class App extends React.Component {
  constructor(...args) {
    console.dir(args);
    super(...args);
  }
  
  render() {
    return ( <Calendar /> )
  }
}

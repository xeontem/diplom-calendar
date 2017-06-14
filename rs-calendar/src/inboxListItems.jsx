import React from 'react';
import { Link } from 'react-router-dom';
import FontIcon from 'react-md/lib/FontIcons';

export default [{
  key: 'Month',
  primaryText: <Link to="/month">Month</Link>,
  leftIcon: <FontIcon>date_range</FontIcon>,
  active: true,
}, {
  key: 'Week',
  primaryText: <Link to="/week">Week</Link>,
  leftIcon: <FontIcon>event</FontIcon>,
  active: false,
}, {
  key: 'Day',
  primaryText: <Link to="/day">Day</Link>,
  leftIcon: <FontIcon>content_paste</FontIcon>,
  active: false,
}, {
  key: 'Table',
  primaryText: <Link to="/table">Table</Link>,
  leftIcon: <FontIcon>list</FontIcon>,
  active: false,
}, {
  key: 'Agenda',
  primaryText: <Link to="/agenda">Agenda</Link>,
  leftIcon: <FontIcon>view_agenda</FontIcon>,
  active: false,
}, { key: 'divider', divider: true }
];

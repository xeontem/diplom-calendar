import React from 'react';
import SelectField from 'react-md/lib/SelectFields';
import { EVENT_TYPES } from '../../instruments/constants';
import './style.css';

export const EventSelector = (props) => {
  return (
    <SelectField
      id="statesControlled"
      value={props.value}
      placeholder="Some State"
      menuItems={EVENT_TYPES}
      onChange={props.onChange}
      className={`${props.className || ''}`}
      itemLabel="label"
      itemValue="value"
    />
  );
};

import React from 'react';
import SelectField from 'react-md/lib/SelectFields';
import { EVENT_TYPES } from '../../instruments/constants';

export const EventSelector = (props) => {
  return (
    <SelectField
      id="statesControlled"
      label="Select type of event"
      value={props.value}
      placeholder="Some State"
      menuItems={EVENT_TYPES}
      onChange={props.onChange}
      errorText="A state is required"
      className="md-cell"
      itemLabel="label"
      itemValue="value"
    />
  );
};

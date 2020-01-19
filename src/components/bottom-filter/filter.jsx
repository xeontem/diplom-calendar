import React from 'react';
import Button from 'react-md/lib/Buttons';
import { EVENT_TYPES } from '../../instruments/constants';

export const Filter = (props) => {
  const _toggle = (e) => {
    e.nativeEvent.path.forEach(el => {
      if(el.classList && el.classList.contains('action')) {
        if(props.toggleValue === el.dataset.type) props._filterByType('All');
        else props._filterByType(el.dataset.type);
      }
    });
  };

  return (
    <div>
      <h3>Legend:</h3>
      <div className="md-grid no-padding box" onClick={_toggle}>
      { EVENT_TYPES.filter(t => t.value !== 'All').map(type =>
        <Button
          raised
          key={type.value}
          data-type={type.value}
          className={`action ${props.toggleValue === type.value ? 'today' : ''}`}
        >
          <div className={`event-cell ${type.value}`}></div>
          <p>{ type.label }</p>
        </Button>
      ) }
      </div>
    </div>
  );
};

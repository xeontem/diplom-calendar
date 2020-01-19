import React from 'react';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import SelectField from 'react-md/lib/SelectFields';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import { EVENT_TYPES } from '../../instruments/constants';
import { EventSelector } from '../event-type-selector/selector';

import { _filterByFromDate, _filterByToDate, _filterByType } from '../../instruments/filters';
import { _closeSaveTableAgenda } from '../../instruments/emptyEventOpenClose';

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: this.props.events,
      filtered: this.props.events,
      value: 'All',
      from: 'All',
      to: 'All'
    }
    this._filterByType = _filterByType.bind(this, false);
    this._filterByToDate = _filterByToDate.bind(this);
    this._filterByFromDate = _filterByFromDate.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.events.length !== this.props.events.length) {
      this.setState({
        events: this.props.events,
        filtered: this.props.events
      });
    }
  }

  openDialog = (event, eventIndex) => e => {
    if (event) {
      const [{ pageX, pageY }] = e.changedTouches || [e];
      this.props.toggleDialog({ isOpen: true, pageX, pageY, event, eventIndex });
    }
  }

  render() {
    return (
      <div className="agenda-wrapper">
        <div className="md-grid no-padding">
          <DatePicker
            id="fromDate"
            label="Select from date"
            locales="ru-RU"
            className="md-cell"
            onChange={this._filterByFromDate}
            autoOk
          />
          <DatePicker
            id="toDate"
            label="Select to date"
            locales="ru-RU"
            className="md-cell"
            onChange={this._filterByToDate}
            autoOk
          />
          <EventSelector
            value={this.state.value}
            onChange={this._filterByType}
          />
        </div>
        <div>
          <DataTable plain onClick={this._showInfo}>
            <TableHeader>
              <TableRow>
                <TableColumn>type</TableColumn>
                <TableColumn>title</TableColumn>
                <TableColumn>description</TableColumn>
                <TableColumn>location</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {this.state.filtered.map((event, i) =>
                <TableRow key={event.description.slice(0, 45)} onClick={this.openDialog(event, i)} className="pointer">
                  <TableColumn>{event.type.toUpperCase()}</TableColumn>
                  <TableColumn>{event.title.toUpperCase()}</TableColumn>
                  <TableColumn>{event.description.slice(0, 45)+'...'}</TableColumn>
                  <TableColumn>{event.location}</TableColumn>
                </TableRow>
              )}
            </TableBody>
          </DataTable>
        </div>
      </div>
    )
  }
}

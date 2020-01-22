import React from 'react';
import DatePicker from 'react-md/lib/Pickers/DatePickerContainer';
import SelectField from 'react-md/lib/SelectFields';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import { EVENT_TYPES, LECTURES_TYPES } from '../../instruments/constants';
import { EventSelector } from '../event-type-selector/selector';

import { _filterByFromDate, _filterByToDate, _filterByType } from '../../instruments/filters';
import { _closeSaveTableAgenda } from '../../instruments/emptyEventOpenClose';

import './styles.css';

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: this.props.events,
      filtered: this.validateEvents(this.props.events),
      value: 'All',
      from: 'All',
      to: 'All'
    }
    this._filterByType = _filterByType.bind(this, false);
    this._filterByToDate = _filterByToDate.bind(this);
    this._filterByFromDate = _filterByFromDate.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.eventsUpdated && !this.props.eventsUpdated) {
      this.setState({
        events: this.props.events,
        filtered: this.validateEvents(this.props.events)
      });
    }
  }

  validateEvents(events) {
    const prevalidated = events.reduce((filtered, event) => {
      const eventTime = this.getEventDate(event.start, 4, 16);
      const timeValue = new Date(eventTime).getTime();
      const eventDay = filtered.find(map => map.time === eventTime);
      if (eventDay) {
        eventDay.events.push(event);
      } else {
        filtered.push({ timeValue, time: eventTime, events: [event] });
      }
      return filtered;
    }, [])
      .map(dayEvent => {
        dayEvent.events.sort((a, b) => a.start - b.start);
        return this.getInvalidEventIndexes(dayEvent);
      })
      .sort((a, b) => a.timeValue - b.timeValue);
    return this.checkNextDayEvent(prevalidated);
  }

  checkNextDayEvent(events) {
    let prevDay;
    return events.reduce((validated, eventDay) => {
      if (prevDay) {
        const prev = prevDay.events[prevDay.events.length - 1];
        const next = eventDay.events[0];
        const twelvehours = 1000 * 60 *60 * 12;
        const sameLector = next.speakers.includes(prev.speakers[0]);
        if (prev.title === next.title && (next.start - prev.start) < twelvehours && sameLector) {
          eventDay.invalidEventIndexes.push(next.id);
        }
      }
      prevDay = eventDay
      validated.push(eventDay);
      return validated;
    }, []);
  }

  openDialog = (event, eventIndex) => e => {
    if (event) {
      const [{ pageX, pageY }] = e.changedTouches || [e];
      this.props.toggleDialog({ isOpen: true, pageX, pageY, event, eventIndex });
    }
  }

  getInvalidEventIndexes(dayEvent) {
    return {
      ...dayEvent,
      invalidEventIndexes: dayEvent.events.reduce((titles, event, i) => {
        const eventTitles = titles.find(t => t.title === event.title);
        if (eventTitles) {
          eventTitles.events.push(event);
        } else {
          titles.push({ title: event.title, events: [event] });
        }
        return titles;
      }, []).reduce((indexes, titles, i, arr) => {
        if (titles.events.length > 1) {
          const restTitles = arr.filter(t => t.title !== titles.title)
          restTitles.forEach(rts => {
            rts.events.forEach(re => {
              const less = titles.events.find(e => e.start < re.start);
              const  more = titles.events.find(e => e.start > re.start);
              const sameLector = more && re.speakers.includes(more.speakers[0]);
              if (less && more && sameLector) {
                indexes.push(more.id);
              }
            });
          });
        }
        return indexes;
      }, [])
    };
  }

  getEventDate(start, startTrim, endTrim) {
    return (new Date(start)).toString().slice(startTrim, endTrim);
  }

  invaliCheck(dayEvents, id) {
    return dayEvents.invalidEventIndexes.includes(id) ? 'invalid-event' : '';
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
            className="global-selector"
            value={this.state.value}
            onChange={this._filterByType}
          />
        </div>
        <div>
          <DataTable plain onClick={this._showInfo}>
            <TableHeader>
              <TableRow>
                <TableColumn>Type</TableColumn>
                <TableColumn>Title</TableColumn>
                <TableColumn>Time</TableColumn>
                <TableColumn>Location</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              { this.state.filtered.flatMap((dayEvents, i) =>
                dayEvents.events.map((event, i) => [
                  (i === 0 &&
                    <TableRow key={dayEvents.time} className="day-header">
                      <TableColumn>{dayEvents.time}</TableColumn>
                      <TableColumn></TableColumn>
                      <TableColumn></TableColumn>
                      <TableColumn></TableColumn>
                    </TableRow>
                  ),
                  <TableRow key={event.id} onClick={this.openDialog(event, i)} className={`pointer ${this.invaliCheck(dayEvents, event.id)}`}>
                    <TableColumn>{(EVENT_TYPES.find(t => t.value === event.type) || {}).label}</TableColumn>
                    <TableColumn>{(LECTURES_TYPES.find(t => t.value === event.title) || {}).label}</TableColumn>
                    <TableColumn>{this.getEventDate(event.start, 16, 21)}</TableColumn>
                    <TableColumn>{event.location}</TableColumn>
                  </TableRow>
                ].filter(x => x))
              ) }
            </TableBody>
          </DataTable>
        </div>
      </div>
    )
  }
}

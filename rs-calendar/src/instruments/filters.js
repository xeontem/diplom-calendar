export function _filterByType(value) {
    // alert('_filterByType');
    let filtered = this.state.events;
    if(this.state.from !== 'All') {

        // let fromDate = new Date(this.state.from);
        let dayFrom = this.state.from.getDate();
        let monthFrom = this.state.from.getMonth();
        let yearFrom = this.state.from.getFullYear();

        filtered = filtered.filter((event) => {
            let date = new Date(event.start);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            if(year >= yearFrom && month > monthFrom) return true;
            if(month == monthFrom && day >= dayFrom) return true;
            return false;      
        });
    }

    if(this.state.to !== 'All') {

        // let toDate = new Date(this.state.to);
        let dayTo = this.state.to.getDate();
        let monthTo = this.state.to.getMonth();
        let yearTo = this.state.to.getFullYear();

        filtered = filtered.filter((event) => {
            let date = new Date(event.start);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            if(year <= yearTo && month < monthTo) return true;
            if(month == monthTo && day <= dayTo) return true;
            return false;      
        });
    }
    if(value !== 'All') {
        filtered = filtered.filter((event) => {
            return event.type === value;
        });
    }    
    let appliedEventsMonth;
    if(this._applyEventsOnDates) appliedEventsMonth = this._applyEventsOnDates(filtered, this.state.dateToShow);
    this.setState({filtered, value, toggleValue: value, appliedEventsMonth});
}

export function _filterByToDate(to) {

    let toDate = to.slice(3, 6);
    toDate += to.slice(0, 2);
    toDate += to.slice(5);
    toDate = new Date(toDate);
    let dayTo = toDate.getDate();
    let monthTo = toDate.getMonth();
    let yearTo = toDate.getFullYear();

    let filtered = this.state.events;
    if(this.state.from !== 'All') {

        // let fromDate = new Date(this.state.from);
        let dayFrom = this.state.from.getDate();
        let monthFrom = this.state.from.getMonth();
        let yearFrom = this.state.from.getFullYear();

        filtered = filtered.filter((event) => {
            let date = new Date(event.start);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            if(year >= yearFrom && month > monthFrom) return true;
            if(month == monthFrom && day >= dayFrom) return true;
            return false;      
        });
    }

    filtered = filtered.filter((event) => {
        let date = new Date(event.start);
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        if(year <= yearTo && month < monthTo) return true;
        if(month == monthTo && day <= dayTo) return true;
        return false;      
    });

    if(this.state.value !== 'All') {
        filtered = filtered.filter((event) => {
            return event.type === this.state.value;
        });
    }
    let appliedEventsMonth;
    if(this._applyEventsOnDates) appliedEventsMonth = this._applyEventsOnDates(filtered, this.state.dateToShow);
    this.setState({filtered, to: toDate, appliedEventsMonth});
}

export function _filterByFromDate(from) {
        
    let fromDate = from.slice(3, 6);
    fromDate += from.slice(0, 2);
    fromDate += from.slice(5);
    fromDate = new Date(fromDate);
    let dayFrom = fromDate.getDate();
    let monthFrom = fromDate.getMonth();
    let yearFrom = fromDate.getFullYear();

    let filtered = this.state.events;
    filtered = filtered.filter((event) => {
        let date = new Date(event.start);
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        if(year >= yearFrom && month > monthFrom) return true;
        if(month == monthFrom && day >= dayFrom) return true;
        return false;      
    });
    if(this.state.to !== 'All') {

        // let toDate = new Date(this.state.to);
        let dayTo = this.state.to.getDate();
        let monthTo = this.state.to.getMonth();
        let yearTo = this.state.to.getFullYear();

        filtered = filtered.filter((event) => {
            let date = new Date(event.start);
            let day = date.getDate();
            let month = date.getMonth();
            let year = date.getFullYear();
            if(year <= yearTo && month < monthTo) return true;
            if(month == monthTo && day <= dayTo) return true;
            return false;      
        });
    }
    if(this.state.value !== 'All') {
        filtered = filtered.filter((event) => {
            return event.type === this.state.value;
        });
    }
    let appliedEventsMonth;
    if(this._applyEventsOnDates) appliedEventsMonth = this._applyEventsOnDates(filtered, this.state.dateToShow);
    this.setState({filtered, from: fromDate, appliedEventsMonth});
}

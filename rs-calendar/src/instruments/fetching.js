export function _loadSpeakers() {
            let urls = [];
            this.props.event.speakers.map(id => urls.push('http://128.199.53.150/trainers/' + id));
            Promise.all(urls.map(url => fetch(url)))
                .then(resp => Promise.all( resp.map(r => r.json()) ))
                .then(speakers => this.setState({speakers, speakersReady: true}));
}

export function _loadEvents() {
            let that = this;
            fetch('http://128.199.53.150/events')
                .then(response => response.json())
                .then(events =>{
                    that.setState({
                        events: events,
                        filtered: events,
                        fetching: false
                    });
                });
}

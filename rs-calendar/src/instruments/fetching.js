// let source = 'http://localhost:4444';
let source = 'https://sheltered-headland-67163.herokuapp.com';

export function _loadEvents(url) {
            return fetch(source+url)
                .then(response => response.json());
}

export function _loadSpeakers(speakersIDs) {
            let urls = [];
            speakersIDs.map(id => urls.push(source + '/trainers/' + id));
            Promise.all(urls.map(url => fetch(url)))
                .then(resp => Promise.all( resp.map(r => r.json()) ))
                .then(speakers => this.setState({speakers, speakersReady: true}));
}

export function sendToBackend(event) {
    fetch(source + '/events',
        {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json' },
            body: JSON.stringify(event)
        })
}

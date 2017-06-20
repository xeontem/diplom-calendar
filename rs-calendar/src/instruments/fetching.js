export function _loadEvents(url) {
            return fetch(url)
                .then(response => response.json());
}

export function _loadSpeakers(speakersIDs) {
            let urls = [];
            speakersIDs.map(id => urls.push('http://128.199.53.150/trainers/' + id));
            Promise.all(urls.map(url => fetch(url)))
                .then(resp => Promise.all( resp.map(r => r.json()) ))
                .then(speakers => this.setState({speakers, speakersReady: true}));
}

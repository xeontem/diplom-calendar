// let source = 'http://localhost:4444';
let source = 'https://damp-earth-84904.herokuapp.com';

export const _loadEvents = url => fetch(source+url)
  .then(response => response.json())
  .then(events => events.filter(e => e.type && e.title));

export function _loadSpeakers(speakersIDs) {
  let urls = [];
  speakersIDs.map(id => urls.push(source + '/trainers/' + id));
  Promise.all(urls.map(url => fetch(url)))
    .then(resp => Promise.all( resp.map(r => r.json()) ))
    .then(speakers => this.setState({speakers, speakersReady: true}));
}

export function sendToBackend(event) {
  let headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  return fetch(source + '/events',
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(event)
    }
  );
}

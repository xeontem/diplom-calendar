const DOMAIN = 'https://rs-calendar-events.herokuapp.com';

export const _loadEvents = url => fetch(DOMAIN+url)
  .then(response => response.json())
  .then(events => events.filter(e => e.type));

export const _loadSpeakers = speakersIDs =>
  Promise.all(speakersIDs.map(id =>
    fetch(DOMAIN + '/trainers/' + id).then(resp => resp.json())));

export function sendToBackend(event) {
  let headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  return fetch(DOMAIN + '/events',
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(event)
    }
  );
}

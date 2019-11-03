import { HEROKU_DB_DOMAIN } from './constants';

export const apiCallForHerokuDB = url => fetch(HEROKU_DB_DOMAIN + url)
  .then(response => response.json());

export const _loadSpeakers = speakersIDs =>
  Promise.all(speakersIDs.map(id =>
    fetch(HEROKU_DB_DOMAIN + '/trainers/' + id).then(resp => resp.json())));

export function sendToBackend(event) {
  let headers = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  });

  return fetch(HEROKU_DB_DOMAIN + '/events',
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify(event)
    }
  );
}

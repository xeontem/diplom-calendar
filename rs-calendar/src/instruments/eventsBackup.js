let eventBackup = {};
export function eventBackupGet() { return eventBackup};
export function eventBackupSet(event) {eventBackup = event}


let tempEvent = {};
export function tempEventGet() { return tempEvent};
export function tempEventSet(event) {tempEvent = event}

let speakersBackup = [];
export function speakersBackupGet() { return speakersBackup};
export function speakersBackupSet(event) {speakersBackup = event};

let speakersTemp = [];
export function speakersTempGet() { return speakersTemp};
export function speakersTempSet(event) {speakersTemp = event}

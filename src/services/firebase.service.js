import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const userAdapter = result => ({ displayName: result.displayName, photoURL: result.photoURL });

const firebaseConfig = {
  apiKey: "AIzaSyCPSkUCNDS5sQrVId7cEL3JgAa-aJdhe5o",
  authDomain: "diplom-calendar.firebaseapp.com",
  databaseURL: "https://diplom-calendar.firebaseio.com",
  projectId: "diplom-calendar",
  storageBucket: "diplom-calendar.appspot.com",
  messagingSenderId: "769571187642",
  appId: "1:769571187642:web:06cb0c100ff00d6c390b83",
  measurementId: "G-6VH18L9BQR"
};

firebase.initializeApp(firebaseConfig);

const DB = firebase.firestore();
const auth = firebase.auth();
const eventsCollection = DB.collection('events');
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

export const onAuthStateChanged = new Promise(res => {
  auth.onAuthStateChanged(data => {
    res(userAdapter(data));
  });
});

export const getEvents = cb => eventsCollection.onSnapshot(snap =>
  cb(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))))

export const updateEvent = ({ id, ...newEvent }) => {
  console.log(newEvent);
  return eventsCollection.doc(id).update(newEvent);
};
  // .catch(e => {
  //   const numberDate = new Date(newEvent.start).getTime();
  //   const newTime = new Date(numberDate + (1000*60*60*24*31*31)).getTime();
  //   console.log(new Date(newTime));
  //   eventsCollection.doc().set({ ...newEvent, start: newTime });
  // });

export const createNewEvent = ({ id, ...newEvent }) => eventsCollection.doc().set(newEvent);


export const login = () => auth.signInWithPopup(provider)
  .then(data => userAdapter(data.user))
  .catch(console.log);

export const logout = () => auth.signOut()
  .then(() => null)
  .catch(console.log);

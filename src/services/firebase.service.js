import firebase from 'firebase';

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
const eventsCollection = DB.collection('events');

// Add
// DB.collection("users").add({
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
// })
// .then(function(docRef) {
//     console.log("Document written with ID: ", docRef.id);
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error);
// });


// Read
export const getEvents = cb => eventsCollection
  .onSnapshot(snap => cb(snap.docs.map(doc => ({ ...doc.data(), id: doc.id }))))

export const updateEvent = ({ id, ...newEvent }) => eventsCollection.doc(id).update(newEvent);

export const createNewEvent = ({ id, ...newEvent }) => eventsCollection.doc().set(newEvent);

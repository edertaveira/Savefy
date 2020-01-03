import { createStore, combineReducers, compose } from 'redux'
import { reduxFirestore, firestoreReducer, createFirestoreInstance } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCg1Z-jMknefH0phRsKRh9qnBVUyNOIUS4",
    authDomain: "anjobom-5eeeb.firebaseapp.com",
    databaseURL: "https://anjobom-5eeeb.firebaseio.com",
    projectId: "anjobom-5eeeb",
    storageBucket: "anjobom-5eeeb.appspot.com",
    messagingSenderId: "1060000552848",
    appId: "1:1060000552848:web:cb1f8204a5c3c3ae550515",
    measurementId: "G-ET4T7EYVM7"
}; // from Firebase Console
const rfConfig = {} // optional redux-firestore Config Options

// Initialize firebase instance
firebase.initializeApp(firebaseConfig)
// Initialize Cloud Firestore through Firebase
firebase.firestore();

// Add reduxFirestore store enhancer to store creator
const createStoreWithFirebase = compose(
    reduxFirestore(firebase, rfConfig), // firebase instance as first argument, rfConfig as optional second
)(createStore)

// Add Firebase to reducers
const rootReducer = combineReducers({
    firebase: firebaseReducer,
    firestore: firestoreReducer
})

// Create store with reducers and initial state
const initialState = {}
const store = createStoreWithFirebase(rootReducer, initialState)

const rrfConfig = {
    enableLogging: false,
    userProfile: 'users', // root that user profiles are written to
    updateProfileOnLogin: false, // enable/disable updating of profile on login
    //presence: 'presence', // list currently online users under "presence" path in RTDB
    //sessions: null, // Skip storing of sessions
    useFirestoreForProfile: true, // Save profile to Firestore instead of Real Time Database
    useFirestoreForStorageMeta: true // Metadata associated with storage file uploads goes to Firestore
    // profileDecorator: (userData) => ({ email: userData.email }) // customize format of user profile
}

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance
}

export { store, rrfProps };
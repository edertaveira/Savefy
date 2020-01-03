import { createStore, combineReducers, compose } from 'redux'
import { reduxFirestore, firestoreReducer, createFirestoreInstance } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyCsQiyrcx9SMr9TStzcK713lk_cpJuAf6s",
    authDomain: "anjobom-10d2b.firebaseapp.com",
    databaseURL: "https://anjobom-10d2b.firebaseio.com",
    projectId: "anjobom-10d2b",
    storageBucket: "anjobom-10d2b.appspot.com",
    messagingSenderId: "637822282147",
    appId: "1:637822282147:web:7dc12044bddfb4d07b9216",
    measurementId: "G-T1PJBEFBN8"
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
import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyAUE5v4GX4Ti4QZhNhRLY7rmB7F3co3Ju8",
    authDomain: "vacathon.firebaseapp.com",
    databaseURL: "https://vacathon.firebaseio.com",
    projectId: "vacathon",
    storageBucket: "vacathon.appspot.com",
    messagingSenderId: "525053490596"
};

console.log('firebase up!')
firebase.initializeApp(config)
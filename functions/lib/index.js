"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.firestoreEmail = functions.firestore
    .document('movies/{movieId}')
    .onCreate(event => {
    const movieId = event.params.movieId;
    const movie = event.data.data();
    const searchableIndex = createIndex(movie.title);
    const indexedMovie = Object.assign({}, movie, { searchableIndex });
    const db = admin.firestore();
    return db.collection('movies').doc(movieId).set(indexedMovie, { merge: true });
});
function createIndex(title) {
    const arr = title.toLowerCase().split('');
    const searchableIndex = {};
    let prevKey = '';
    for (const char of arr) {
        const key = prevKey + char;
        searchableIndex[key] = true;
        prevKey = key;
    }
    return searchableIndex;
}
//# sourceMappingURL=index.js.map
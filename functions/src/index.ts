import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);


exports.firestoreEmail = functions.firestore
.document('movies/{movieId}')
.onCreate(event => {

    const movieId = event.params.movieId;
    const movie = event.data.data();

    const searchableIndex = createIndex(movie.title)

    const indexedMovie = { ...movie, searchableIndex }

    const db = admin.firestore()

    return db.collection('movies').doc(movieId).set(indexedMovie, { merge: true })

})

function createIndex(title) {
    const arr = title.toLowerCase().split('');
    const searchableIndex = {}

    let prevKey = '';

    for (const char of arr) {
        const key = prevKey + char;
        searchableIndex[key] = true
        prevKey = key
    }

    return searchableIndex
}
import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { switchMap, filter } from 'rxjs/operators';


@Component({
  selector: 'type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.sass']
})
export class TypeAheadComponent implements OnInit {

  results: Observable<any[]>;

  offset = new Subject<string>();

  constructor(private afs: AngularFirestore) { }

  // Form event handler
  onkeyup(e) {
    this.offset.next(e.target.value.toLowerCase())
  }

  // Reactive search query
  search() {
    return this.offset.pipe(
      filter(val => !!val), // filter empty strings
      switchMap(offset => {
        return this.afs.collection('movies', ref =>
          ref.orderBy(`searchableIndex.${offset}`).limit(5)
        )
        .valueChanges()
      })
    )
  }

  ngOnInit() {
    this.results = this.search();
  }



}

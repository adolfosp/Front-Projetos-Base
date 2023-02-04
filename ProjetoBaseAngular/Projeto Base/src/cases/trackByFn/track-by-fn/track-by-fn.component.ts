import { Component } from '@angular/core';

@Component({
  selector: 'app-track-by-fn',
  templateUrl: './track-by-fn.component.html',
  styleUrls: ['./track-by-fn.component.scss'],
})
export class TrackByFnComponent {
  public collection: any = [];
  constructor() {
    this.collection = [{ id: 1 }, { id: 2 }, { id: 3 }];
  }

  getItems() {
    this.collection = this.getItemsFromServer();
  }

  getItemsFromServer() {
    return [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}

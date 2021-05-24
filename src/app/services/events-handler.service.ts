import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsHandlerService {

  public tab1Selected:Subject<string>;

  constructor() {
    this.tab1Selected = new Subject<string>();
  }


}

import { Component } from '@angular/core';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss']
})
export class Tab5Page {

  public yarokBands = [
    {
      name: 'Isaely family'
    },
    {
      name: 'Green Jerusalem'
    },
    {
      name: 'My Street Group'
    },
  ]

  constructor() {}

}

import { Component } from '@angular/core';
import { EventsHandlerService } from '../services/events-handler.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private eventsHandler:EventsHandlerService) {
    
  }


  test(event:any){
    this.eventsHandler.tab1Selected.next(event);
  }
}

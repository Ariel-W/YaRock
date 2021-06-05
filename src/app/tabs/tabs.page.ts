import { Component } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { EventsHandlerService } from '../services/events-handler.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  public currUser;

  constructor(
    private eventsHandler: EventsHandlerService,
    private firestoreService: FirestoreService,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit() {
    const loggedInUser = await this.authenticationService.isLoggedIn();
    if (loggedInUser) {
      this.firestoreService
        .getUserByUidObs(loggedInUser.uid)
        .subscribe((user) => {
          this.currUser = user;
        });
    }
  }

  test(event: any) {
    this.eventsHandler.tab1Selected.next(event);
  }
}

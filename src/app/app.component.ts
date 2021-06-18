import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { KeepAwake } from '@capacitor-community/keep-awake';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit() {
    // const keepAwake = async () => {
    await KeepAwake.keepAwake();
    // };

    // const allowSleep = async () => {
    //   await KeepAwake.allowSleep();
    // };
    const loggedInUser = await this.authenticationService.isLoggedIn();
    if (loggedInUser) {
      const user: any = await this.firestoreService.getUserByUid(
        loggedInUser.uid
      );
      user.visits = user.visits || {};
      const currTime = Date.now();
      user.visits[currTime] = currTime;
      await this.firestoreService.createOrUpdateUser(user);
      this.router.navigate(['main/tabs/tab1'], { relativeTo: this.route });
    } else {
      this.router.navigate([''], { relativeTo: this.route });
    }
  }
}

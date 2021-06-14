import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['tab5.page.scss'],
})
export class Tab5Page {
  public currUser;
  public groupUsers;
  public groupCode;
  public subscription;

  public yarokBands = [
    {
      name: 'נורית ישראלי',
    },
    {
      name: 'דן ישראלי',
    },
    {
      name: 'דניאל ישראלי',
    },
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private firestoreService: FirestoreService,
    private platform: Platform
  ) {}

  async ngOnInit() {
    const loggedInUser = await this.authenticationService.isLoggedIn();
    if (loggedInUser) {
      this.firestoreService
        .getUserByUidObs(loggedInUser.uid)
        .subscribe((user: any) => {
          this.currUser = user;
          this.groupCode = user.groupCode;
          this.subscribeToGroupCode(user.groupCode);
        });
    }
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {}
    );
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  subscribeToGroupCode(groupCode) {
    this.firestoreService.getUsersByGroupCode(groupCode).subscribe((users) => {
      this.groupUsers = users.filter(
        (user: any) => user.uid !== this.currUser.uid
      );
    });
  }

  async updateGroupCode() {
    this.currUser.groupCode = this.groupCode;
    await this.firestoreService.createOrUpdateUser(this.currUser);
  }

  logout() {
    this.authenticationService.SignOut();
  }
}

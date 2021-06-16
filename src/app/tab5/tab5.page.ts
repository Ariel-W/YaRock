import { Component } from '@angular/core';
import { AlertController, Platform } from '@ionic/angular';
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
    private platform: Platform,
    private alertController: AlertController
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
    if (!groupCode || groupCode === '') {
      this.groupUsers = [{ name: '-- ללא קבוצה --' }];
    } else {
      this.firestoreService
        .getUsersByGroupCode(groupCode)
        .subscribe((users) => {
          this.groupUsers = users.filter(
            (user: any) => user.uid !== this.currUser.uid
          );
          if (this.groupUsers.length === 0) {
            this.groupUsers = [
              { name: '-- זה הזמן להזמין חברים --' },
              { name: `קוד קבוצה: ${groupCode}` },
            ];
          }
        });
    }
  }

  async updateGroupCode() {
    this.currUser.groupCode = this.groupCode;
    await this.firestoreService.createOrUpdateUser(this.currUser);
  }

  async editGroup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'החלפת קבוצה',
      inputs: [
        {
          name: 'newGroupCode',
          type: 'text',
          id: 'newGroupCode',
          value: this.groupCode,
          // placeholder: 'Placeholder 2',
        },
      ],
      buttons: [
        {
          text: 'ביטול',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'שמור',
          handler: async (alertData) => {
            this.currUser.groupCode = alertData.newGroupCode;
            await this.firestoreService.createOrUpdateUser(this.currUser);
          },
        },
      ],
    });

    await alert.present();
    // this.currUser.groupCode = this.groupCode;
    // await this.firestoreService.createOrUpdateUser(this.currUser);
  }

  logout() {
    this.authenticationService.SignOut();
  }
}

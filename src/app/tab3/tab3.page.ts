import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {
  public subscription: any;
  public loggedInUser: any = {};
  public currUser: any;

  public individualRankings = [
    {
      rank: 1,
      name: 'משה מכלוף',
      totalPoints: 380,
    },
    {
      rank: 2,
      name: 'אריאל וויס',
      totalPoints: 200,
    },
    {
      rank: 3,
      name: 'אלכס חורושין',
      totalPoints: 190,
    },
    {
      rank: 4,
      name: 'יהורם גאון',
      totalPoints: 180,
    },
    {
      rank: 5,
      name: 'יוסף שילוח',
      totalPoints: 170,
    },
    {
      rank: 6,
      name: 'דנה וויס',
      totalPoints: 160,
    },
    {
      rank: 7,
      name: 'ציפי לייבוביץ',
      totalPoints: 155,
    },
    {
      rank: 8,
      name: 'חיים גולן',
      totalPoints: 150,
    },
    {
      rank: 9,
      name: 'אבנר כץ',
      totalPoints: 100,
    },
  ];

  public groupRankings = [
    {
      rank: 1,
      name: 'העלים החומים',
      totalPoints: 3390,
    },
    {
      rank: 2,
      name: 'ממחזרי חדרה',
      totalPoints: 2500,
    },
    {
      rank: 3,
      name: 'ירוק עולה',
      totalPoints: 1180,
    },
    {
      rank: 4,
      name: 'העלים החומים',
      totalPoints: 1170,
    },
    {
      rank: 5,
      name: 'ממחזרי חדרה',
      totalPoints: 1160,
    },
    {
      rank: 6,
      name: 'ירוק עולה',
      totalPoints: 1100,
    },
    {
      rank: 7,
      name: 'העלים החומים',
      totalPoints: 1070,
    },
    {
      rank: 8,
      name: 'ממחזרי חדרה',
      totalPoints: 1000,
    },
    {
      rank: 9,
      name: 'ירוק עולה',
      totalPoints: 870,
    },
  ];

  constructor(
    private platform: Platform,
    private firestoreService: FirestoreService,
    private authenticationService: AuthenticationService
  ) {}

  async ngOnInit() {
    this.loggedInUser = await this.authenticationService.isLoggedIn();
    this.firestoreService.getUsers().subscribe((users) => {
      this.currUser = users.find(
        (user: any) => user.uid === this.loggedInUser.uid
      );
      // calculate individual rankings
      let myGroupUsers: any = [...users];
      myGroupUsers = myGroupUsers.filter(
        (user: any) => user.groupCode === this.currUser.groupCode
      );
      myGroupUsers = myGroupUsers.sort(
        (user1: any, user2: any) => user2.totalPoints - user1.totalPoints
      );

      for (let index = 0; index < myGroupUsers.length; index++) {
        myGroupUsers[index].rank = index + 1;
      }
      this.individualRankings = myGroupUsers;

      // Calculate group rankings
      let groups: any = [];
      users.forEach((user: any) => {
        if (user.groupCode) {
          groups[user.groupCode] = groups[user.groupCode] || {
            totalPoints: 0,
            name: user.groupCode,
          };
          groups[user.groupCode].totalPoints += user.totalPoints;
        }
      });
      const groupKyes: string[] = Object.keys(groups);
      let groupsArr = [];
      groupKyes.forEach((groupKey) => groupsArr.push(groups[groupKey]));
      groupsArr = groupsArr.sort(
        (group1: any, group2: any) => group2.totalPoints - group1.totalPoints
      );

      for (let index = 0; index < groupsArr.length; index++) {
        groupsArr[index].rank = index + 1;
      }
      this.groupRankings = groupsArr;
    });
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
}
// [ngClass] =
//   "{'first-rank': group.rank === 1 , 'second-rank': group.rank === 2 , 'third-rank': group.rank === 3}";

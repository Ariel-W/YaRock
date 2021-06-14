import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  public subscription: any;

  public individualRankings = [
    {
      rank: 1,
      name: 'משה מכלוף',
      greenPoints: 380,
    },
    {
      rank: 2,
      name: 'אריאל וויס',
      greenPoints: 200,
    },
    {
      rank: 3,
      name: 'אלכס חורושין',
      greenPoints: 190,
    },
    {
      rank: 4,
      name: 'יהורם גאון',
      greenPoints: 180,
    },
    {
      rank: 5,
      name: 'יוסף שילוח',
      greenPoints: 170,
    },
    {
      rank: 6,
      name: 'דנה וויס',
      greenPoints: 160,
    },
    {
      rank: 7,
      name: 'ציפי לייבוביץ',
      greenPoints: 155,
    },
    {
      rank: 8,
      name: 'חיים גולן',
      greenPoints: 150,
    },
    {
      rank: 9,
      name: 'אבנר כץ',
      greenPoints: 100,
    },
  ];

  public groupRankings = [
    {
      rank: 1,
      name: 'העלים החומים',
      greenPoints: 3390,
    },
    {
      rank: 2,
      name: 'ממחזרי חדרה',
      greenPoints: 2500,
    },
    {
      rank: 3,
      name: 'ירוק עולה',
      greenPoints: 1180,
    },
    {
      rank: 4,
      name: 'העלים החומים',
      greenPoints: 1170,
    },
    {
      rank: 5,
      name: 'ממחזרי חדרה',
      greenPoints: 1160,
    },
    {
      rank: 6,
      name: 'ירוק עולה',
      greenPoints: 1100,
    },
    {
      rank: 7,
      name: 'העלים החומים',
      greenPoints: 1070,
    },
    {
      rank: 8,
      name: 'ממחזרי חדרה',
      greenPoints: 1000,
    },
    {
      rank: 9,
      name: 'ירוק עולה',
      greenPoints: 870,
    },
  ];

  constructor(private platform: Platform) {}

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

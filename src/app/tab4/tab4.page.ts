import { Component, ViewChild } from '@angular/core';
import {
  AlertController,
  IonSlides,
  Platform,
  ToastController,
} from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
})
export class Tab4Page {
  @ViewChild('marketSlider') marketSlider: IonSlides;

  public currUser;
  public subscription;
  private currToast;

  slidesContext = [
    {
      title: 'סקינים לפורטנייט',
      firstTitle: 'ריקוד/תיק פורטנייט (עד 300 V-Bucks)',
      firstImage: 'assets/images/fortnite-03.png',
      firstPoints: 60,
      firstGift: 'fortnite-01',
      secondTitle: 'סקין פורטנייט (עד 800 V-Bucks)',
      secondImage: 'assets/images/fortnite-02.png',
      secondPoints: 80,
      secondGift: 'fortnite-02',
    },
    {
      title: 'חולצות ירוקות',
      firstTitle: 'חולצה ממותגת',
      firstImage: 'assets/images/t-shirt.png',
      firstPoints: 30,
      firstGift: 'shirt-01',
      secondTitle: 'חולצה בהדפסה אישית',
      secondImage: 'assets/images/t-shirt-custom.png',
      secondPoints: 60,
      secondGift: 'shirt-02',
    },
    {
      title: 'בקבוקים רב פעמיים',
      firstTitle: 'בקבוק פלסטיק רב-פעמי',
      firstImage: 'assets/images/plastic-bottle.png',
      firstPoints: 30,
      firstGift: 'cup-01',
      secondTitle: 'בקבוק מתכת רב-פעמי',
      secondImage: 'assets/images/metal-bottle.png',
      secondPoints: 45,
      secondGift: 'cup-02',
    },
    // {
    //   title: 'סיורים באתרים ירוקים',
    //   firstImage: 'assets/images/tour-04.png',
    //   firstPoints: 70,
    //   firstGift: 'tour-01',
    //   secondImage: 'assets/images/tour-03.png',
    //   secondPoints: 90,
    //   secondGift: 'tour-02',
    // },
  ];

  slideOpts = {
    // initialSlide: -1,
    speed: 400,
  };

  constructor(
    private authenticationService: AuthenticationService,
    private firestoreService: FirestoreService,
    private platform: Platform,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {}
    );
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

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

  nextSlide() {
    this.marketSlider.slideNext();
  }

  previousSlide() {
    console.log('in prev');

    this.marketSlider.slidePrev();
  }

  async consumeGift(slider: any, num: string) {
    let requiredPoints = slider.firstPoints;
    let consumedGift = slider.firstGift;
    if (num === 'second') {
      requiredPoints = slider.secondPoints;
      consumedGift = slider.secondGift;
    }

    if (this.currUser.greenPoints >= requiredPoints) {
      this.currUser.greenPoints -= requiredPoints;
      const currTime = Date.now();
      this.currUser.consumedGifts = this.currUser.consumedGifts || {};
      this.currUser.consumedGifts[currTime] = {
        consumedGift,
        requiredPoints,
        timestamp: currTime,
      };
      await this.firestoreService.createOrUpdateUser(this.currUser);

      const alert = await this.alertController.create({
        header: 'מזל טוב',
        message: 'המתנה בדרך אליך, ניצור קשר בקרוב לפרטי המשלוח',
        buttons: ['יששש'],
      });
      await alert.present();
    } else {
      if (this.currToast) {
        this.currToast.dismiss();
      }
      this.currToast = await this.toastController.create({
        message: 'אין מספיק מטבעות ירוקים, קדימה לאתגר הבא',
        duration: 2000,
        position: 'top',
      });
      this.currToast.present();
    }
  }
}

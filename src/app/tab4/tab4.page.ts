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

  slidesContext = [
    {
      title: 'סקינים לפורטנייט',
      firstImage: 'assets/images/fortnite-03.png',
      firstPoints: 40,
      firstGift: 'fortnite-01',
      secondImage: 'assets/images/fortnite-02.png',
      secondPoints: 55,
      secondGift: 'fortnite-02',
    },
    {
      title: 'חולצות ירוקות',
      firstImage: 'assets/images/tshirt-01.png',
      firstPoints: 15,
      firstGift: 'shirt-01',
      secondImage: 'assets/images/tshirt-02.png',
      secondPoints: 20,
      secondGift: 'shirt-02',
    },
    {
      title: 'כוסות רב שימושיות',
      firstImage: 'assets/images/cup-05.png',
      firstPoints: 15,
      firstGift: 'cup-01',
      secondImage: 'assets/images/cup-01.png',
      secondPoints: 20,
      secondGift: 'cup-02',
    },
    {
      title: 'סיורים באתרים ירוקים',
      firstImage: 'assets/images/tour-04.png',
      firstPoints: 70,
      firstGift: 'tour-01',
      secondImage: 'assets/images/tour-03.png',
      secondPoints: 90,
      secondGift: 'tour-02',
    },
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
      this.currUser.consumedGifts[currTime] = { consumedGift, requiredPoints };

      const alert = await this.alertController.create({
        header: 'מזל טוב',
        message: 'המתנה בדרך אליך, ניצור קשר בקרוב לפרטי המשלוח',
        buttons: ['יששש'],
      });
      await alert.present();
    } else {
      const toast = await this.toastController.create({
        message: 'אין מספיק מטבעות ירוקים, קדימה לאתגר הבא',
        duration: 2000,
        position: 'top',
      });
      toast.present();
    }
  }
}

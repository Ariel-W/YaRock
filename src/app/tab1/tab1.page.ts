import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides, Platform } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { EventsHandlerService } from '../services/events-handler.service';
import { FirestoreService } from '../services/firestore.service';
import { PhotoService } from '../services/photo.service';
import { ToastController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  public showHomeContent: boolean = true;
  public showActionContent: boolean = false;
  public selectedActionContext;
  public currUser;
  public subscription: any;
  public playingMusic = false;
  public playingMusicStart = 0;

  public greenActions = [
    {
      imgSrc: 'assets/icon/green-power.png',
      title: 'תחבורה ירוקה',
      case: 'greenPower',
      detailedTitle: 'נסיעה בתחבורה ציבורית',
      greenPoints: 5,
      description: 'יש להעלות תצלום חשבונית של נסיעה בתחבורה ציבורית מהיום :-)',
      reportText: 'סרוק קבלת תחבורה ציבורית',
      isActive: true,
    },
    {
      imgSrc: 'assets/icon/water.png',
      title: 'מים',
      case: 'water',
      detailedTitle: 'מקלחת חסכונית במים',
      description:
        'יש להפעיל את השיר בכניסה למקלחת ולעצור אותו בסיום המקלחת, האתגר הוא לסיים להתקלח לפני שהשיר נגמר',
      greenPoints: 1,
      reportText: 'דווח חיסכון במים',
      isActive: true,
    },
    {
      imgSrc: 'assets/icon/recycle.png',
      title: 'מחזור',
      case: 'recycle',
      detailedTitle: 'מחזור בקבוק פלסטיק',
      description: 'יש להעלות סלפי עם בקבוק ומחזורית :-)',
      greenPoints: 3,
      reportText: 'דווח מחזור',
      isActive: true,
    },
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'שימוש חוזר',
      case: 'reuse',
      detailedTitle: 'יצירת עציצים מקרטון חלב',
      greenPoints: 1,
      reportText: 'דווח שימוש חוזר',
      isActive: false,
    },
    {
      imgSrc: 'assets/icon/plant-a-tree.png',
      title: 'טבע',
      case: 'plantATree',
      detailedTitle: 'ניקיון שמורת טבע',
      greenPoints: 5,
      reportText: 'דווח שמירה על הטבע',
      isActive: false,
    },
    {
      imgSrc: 'assets/icon/electricity.png',
      title: 'חשמל',
      case: 'electricity',
      detailedTitle: 'חסכון בחשמל בבית / מקום העבודה',
      greenPoints: 1,
      reportText: 'דווח חיסכון בחשמל',
      isActive: false,
    },
  ];

  public greenActionsContext = [
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'Report Reuse Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'ניקיון חופים - 27.06.2021',
    },
    {
      imgSrc: 'assets/icon/green-power.png',
      title: 'Report Green Power Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'ניקיון יער בן שמן - 11.07.2021',
    },
    {
      imgSrc: 'assets/icon/water.png',
      title: 'Report Water Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'ניקיון נחל דוד - 20.07.2021',
    },
  ];

  @ViewChild('actionSlider') slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  constructor(
    private eventsHandler: EventsHandlerService,
    private authenticationService: AuthenticationService,
    private firestoreService: FirestoreService,
    private router: Router,
    private route: ActivatedRoute,
    private platform: Platform,
    private nativeAudio: NativeAudio,
    public toastController: ToastController,
    public photoService: PhotoService
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
    this.eventsHandler.tab1Selected.subscribe((tab) => {
      this.showHomeContent = true;
      this.showActionContent = false;
    });
  }

  ionViewDidEnter() {
    this.subscription = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {
        this.showHomeContent = true;
        this.showActionContent = false;
      }
    );
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  async actionClicked(greenAction: any) {
    if (greenAction.isActive) {
      this.showHomeContent = false;
      this.showActionContent = true;
      this.selectedActionContext = greenAction;
    } else {
      const toast = await this.toastController.create({
        message: 'אתגר זה אינו זמין כעת, האתגר יופעל בקרב',
        duration: 2000,
        position: 'top',
      });
      toast.present();
    }
  }

  nextSlide() {
    this.slides.slideNext();
  }

  previousSlide() {
    this.slides.slidePrev();
  }

  async report() {
    let awardPoints: boolean = true;
    let message = '';

    if (
      this.selectedActionContext.case === 'recycle' ||
      this.selectedActionContext.case === 'greenPower'
    ) {
      var currentDate = Date.now();
      const photoFileName: string = `${this.currUser.email}_${this.currUser.uid}_${this.selectedActionContext.case}_${currentDate}`;
      const success: boolean = await this.photoService.takePhoto(photoFileName);
      if (!success) {
        return;
      }
    }
    const user: any = await this.firestoreService.getUserByUid(
      this.currUser.uid
    );
    // If the user already completed this challenge today, do not give them additional points
    const currDate: Date = new Date();
    if (user[this.selectedActionContext.case]) {
      const latestCompleteDate: Date = new Date(
        user[this.selectedActionContext.case]
      );
      if (
        currDate.getMonth() === latestCompleteDate.getMonth() &&
        currDate.getDate() === latestCompleteDate.getDate()
      ) {
        awardPoints = false;
      }
    }
    // Set the timestamp of the latest complete date of this challenge
    user[this.selectedActionContext.case] = Date.now();
    if (awardPoints) {
      message = `כל הכבוד!  קיבלת ${this.selectedActionContext.greenPoints} נקודות ירוקות`;
      user.greenPoints =
        user.greenPoints + this.selectedActionContext.greenPoints;
    } else {
      message = `כל הכבוד על השלמת האתגר<br/>שים לב - ניתן לקבל נק׳ ירוקות על השלמת אתגר אחת ליממה`;
    }
    await this.firestoreService.createOrUpdateUser(user);
    const toast = await this.toastController.create({
      message: message,
      cssClass: 'text-align: right;',
      position: 'top',
      buttons: [
        {
          side: 'end',
          icon: 'star',
          text: 'סגור',
        },
      ],
    });
    toast.present();
    this.showActionContent = false;
    this.showHomeContent = true;
  }

  logout() {
    this.authenticationService.SignOut();
  }

  async clickEvent() {
    const toast = await this.toastController.create({
      message: `האירוע יהיה פעיל במועד הנקוב מטה`,
      cssClass: 'text-align: right;',
      position: 'top',
      buttons: [
        {
          side: 'end',
          icon: 'star',
          text: 'סגור',
        },
      ],
    });
    toast.present();
  }

  play() {
    this.nativeAudio
      .preloadSimple(
        'uniqueId1',
        'assets/audio/Guns_N_Roses_-_Sweet_Child_O_Mine.mp3'
      )
      .then(
        () => {
          this.playingMusic = true;
          this.playingMusicStart = Date.now();
          this.nativeAudio.play('uniqueId1', async () => {
            this.playingMusicStart = 0;
            this.playingMusic = false;
            const toast = await this.toastController.create({
              message: `השיר נגמר... נסה שוב במקלחת הבאה :-)`,
              position: 'top',
              buttons: [
                {
                  side: 'end',
                  icon: 'star',
                  text: 'סגור',
                },
              ],
            });
            toast.present();
          });
        },
        async (error) => {
          console.log(error);
          const toast = await this.toastController.create({
            message: `לא ניתן לנגן, נא לנסות מאוחר יותר`,
            position: 'top',
            duration: 2000,
          });
          toast.present();
        }
      );
  }

  stop() {
    this.nativeAudio.stop('uniqueId1').then(
      async () => {
        if (this.playingMusic) {
          this.playingMusic = false;
          this.nativeAudio.unload('uniqueId1').then(
            () => {},
            () => {}
          );
          const currTime = Date.now();
          const showerTimeSec = (currTime - this.playingMusicStart) / 1000;
          if (showerTimeSec < 120) {
            const toast = await this.toastController.create({
              message: `המממ.... האם באמת התקלחנו כל כך מהר?   יש לנסות שוב`,
              position: 'top',
              buttons: [
                {
                  side: 'end',
                  icon: 'star',
                  text: 'סגור',
                },
              ],
            });
            toast.present();
          } else {
            this.report();
          }
        }
      },
      () => {}
    );
  }
}

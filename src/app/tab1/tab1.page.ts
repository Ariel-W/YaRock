import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Pipe,
  PipeTransform,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonSlides,
  ModalController,
  Platform,
} from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { EventsHandlerService } from '../services/events-handler.service';
import { FirestoreService } from '../services/firestore.service';
import { PhotoService } from '../services/photo.service';
import { ToastController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { timeout, timestamp } from 'rxjs/operators';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, AfterViewInit {
  public showHomeContent: boolean = true;
  public showActionContent: boolean = false;
  public selectedActionContext;
  public currUser;
  public subscription: any;
  public playingMusic = false;
  public playingMusicStart = 0;
  public audioDuration = 0;
  public audioDurationFormatted = '00:00';
  public audioCountDown: Subscription;
  public audioSrc;
  @ViewChild('audioElement', { static: true }) public _audioRef: ElementRef;
  private audio: HTMLMediaElement;
  private currToast;

  public greenActions = [
    {
      imgSrc: 'assets/icon/YarockGreenTransport.png',
      title: 'תחבורה',
      case: 'greenPower',
      detailedTitle: 'נסיעה בתחבורה ציבורית',
      greenPoints: 5,
      description:
        'להעלות תצלום קבלה של נסיעה ציבורית, תמונה עם אופנים או תמונה ברכב קארפול ומרוויחים!',
      reportText: 'נסעתי ירוק',
      isActive: true,
    },
    {
      imgSrc: 'assets/icon/YarockWater.png',
      title: 'מים',
      case: 'water',
      detailedTitle: 'התקלחת יצאת',
      description:
        'בחרנו לך שיר מקלחת ירוק במיוחד, התקלחת יצאת והשיר עדיין מתנגן? זכית!',
      greenPoints: 1,
      reportText: 'דווח חיסכון במים',
      isActive: true,
    },
    {
      imgSrc: 'assets/icon/YarockRecycle.png',
      title: 'מחזור',
      case: 'recycle',
      detailedTitle: 'מחזור בקבוק פלסטיק',
      description: 'בוא נראה אותך בסלפי עם בקבוק ומחזורית',
      greenPoints: 3,
      reportText: 'העלאת סלפי',
      isActive: true,
    },
    {
      imgSrc: 'assets/icon/YarockReuse.png',
      title: 'שימוש חוזר',
      case: 'reuse',
      detailedTitle: 'יצירת עציצים מקרטון חלב',
      greenPoints: 1,
      reportText: 'דווח שימוש חוזר',
      isActive: false,
    },
    {
      imgSrc: 'assets/icon/YarockPlant.png',
      title: 'טבע',
      case: 'plantATree',
      detailedTitle: 'ניקיון שמורת טבע',
      greenPoints: 5,
      reportText: 'דווח שמירה על הטבע',
      isActive: false,
    },

    {
      imgSrc: 'assets/icon/YarockGreenEnergy.png',
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
      sliderImg1Src: 'assets/images/YarockWelcomeIcon.png',
      sliderText1: 'ניקיון חופים - 27.06.2021',
    },
    {
      imgSrc: 'assets/icon/green-power.png',
      title: 'Report Green Power Activity',
      sliderImg1Src: 'assets/images/YarockWelcomeIcon.png',
      sliderText1: 'ניקיון יער בן שמן - 11.07.2021',
    },
    {
      imgSrc: 'assets/icon/water.png',
      title: 'Report Water Activity',
      sliderImg1Src: 'assets/images/YarockWelcomeIcon.png',
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
    public photoService: PhotoService,
    public alertController: AlertController
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

  public ngAfterViewInit() {
    this.audio = this._audioRef.nativeElement;
    this.prepareAudio(
      'https://yarock-audio.s3.eu-central-1.amazonaws.com/Guns_N_Roses_-_Sweet_Child_O_Mine.mp3'
    );
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
      if (this.currToast) {
        this.currToast.dismiss();
      }
      this.currToast = await this.toastController.create({
        message: 'אתגר זה אינו זמין כעת, האתגר יופעל בקרב',
        duration: 2000,
        position: 'top',
      });
      this.currToast.present();
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

    if (awardPoints) {
      const alert = await this.alertController.create({
        cssClass: 'points-alert',
        header: 'כל הכבוד',
        // subHeader: 'Subtitle',
        message: 'המטבעות הירוקים כבר אצלך בארנק, האתגר הבא כבר מחכה לך',
        buttons: ['יששש'],
      });

      await alert.present();

      // message = `כל הכבוד!  קיבלת ${this.selectedActionContext.greenPoints} נקודות ירוקות`;
      user.greenPoints =
        user.greenPoints + this.selectedActionContext.greenPoints;
      user.totalPoints =
        user.totalPoints + this.selectedActionContext.greenPoints;
      // Set the timestamp of the latest complete date of this challenge
      const currTime = Date.now();
      user[this.selectedActionContext.case] = currTime;
      user.completedChallenges = user.completedChallenges || {};
      user.completedChallenges[currTime] = {
        gotPoints: true,
        challenge: this.selectedActionContext.case,
        timestamp: currTime,
      };
    } else {
      message = `כל הכבוד על השלמת האתגר<br/>שים לב - ניתן לקבל נק׳ ירוקות על השלמת אתגר אחת ליממה`;
      if (this.currToast) {
        this.currToast.dismiss();
      }
      this.currToast = await this.toastController.create({
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
      this.currToast.present();
    }
    const currTime = Date.now();
    user.completedChallenges = user.completedChallenges || {};
    user.completedChallenges[currTime] = {
      gotPoints: true,
      challenge: this.selectedActionContext.case,
      timestamp: currTime,
    };
    await this.firestoreService.createOrUpdateUser(user);
    this.showActionContent = false;
    this.showHomeContent = true;
  }

  logout() {
    this.authenticationService.SignOut();
  }

  async clickEvent() {
    if (this.currToast) {
      this.currToast.dismiss();
    }
    this.currToast = await this.toastController.create({
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
    this.currToast.present();
  }

  prepareAudio(audioSrc: string) {
    if (this.audio) {
      this.audio.oncanplaythrough = () => {
        console.log('oncanplaythrough');
        this.audioDuration = Math.round(this.audio.duration);
        this.audioDurationFormatted = this.formatDuration(this.audioDuration);
      };
      this.audio.onended = async () => {
        console.log('onended');
        this.resetAudio();
        this.playingMusicStart = 0;
        this.playingMusic = false;
        if (this.currToast) {
          this.currToast.dismiss();
        }
        this.currToast = await this.toastController.create({
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
        this.currToast.present();
      };
      this.audio.src = audioSrc;
      this.audio.load();
    }
  }

  play() {
    this.playingMusic = true;
    this.playingMusicStart = Date.now();
    this.audio.play();
    this.audioCountDown = timer(0, 1000).subscribe(() => {
      --this.audioDuration;
      this.audioDurationFormatted = this.formatDuration(this.audioDuration);
    });
  }
  async stop() {
    this.resetAudio();
    if (this.playingMusic) {
      this.playingMusic = false;
      const currTime = Date.now();
      const showerTimeSec = (currTime - this.playingMusicStart) / 1000;
      if (showerTimeSec < 120) {
        if (this.currToast) {
          this.currToast.dismiss();
        }
        this.currToast = await this.toastController.create({
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
        this.currToast.present();
      } else {
        this.report();
      }
    }
  }

  resetAudio() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audioDuration = Math.round(this.audio.duration);
    this.audioDurationFormatted = this.formatDuration(this.audioDuration);
    if (this.audioCountDown) {
      this.audioCountDown.unsubscribe();
      this.audioCountDown = null;
    }
  }

  formatDuration(duration: number) {
    const minutes: number = Math.floor(duration / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(duration - minutes * 60)).slice(-2)
    );
  }

  async button01() {
    console.log(`Button01 => clicked`);
    await this.firestoreService.getUsers().subscribe((users) => {
      let userExcel =
        'Name,Email,Signup Date, Total Points, Green Points, Water Challenge, Recycle Challenge, Commute Challenge\n';
      const userEmails = [];
      const userNames = [];
      const userSignupDate = [];
      const userTotalpoints = [];
      const userGreenPoints = [];
      const userCompletedWaterChallenges = [];
      const userCompletedRecycleChallenges = [];
      const userCompletedCommuteChallenges = [];
      let signupDate = '';
      const completedChallengesByType = {};
      completedChallengesByType['water'] = 0;
      completedChallengesByType['greenPower'] = 0;
      completedChallengesByType['recycle'] = 0;
      let completedChallenges = {};
      let completedChallengesTimes = [];

      users.forEach((user: any) => {
        userExcel += `${user.email}`;
        userExcel += `,${user.name}`;
        signupDate = '';
        if (user.createdTime) {
          signupDate = new Date(user.createdTime).toString();
        }
        userExcel += `,${signupDate}`;
        userExcel += `,${user.totalPoints}`;
        userExcel += `,${user.greenPoints}`;
        completedChallengesByType['water'] = 0;
        completedChallengesByType['greenPower'] = 0;
        completedChallengesByType['recycle'] = 0;
        completedChallenges = user.completedChallenges;
        if (completedChallenges) {
          completedChallengesTimes = Object.keys(completedChallenges);
          completedChallengesTimes.forEach((timestamp) => {
            completedChallengesByType[
              completedChallenges[timestamp].challenge
            ]++;
          });
        }
        userExcel += `,${completedChallengesByType['water']}`;
        userExcel += `,${completedChallengesByType['recycle']}`;
        userExcel += `,${completedChallengesByType['greenPower']}\n`;
      });
      console.log(userExcel);
      var hiddenElement = document.createElement('a');
      hiddenElement.href =
        'data:text/csv;charset=utf-8,' + encodeURI(userExcel);
      hiddenElement.target = '_blank';
      hiddenElement.download = 'people.csv';
      hiddenElement.click();
    });
  }
  // play() {
  //   this.nativeAudio
  //     .preloadSimple(
  //       'uniqueId1',
  //       'assets/audio/Guns_N_Roses_-_Sweet_Child_O_Mine.mp3'
  //     )
  //     .then(
  //       () => {
  //         this.playingMusic = true;
  //         this.playingMusicStart = Date.now();
  //         this.audio.play();
  //         this.nativeAudio.play('uniqueId1', async () => {
  //           this.playingMusicStart = 0;
  //           this.playingMusic = false;
  //           const toast = await this.toastController.create({
  //             message: `השיר נגמר... נסה שוב במקלחת הבאה :-)`,
  //             position: 'top',
  //             buttons: [
  //               {
  //                 side: 'end',
  //                 icon: 'star',
  //                 text: 'סגור',
  //               },
  //             ],
  //           });
  //           toast.present();
  //         });
  //       },
  //       async (error) => {
  //         console.log(error);
  //         const toast = await this.toastController.create({
  //           message: `לא ניתן לנגן, נא לנסות מאוחר יותר`,
  //           position: 'top',
  //           duration: 2000,
  //         });
  //         toast.present();
  //       }
  //     );
  // }

  // stop() {
  //   this.nativeAudio.stop('uniqueId1').then(
  //     async () => {
  //       if (this.playingMusic) {
  //         this.playingMusic = false;
  //         this.nativeAudio.unload('uniqueId1').then(
  //           () => {},
  //           () => {}
  //         );
  //         const currTime = Date.now();
  //         const showerTimeSec = (currTime - this.playingMusicStart) / 1000;
  //         if (showerTimeSec < 120) {
  //           const toast = await this.toastController.create({
  //             message: `המממ.... האם באמת התקלחנו כל כך מהר?   יש לנסות שוב`,
  //             position: 'top',
  //             buttons: [
  //               {
  //                 side: 'end',
  //                 icon: 'star',
  //                 text: 'סגור',
  //               },
  //             ],
  //           });
  //           toast.present();
  //         } else {
  //           this.report();
  //         }
  //       }
  //     },
  //     () => {}
  //   );
  // }
}

// @Pipe({
//   name: 'formatTime',
// })
// export class FormatTimePipe implements PipeTransform {
//   transform(value: number): string {
//     const minutes: number = Math.floor(value / 60);
//     return (
//       ('00' + minutes).slice(-2) +
//       ':' +
//       ('00' + Math.floor(value - minutes * 60)).slice(-2)
//     );
//   }
// }

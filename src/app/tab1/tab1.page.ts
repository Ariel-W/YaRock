import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { EventsHandlerService } from '../services/events-handler.service';
import { FirestoreService } from '../services/firestore.service';
import { PhotoService } from '../services/photo.service';

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

  public greenActions = [
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'שימוש חוזר',
      case: 'reuse',
      detailedTitle: 'יצירת עציצים מקרטון חלב',
      greenPoints: 1,
      reportText: 'דווח שימוש חוזר',
    },
    {
      imgSrc: 'assets/icon/green-power.png',
      title: 'אנרגיה ירוקה',
      case: 'greenPower',
      detailedTitle: 'נסיעה ברכב חשמלי',
      greenPoints: 2,
      reportText: 'דווח אנרגיה ירוקה',
    },
    {
      imgSrc: 'assets/icon/water.png',
      title: 'מים',
      case: 'water',
      detailedTitle: 'מקלחת חסכונית במים',
      greenPoints: 3,
      reportText: 'דווח חיסכון במים',
    },
    {
      imgSrc: 'assets/icon/recycle.png',
      title: 'מחזור',
      case: 'recycle',
      detailedTitle: 'מחזור בקבוק פלסטיק',
      greenPoints: 4,
      reportText: 'דווח מחזור',
    },
    {
      imgSrc: 'assets/icon/plant-a-tree.png',
      title: 'טבע',
      case: 'plantATree',
      detailedTitle: 'ניקיון שמורת טבע',
      greenPoints: 5,
      reportText: 'דווח שמירה על הטבע',
    },
    {
      imgSrc: 'assets/icon/electricity.png',
      title: 'חשמל',
      case: 'electricity',
      detailedTitle: 'חסכון בחשמל בבית / מקום העבודה',
      greenPoints: 1,
      reportText: 'דווח חיסכון בחשמל',
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
      sliderText1: 'אירוע משמעותי',
    },
    {
      imgSrc: 'assets/icon/water.png',
      title: 'Report Water Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'אירוע משנה חיים',
    },
    {
      imgSrc: 'assets/icon/recycle.png',
      title: 'Report Recycle Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'אירוע להצלת כדוה״א',
    },
    {
      imgSrc: 'assets/icon/plant-a-tree.png',
      title: 'Report Plant A Tree Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'אירוע מסחרי',
    },
    {
      imgSrc: 'assets/icon/electricity.png',
      title: 'Report Electricity Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'אירוע משתלם',
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

  actionClicked(action: string) {
    this.showHomeContent = false;
    this.showActionContent = true;

    switch (action) {
      case 'reuse':
        this.selectedActionContext = this.greenActions[0];
        break;

      case 'greenPower':
        this.selectedActionContext = this.greenActions[1];
        break;

      case 'water':
        this.selectedActionContext = this.greenActions[2];
        break;

      case 'recycle':
        this.selectedActionContext = this.greenActions[3];
        break;

      case 'plantATree':
        this.selectedActionContext = this.greenActions[4];
        break;

      case 'electricity':
        this.selectedActionContext = this.greenActions[5];
        break;

      default:
        console.log('unknown green action');
    }
  }

  nextSlide() {
    this.slides.slideNext();
  }

  previousSlide() {
    this.slides.slidePrev();
  }

  async report() {
    if (this.selectedActionContext.case === 'recycle') {
      await this.photoService.addNewToGallery();
    }
    const user: any = await this.firestoreService.getUserByUid(
      this.currUser.uid
    );
    user.greenPoints =
      user.greenPoints + this.selectedActionContext.greenPoints;
    await this.firestoreService.createOrUpdateUser(user);
    this.showActionContent = false;
    this.showHomeContent = true;
  }

  logout() {
    this.authenticationService.SignOut();
  }
}

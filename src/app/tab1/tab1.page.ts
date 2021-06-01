import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { EventsHandlerService } from '../services/events-handler.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  public showHomeContent: boolean = true;
  public showActionContent: boolean = false;
  public selectedActionContext;

  public greenActions = [
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'שימוש חוזר',
      case: 'reuse',
    },
    {
      imgSrc: 'assets/icon/green-power.png',
      title: 'אנרגיה ירוקה',
      case: 'greenPower',
    },
    {
      imgSrc: 'assets/icon/water.png',
      title: 'מים',
      case: 'water',
    },
    {
      imgSrc: 'assets/icon/recycle.png',
      title: 'מחזור',
      case: 'recycle',
    },
    {
      imgSrc: 'assets/icon/plant-a-tree.png',
      title: 'טבע',
      case: 'plantATree',
    },
    {
      imgSrc: 'assets/icon/electricity.png',
      title: 'חשמל',
      case: 'electricity',
    },
  ];

  public greenActionsContext = [
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'Report Reuse Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'אירוע מגניב',
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

  constructor(private eventsHandler: EventsHandlerService) {}

  ngOnInit() {
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
        this.selectedActionContext = this.greenActionsContext[0];
        break;

      case 'greenPower':
        this.selectedActionContext = this.greenActionsContext[1];
        break;

      case 'water':
        this.selectedActionContext = this.greenActionsContext[2];
        break;

      case 'recycle':
        this.selectedActionContext = this.greenActionsContext[3];
        break;

      case 'plantATree':
        this.selectedActionContext = this.greenActionsContext[4];
        break;

      case 'electricity':
        this.selectedActionContext = this.greenActionsContext[5];
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
}

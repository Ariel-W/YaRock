import { AfterContentChecked, AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { EventsHandlerService } from '../services/events-handler.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  public showHomeContent:boolean = true;
  public showActionContent:boolean = false;
  public selectedActionContext;

  public greenActions= [
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'Reuse',
      case: 'reuse',
    },
    {
      imgSrc: 'assets/icon/green-power.png',
      title: 'Green power',
      case: 'greenPower',
    },
    {
      imgSrc: 'assets/icon/water.png',
      title: 'Water',
      case: 'water',
    },
    {
      imgSrc: 'assets/icon/recycle.png',
      title: 'Recycle',
      case: 'recycle',
    },
    {
      imgSrc: 'assets/icon/plant-a-tree.png',
      title: 'Plant a tree',
      case: 'plantATree',
    },
    {
      imgSrc: 'assets/icon/electricity.png',
      title: 'Electricity',
      case: 'electricity',
    },
  ]

  public greenActionsContext= [
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'Report Reuse Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
    {
      imgSrc: 'assets/icon/green-power.png',
      title: 'Report Green Power Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
    {
      imgSrc: 'assets/icon/water.png',
      title: 'Report Water Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
    {
      imgSrc: 'assets/icon/recycle.png',
      title: 'Report Recycle Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
    {
      imgSrc: 'assets/icon/plant-a-tree.png',
      title: 'Report Plant A Tree Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
    {
      imgSrc: 'assets/icon/electricity.png',
      title: 'Report Electricity Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
  ]

  @ViewChild('actionSlider') slides:IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400
  }

  constructor(private eventsHandler:EventsHandlerService) {
    
  }

  ngOnInit(){
    this.eventsHandler.tab1Selected.subscribe((tab)=>{
        this.showHomeContent = true;
        this.showActionContent = false;
    })
  }

  actionClicked(action:string){
    this.showHomeContent = false;
    this.showActionContent = true;
    
    switch(action){
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
        console.log("unknown green action");
        
    }
  }

  nextSlide(){
    this.slides.slideNext();
  }

  previousSlide(){
    this.slides.slidePrev();
  }

}

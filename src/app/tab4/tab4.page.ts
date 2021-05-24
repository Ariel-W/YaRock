import { Component, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})
export class Tab4Page {

  @ViewChild('marketSlider') marketSlider:IonSlides;

  slidesContext = [
    {
      firstImage:'assets/images/market-bike-1.png',
      firstPoints: 1580,
      secondImage:'assets/images/market-bike-2.png',
      secondPoints: 1180,
    },
    {
      firstImage:'assets/images/market-bike-2.png',
      firstPoints: 1520,
      secondImage:'assets/images/market-bike-1.png',
      secondPoints: 3180,
    },
    {
      firstImage:'assets/images/market-bike-1.png',
      firstPoints: 1540,
      secondImage:'assets/images/market-bike-1.png',
      secondPoints: 1080,
    },
    {
      firstImage:'assets/images/market-bike-1.png',
      firstPoints: 1540,
      secondImage:'assets/images/market-bike-1.png',
      secondPoints: 1080,
    },
  ]

  slideOpts = {
    // initialSlide: -1,
    speed: 400
  }

  constructor() {}

  nextSlide(){
    this.marketSlider.slideNext();
  }

  previousSlide(){
    console.log("in prev");
    
    this.marketSlider.slidePrev();
  }

}

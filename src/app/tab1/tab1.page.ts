import { Component, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page{

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
      imgSrc: 'assets/icon/reuse.png',
      title: 'Report Green Power Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'Report Water Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'Report Recycle Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'Report Plant A Tree Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
    {
      imgSrc: 'assets/icon/reuse.png',
      title: 'Report Electricity Activity',
      sliderImg1Src: 'assets/images/reuse-slider1.png',
      sliderText1: 'Trash to Treasure Challenge'
    },
  ]

  slideOpts = {
    initialSlide: 0,
    speed: 400
  }

  constructor() {}

  // ngOnChanges(){
  //   console.log("home ngoninit");
    
  // }

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

}

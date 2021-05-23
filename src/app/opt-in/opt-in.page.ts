import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-opt-in',
  templateUrl: './opt-in.page.html',
  styleUrls: ['./opt-in.page.scss'],
})
export class OptInPage implements OnInit {

  public optInTitleText:string = "YaRock\nBe greener with us.";
  public optInButtonText:string = "Start The Journey";

  constructor() { }

  ngOnInit() {
  }

}

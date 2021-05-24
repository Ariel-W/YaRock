import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginTitleText:string = "YaRock\nBe greener with us."
  public joinButtonText:string = "Join us"
  public namePlaceholder:string = "Name";

  constructor() { }

  ngOnInit() {
  }

  inputBlured(event:any){
    event.target.placeholder = "";
  }
  
  inputFocused(event:any){
    event.target.placeHolder = this.namePlaceholder;
    
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginTitleText:string = "YaRock\nBe greener with us."
  public joinButtonText:string = "Join us"

  constructor() { }

  ngOnInit() {
  }

}

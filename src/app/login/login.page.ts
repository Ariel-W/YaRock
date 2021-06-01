import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginTitleText: string = 'YaRock\nהצטרפו למהפה הירוקה';
  public joinButtonText: string = 'הרשמה';
  public namePlaceholder: string = 'שם מלא';
  public name: string;
  public email: string;
  public password: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}

  inputBlured(event: any) {
    event.target.placeholder = '';
  }

  inputFocused(event: any) {
    event.target.placeHolder = this.namePlaceholder;
  }

  signUp() {
    // console.log(`${this.name} -- ${this.email} -- ${this.password}`);
    this.authenticationService
      .SignUp(this.email, this.password)
      .then((result) => {
        this.router.navigate(['opt-in'], { relativeTo: this.route });
        // this.router.navigate(['<!-- enter your route name here -->']);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  signIn() {
    // console.log(`${this.name} -- ${this.email} -- ${this.password}`);
    this.authenticationService
      .SignIn(this.email, this.password)
      .then((result) => {
        this.router.navigate(['/main/tabs/tab1'], { relativeTo: this.route });
        // this.router.navigate(['<!-- enter your route name here -->']);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }
}

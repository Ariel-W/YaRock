import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

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
  public signUpMode: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    public authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}

  setSignUpMode(newSignUpMode: boolean) {
    this.signUpMode = newSignUpMode;
  }

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
      .then(async (result) => {
        const loggedInUser = await this.authenticationService.isLoggedIn();
        if (!loggedInUser) {
          alert('שגיאה, אנא נסה שוב מאוחר יותר');
        }
        await this.createUser(loggedInUser.uid);
        this.router.navigate(['opt-in'], { relativeTo: this.route });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  signIn() {
    this.authenticationService
      .SignIn(this.email, this.password)
      .then(async (result) => {
        this.router.navigate(['/main/tabs/tab1'], { relativeTo: this.route });
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  async createUser(uid: string) {
    const user = {
      uid: uid,
      name: this.name || null,
      email: this.email || null,
      greenPoints: 0,
    };
    return this.firestoreService.createOrUpdateUser(user);
  }
}

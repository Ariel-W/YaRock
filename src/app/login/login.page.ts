import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginTitleText: string = 'YaRock\nהמהפה הירוקה';
  public joinButtonText: string = 'הרשמה';
  public namePlaceholder: string = 'שם מלא';
  public name: string;
  public email: string;
  public password: string;
  public signUpMode: boolean = true;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    public authenticationService: AuthenticationService,
    public toastController: ToastController
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
          const toast = await this.toastController.create({
            message: 'שגיאה, אנא נסה שוב מאוחר יותר',
            duration: 2000,
            position: 'top',
          });
          toast.present();
        }
        if (this.name && this.email) {
          await this.createUser(loggedInUser.uid);
          this.router.navigate(['opt-in'], { relativeTo: this.route });
        } else {
          const toast = await this.toastController.create({
            message: 'שגיאה, יש להזין שם',
            duration: 2000,
            position: 'top',
          });
          toast.present();
        }
      })
      .catch(async (error) => {
        const toast = await this.toastController.create({
          message: error.message,
          duration: 2000,
          position: 'top',
        });
        toast.present();
      });
  }

  signIn() {
    this.authenticationService
      .SignIn(this.email, this.password)
      .then(async (result) => {
        this.router.navigate(['/main/tabs/tab1'], { relativeTo: this.route });
      })
      .catch(async (error) => {
        const toast = await this.toastController.create({
          message: error.message,
          duration: 2000,
          position: 'top',
        });
        toast.present();
      });
  }

  async createUser(uid: string) {
    const user = {
      uid: uid,
      name: this.name || null,
      email: this.email || null,
      greenPoints: 0,
      totalPoints: 0,
    };
    return this.firestoreService.createOrUpdateUser(user);
  }
}

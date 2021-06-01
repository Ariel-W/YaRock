import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public tab1Selected: Subject<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public afAuth: AngularFireAuth
  ) {}

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        window.alert('You have been successfully registered!');
        console.log(result.user);
      })
      .catch((error) => {
        window.alert(error.message);
      });
  }

  // Sign in with email/password
  SignIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
    // .then((result) => {
    //   this.router.navigate(['opt-in'], { relativeTo: this.route });
    //   // this.router.navigate(['<!-- enter your route name here -->']);
    // })
    // .catch((error) => {
    //   window.alert(error.message);
    // });
  }
}

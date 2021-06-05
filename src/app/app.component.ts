import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { FirestoreService } from './services/firestore.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit() {
    const loggedInUser = await this.authenticationService.isLoggedIn();
    if (loggedInUser) {
      this.router.navigate(['main/tabs/tab1'], { relativeTo: this.route });
    } else {
      this.router.navigate([''], { relativeTo: this.route });
    }
  }
}

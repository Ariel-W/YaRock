import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-opt-in',
  templateUrl: './opt-in.page.html',
  styleUrls: ['./opt-in.page.scss'],
})
export class OptInPage implements OnInit {
  public optInTitleText: string = 'YaRock\nהמהפכה הירוקה';
  public optInButtonText: string = 'סיימתי';
  public city: string;
  public age: number;
  public greenActivity: string;
  public greenPartners: string;
  public groupCode: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {}

  public async Submit() {
    const loggedInUser = await this.authenticationService.isLoggedIn();
    if (!loggedInUser) {
      alert('שגיאה, אנא נסה שוב מאוחר יותר');
    }
    const user: any = await this.firestoreService.getUserByUid(
      loggedInUser.uid
    );
    user.city = this.city || null;
    user.age = this.age || null;
    user.greenActivity = this.greenActivity || null;
    user.greenPartners = this.greenPartners || null;
    user.groupCode = this.groupCode || null;
    await this.firestoreService.createOrUpdateUser(user);
    this.router.navigate(['/how-to'], { relativeTo: this.route });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-opt-in',
  templateUrl: './opt-in.page.html',
  styleUrls: ['./opt-in.page.scss'],
})
export class OptInPage implements OnInit {
  public optInTitleText: string = 'Welcome Yarock שכמוך';
  public optInSubTitleText: string = 'רק כמה פרטים נוספים לפני שמתחילים';
  public optInButtonText: string = 'סיימתי';
  public city: string;
  public age: number;
  public greenActivity: string;
  public greenPartners: string;
  public groupCode: string;
  public preferredActivity;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firestoreService: FirestoreService,
    private authenticationService: AuthenticationService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  public async Submit() {
    const loggedInUser = await this.authenticationService.isLoggedIn();
    if (!loggedInUser) {
      const toast = await this.toastController.create({
        message: 'שגיאה, אנא נסה שוב מאוחר יותר',
        duration: 2000,
        position: 'top',
      });
      toast.present();
    }
    const user: any = await this.firestoreService.getUserByUid(
      loggedInUser.uid
    );
    if (!this.groupCode) {
      this.groupCode = loggedInUser.displayName.replace(' ', '-');
    }
    user.city = this.city || null;
    user.age = this.age || null;
    user.greenActivity = this.preferredActivity || null;
    await this.firestoreService.createOrUpdateUser(user);
    this.router.navigate(['/how-to'], { relativeTo: this.route });
  }
}

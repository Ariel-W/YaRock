import { Component, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { AuthenticationService } from '../services/authentication.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss'],
})
export class Tab4Page {
  @ViewChild('marketSlider') marketSlider: IonSlides;

  public currUser;

  slidesContext = [
    {
      title: 'סקינים לפורטנייט',
      firstImage: 'assets/images/fortnite-03.png',
      firstPoints: 40,
      secondImage: 'assets/images/fortnite-02.png',
      secondPoints: 55,
    },
    {
      title: 'חולצות ירוקות',
      firstImage: 'assets/images/tshirt-01.png',
      firstPoints: 15,
      secondImage: 'assets/images/tshirt-02.png',
      secondPoints: 20,
    },
    {
      title: 'כוסות רב שימושיות',
      firstImage: 'assets/images/cup-05.png',
      firstPoints: 15,
      secondImage: 'assets/images/cup-01.png',
      secondPoints: 20,
    },
    {
      title: 'סיורים באתרים ירוקים',
      firstImage: 'assets/images/tour-04.png',
      firstPoints: 70,
      secondImage: 'assets/images/tour-03.png',
      secondPoints: 90,
    },
  ];

  slideOpts = {
    // initialSlide: -1,
    speed: 400,
  };

  constructor(
    private authenticationService: AuthenticationService,
    private firestoreService: FirestoreService
  ) {}

  async ngOnInit() {
    const loggedInUser = await this.authenticationService.isLoggedIn();
    if (loggedInUser) {
      this.firestoreService
        .getUserByUidObs(loggedInUser.uid)
        .subscribe((user) => {
          this.currUser = user;
        });
    }
  }

  nextSlide() {
    this.marketSlider.slideNext();
  }

  previousSlide() {
    console.log('in prev');

    this.marketSlider.slidePrev();
  }
}

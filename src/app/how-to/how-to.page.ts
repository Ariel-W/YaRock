import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-how-to',
  templateUrl: './how-to.page.html',
  styleUrls: ['./how-to.page.scss'],
})
export class HowToPage implements OnInit {
  public howToTitleText: string = 'YaRock\nהמהפכה הירוקה';
  public howToButtonText: string = '!אני מוכן';
  public howToMainText: string =
    'אנחנו מוכנים, ואתה? בלחיצת כפתור תעבור לדף הבית של האפליקציה. בו תוכל לראות מספר תחומים ירוקים ולהתחיל בצבירת מטבעות. בכל תחום ירוק תוכל למצוא שלל אתגרים. על כל אתגר ירוק שתבצע, תקבל מספר מטבעות ירוקים.';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  public Submit() {
    this.router.navigate(['/main/tabs/tab1'], { relativeTo: this.route });
  }
}

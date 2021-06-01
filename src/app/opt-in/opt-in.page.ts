import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-opt-in',
  templateUrl: './opt-in.page.html',
  styleUrls: ['./opt-in.page.scss'],
})
export class OptInPage implements OnInit {
  public optInTitleText: string = 'YaRock\nהמהפכה הירוקה';
  public optInButtonText: string = 'סיימתי';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  public Submit() {
    this.router.navigate(['/how-to'], { relativeTo: this.route });
  }
}

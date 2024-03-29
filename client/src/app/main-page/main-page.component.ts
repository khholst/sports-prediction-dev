import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { faCheck, faTrophy, faPeopleRoof, faCircleQuestion } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public subscription: Subscription = new Subscription();
  public username: string = "";
  public checkIcon = faCheck;
  public trophyIcon = faTrophy;
  public roomIcon = faPeopleRoof;
  public predictionIcon = faCircleQuestion;

  constructor(
    private authService: AuthService,
    private router: Router,
    private titleService: Title
  ) { 
    this.titleService.setTitle("Sports Prediction - Home");
  }


  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();

    if (this.isLoggedIn) {
      this.username = this.authService.getUsername();
    }
    
    this.subscription = this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
        this.isLoggedIn = this.authService.getIsLoggedIn();
      }
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

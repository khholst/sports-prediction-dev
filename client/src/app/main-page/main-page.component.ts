import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public isLoggedIn: boolean = false;
  public subscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    
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

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public isMenuCollapsed = true;
  public isLoggedIn = false;
  public username = "";
  public subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.subscription = this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
        console.log("RUNNING")
        this.isLoggedIn = this.authService.getIsLoggedIn();
        this.username = this.authService.getUsername();
      }
    })
  }

  logout() {
    this.authService.logout();
    this.reloadCurrentRoute();
  }

  reloadCurrentRoute() {
    this.router.navigateByUrl('/register', {skipLocationChange: true}).then(() => {
        this.router.navigate(["/"]);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

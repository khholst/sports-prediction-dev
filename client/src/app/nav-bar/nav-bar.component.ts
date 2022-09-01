import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
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
    private router: Router,
  ) {
    this.subscription = this.router.events.subscribe(event => {
      if (event.toString().includes("NavigationEnd")) {
        this.isLoggedIn = this.authService.getIsLoggedIn();
        this.username = this.authService.getUsername();
      }
    })
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.getIsLoggedIn();
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

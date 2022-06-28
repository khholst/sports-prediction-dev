import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public isMenuCollapsed = true;
  public isLoggedIn = false;
  public username = "";

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {    
    this.router.events.subscribe(event => {
      if (event.constructor.name === "NavigationEnd") {
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
}

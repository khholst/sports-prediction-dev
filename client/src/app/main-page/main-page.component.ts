import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public isLoggedIn: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log("bhkdnhdsjnsdjn")
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.router.events.subscribe(event => {
      console.log(event)
      //if (event.constructor.name === "NavigationEnd") {
       this.isLoggedIn = this.authService.getIsLoggedIn();
      //}
    })
  }
}

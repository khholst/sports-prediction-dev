import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserRegister } from './userRegister';
import { UserLogin } from './userLogin';
import jwtDecode from "jwt-decode";
import { Router } from '@angular/router';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authUrl: string = "http://localhost:8080/auth";
  private isLoggedIn: boolean = false;
  private username: string = "";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  async register(credentials:UserRegister):Promise<any> {
    return await lastValueFrom(this.http.post(`${this.authUrl}/register`, credentials, httpOptions))
  }

  async login(credentials: UserLogin):Promise<any> {
    return await lastValueFrom(this.http.post(`${this.authUrl}/login`, credentials, httpOptions))
  }

  logout() {
    localStorage.removeItem("token");
    this.isLoggedIn = false;
    this.username = "";
  }

  getIsLoggedIn() {
    this.checkJwtToken();
    return this.isLoggedIn;
  }

  checkJwtToken() {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<any>(token);

      if (this.JwtIsExpired(decodedToken.exp!)) {
        this.setLoggedIn(false);
        this.navigateToLogin();
      } else {
        this.setUsername(decodedToken.username!)
        this.setLoggedIn(true);
      }

    } else {
      this.setLoggedIn(false);
      this.navigateToLogin();
    }
  }

  private navigateToLogin() {
    this.router.navigate(["/login"]);
  }

  private JwtIsExpired(expiry: number) {
    return expiry < Date.now() / 1000;
  }

  setLoggedIn(loggedIn: boolean): void {
    this.isLoggedIn = loggedIn;
  }

  getUsername() {
    return this.username;
  }

  setUsername(username: string) {
    this.username = username;
  }
}

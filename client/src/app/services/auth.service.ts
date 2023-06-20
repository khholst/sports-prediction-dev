import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserRegister } from '../models/userRegister';
import { UserLogin } from '../models/userLogin';
import jwtDecode from "jwt-decode";
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //private authUrl: string = "https://sports-prediction-api.onrender.com/api/auth";
  private authUrl: string = `${environment.serverUrl}/auth`;
  //private localUrl: string = "http://localhost:8080/api/auth";
  private isLoggedIn: boolean = false;
  private isAdmin: boolean = false;
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


  getIsAdmin(): boolean {
    return this.isAdmin;
  }

  checkJwtToken() {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode<any>(token);

      if (this.JwtIsExpired(decodedToken.exp!)) {
        this.setLoggedIn(false);
      } else {
        this.setUsername(decodedToken.username!);
        this.isAdmin = decodedToken.admin;
        this.setLoggedIn(true);
      }

    } else {
      this.setLoggedIn(false);
    }
  }


  navigateToLogin() {
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

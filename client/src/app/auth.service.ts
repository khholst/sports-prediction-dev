import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserRegister } from './userRegister';
import { UserLogin } from './userLogin';

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
    private http: HttpClient
  ) { }

  async register(credentials:UserRegister):Promise<any> {
    return await lastValueFrom(this.http.post(`${this.authUrl}/register`, credentials, httpOptions))
  }

  async login(credentials: UserLogin):Promise<any> {
    return await lastValueFrom(this.http.post(`${this.authUrl}/login`, credentials, httpOptions))
  }

  logout() {
    console.log("LOGGING OUT")
    localStorage.removeItem("token");
    this.isLoggedIn = false;
    this.username = "";
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
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

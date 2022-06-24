import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { UserRegister } from './userRegister';

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

  constructor(
    private http: HttpClient
  ) { }

  async register(credentials:UserRegister):Promise<any> {
    return await lastValueFrom(this.http.post(`${this.authUrl}/register`, credentials, httpOptions))
  }

  async login() {

  }

  logout() {
    console.log("LOGGING OUT")
    localStorage.removeItem("token");
    this.isLoggedIn = false;
  }

  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  setLoggedIn(loggedIn: boolean): void {
    this.isLoggedIn = loggedIn;
  }
}

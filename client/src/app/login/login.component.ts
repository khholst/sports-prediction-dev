import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { UserLogin } from '../models/userLogin';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  private userCredentials: UserLogin = new UserLogin();
  alert = {
    closed: true,
    message: ""
  };
  public isLoggingIn: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  loginForm = this.formBuilder.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]],
  })

  ngOnInit(): void {
  }


  async onSubmit() {
    try {
      this.isLoggingIn = true;
      this.userCredentials = this.loginForm.value
      
      const response = await this.authService.login(this.userCredentials);
      
        localStorage.setItem("token", response.token);
        this.authService.setLoggedIn(true);
        this.authService.setUsername(this.userCredentials.username);
        this.router.navigate(["/"]);
      
    } catch(error: any) { //If server throws a validation error
      this.isLoggingIn = false;
      if (error.status === 401) {
        this.alert.closed = false;
        this.alert.message = "Credentials don't match";
      } 
    }
  }



  get username() {
    return this.loginForm.get("username")!;
  }

  get password() {
    return this.loginForm.get("password")!;
  }
}

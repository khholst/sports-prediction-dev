import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { UserRegister } from '../userRegister';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  private isLoggedIn: boolean = false;

  userCredentials: UserRegister = new UserRegister();
  alert = {
    closed: true,
    message: ""
  }


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }


  registerForm = this.formBuilder.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]],
    confirmPassword: ["", [Validators.required]],
  })

  ngOnInit(): void {
  }

  async onSubmit() {
    if(this.registerForm.valid) {
      this.userCredentials = this.registerForm.value
      
      const response = await this.authService.register(this.userCredentials);

      //If server throws a validation error
      if (response.code === 400) {
        this.alert.closed = false;
        this.alert.message = response.errors[0].msg;

      } else {
        console.log("GREAT") //SAVE TOKEN AND REDIRECT
        localStorage.setItem("token", response.token);
        this.authService.setLoggedIn(true);
        this.router.navigate(["/"]);
      }
    }
  }


  getIsLoggedIn() {
    return this.isLoggedIn;
  }

  get username() {
    return this.registerForm.get("username")!;
  }

  get password() {
    return this.registerForm.get("password")!;
  }

  get confirmPassword() {
    return this.registerForm.get("confirmPassword")!;
  }
}

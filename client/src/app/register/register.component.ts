import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { UserRegister } from '../models/userRegister';
import { Router } from '@angular/router';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  userCredentials: UserRegister = new UserRegister();
  alert = {
    closed: true,
    message: ""
  };
  public isRegistering: boolean = false;

  //ICONS
  public userIcon = faUser;
  public passwordIcon = faLock;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private titleService: Title
  ) { 
    this.titleService.setTitle("Sports Prediction - Register");
  }


  registerForm = this.formBuilder.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]],
    confirmPassword: ["", [Validators.required]],
  })

  ngOnInit(): void {
  }

  async onSubmit() {
    if(this.registerForm.valid) {
      this.isRegistering = true;
      this.userCredentials = this.registerForm.value
      const response = await this.authService.register(this.userCredentials);

      //If server throws a validation error
      if (response.code === 401) {
        this.isRegistering = false;
        this.alert.closed = false;
        this.alert.message = response.errors[0].msg;

      } else {
        localStorage.setItem("token", response.token);
        this.authService.setLoggedIn(true);
        this.authService.setUsername(this.userCredentials.username);
        this.router.navigate(["/"]);
      }
    }
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

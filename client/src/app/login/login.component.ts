import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UserRegister } from '../userRegister';
import { Router } from '@angular/router';
import { UserLogin } from '../userLogin';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {
  private userCredentials: UserLogin = new UserLogin();
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
      this.userCredentials = this.loginForm.value
      
      const response = await this.authService.login(this.userCredentials);

      //If server throws a validation error
      if (response.code === 201) {
        console.log("Password doesn't match");

      } else {
        localStorage.setItem("token", response.token);
        this.authService.setLoggedIn(true);
        this.router.navigate(["/"]);
      }
  }



  get username() {
    return this.loginForm.get("username")!;
  }

  get password() {
    return this.loginForm.get("password")!;
  }
}

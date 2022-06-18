import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
  ) { }

  register = new User();

  registerForm = this.formBuilder.group({
    username: ["", [Validators.required]],
    password: ["", [Validators.required]],
    confirmPassword: ["", [Validators.required]],
  })

  ngOnInit(): void {
  }

  onSubmit():void {
    if(this.registerForm.valid)
      console.log(this.registerForm.value);
  }

  ngOnChanges(): void {
    this.registerForm.patchValue(this.register);
    console.log(this.register)
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

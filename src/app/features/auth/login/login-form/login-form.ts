import { Component, EventEmitter, output, Output, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { LoginPayload } from '@core/auth/types';

@Component({
  selector: 'login-form',
  imports: [FormField],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  login = output<LoginPayload>();

  private readonly loginModel = signal({email: '', password: ''});

  loginForm = form(this.loginModel, schema => {
    required(schema.email);
    required(schema.password);

    email(schema.email);
  });

  onSubmit(event: Event) {
    event.preventDefault();
    this.login.emit({
      email: this.loginForm.email().value(),
      password: this.loginForm.password().value(),
    })
  }
}

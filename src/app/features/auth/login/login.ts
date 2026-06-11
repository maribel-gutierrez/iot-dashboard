import { Component, inject, signal } from '@angular/core';
import { email, form, FormField, required } from '@angular/forms/signals';
import { AuthStore } from '@core/auth/auth.store';
import { Router } from '@angular/router';
import { AlertMessage } from '@shared/alert-component/alert-message';

@Component({
  selector: 'login',
  imports: [
    FormField,
    AlertMessage
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authStoreService = inject(AuthStore);
  router = inject(Router);

  protected isError = signal<boolean>(false);
  protected readonly errorMessage = 'Invalid credentials';
  protected message = signal<string>('');

  private readonly loginModel = signal({email: '', password: ''});

  loginForm = form(this.loginModel, schema => {
    required(schema.email);
    required(schema.password);

    email(schema.email);
  });

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    try {
      await this.authStoreService.login(this.loginForm.email().value(), this.loginForm.password().value());

      void this.router.navigate(['/dashboard']);
    } catch (e) {
      console.error(e)
      this.message.set(this.errorMessage);
      this.isError.set(true);
      setTimeout(() => this.isError.set(false), 3000);
    }
  }
}

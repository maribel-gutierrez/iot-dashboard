import { Component, inject, signal } from '@angular/core';
import { LoginForm } from '@features/auth/login/login-form/login-form';
import { Router } from '@angular/router';
import { AuthStore } from '@core/auth/auth.store';
import { AlertMessage } from '@shared/alert-component/alert-message';
import { DEMO_USERS } from '@core/constants/user.constants';
import { LoginPayload } from '@core/auth/types';
import { USER_ROLES, UserRoles } from '@core/types/user';


@Component({
  selector: 'login',
  imports: [
    LoginForm,
    AlertMessage
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  router = inject(Router);

  authStoreService = inject(AuthStore);

  protected readonly USER_ROLES = USER_ROLES;

  protected isError = signal<boolean>(false);
  protected readonly errorMessage = 'Invalid credentials';
  protected message = signal<string>('');

  loginAs(event: Event, role: UserRoles) {
    event.preventDefault();
    const credentials = DEMO_USERS.find(user => user.role === role);
    void this.onLogin({email: credentials!.email, password: credentials!.password});
  }

  async onLogin(payload: LoginPayload): Promise<void> {
    this.authStoreService.login(payload).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: e => {
        console.error(e);
        this.handleErrorMessage();
      }
    })
  }

  handleErrorMessage() {
    this.message.set(this.errorMessage);
    this.isError.set(true);
    setTimeout(() => this.isError.set(false), 3000);
  }

}

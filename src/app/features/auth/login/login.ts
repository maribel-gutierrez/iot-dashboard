import { Component, inject, signal } from '@angular/core';
import { LoginForm } from '@features/auth/login/login-form/login-form';
import { Router } from '@angular/router';
import { AuthStore } from '@core/auth/auth.store';
import { AlertMessage } from '@shared/alert-component/alert-message';
import { DEMO_USERS, UserRoles, USER_ROLES } from '@core/constants/user.constants';


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
  authStoreService = inject(AuthStore);
  router = inject(Router)

  protected isError = signal<boolean>(false);
  protected readonly errorMessage = 'Invalid credentials';
  protected message = signal<string>('');

  loginAs(event: Event, role: UserRoles) {
    event.preventDefault();
    const credentials = DEMO_USERS.find(user => user.role === role);
    void this.onLogin({email: credentials!.email, password: credentials!.password});
  }

  async onLogin({email, password}: { email: string; password: string }): Promise<void> {
    try {
      await this.authStoreService.login(email, password);
      void this.router.navigate(['/dashboard']);
    } catch (e) {
      console.error(e)
      this.message.set(this.errorMessage);
      this.isError.set(true);
      setTimeout(() => this.isError.set(false), 3000);
    }
  }

  protected readonly RolesEnum = USER_ROLES;
}

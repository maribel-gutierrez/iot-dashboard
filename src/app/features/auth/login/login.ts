import { Component, computed, inject, signal } from '@angular/core';
import { LoginForm } from '@features/auth/login/login-form/login-form';
import { Router } from '@angular/router';
import { AuthStore } from '@core/auth/auth.store';
import { AlertMessage } from '@shared/alert-component/alert-message';
import { DEMO_USERS } from '@core/constants/user.constants';
import { LoginPayload } from '@core/auth/types';
import { USER_ROLES, UserRoles } from '@core/types/user';
import { LOGIN_SOURCE, LoginSource } from '@features/auth/login/types';

@Component({
  selector: 'login',
  imports: [LoginForm, AlertMessage],
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

  protected loginSource = signal<LoginSource>(null);
  protected readonly isLoading = computed(() => this.loginSource() !== null);
  protected readonly isAdminLoading = computed(() => this.loginSource() === LOGIN_SOURCE.Admin);
  protected readonly isViewerLoading = computed(() => this.loginSource() === LOGIN_SOURCE.Viewer);
  protected readonly isFormLoading = computed(() => this.loginSource() === LOGIN_SOURCE.Form);

  protected readonly adminCapabilities = [
    'View all devices',
    'Send commands',
    'Set alert rules',
    'Full analytics',
  ];

  protected readonly viewerCapabilities = [
    'Monitor devices',
    'View live telemetry',
    'View analytics',
    'No controls',
  ];

  loginAs(event: Event, role: UserRoles): void {
    event.preventDefault();
    this.loginSource.set(role === USER_ROLES.Admin ? 'admin' : 'viewer');
    const credentials = DEMO_USERS.find((user) => user.role === role);
    this.onLogin({ email: credentials!.email, password: credentials!.password });
  }

  onLogin(payload: LoginPayload): void {
    if (!this.loginSource()) {
      this.loginSource.set('form');
    }

    this.authStoreService.login(payload).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => {
        console.error(e);
        this.loginSource.set(null);
        this.showErrorMessage();
      },
    });
  }

  showErrorMessage() {
    this.message.set(this.errorMessage);
    this.isError.set(true);
    setTimeout(() => this.isError.set(false), 3000);
  }
}

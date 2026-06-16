import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';

import { LoginPayload } from '@core/auth/types';
import { LoggingService } from '@core/logging.service';
import { USER_ROLES, UserRoles } from '@core/types/user';

import { AlertMessage } from '@shared/alert-component/alert-message';

import { LoginForm } from '@features/auth/login/login-form/login-form';
import { LOGIN_SOURCE, LoginSource } from '@features/auth/login/login-types';
import { LoginApi } from '@features/auth/login/login-api';

@Component({
  selector: 'login',
  imports: [LoginForm, AlertMessage],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {
  router = inject(Router);

  loginService = inject(LoginApi);

  logger = inject(LoggingService);

  protected readonly USER_ROLES = USER_ROLES;

  protected isError = signal<boolean>(false);
  protected readonly errorMessage = 'Invalid credentials';
  protected message = signal<string>('');
  private _alertMessageTimeout: number | null = null;

  protected loginSource = signal<LoginSource | null>(null);
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
    this.loginSource.set(role === USER_ROLES.Admin ? USER_ROLES.Admin : USER_ROLES.Viewer);
    const credentials = this.loginService.getDemoCredentials(role);

    if (!credentials) {
      this.showErrorMessage('Demo credentials not found');
      return;
    }

    this.onLogin(credentials);
  }

  onLogin(payload: LoginPayload): void {
    if (!this.loginSource()) {
      this.loginSource.set('Form');
    }

    this.loginService
      .login(payload)
      .pipe(
        take(1),
        finalize(() => this.loginSource.set(null)),
      )
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (e) => {
          this.logger.error(e);
          this.showErrorMessage();
        },
      });
  }

  showErrorMessage(message: string = this.errorMessage) {
    this.loginSource.set(null);
    this.message.set(message);
    this.isError.set(true);
    if (this._alertMessageTimeout) {
      clearTimeout(this._alertMessageTimeout);
    }
    this._alertMessageTimeout = window.setTimeout(() => {
      this.isError.set(false);
      this._alertMessageTimeout = null;
    }, 3000);
  }

  ngOnDestroy(): void {
    if (this._alertMessageTimeout) {
      clearTimeout(this._alertMessageTimeout);
      this._alertMessageTimeout = null;
    }
  }
}

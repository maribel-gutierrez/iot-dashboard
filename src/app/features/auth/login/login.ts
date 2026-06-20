import { Component, computed, inject, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, take } from 'rxjs';

import { LoginPayload } from '@core/auth/types';
import { LoggingService } from '@core/logging.service';
import { UserRoles } from '@core/types/user';

import { LoginForm } from '@features/auth/login/components/login-form/login-form';
import { RoleCardGrid } from '@features/auth/login/components/role-card-grid/role-card-grid';
import { LoginApi } from '@features/auth/login/login-api';
import { LOGIN_SOURCE, LoginSource } from '@features/auth/login/login-types';

import { AlertMessage } from '@shared/alert-component/alert-message';

@Component({
  selector: 'login',
  imports: [LoginForm, AlertMessage, RoleCardGrid],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login implements OnDestroy {
  router = inject(Router);

  loginService = inject(LoginApi);

  logger = inject(LoggingService);

  protected isError = signal<boolean>(false);
  protected readonly errorMessage = 'Invalid credentials';
  protected message = signal<string>('');
  private _alertMessageTimeout: number | null = null;

  protected loginSource = signal<LoginSource | null>(null);
  protected readonly isDemoLoading = computed(
    () => this.loginSource() === LOGIN_SOURCE.Admin || this.loginSource() === LOGIN_SOURCE.Viewer,
  );
  protected readonly isFormLoading = computed(() => this.loginSource() === LOGIN_SOURCE.Form);

  loginAs(role: UserRoles): void {
    const credentials = this.loginService.getDemoCredentials(role);

    if (!credentials) {
      this.showErrorMessage('Demo credentials not found');
      return;
    }

    this.login(credentials);
  }

  login(payload: LoginPayload): void {
    if (this.loginSource() === null) {
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

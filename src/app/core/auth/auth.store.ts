import { computed, Service, signal } from '@angular/core';
import { delay, map, Observable, of, switchMap, tap, throwError } from 'rxjs';

import { AuthResponse, LoginPayload } from '@core/auth/types';
import { DEMO_USERS } from '@core/constants/user.constants';
import { UserProfile } from '@core/types/user';

@Service()
export class AuthStore {
  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<UserProfile | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);

  login(payload: LoginPayload): Observable<UserProfile> {
    return of(payload).pipe(
      delay(5000),
      switchMap(({ email, password }) => {
        const found = DEMO_USERS.find((u) => u.email === email && u.password === password);

        if (!found) {
          return throwError(() => new Error('Invalid credentials'));
        }

        const authResponse: AuthResponse = {
          token: this.createFakeJwt(found),
          user: {
            email: found.email,
            name: found.name,
            role: found.role,
          },
        };

        return of(authResponse);
      }),
      tap((response) => {
        this._token.set(response.token);
        this._user.set(response.user);
      }),
      map((response) => response.user),
    );
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
  }

  private createFakeJwt(user: { email: string; role: string }): string {
    const enc = (o: object) => btoa(JSON.stringify(o));
    return `${enc({ alg: 'none', typ: 'JWT' })}.${enc({
      sub: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1h expiry — handle it!
    })}.demo-signature`;
  }
}

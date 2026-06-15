import { computed, Service, signal } from '@angular/core';
import { DEMO_USERS, User, USER_ROLES } from '@core/constants/user.constants';

@Service()
export class AuthStore {
  private readonly _token = signal<string | null>(null);
  private readonly _user = signal<Omit<User, 'password'> | null>(null);

  readonly token = this._token.asReadonly();
  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._token() !== null);
  readonly isAdmin = computed(() => this._user()?.role === USER_ROLES.Admin);

  async login(email: string, password: string): Promise<void> {
    await new Promise(r => setTimeout(r, 1000));

    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');

    const {password: _, ...user} = found;
    this._user.set(user);
    this._token.set(this.createFakeJwt(user));
  }

  logout(): void {
    this._user.set(null);
    this._token.set(null);
  }

  private createFakeJwt(user: { email: string; role: string }): string {
    const enc = (o: object) => btoa(JSON.stringify(o));
    return `${enc({alg: 'none', typ: 'JWT'})}.${enc({
      sub: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1h expiry — handle it!
    })}.demo-signature`;
  }
}

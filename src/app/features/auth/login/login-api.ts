import { Service, inject } from '@angular/core';
import { DEMO_USERS } from '@core/constants/user.constants';
import { AuthStore } from '@core/auth/auth.store';
import { LoginPayload } from '@core/auth/types';
import { UserRoles } from '@core/types/user';
import { Observable } from 'rxjs';
import { UserProfile } from '@core/types/user';

@Service()
export class LoginApi {
  private authStore = inject(AuthStore);

  getDemoCredentials(role: UserRoles): LoginPayload | null {
    const found = DEMO_USERS.find((u) => u.role === role);
    if (!found) return null;
    return { email: found.email, password: found.password };
  }

  login(payload: LoginPayload): Observable<UserProfile> {
    return this.authStore.login(payload);
  }
}

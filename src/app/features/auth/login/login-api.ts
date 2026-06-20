import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthStore } from '@core/auth/auth.store';
import { LoginPayload } from '@core/auth/types';
import { DEMO_USERS } from '@core/constants/user.constants';
import { UserProfile, UserRoles } from '@core/types/user';

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

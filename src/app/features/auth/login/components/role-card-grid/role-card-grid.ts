import { Component, computed, input, output, signal } from '@angular/core';

import { USER_ROLES, UserRoles } from '@core/types/user';

import { RoleCard } from '@features/auth/login/components/role-card/role-card';
import { LOGIN_SOURCE, LoginSource } from '@features/auth/login/login-types';

@Component({
  selector: 'role-card-grid',
  imports: [RoleCard],
  templateUrl: './role-card-grid.html',
  styleUrls: ['./role-card-grid.css'],
})
export class RoleCardGrid {
  loginAsDemo = output<UserRoles>();
  loading = input.required<boolean>();

  protected loginSource = signal<LoginSource | null>(null);

  protected readonly isAdminLoading = computed(() => this.loginSource() === LOGIN_SOURCE.Admin);
  protected readonly isViewerLoading = computed(() => this.loginSource() === LOGIN_SOURCE.Viewer);

  protected readonly USER_ROLES = USER_ROLES;

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

    this.loginAsDemo.emit(role);
  }
}

export const USER_ROLES = {
  Admin: 'Admin',
  Viewer: 'Viewer'
} as const;

export type UserRoles = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface User {
  email: string;
  name: string;
  password?: string;
  role: UserRoles;
}

export const DEMO_USERS: User[] = [
  {email: 'admin@demo.io', password: 'demo1234', role: USER_ROLES.Admin, name: 'Demo Admin'},
  {email: 'viewer@demo.io', password: 'demo1234', role: USER_ROLES.Viewer, name: 'Demo Viewer'},
];

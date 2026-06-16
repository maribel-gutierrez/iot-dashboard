import { User, USER_ROLES } from '@core/types/user';

export const DEMO_USERS: User[] = [
  {
    email: 'admin@demo.io',
    password: 'demo1234',
    role: USER_ROLES.Admin,
    name: 'Demo Admin',
  },
  {
    email: 'viewer@demo.io',
    password: 'demo1234',
    role: USER_ROLES.Viewer,
    name: 'Demo Viewer',
  },
];

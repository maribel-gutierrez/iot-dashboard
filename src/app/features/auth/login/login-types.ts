import { USER_ROLES } from '@core/types/user';

export const LOGIN_SOURCE = {
  Admin: USER_ROLES.Admin,
  Viewer: USER_ROLES.Viewer,
  Form: 'Form',
} as const;

export type LoginSource = (typeof LOGIN_SOURCE)[keyof typeof LOGIN_SOURCE] | null;

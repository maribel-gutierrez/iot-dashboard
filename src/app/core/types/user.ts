export const USER_ROLES = {
  Admin: 'Admin',
  Viewer: 'Viewer'
} as const;
export type UserRoles = typeof USER_ROLES[keyof typeof USER_ROLES];

export interface User {
  email: string;
  name: string;
  password: string;
  role: UserRoles;
}

export type UserProfile = Omit<User, 'password'>;

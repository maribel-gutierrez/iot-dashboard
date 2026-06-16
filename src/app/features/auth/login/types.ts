export const LOGIN_SOURCE = {
  Admin: 'admin',
  Viewer: 'viewer',
  Form: 'form',
} as const;

export type LoginSource = (typeof LOGIN_SOURCE)[keyof typeof LOGIN_SOURCE] | null;

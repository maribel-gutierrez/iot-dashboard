import { User, UserProfile } from '@core/types/user';

export type LoginPayload = Pick<User, 'email' | 'password'>;

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

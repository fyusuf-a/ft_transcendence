import { User } from '../users/entities/user.entity';

export type JwtToken = string;

export interface JwtPayload {
  id: number;
  isTwoFAAuthenticated: boolean;
}

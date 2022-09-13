import { UserDto } from '@dtos/users';

export type RequestWithUser = {
  user: UserDto;
};

export type JwtToken = string;

export interface JwtPayload {
  id: number;
  isTwoFAAuthenticated: boolean;
}

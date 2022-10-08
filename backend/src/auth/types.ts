export type JwtToken = string;

export interface JwtPayload {
  id: number;
  isTwoFAAuthenticated: boolean;
}

import { User, AuthResponse } from '.'

export interface RegisterResponse {
  user: User
  token: AuthResponse
}

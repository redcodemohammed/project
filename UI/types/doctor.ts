import { User } from './user'

export interface Doctor {
  id: number
  user_id: number
  specialty: string
  created_at: string
  updated_at: string

  user?: User
}

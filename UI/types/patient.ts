import { Gender } from '~~/enums'
import { User } from './user'
import { Medicine } from './medicine'

export interface Patient {
  id: number
  user_id: number
  birthdate: string
  created_at: string
  updated_at: string
  user?: User
  gender?: Gender
  phonenumber?: string
  medicines: Medicine[]
}

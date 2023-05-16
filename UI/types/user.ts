import { UserType } from '~~/enums'
import { Doctor, Patient } from '.'

export interface User {
  id: number
  name: string
  email: string
  remember_me_token: string
  user_type: UserType
  created_at: string
  updated_at: string
  doctor_id?: number
  doctor?: Doctor
  patient_id?: number
  patient?: Patient
}

import { Doctor } from './doctor'
import { Patient } from './patient'

export interface Medicine {
  id: number
  name: string
  dosage: number
  // todo: create type for this
  frequency_settings: any
  start_date: string
  end_date: string
  quantity: number
  full_quantity: number
  reason: string
  expiry_date: string
  state: string
  state_reason: string
  state_updated_at: string
  patient_id: number
  patient?: Patient
  doctor_id: number
  doctor?: Doctor
  created_at: string
  updated_at: string
}

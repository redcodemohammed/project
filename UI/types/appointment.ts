export interface Appointment {
  id: number
  doctor_id: number
  patient_id: number
  message: string | null
  created_at: string
  updated_at: string
}

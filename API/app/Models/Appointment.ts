import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { belongsTo } from '@ioc:Adonis/Lucid/Orm'
import Doctor from './Doctor'
import { BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Patient from './Patient'

export default class Appointment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'doctor_id' })
  public doctorId: number

  @belongsTo(() => Doctor)
  public doctor: BelongsTo<typeof Doctor>

  @column({ columnName: 'patient_id' })
  public patientId: number

  @belongsTo(() => Patient)
  public patient: BelongsTo<typeof Patient>

  @column.dateTime({ columnName: 'start_time', autoCreate: true })
  public startTime: DateTime

  @column({ columnName: 'message' })
  public message: string | null

  @column()
  public accepted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}

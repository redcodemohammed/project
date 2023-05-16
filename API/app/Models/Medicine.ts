import { BaseModel, BelongsTo, afterFetch, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Doctor from './Doctor'
import Patient from './Patient'

export default class Medicine extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public dosage: number

  @column()
  // todo: create type for this
  public frequency_settings: any

  @column.date()
  public start_date: DateTime

  @column.date()
  public end_date: DateTime

  @column()
  public quantity: number

  @column()
  public full_quantity: number

  @column()
  public reason: string

  @column.date()
  public expiry_date: DateTime

  @column()
  public state: string

  @column()
  public state_reason: string

  @column.dateTime()
  public state_updated_at: DateTime

  @column()
  public patientId: number

  @belongsTo(() => Patient)
  public patient: BelongsTo<typeof Patient>

  @column()
  public doctorId: number

  @belongsTo(() => Doctor)
  public doctor: BelongsTo<typeof Doctor>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @afterFetch()
  public static async afterFindHook(medicines: Medicine[]) {
    medicines.forEach(async (medicine) => {
      // check if the medicine is not expired
      const isExpired = DateTime.now() > medicine.expiry_date
      // check if the medicine has not ended
      const isEnded = DateTime.now() > medicine.end_date
      if (medicine.state === 'deleted') return
      if (isExpired) {
        medicine.state = 'expired'
      }
      if (isEnded) {
        medicine.state = 'completed'
      }
      await medicine.save()
    })
  }
}

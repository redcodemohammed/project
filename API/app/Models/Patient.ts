import {
  BaseModel,
  BelongsTo,
  belongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Doctor from './Doctor'
import User from './User'
import { Gender } from '../../global/enums'
import Medicine from './Medicine'
import Appointment from './Appointment'

export default class Patient extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.date()
  public birthdate: DateTime

  @column()
  public gender: Gender

  @column()
  public phonenumber: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId: number
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Doctor, {
    pivotTimestamps: true,
  })
  public doctors: ManyToMany<typeof Doctor>

  @hasMany(() => Medicine)
  public medicines: HasMany<typeof Medicine>

  @hasMany(() => Appointment)
  public appointment: HasMany<typeof Appointment>
}

import {
  BaseModel,
  belongsTo,
  BelongsTo,
  column,
  HasMany,
  hasMany,
  ManyToMany,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Patient from './Patient'
import User from './User'
import Medicine from './Medicine'

export default class Doctor extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public specialty: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public userId: number
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Patient, {
    pivotTimestamps: true,
  })
  public patients: ManyToMany<typeof Patient>

  @hasMany(() => Medicine)
  public medicines: HasMany<typeof Medicine>
}

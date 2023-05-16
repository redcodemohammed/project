import Hash from '@ioc:Adonis/Core/Hash'
import {
  BaseModel,
  HasOne,
  beforeSave,
  column,
  hasOne,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import { UserType } from '../../global/enums'
import Doctor from './Doctor'
import Patient from './Patient'
import Subscription from './Subscription'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public userType: UserType

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public patientId: number
  @hasOne(() => Patient)
  public patient: HasOne<typeof Patient>

  @column()
  public doctorId: number
  @hasOne(() => Doctor)
  public doctor: HasOne<typeof Doctor>

  @hasMany(() => Subscription)
  public subscriptions: HasMany<typeof Subscription>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}

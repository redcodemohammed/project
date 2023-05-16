import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { Gender } from '../../global/enums'

export default class extends BaseSchema {
  protected tableName = 'patients'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum('gender', Object.values(Gender))
      table.string('phonenumber', 255)
      table.date('birthdate').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

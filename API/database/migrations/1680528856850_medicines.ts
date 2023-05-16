import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { MedicineState } from '../../global/enums'

export default class extends BaseSchema {
  protected tableName = 'medicines'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.integer('dosage').notNullable()
      table.jsonb('frequency_settings').notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.integer('quantity').notNullable()
      table.integer('full_quantity').notNullable()
      table.string('reason').notNullable()
      table.date('expiry_date').notNullable()
      table.enum('state', Object.values(MedicineState)).defaultTo(MedicineState.Suspended)
      table.string('state_reason').nullable()
      table.timestamp('state_updated_at').nullable()
      table.integer('patient_id').unsigned().references('patients.id').onDelete('CASCADE')
      table.integer('doctor_id').unsigned().references('doctors.id').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

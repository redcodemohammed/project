import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('doctor_id').unsigned().references('doctors.id').onDelete('CASCADE').nullable()
      table
        .integer('patient_id')
        .unsigned()
        .references('patients.id')
        .onDelete('CASCADE')
        .nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumns('doctor_id', 'patient_id')
    })
  }
}

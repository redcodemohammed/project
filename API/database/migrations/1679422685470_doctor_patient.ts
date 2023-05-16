import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'doctor_patient'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('doctor_id').unsigned().references('doctors.id')
      table.integer('patient_id').unsigned().references('patients.id')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.unique(['doctor_id', 'patient_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

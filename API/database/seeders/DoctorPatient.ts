import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Doctor from '../../app/Models/Doctor'
import Patient from '../../app/Models/Patient'

export default class extends BaseSeeder {
  public async run() {
    const patient = await Patient.findBy('id', 1)
    const doctor = await Doctor.findBy('id', 1)

    if (patient && doctor) {
      await patient.related('doctors').attach([doctor.id])
    }
  }
}

import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Patient from '../../app/Models/Patient'
import User from '../../app/Models/User'
import { UserType } from '../../global/enums'

export default class extends BaseSeeder {
  public async run() {
    const user = await User.create({
      name: 'Patient 1',
      email: 'patient@gmail.com',
      password: '1234567890',
      userType: UserType.Patient,
    })

    const patient = await Patient.create({
      birthdate: '01/01/2001',
      userId: user.id,
    })

    user.patientId = patient.id

    await user.save()
  }
}

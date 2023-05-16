import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Doctor from '../../app/Models/Doctor'
import User from '../../app/Models/User'
import { UserType } from '../../global/enums'

export default class extends BaseSeeder {
  public async run() {
    const user = await User.create({
      name: 'Doctor 1',
      email: 'doctor@gmail.com',
      password: '1234567890',
      userType: UserType.Doctor,
    })

    const doctor = await Doctor.create({
      specialty: 'Surgery',
      userId: user.id,
    })

    user.doctorId = doctor.id
    await user.save()
  }
}

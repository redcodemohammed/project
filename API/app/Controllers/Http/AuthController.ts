import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { MedicineState, UserType } from 'Global/enums'
import Doctor from 'App/Models/Doctor'
import Encryption from '@ioc:Adonis/Core/Encryption'
import Patient from 'App/Models/Patient'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ request, auth }: HttpContextContract) {
    const registerSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.unique({ column: 'email', table: 'users', caseInsensitive: true }),
      ]),
      password: schema.string({}),
      name: schema.string({}),
      userType: schema.enum(Object.values(UserType)),
      birthdate: schema.date.optional({ format: 'yyyy-mm-dd' }, [
        rules.requiredWhen('userType', '=', UserType.Patient),
      ]),
      specialty: schema.string.optional({}, [rules.requiredWhen('userType', '=', UserType.Doctor)]),
    })

    const { birthdate, email, name, password, userType, specialty } = await request.validate({
      schema: registerSchema,
    })

    const newUser = await User.create({ email, name, password, userType })

    // create profile for the user based on the type
    let profile: Doctor | Patient
    if (userType === UserType.Doctor) {
      profile = await Doctor.create({ userId: newUser.id, specialty })
      newUser.doctorId = profile.id
      await newUser.load('doctor')
    } else {
      profile = await Patient.create({ birthdate, userId: newUser.id })
      newUser.patientId = profile.id
      await newUser.load('patient')
    }
    await newUser.save()

    const token = await auth.use('api').attempt(email, password)

    return { user: newUser, profile, token }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const loginSchema = schema.create({
      email: schema.string({}, [rules.email()]),
      password: schema.string({}),
    })

    const { email, password } = await request.validate({ schema: loginSchema })

    try {
      const token = await auth.use('api').attempt(email, password)
      const user = await User.findBy('email', email)
      if (user) {
        const wsToken = await Encryption.encrypt(user.id)
        return { ...token.toJSON(), wsToken }
      }
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async profile({ auth }: HttpContextContract) {
    await auth.use('api').authenticate()
    const user = auth.use('api').user! as User

    await user.load(user.userType === UserType.Doctor ? 'doctor' : 'patient')

    return { user }
  }

  public async createPatient({ auth, request, bouncer }: HttpContextContract) {
    await bouncer.authorize('createPatient')
    const createPatientSchema = schema.create({
      email: schema.string({}, [
        rules.email(),
        rules.unique({ column: 'email', table: 'users', caseInsensitive: true }),
      ]),
      password: schema.string({}),
      name: schema.string({}),
      birthdate: schema.date({ format: 'dd/mm/yyyy' }),
    })

    const { birthdate, email, name, password } = await request.validate({
      schema: createPatientSchema,
    })

    // create a new user
    const newUser = await User.create({ email, name, password })
    const patient = await Patient.create({ birthdate, userId: newUser.id })

    // link the new user with the current one
    const currentUser = (await auth.use('api').user!) as User
    const currentDoctor = await Doctor.findBy('user_id', currentUser.id)

    currentDoctor?.related('patients').attach([patient.id])
    return { user: newUser, patient }
  }

  public async linkPatient({ auth, request, bouncer }: HttpContextContract) {
    await bouncer.authorize('createPatient')

    // link the new user with the current one
    const currentUser = (await auth.use('api').user!) as User
    const currentDoctor = await Doctor.findBy('user_id', currentUser.id)

    const linkPatientSchema = schema.create({
      patientID: schema.number([
        rules.exists({ column: 'id', table: 'patients' }),
        rules.unique({
          column: 'patient_id',
          table: 'doctor_patient',
          where: { doctor_id: currentDoctor?.id },
        }),
      ]),
    })

    const { patientID } = await request.validate({ schema: linkPatientSchema })

    currentDoctor?.related('patients').attach([patientID])
  }

  public async getPatients({ auth, bouncer }: HttpContextContract) {
    await bouncer.authorize('getPatients')

    const currentUser = (await auth.use('api').user!) as User
    const currentDoctor = (await Doctor.findBy('user_id', currentUser.id)) as Doctor

    const patients = await currentDoctor.related('patients').query().preload('user')

    return patients
  }

  public async getPatientById({ request, bouncer }: HttpContextContract) {
    const getPatientSchema = schema.create({
      params: schema.object([]).members({
        id: schema.number(),
      }),
    })
    const { params } = await request.validate({ schema: getPatientSchema })

    await bouncer.authorize('getPatients', params.id)

    const patientUser = await User.findBy('id', params.id)
    await patientUser?.load('patient')
    await patientUser?.patient.load('medicines')
    patientUser?.patient.medicines.sort((a, b) => {
      if (a.state === MedicineState.Deleted) return -1
      // @ts-ignore
      return new Date(a.createdAt) - new Date(b.createdAt)
    })

    return patientUser
  }

  public async getDoctors({ auth, bouncer }: HttpContextContract) {
    await bouncer.authorize('getDoctors')

    const currentUser = (await auth.use('api').user!) as User
    const currentPatient = await Patient.findBy('user_id', currentUser.id)

    const doctors = await currentPatient?.related('doctors').query().preload('user')

    return doctors
  }

  public async logout({ auth }: HttpContextContract) {
    auth.logout()
  }
}

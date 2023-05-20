import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Appointment from 'App/Models/Appointment'
import Event from '@ioc:Adonis/Core/Event'
import Doctor from 'App/Models/Doctor'

export default class AppointmentsController {
  public async index({ bouncer, auth }: HttpContextContract) {
    await bouncer.authorize('showAppointments')
    const user = await auth.user
    const doctorID = user?.doctorId as number
    const appointments = await Appointment.query()
      .select('*')
      .where('doctorId', doctorID)
      .preload('patient', (patient) => patient.preload('user'))

    return appointments
  }

  public async create({ request, bouncer, auth }: HttpContextContract) {
    await bouncer.authorize('createAppointments')
    const user = await auth.user

    const { doctorId, message, startTime } = await request.validate({
      schema: schema.create({
        doctorId: schema.number([rules.exists({ column: 'id', table: 'doctors' })]),
        startTime: schema.date(),
        message: schema.string.optional(),
      }),
    })

    const appointment = await Appointment.create({
      doctorId,
      message,
      patientId: user?.patientId,
      startTime,
    })

    return appointment.toJSON()
  }

  public async acceptAppointment({ request, bouncer, auth }: HttpContextContract) {
    await bouncer.authorize('acceptAppointments')

    const user = auth.user
    await user?.load('doctor')
    const doctor = user?.doctor as Doctor

    const {
      params: { id },
    } = await request.validate({
      schema: schema.create({
        params: schema.object([]).members({
          id: schema.number(),
        }),
      }),
    })

    const appointment = await Appointment.findBy('id', id)
    if (appointment && doctor) {
      await bouncer.authorize('acceptAppointment', doctor, appointment)
      appointment.accepted = true
      await appointment.save()
      Event.emit('appointment-accepted', id)
      return appointment.toJSON()
    }
  }
}

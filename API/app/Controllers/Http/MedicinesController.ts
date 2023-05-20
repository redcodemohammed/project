import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import Log from 'App/Models/Log'
import Medicine from 'App/Models/Medicine'
import User from 'App/Models/User'
import { MedicineState, Status } from 'Global/enums'
import { DateTime } from 'luxon'

export default class MedicinesController {
  public async createMedicine({ auth, bouncer, request }: HttpContextContract) {
    // check if the current user can add medicines
    await bouncer.authorize('createMedicine')

    const doctorUser = (await auth.user) as User
    await doctorUser.load('doctor')

    // validate the request
    // const dateRegex = /^(?!0000)[0-9]{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/
    const createMedicineSchema = schema.create({
      name: schema.string(),
      dosage: schema.number(),
      frequency_settings: schema.object().members({
        start_time: schema.object().members({
          hours: schema.number(),
          minutes: schema.number(),
          seconds: schema.number(),
        }),
        end_time: schema.object().members({
          hours: schema.number(),
          minutes: schema.number(),
          seconds: schema.number(),
        }),
        doses: schema.array().members(
          schema.object().members({
            hours: schema.number(),
            minutes: schema.number(),
            seconds: schema.number(),
          })
        ),
      }),
      start_date: schema.date(),
      end_date: schema.date(),
      quantity: schema.number(),
      reason: schema.string(),
      expiry_date: schema.date(),
      patientId: schema.number(),
    })

    const createMedicineData = await request.validate({ schema: createMedicineSchema })

    const medicine = await Medicine.create({
      ...createMedicineData,
      doctorId: doctorUser.doctor.id,
      full_quantity: createMedicineData.quantity,
    })

    await medicine.load('doctor')
    await medicine.doctor.load('user')
    await medicine.load('patient')
    await medicine.patient.load('user')

    return medicine
  }

  public async removeMedicine({ auth, bouncer, request, response }: HttpContextContract) {
    // check if the current user can remove a medicine
    await bouncer.authorize('removeMedicine')
    const doctorUser = (await auth.user) as User
    await doctorUser.load('doctor')
    const removeMedicineSchema = schema.create({
      params: schema.object([]).members({
        id: schema.number(),
      }),
      remove_reason: schema.string(),
    })
    const removeMedicineData = await request.validate({ schema: removeMedicineSchema })
    // find the medicine
    const medicine = await Medicine.findBy('id', removeMedicineData.params.id)
    // change the state of the medicine
    if (medicine) {
      medicine.state = MedicineState.Deleted
      medicine.state_reason = removeMedicineData.remove_reason
      medicine.state_updated_at = DateTime.now()
      await medicine.save()

      return medicine.toJSON()
    } else {
      return response.notFound({
        message: `medicine with id ${removeMedicineData.params.id} was not found`,
      })
    }
  }

  public async toggleMedicineState({ auth, bouncer, request, response }: HttpContextContract) {
    // check if the current user can remove a medicine
    await bouncer.authorize('modifyMedicine')
    const doctorUser = (await auth.user) as User
    await doctorUser.load('doctor')

    const toggleMedicineStateSchema = schema.create({
      params: schema.object([]).members({
        id: schema.number(),
      }),
    })
    const toggleMedicineStateData = await request.validate({ schema: toggleMedicineStateSchema })
    // find the medicine
    const medicine = await Medicine.findBy('id', toggleMedicineStateData.params.id)
    // change the state of the medicine
    if (medicine) {
      medicine.state =
        medicine.state === MedicineState.Suspended ? MedicineState.Active : MedicineState.Suspended
      medicine.state_updated_at = DateTime.now()
      await medicine.save()

      return medicine.toJSON()
    } else {
      return response.notFound({
        message: `medicine with id ${toggleMedicineStateData.params.id} was not found`,
      })
    }
  }

  public async getTodaysMedicines({ auth, bouncer }: HttpContextContract) {
    await bouncer.authorize('getTodaysMedicines')

    // get the current user
    const patientUser = (await auth.user) as User
    // load the patient
    await patientUser.load('patient')
    // load the patient's medicines
    await patientUser.patient.load('medicines')
    // filter the medicines
    const medicines = await Promise.all(
      patientUser.patient.medicines
        .filter((medicine) => {
          // check if the medicine is active
          const isActive = medicine.state === MedicineState.Active
          // check if the medicine is not expired
          const isNotExpired = DateTime.now() < medicine.expiry_date
          // check if the medicine has not ended
          const isNotEnded = DateTime.now() < medicine.end_date
          // check if the medicine has started
          const hasStarted = DateTime.now() >= medicine.start_date

          return isActive && isNotExpired && isNotEnded && hasStarted
        })
        .map(async (medicine) => {
          await medicine.load('doctor')
          await medicine.doctor.load('user')
          return medicine
        })
    )

    return medicines
  }

  public async takePill({ bouncer, request, response }: HttpContextContract) {
    const {
      params: { id: medicineID },
    } = await request.validate({
      schema: schema.create({
        params: schema.object([]).members({
          id: schema.number(),
        }),
      }),
    })

    const medicine = await Medicine.findBy('id', medicineID)
    if (medicine) {
      // check if the current user can take a pill
      await bouncer.authorize('takePill', medicine)
      await bouncer.authorize('pillsAvailable', medicine)

      const log = await Log.create({ medicine_id: medicineID, status: Status.Taken })

      medicine.quantity--

      await medicine.save()

      return log.toJSON()
    } else {
      return response.notFound({
        message: `medicine with id ${medicineID} was not found`,
      })
    }
  }
}

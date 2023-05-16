// import type { EventsList } from '@ioc:Adonis/Core/Event'
import Logger from '@ioc:Adonis/Core/Logger'
import { DateTime } from 'luxon'
import webpush, { PushSubscription } from 'web-push'
import { MedicineState } from '../../global/enums'
import Medicine from '../Models/Medicine'
import Subscription from '../Models/Subscription'

export default class Notification {
  public async onMedicineNotification() {
    // find medicines to notify about
    const activeMedicines = await Medicine.query()
      .where('state', MedicineState.Active)
      .where('expiry_date', '>', DateTime.now())
      .where('end_date', '>', DateTime.now())
      .where('start_date', '<=', DateTime.now())
      .preload('patient', (builder) => {
        builder.preload('user')
      })

    activeMedicines.forEach(async (medicine) => {
      await medicine.patient.load('user')
      const subscription = await Subscription.findBy<any>('userId', medicine.patient.user.id)

      if (subscription) {
        const { frequency_settings: frequencySettings } = medicine
        const now = new Date()

        // this mean the medicine time hasn't started yet.
        // if (now.getHours() < frequencySettings.start_time.hours) return

        // this mean the medicine time hasn't ended yet.
        // if (now.getHours() < frequencySettings.end_time.hours) return

        const doses = frequencySettings.doses
        if (Array.isArray(doses)) {
          doses.forEach((dose: { hours: number; minutes: number }) => {
            if (now.getHours() === dose.hours && Math.abs(now.getMinutes() - dose.minutes) < 30) {
              // send a notification
              const payload = JSON.stringify({
                title: 'Web push test',
                name: `${medicine.patient.user.name} take the ${dose.hours}:${dose.minutes} dose`,
              })

              if (subscription) {
                try {
                  webpush.sendNotification(subscription as PushSubscription, payload)
                  Logger.info(
                    `sending push to ${medicine.patient.user.name}: take the ${dose.hours}:${dose.minutes} dose`
                  )
                } catch {
                  Logger.error(
                    `error while sending a push notification to ${medicine.patient.user.id}`
                  )
                }
              }
            }
          })
        }
      }
    })
  }
}

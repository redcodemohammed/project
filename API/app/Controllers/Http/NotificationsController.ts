import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from '../../Models/User'
import { schema } from '@ioc:Adonis/Core/Validator'
import Subscription from '../../Models/Subscription'

export default class NotificationsController {
  /**
   * subscribe
   */
  public async subscribe({ request, auth }: HttpContextContract) {
    const subscriptionSchema = schema.create({
      endpoint: schema.string(),
      keys: schema.object().members({
        p256dh: schema.string(),
        auth: schema.string(),
      }),
    })

    await auth.use('api').authenticate()
    const user = auth.use('api').user! as User

    const { endpoint, keys } = await request.validate({ schema: subscriptionSchema })

    // remove all existing Subscriptions
    const subscriptions = await Subscription.query().where('userId', user.id)
    await Promise.all(subscriptions.map(async (subscription) => await subscription.delete()))

    await Subscription.create({ keys, endpoint, userId: user.id })
  }
}

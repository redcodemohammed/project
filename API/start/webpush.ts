import Env from '@ioc:Adonis/Core/Env'
import webpush from 'web-push'

const publicKey = Env.get('PUBLIC_VAPID_KEY')
const privateKey = Env.get('PRIVATE_VAPID_KEY')
webpush.setVapidDetails('mailto:text@text.com', publicKey, privateKey)

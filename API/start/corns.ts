import { CronJob } from 'cron'
import Event from '@ioc:Adonis/Core/Event'

new CronJob(
  '*/30 * * * *',
  () => Event.emit('medicine-notification', {}),
  null,
  true,
  'Asia/Baghdad'
)

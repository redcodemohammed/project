import { CronJob } from 'cron'
import Event from '@ioc:Adonis/Core/Event'

new CronJob(
  '*/1 * * * *',
  () => Event.emit('medicine-notification', {}),
  null,
  true,
  'Asia/Baghdad'
)

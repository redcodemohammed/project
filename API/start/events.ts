import Event from '@ioc:Adonis/Core/Event'

Event.on('medicine-notification', 'Notification.onMedicineNotification')

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // auth group
  Route.group(() => {
    Route.post('/login', 'AuthController.login')
    Route.post('/register', 'AuthController.register')
    Route.group(() => {
      Route.post('/patient', 'AuthController.createPatient')
      Route.post('/logout', 'AuthController.logout')
      Route.get('/profile', 'AuthController.profile')
      Route.get('/patients', 'AuthController.getPatients')
      Route.patch('/patients', 'AuthController.linkPatient')
      Route.get('/patient/:id', 'AuthController.getPatientById')
      Route.get('/doctors', 'AuthController.getDoctors')
    }).middleware('auth')
  }).prefix('auth')

  // Medicines group
  Route.group(() => {
    Route.post('/', 'MedicinesController.createMedicine')
    Route.delete('/:id', 'MedicinesController.removeMedicine')
    Route.patch('/:id/state', 'MedicinesController.toggleMedicineState')
    Route.get('/today', 'MedicinesController.getTodaysMedicines')
    Route.patch('/:id', 'MedicinesController.takePill')
  })
    .middleware('auth')
    .prefix('medicines')

  // Notification group
  Route.group(() => {
    Route.post('/', 'NotificationsController.subscribe')
  })
    .middleware('auth')
    .prefix('notifications')

  // Appointments group
  Route.group(() => {
    Route.post('/', 'AppointmentsController.create')
    Route.get('/', 'AppointmentsController.index')
    Route.patch('/:id', 'AppointmentsController.acceptAppointment')
  })
    .middleware('auth')
    .prefix('appointments')
}).prefix('v1')

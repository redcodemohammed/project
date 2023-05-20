/**
 * Contract source: https://git.io/Jte3T
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Bouncer from '@ioc:Adonis/Addons/Bouncer'
import Appointment from 'App/Models/Appointment'
import Doctor from 'App/Models/Doctor'
import Medicine from 'App/Models/Medicine'
import User from 'App/Models/User'
import { UserType } from 'Global/enums'

/*
|--------------------------------------------------------------------------
| Bouncer Actions
|--------------------------------------------------------------------------
|
| Actions allows you to separate your application business logic from the
| authorization logic. Feel free to make use of policies when you find
| yourself creating too many actions
|
| You can define an action using the `.define` method on the Bouncer object
| as shown in the following example
|
| ```
| 	Bouncer.define('deletePost', (user: User, post: Post) => {
|			return post.user_id === user.id
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "actions" const from this file
|****************************************************************
*/
export const { actions } = Bouncer
  // doctors permissions
  .define('createPatient', (user: User) => {
    return user.userType === UserType.Doctor
  })
  .define('getPatients', (user: User, id?: number) => {
    return user.userType === UserType.Doctor || user.id === id
  })
  .define('createMedicine', (user: User) => {
    return user.userType === UserType.Doctor
  })
  .define('removeMedicine', (user: User) => {
    return user.userType === UserType.Doctor
  })
  .define('modifyMedicine', (user: User) => {
    return user.userType === UserType.Doctor
  })
  // patients permissions
  .define('getDoctors', (user: User) => {
    return user.userType === UserType.Patient
  })
  .define('getTodaysMedicines', (user: User) => {
    return user.userType === UserType.Patient
  })
  /**
   * check if the current patient owns this medicine
   */
  .define('takePill', (user: User, medicine: Medicine) => {
    return user.userType === UserType.Patient && medicine.patientId === user.patientId
  })
  .define('pillsAvailable', (_user: User, medicine: Medicine) => {
    return medicine.quantity > 0
  })
  .define('createAppointments', (user: User) => {
    return user.userType === UserType.Patient
  })
  .define('showAppointments', (user: User) => {
    return user.userType === UserType.Doctor
  })
  .define('acceptAppointments', (user: User) => {
    return user.userType === UserType.Doctor
  })
  .define('acceptAppointment', (_user: User, doctor: Doctor, appointment: Appointment) => {
    return doctor.id === appointment.doctorId
  })
/*
|--------------------------------------------------------------------------
| Bouncer Policies
|--------------------------------------------------------------------------
|
| Policies are self contained actions for a given resource. For example: You
| can create a policy for a "User" resource, one policy for a "Post" resource
| and so on.
|
| The "registerPolicies" accepts a unique policy name and a function to lazy
| import the policy
|
| ```
| 	Bouncer.registerPolicies({
|			UserPolicy: () => import('App/Policies/User'),
| 		PostPolicy: () => import('App/Policies/Post')
| 	})
| ```
|
|****************************************************************
| NOTE: Always export the "policies" const from this file
|****************************************************************
*/
export const { policies } = Bouncer.registerPolicies({})

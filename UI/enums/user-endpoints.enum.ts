export enum UserEndpoints {
  /**
   * @method POST
   * @description log the user in
   */
  Login = '/auth/login',
  /**
   * @method POST
   * @description create a new user
   */
  Register = '/auth/register',
  /**
   * @method POST
   * @description log the current user out
   */
  Logout = '/auth/logout',

  /**
   * @method GET
   * @description returns the current profile of the user
   */
  Profile = '/auth/profile'
}

'use strict'

/*
|--------------------------------------------------------------------------
| Router
|--------------------------------------------------------------------------
|
| AdonisJs Router helps you in defining urls and their actions. It supports
| all major HTTP conventions to keep your routes file descriptive and
| clean.
|
| @example
| Route.get('/user', 'UserController.index')
| Route.post('/user', 'UserController.store')
| Route.resource('user', 'UserController')
*/


const Route = use('Route')
Route.get('/', 'HomeController.index')
Route.get('/loaderio-6903aed1b486387ac31b1e92971901ab.txt', 'HomeController.loaderIOverification')

/*
 |--------------------------------------------------------------------------
 | Api v1
 |--------------------------------------------------------------------------
 */
Route.group('apiv1', function () {
    Route.get('/latest', 'ApiV1Controller.latest')
    Route.get('/get/:from/:to/:date?', 'ApiV1Controller.convert')
}).prefix('api/v1');




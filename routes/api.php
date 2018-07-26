<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('foo', function () {
    return 'Hello World';
});

Route::post('login','\App\Http\Controllers\Auth\LoginController@authenticate')->middleware('auth.ldap');

/**
** Basic Routes for a RESTful service:
**
** Route::get($uri, $callback);
** Route::post($uri, $callback);
** Route::put($uri, $callback);
** Route::delete($uri, $callback);
**
**/

//Direct define http request method and its action here
//=============================================================================
// Route::get('products', function () {
//     return response(Product::all(),200);
// });
 
// Route::get('products/{product}', function ($productId) {
//     return response(Product::find($productId), 200);
// });
  
 
// Route::post('products', function(Request $request) {
//    $resp = Product::create($request->all());
//     return $resp;
 
// });
 
// Route::put('products/{product}', function(Request $request, $productId) {
//     $product = Product::findOrFail($productId);
//     $product->update($request->all());
//     return $product;
// });
 
// Route::delete('products/{product}',function($productId) {
//     Product::find($productId)->delete();
//     return 204;
// });
//=============================================================================

//Use method and it's action define in controller
//=============================================================================
Route::get('products', 'ProductsController@index');
 
Route::get('products/{product}', 'ProductsController@show');

Route::get('products/find_price/{price}', 'ProductsController@find_price');
 
Route::post('products','ProductsController@store');
 
Route::put('products/{product}','ProductsController@update');
 
Route::delete('products/{product}', 'ProductsController@delete');

// Route::get('tableau','TableauController@getTrustedTicket');
//=============================================================================
//Methods for year report
Route::get('getData', 'ReportDataController@index');
Route::get('getDataCount', 'ReportDataController@countOfData');
Route::get('getReportCount', 'ReportDataController@countOfReport');
Route::get('getUserCount', 'ReportDataController@countOfUser');
Route::get('getSummaryStats', 'ReportDataController@getSummaryStats');
Route::get('getReportList', 'ReportDataController@getReportList');
// Route::get('getCategory', 'ReportCategoryController@index');
Route::get('getReportMeta/{rep_no}', 'ReportMetaController@getReportMeta');
Route::middleware('csrf')->post('updateReportMeta','ReportMetaController@updateReportMeta');
Route::get('getCategory/{rep_no}', 'ReportCategoryController@getCategory');
Route::get('getCategoryNotHidden/{rep_no}', 'ReportCategoryController@getCategoryNotHidden');
Route::middleware('csrf')->post('updateCategory','ReportCategoryController@updateCategory');
Route::get('getReport/{rep_no}', 'ReportDataController@getReport');
Route::middleware('csrf')->post('updateReport','ReportDataController@updateReport');
// Route::get('getFile', 'FileController@getFile');
Route::get('getFileList/{folder}', 'FileController@getFileList');
Route::get('getPublicFile/{src}', 'FileController@getPublicFile');
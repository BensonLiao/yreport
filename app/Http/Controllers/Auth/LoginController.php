<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\ReportUser;

class LoginController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    use AuthenticatesUsers;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/yreport';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest')->except('logout');
    }

    /**
     * Retrieve the user object information from database.
     *
     * @return $user
     */
    public function getUserInfo($id)
    {
        Log::info('getUserInfo');
        // $user = null
        // try {
        //     $user = ReportUser::where('loginname', $id)->firstOrFail();
        //     Log::info('getUser of '.$user);
        // } catch (Exception $e) {
        //     Log::error('An exception occured in getUser:'.$e);
        //     return response()->json([
        //         'result' => 'An exception occured in getUser',
        //         'exception' => $e,
        //     ], 200);
        // }
        $user = ReportUser::where('loginname', $id)->first();
        Log::info('getUser of '.$user);
        return $user;
    }

    /**
     * Handle an authentication attempt.
     *
     * @return Response
     */
    public function authenticate(Request $request)
    {
        if ($request) {
            $login = $request->input('id');
            $user = $this->getUserInfo($login);
            if ($user == null) {
                return response()->json([
                    'loginStatus' => 'out',
                    'loginID' => 'not found'
                ], 200);
            }
            // Authentication passed...
            // return redirect()->intended('/login');
            return response()->json([
                'loginStatus' => 'in',
                'loginID' => $login,
                'loginInfo' => $user
            ], 200);
        } else {
            // return redirect()->intended('/');
            return response()->json([
                'loginStatus' => 'out'
            ], 200);
        }
    }
}

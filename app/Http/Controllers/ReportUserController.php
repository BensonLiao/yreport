<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\ReportUser;

class ReportUserController extends Controller
{
    /**
     * SELECT report_name.class_id, report_name.rep_id, report_name.rep_no, 
	 * class_name, rep_name, year, category_name, y_data, unit, latest_date, description 
	 * FROM report_data 
	 * INNER JOIN category ON report_data.c_id = category.c_id AND category.rep_no = report_data.rep_no 
	 * INNER JOIN report_name ON report_name.rep_no = report_data.rep_no 
	 * INNER JOIN report_class ON report_class.class_id = report_name.class_id 
	 * WHERE report_class.class_id = 2
	 * ORDER BY class_id, rep_name, year, category_name, latest_date ASC
     */

    public function index()
    {
        // return response()->json([
        //     'message' => 'This is index'
        // ], 200);
        return ReportUser::all();
    }

    public function getUserInfo($id)
    {
        Log::info('getUserInfo');
        $user = ReportUser::where('loginname', $id)->firstOrFail();
        Log::info('getUser of '.$user);
        return response()->json([
            'user' => $user
        ], 200);
    }
}

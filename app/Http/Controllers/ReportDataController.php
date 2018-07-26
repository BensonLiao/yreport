<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\UpdateReport;
use App\ReportData;
use App\ReportMeta;
use App\ReportClass;
use App\ReportCategory;
use App\ReportUser;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Validator;
use \StdClass;

class ReportDataController extends Controller
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
        return ReportCategory::with('reportData')->get();
    }

    public function countOfData()
    {
        return ReportData::count();
    }

    public function countOfReport()
    {
        return ReportMeta::where('display', 'T')->count();
    }

    public function countOfUser()
    {
        return ReportUser::count();
    }

    public function getSummaryStats()
    {
        Log::info('getSummaryStats');
        $dataCount = ReportData::count();
        $reportCount = ReportMeta::where('display', 'T')->count();
        $userCount = ReportUser::count();
        return response()->json([
            'dataCount' => $dataCount,
            'reportCount' => $reportCount,
            'userCount' => $userCount
        ], 200);
    }

    public function getReportList()
    {
        Log::info('getReportList');
        // SELECT report_name.rep_no, report_name.class_id, class_name, report_name.rep_id, rep_name,
        // CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(report_name.rep_id, "-", 2), "-", -1) AS UNSIGNED INTEGER) AS rep_id_sub, 
        // CAST(SUBSTRING_INDEX(report_name.rep_id, "-", -1) AS UNSIGNED INTEGER) AS rep_id_sub2
        // FROM report_name 
        // INNER JOIN report_class ON report_class.class_id = report_name.class_id 
        // WHERE report_name.display = "T" 
        // ORDER BY class_id, rep_id_sub, rep_id_sub2
        // $selectQuery = "report_name.display, report_name.rep_no, report_name.class_id, report_name.rep_id, rep_name";
        $selectQuery = "report_name.rep_no, report_name.class_id, report_name.division_id, class_name, rep_name, CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(report_name.rep_id, '-', 2), '-', -1) AS UNSIGNED INTEGER) AS rep_id_sub, CAST(SUBSTRING_INDEX(report_name.rep_id, '-', -1) AS UNSIGNED INTEGER) AS rep_id_sub2";

        //Use Query Builder
        $reportList = DB::table('report_name')
            ->join('report_class', 'report_name.class_id', '=', 'report_class.class_id')
            ->select(DB::Raw($selectQuery))
            // ->select('report_name.rep_no', 'report_name.class_id', 'report_name.rep_id', 'class_name', 'rep_name')
            ->where('report_name.display', 'T')
            ->orderBy('report_name.class_id')
            ->orderBy('rep_id_sub')
            ->orderBy('rep_id_sub2')
            ->get();
        return $reportList;
    }

    public function getReport($rep_no)
    {
        Log::info('getReport of '.$rep_no);
        // SELECT report_name.class_id, report_name.rep_id, report_name.rep_no, 
        // class_name, rep_name, year, category_name, y_data, unit, latest_date, description 
        // FROM report_data 
        // INNER JOIN category ON report_data.c_id = category.c_id AND category.rep_no = report_data.rep_no 
        // INNER JOIN report_name ON report_name.rep_no = report_data.rep_no 
        // INNER JOIN report_class ON report_class.class_id = report_name.class_id 
        // WHERE report_name.display = 'T' AND report_name.rep_id = '08-3'
        // ORDER BY class_id, rep_name, year, category_name, latest_date ASC

        // return ReportMeta::with('ReportData', 'ReportCategory', 'ReportClass')->where('rep_no', $rep_no)->get();
        // return ReportMeta::with('ReportData', 'ReportClass')->where('rep_no', $rep_no)->get();
        // return ReportCategory::with('reportData')->where('rep_no', $rep_no)->get();
        // return ReportData::with('ReportCategory')->where('rep_no', $rep_no)->get();
        $selectQuery = "report_name.class_id, report_name.rep_id, report_name.rep_no, data_no, class_name, rep_name, year, category_name, CAST(y_data AS DECIMAL(24,6)) AS data, unit, latest_date, description, login_id";

        //Use Query Builder
        $report = DB::table('report_data')
            ->join('category', function ($join) {
                $join->on('report_data.c_id', '=', 'category.c_id');
                $join->on('report_data.rep_no', '=', 'category.rep_no');
            })
            ->join('report_name', 'report_data.rep_no', '=', 'report_name.rep_no')
            ->join('report_class', 'report_name.class_id', '=', 'report_class.class_id')
            ->select('report_name.class_id', 'report_name.rep_id', 'report_name.rep_no', 'data_no', 'category.c_id', 'year', 'category_name', 'y_data', 'unit', 'latest_date', 'description', 'login_id')
            // ->select(DB::Raw($selectQuery))
            ->where('report_name.display', 'T')
            ->where('report_name.rep_no', $rep_no)
            ->orderBy('year', 'desc')
            ->orderBy('category_name')
            ->get(); //get() will always return a collection even if only one record are found

        $modReport = array();
        foreach ($report as $data) {
            $dataArray = get_object_vars($data);
            $dataObj = new StdClass();
            foreach ($dataArray as $key => $value) {
                if ($key === 'y_data') {
                    $dataObj->$key = floatval($value);
                } else {
                    $dataObj->$key = $value;
                }
            }
            // $modData = gettype($data);
            array_push($modReport, $dataObj);
        }
        // return $modReport;
        $categories = ReportCategory::where('rep_no', $rep_no)->get();
        return response()->json([
            'data' => $modReport,
            'categories' => $categories
        ], 200);
    }

    public function updateReport(UpdateReport $request)
    {
        $loginID = $request->input('loginID');
        Log::info('updateReport by id:'.$loginID);
        if ($loginID == 'test') {
            return response()->json([
                'result' => 'An guest test exception occured in updateReport',
                'exception' => 'guest',
            ], 200);
        }
        // $rep_no = $request->input('reportNo');
        $reportToUpdate = json_decode($request->input('reportToUpdate'), true);
        $reportToDelete = json_decode($request->input('reportToDelete'), false);
        //Define any business logic validation rule here or in the custom FormRequest like UpdateReport class
        //Note. When using the validate method during an AJAX request, Laravel will not generate a redirect response. Instead, Laravel generates a JSON response containing all of the validation errors. This JSON response will be sent with a 422 HTTP status code.
        // Log::info('Apply custom validation rules to arrays');
        // $validator = Validator::make($reportToUpdate, [
        //     'year' => 'required|string',
        //     'c_id' => 'required|string',
        //     'y_data' => 'required|decimal',
        // ]);
        // if ($validator->fails()) {
        //     return response()->json([
        //         'result' => 'An exception occured in data validation phase',
        //         'exception' => $validator->errors(),
        //     ], 200);
        // }
        // $reportToUpdateType = gettype($reportToUpdate);
        // $test = is_array($reportToUpdate) ? 'Array' : 'not an Array';
        // $count = count($reportToUpdate);
        // $rowTypes = '';
        $deletedReport = array();
        DB::beginTransaction();
        try {
            foreach ($reportToDelete as $deleteData) {
                $dataNo = data_get($deleteData, 'data_no');
                $dataToDelete = ReportData::where('data_no', $dataNo)->sharedLock()->first();
                array_push($deletedReport, $dataToDelete);
                ReportData::where('data_no', $dataNo)->delete();
            }
            DB::commit();
        } catch (Exception $e) {
            //Cancel all operations if something wrong
            DB::rollBack();
            Log::error('An exception occured in delete query:'.$e);
            return response()->json([
                'result' => 'An exception occured in delete query',
                'exception' => $e,
            ], 200);
        }
        // date_default_timezone_set('Asia/Taipei');
        $timezone = date_default_timezone_get();
        $now = now()->toDateTimeString();
        $result = false;
        $updatedReport = array();
        DB::beginTransaction();
        try {
            foreach ($reportToUpdate as $updateData) {
                $dataNo = data_get($updateData, 'data_no');
                if ($dataNo > 0) { //Existing data
                    Log::info('updateReport on update query');
                    //Get a elequent model from table's record and lock it from being modified until transaction commits
                    $dataToUpdate = ReportData::where('data_no', $dataNo)->sharedLock()->first();
                    //Assign each field to updated value as $dataToUpdate
                    $reportNo = data_get($updateData, 'rep_no');
                    $dataToUpdate->rep_no = $reportNo;
                    $year = data_get($updateData, 'year');
                    $dataToUpdate->year = $year;
                    $categoryID = data_get($updateData, 'c_id');
                    $dataToUpdate->c_id = $categoryID;
                    $data = data_get($updateData, 'y_data');
                    $dataToUpdate->y_data = $data;
                    $dataToUpdate->latest_date = $now;
                    $existLoginID = data_get($updateData, 'login_id');
                    $dataToUpdate->login_id = empty($existLoginID) ? $loginID : $existLoginID;
                    //Write $dataToUpdate back to db
                    $result = $dataToUpdate->save();
                    array_push($updatedReport, $dataToUpdate);
                } else { //New data
                    Log::info('updateReport on insert query');
                    //Note. Laravel have 2 setter method array_set() & data_fill() but only array_set() return the modified array
                    $updateData = array_set($updateData, 'sort_weight', 1);
                    $updateData = array_set($updateData, 'latest_date', $now);
                    // $newReport = ReportData::create($updateData);
                    $newReport = DB::table('report_data')->insert($updateData);
                    array_push($updatedReport, $newReport);
                }
            }
            //Perform above bulk operations to db
            DB::commit();
        } catch (Exception $e) {
            //Cancel all operations if something wrong
            DB::rollBack();
            Log::error('An exception occured in bulk update query:'.$e);
            return response()->json([
                'result' => 'An exception occured in bulk update query',
                'exception' => $e,
            ], 200);
        }
        
        Log::info('updateReport result:'.$result);
        return response()->json([
            'timezone' => $timezone,
            'now' => $now,
            'result' => $result,
            'deletedReport' => $deletedReport,
            'updatedReport' => $updatedReport,
        ], 200);
    }
}

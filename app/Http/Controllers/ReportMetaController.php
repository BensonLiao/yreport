<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ReportMeta;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ReportMetaController extends Controller
{
    /**
     * UPDATE `category` SET `category_name` = '教育學院' WHERE `category`.`c_id` = '01' AND `category`.`rep_no` = 1;
     */

    public function index()
    {
        // return response()->json([
        //     'message' => 'This is index'
        // ], 200);
        return ReportMeta::all();
    }

    public function getReportMeta($rep_no)
    {
        Log::info('getReportMeta');
        $meta = ReportMeta::where('rep_no', $rep_no)->get();
        return response()->json([
            'meta' => $meta
        ], 200);
    }

    public function updateReportMeta(Request $request)
    {
        Log::info('updateReportMeta');
        $metaToUpdate = json_decode($request->input('metaToUpdate'));
        // Log::info(var_dump($metaToUpdate));
        // Log::info('reportNo = '.$metaToUpdate->reportNo);
        // $isArray = is_array($metaToUpdate) ? 'Array' : 'not an Array';
        // Log::info('isArray?'.$isArray);
        // date_default_timezone_set('Asia/Taipei');
        $timezone = date_default_timezone_get();
        $now = now()->toDateTimeString();
        $result = 0;
        DB::beginTransaction();
        try {
            $reportNo = $metaToUpdate->reportNo;
            $reportName = $metaToUpdate->reportName;
            $reportUnit = $metaToUpdate->reportUnit;
            $reportDesc = $metaToUpdate->reportDesc;
            if (ReportMeta::where('rep_no', $reportNo)->first() !== null) { 
                //Existing data
                Log::info('updateReportMeta on update query');
                //Get a elequent model from table's record and lock it from being modified until transaction commits
                $dataToUpdate = ReportMeta::where('rep_no', $reportNo)->sharedLock()->first();
                //Assign each field to updated value as $dataToUpdate
                $dataToUpdate->rep_name = $reportName;
                $dataToUpdate->unit = $reportUnit;
                $dataToUpdate->description = $reportDesc;
                //Write $dataToUpdate back to db
                $result = $dataToUpdate->save();
            }
            //Perform the above bulk operations to db
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
        
        Log::info('updateReportMeta result:'.$result);
        return response()->json([
            'timezone' => $timezone,
            'now' => $now,
            'result' => $result,
            'updatedReportMeta' => $metaToUpdate,
        ], 200);
    }
}

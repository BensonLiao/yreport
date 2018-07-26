<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\ReportCategory;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ReportCategoryController extends Controller
{
    /**
     * UPDATE `category` SET `category_name` = '教育學院' WHERE `category`.`c_id` = '01' AND `category`.`rep_no` = 1;
     */

    public function index()
    {
        // return response()->json([
        //     'message' => 'This is index'
        // ], 200);
        return ReportCategory::all();
    }

    public function getCategory($rep_no)
    {
        Log::info('getCategory');
        $categories = ReportCategory::where('rep_no', $rep_no)->get();
        return response()->json([
            'categories' => $categories
        ], 200);
    }

    public function getCategoryNotHidden($rep_no)
    {
        Log::info('getCategory');
        $categories = ReportCategory::where('rep_no', $rep_no)->where('display', 1)->get();
        return response()->json([
            'categories' => $categories
        ], 200);
    }

    public function updateCategory(Request $request)
    {
        Log::info('updateCategory');
        DB::connection()->enableQueryLog();
        // $rep_no = $request->input('reportNo');
        $categoryToUpdate = json_decode($request->input('categoryToUpdate'), true);
        $categoryToDelete = json_decode($request->input('categoryToDelete'), false);
        $deletedCategory = array();
        DB::beginTransaction();
        try {
            foreach ($categoryToDelete as $deleteData) {
                $reportNo = array_get($deleteData, 'rep_no');
                $categoryID = array_get($deleteData, 'c_id');
                if (ReportCategory::where('rep_no', $reportNo)->where('c_id', $categoryID)->first() !== null) {
                    $dataToDelete = ReportCategory::where('rep_no', $reportNo)->where('c_id', $categoryID)->sharedLock()->first();
                    ReportCategory::where('rep_no', $reportNo)->where('c_id', $categoryID)->delete();
                }
                array_push($deletedCategory, $dataToDelete);
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
        $result = 0;
        // $result = false;
        $updatedCategory = array();
        DB::beginTransaction();
        try {
            foreach ($categoryToUpdate as $updateData) {
                $reportNo = array_get($updateData, 'rep_no');
                $categoryID = array_get($updateData, 'c_id');
                $categoryName = array_get($updateData, 'category_name');
                // if (ReportCategory::where('rep_no', $reportNo)->where('c_id', $categoryID)->first() !== null) { 
                if (ReportCategory::where(['rep_no' => $reportNo, 'c_id' => $categoryID])->first() !== null) { 
                    //Existing data
                    Log::info('updateCategory on update query');
                    //Get a elequent model from table's record and lock it from being modified until transaction commits
                    // $dataToUpdate = ReportCategory::where('rep_no', $reportNo)->where('c_id', $categoryID)->sharedLock()->first();
                    // $dataToUpdate = ReportCategory::where('rep_no', $reportNo)->where('c_id', $categoryID)->first();
                    // $dataToUpdate = ReportCategory::where(['rep_no' => $reportNo, 'c_id' => $categoryID])->sharedLock()->first();
                    //Eloquent model will lock for only records on the first condition, need to find out what cause the problem
                    //Assign each field to updated value as $dataToUpdate
                    // $dataToUpdate->rep_no = $reportNo;
                    // $dataToUpdate->c_id = $categoryID;
                    // $dataToUpdate->category_name = $categoryName;
                    $dataToUpdate = ['category_name' => $categoryName];
                    //Write $dataToUpdate back to db
                    // $result = $dataToUpdate->save(); //Using Eloquent model, returning true or false
                    $result += DB::table('category')->where('rep_no', $reportNo)->where('c_id', $categoryID)->sharedLock()->update($dataToUpdate); //Using Raw query, returning affected rows
                    array_push($updatedCategory, $dataToUpdate);
                }  else { 
                    //New data
                    Log::info('updateCategory on insert query');
                    //Note. Laravel have 2 setter method array_set() & data_fill() but only array_set() return the modified array
                    $updateData = array_set($updateData, 'sort_weight', 1);
                    // $newReport = ReportCategory::create($updateData);
                    $newReport = DB::table('category')->insert($updateData);
                    $result += 1;
                    array_push($updatedCategory, $newReport);
                }
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
        Log::info('updateCategory affected records:'.$result);
        //Dump query for debugging
        // $queries = DB::getQueryLog();
        // var_dump($queries);
        
        // Log::info('updateCategory result:'.$result);
        return response()->json([
            'timezone' => $timezone,
            'now' => $now,
            'result' => $result,
            'deletedCategory' => $deletedCategory,
            'updatedCategory' => $updatedCategory,
        ], 200);
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class UpdateReport extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * If the authorize method returns false, a HTTP response with a 403 status code will automatically be returned and your controller method will not execute.
     * If you plan to have authorization logic in another part of your application, return  true from the authorize method
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     * When using the validate method during an AJAX request, Laravel will not generate a redirect response. Instead, Laravel generates a JSON response containing all of the validation errors. This JSON response will be sent with a 422 HTTP status code.
     * @return array
     */
    public function rules()
    {
        Log::info('Get the validation rules that apply to the request');
        // return [
        //     'reportToDelete' => 'required',
        //     'reportToUpdate' => 'required',
        //     'loginID' => 'required',
        // ];
        //Using asterisk too apply sub rules to array based field
        return [
            'reportToDelete' => 'required',
            'reportToUpdate' => 'required',
            'reportToUpdate.*.year' => 'required|string',
            'reportToUpdate.*.c_id' => 'required|string',
            'reportToUpdate.*.y_data' => 'required|decimal', //TODO: do further validate 6 digit precision
            'loginID' => 'required',
        ];
        // $rules = [
        //     'reportToDelete' => 'required',
        //     'reportToUpdate' => 'required',
        //     'loginID' => 'required',
        // ];
        // foreach($this->request->get('reportToUpdate') as $key => $val) {
        //     $rules['reportToUpdate.'.$key] = 'required';
        // }
        // return $rules;
    }
}

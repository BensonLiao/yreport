<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    /**
     * A controller handles file operation on the server public folder which based on config/filesystems.php
     */

    public function getFile()
    {
        $url = Storage::url('01-1/2012.pdf');
        $exist = Storage::disk('public')->exists('01-1/2012.pdf');
        return response()->json([
            'url' => $url,
            'exist' => $exist
        ], 200);
    }

    public function getFileList($folder)
    {
        $files = Storage::disk('public')->files($folder);
        $fileNames = '';
        foreach($files as $f)
        {
            $name = array_get(pathinfo($f), 'filename');
            $fileNames .= $name . ',';
        }
        $fileNames = str_replace_last(',', '', $fileNames);
        return response()->json([
            'files' => $fileNames
        ], 200);
    }

    public function getPublicFile($src)
    {
        $filename = 'temp.docx';
        $tempFile = tempnam(sys_get_temp_dir(), $filename);
        copy($src, $tempFile);
        return response()->download($tempFile, $filename);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TableauController extends Controller
{
    //Define http request method's action like GET, POST...
    public function update(Request $request, Product $product)
    {
        $product->update($request->all());
 
        return response()->json($product, 200);
    }
 
    // public function getTrustedTicket(String $server, String $username, String $site, String $remoteAddr)
    public function getTrustedTicket()
    {
        $server = 'stats.iro.ntnu.edu.tw';
        $username = 'NTNU_GUEST';
        $contentUrl = "views/_5/sheet8";
        // Request the trusted ticket ID by sending username & client_ip via POST fields to "/trusted"
        $params = compact('username');
        // if ($clientIp) {
        //     $params['client_ip'] = $clientIp;
        // }

        $ch = curl_init();
        curl_setopt_array($ch, array(
            CURLOPT_URL            => "https://{$server}/trusted",
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $params,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER     => array('Content-Type: application/x-www-form-urlencoded'),
        ));

        $ticket = (int) curl_exec($ch);
        curl_close($ch);
 
        return response()->json($ticket, 200);
    }
}

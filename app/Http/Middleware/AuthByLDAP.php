<?php

namespace App\Http\Middleware;

use Closure;

class AuthByLDAP
{
    function ldapAuth($host, $method, $path='/', $data='', $useragent=0)
    {
        $buf="";
        // Supply a default method of GET if the one passed was empty
        if (empty($method)) {
            $method = 'GET';
        }
        $method = strtoupper($method);
        $fp = fsockopen($host, 8080) or die("Unable to open socket"); //port:8080 by 網路組樹昌
    
        fputs($fp, "$method $path HTTP/1.1\r\n");
        fputs($fp, "Host: $host\r\n");
        fputs($fp, "Content-type: application/x-www-form- urlencoded\r\n");
        if ($method == 'POST') fputs($fp, "Content-length: " . strlen($data) . "\r\n");
        if ($useragent) fputs($fp, "User-Agent: MSIE\r\n");
        fputs($fp, "Connection: close\r\n\r\n");
        if ($method == 'POST') fputs($fp, $data);
    
        while (!feof($fp))
        $buf .= fgets($fp,128);
    
        fclose($fp);
        $buf=explode("\r\n",$buf);
        return $buf[7];
    }

    function imapAuth($host, $login, $password)
    {
        $mbox = imap_open($host, $login, $password);
        if ($mbox) {
            @imap_close($mbox);
            return 1;
        }
        return 0;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $login = $request->input('id');
        $password = $request->input('password');
        $status = 0;
        // $status = $this->ldapAuth("140.122.66.45","POST","/ldapAuth/main?account=$login&password=$password","");
        $status = $this->imapAuth("{pop3.ntnu.edu.tw:995/pop3/ssl/novalidate-cert}INBOX", $login, $password);
        if ($status != 1) {
            // return redirect('/yreport');
            return response()->json([
                'ldapAuth' => 'false'
            ], 200);
        }
        return $next($request);
    }
}

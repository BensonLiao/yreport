<!doctype html>
<html lang="{{ app()->getLocale() }}" style="width: 100%; background-color: #4E070B">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- <meta http-equiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' publicstatic.tableausoftware.com "> -->
        <!-- Add the following meta tag to prevent browser's "csrf token not found" warnning message -->
        <meta name="csrf-token" content="{{ csrf_token() }}"> 
        <title>NTNU FactBook, The Office of Institutional Research</title>
        <link href="{{mix('css/app.css')}}" rel="stylesheet" type="text/css">
        <link href='/css/odometer-theme-train-station.css' rel="stylesheet" type="text/css">
        <script src='/js/odometer.min.js' ></script>
        <!-- <link href="{{asset('css/odometer-theme-train-station.css')}}" rel="stylesheet" type="text/css">
        <script src="{{asset('js/odometer.min.js')}}" ></script> -->
        <style>
        h2 {
            position: relative;
            display: inline; 
            text-align: center; 
            background-color: #4E070B; 
            color: white; 
            height: 50px; 
            margin: 0px auto;
            font-size: 48px;
        }

        img {
            background-color: #4E070B;
            width: 220px;
            cursor: pointer;
        }

        .odometer {
            text-align: center;
            font-size: 60px;
            line-height: 1.4;
        }

        .odometer-unit {
            text-align: center;
            font-size: 60px;
            line-height: 1.4;
        }

        .responsive-embed {
            width: 100%;
            max-width: 600px;
            margin: 20px auto;
        }

        /* Mobile part */
        @media screen and (max-width: 768px) {
            h2 {
                display: block; 
                text-align: left; 
                background-color: #4E070B; 
                color: white; 
                height: 28px; 
                margin-bottom: 0px;
                font-size: 24px;
            }

            img {
                background-color: #4E070B;
                margin: 0px auto;
            }

            .odometer {
                text-align: center;
                font-size: 24px;
                line-height: 1.2;
            }

            .odometer-unit {
                text-align: center;
                font-size: 24px;
                line-height: 1.2;
            }
        }

        @media screen and (max-width: 400px) {
            h2 {
                display: block; 
                text-align: left; 
                background-color: #4E070B; 
                color: white; 
                height: 28px; 
                margin-bottom: 0px;
                font-size: 20px;
            }
        }
        </style>
    </head>
    <body>
    <div style="background-color: #4E070B;">
        <img src="img/logo.png" alt="NTNU" onClick="window.open('http://www.ntnu.edu.tw');">
        <h2> The Office of Institutional Research </h2>
    </div>
    <div id="main"></div>
    <script src="{{mix('js/app.js')}}" ></script>
    </body>
</html>
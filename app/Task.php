<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    //
    /**
     * 與模型關聯的資料表。
     * 請注意，我們並沒有告訴 Eloquent Flight 模型該使用哪一個資料表。
     * 除非明確地指定其他名稱，不然類別的小寫、底線、複數形式會拿來當作資料表的表單名稱。
     * 所以，這個案例中，Eloquent 將會假設 Flight 模型儲存記錄在 flights 資料表。
     * 你可以在模型上定義一個 table 屬性，用來指定自訂的資料表。
     *
     * @var string
     */
    protected $table = 'tasks';

    /**
     * 指定是否模型應該被戳記時間。
     * 預設情況下，Eloquent 預期你的資料表會有 created_at 和 updated_at 欄位。
     * 如果你不希望讓 Eloquent 來自動維護這兩個欄位，在你的模型內將 $timestamps 屬性設定為 false。
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * 模型的日期欄位的儲存格式。
     * 如果你需要客製化你的時間戳記格式，在你的模型內設定 $dateFormat 屬性。
     * 這個屬性決定日期如何在資料庫中儲存，以及當模型被序列化成陣列或是 JSON 時的格式。
     *
     * @var string
     */
    protected $dateFormat = 'U';

    /**
     * 此模型的連接名稱。
     * 預設情況下，所有的 Eloquent 模型會使用你應用程式中預設的資料庫連接設定。
     * 如果你想為模型指定不同的連接，可以使用 $connection 屬性。
     *
     * @var string
     */
    // protected $connection = 'tasks';
}

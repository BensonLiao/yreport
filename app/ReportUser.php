<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReportUser extends Model
{
    /**
     * Get the report_class record associated with the report_name.
     */
    // public function reportClass()
    // {
    //     return $this->belongsTo('App\ReportClass', 'class_id', 'class_id');
    // }

    /**
     * 與模型關聯的資料表。
     * 請注意，我們並沒有告訴 Eloquent Flight 模型該使用哪一個資料表。
     * 除非明確地指定其他名稱，不然類別的小寫、底線、複數形式會拿來當作資料表的表單名稱。
     * 所以，這個案例中，Eloquent 將會假設 Flight 模型儲存記錄在 flights 資料表。
     * 你可以在模型上定義一個 table 屬性，用來指定自訂的資料表。
     *
     * @var string
     */
    protected $table = 'division_user';

    /**
     * 指定primary key。
     * 預設情況下，Eloquent 預期你的資料表會有一個 id 欄位是作為資料表的primary key。
     * 你可以在你的模型內將 $primaryKey 屬性設定為你想要的欄位名稱來取代。
     * 除此之外，預設會將primary key視為自動增加的int，若想修改為手動增加，
     * 必須在後面增加 public 的 $incrementing 屬性並設定為 false，
     * 若想修改為其他資料型態如字串，必須在後面增加 protected 的 $keyType 屬性並設定為 string
     *
     * @var int
     */
    protected $primaryKey = 'uid';

    /**
     * 指定是否模型應該被戳記時間。
     * 預設情況下，Eloquent 預期你的資料表會有 created_at 和 updated_at 欄位。
     * 如果你不希望讓 Eloquent 來自動維護這兩個欄位，在你的模型內將 $timestamps 屬性設定為 false。
     *
     * @var bool
     */
    public $timestamps = false;
}

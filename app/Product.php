<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    // Add the fillable property into the product model
    protected $fillable = ['title', 'description', 'price', 'available'];
}

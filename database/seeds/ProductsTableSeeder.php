<?php

use Illuminate\Database\Seeder;
use App\Product;

class ProductsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = \Faker\Factory::create();
        //create 50 product records
        for ($i = 0; $i <= 50; $i++) {
            Product::create([
               'title' => $faker->title,
               'description' => $faker->paragraph,
               'price' => $faker->randomNumber(2),
               'available' => $faker->boolean(50)
            ]);
        } 
    }
}

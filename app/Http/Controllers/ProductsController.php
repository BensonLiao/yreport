<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Product;

class ProductsController extends Controller
{
    //Define http request method's action like GET, POST...
    public function index()
    {
        return Product::all();
    }
 
    public function show(Product $product)
    {
        return $product;
    }

    public function find_price(int $price)
    {
        return Product::where('price', $price)->get();
    }
 
    public function store(Request $request)
    {
        //Define any business logic validation rule here
        $this->validate($request, [
            'title' => 'required|unique:products|max:255',
            'description' => 'required',
            'price' => 'integer',
            'availability' => 'boolean',
        ]);
        
        $product = Product::create($request->all());
 
        // return response()->json($product, 201);
        return $product;
    }
 
    public function update(Request $request, Product $product)
    {
        $product->update($request->all());
 
        return response()->json($product, 200);
    }
 
    public function delete(Product $product)
    {
        $product->delete();
 
        return response()->json(null, 204);
    }
}

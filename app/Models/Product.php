<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $primaryKey = 'product_id';
    protected $fillable = ['product_name', 'category_id', 'suplier_id', 'stock_qty', 'price', 'low_stock_threshold'];

    protected $casts = [
        'price' => 'decimal:2',
    ];
    
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'suplier_id', 'suplier_id');
    }
}

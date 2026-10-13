<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $primaryKey = 'suplier_id';
    protected $fillable = ['suplier_name'];

    public function products()
    {
        return $this->hasMany(Product::class, 'suplier_id', 'suplier_id');
    }
}

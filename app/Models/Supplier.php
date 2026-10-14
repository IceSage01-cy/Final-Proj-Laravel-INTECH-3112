<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $primaryKey = 'supplier_id';
    protected $fillable = ['supplier_name'];

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'supplier_id', 'supplier_id');
    }
}

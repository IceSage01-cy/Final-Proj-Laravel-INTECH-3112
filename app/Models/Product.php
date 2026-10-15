<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    protected $primaryKey = 'product_id';
    protected $fillable = ['product_name', 'category_id', 'supplier_id', 'stock_qty', 'price', 'low_stock_threshold'];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'category_id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id', 'supplier_id');
    }

    /** Stock at or below the product's own threshold (includes out of stock). */
    public function scopeNeedsRestock(Builder $query): Builder
    {
        return $query->whereColumn('stock_qty', '<=', 'low_stock_threshold');
    }

    /** Still in stock, but at or below the threshold. */
    public function scopeLowStock(Builder $query): Builder
    {
        return $query->where('stock_qty', '>', 0)->needsRestock();
    }

    public function scopeOutOfStock(Builder $query): Builder
    {
        return $query->where('stock_qty', 0);
    }
}

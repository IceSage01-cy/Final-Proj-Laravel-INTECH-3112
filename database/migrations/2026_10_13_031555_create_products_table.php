<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('product_name', 255);
            $table->foreignID('category_id')->constrained('categories', 'category_id')->cascadeOnDelete();
            $table->foreignID('suplier_id')->constrained('suppliers', 'suplier_id')->cascadeOnDelete();
            $table->integer('stock_qty')->default(0);
            $table->decimal('price', 10, 2)->default(0);
            $table->integer('low_stock_threshold')->default(10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

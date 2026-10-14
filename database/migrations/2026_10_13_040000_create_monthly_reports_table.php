<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monthly_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->references('user_id')->on('users')->cascadeOnDelete();
            $table->unsignedSmallInteger('report_year');
            $table->unsignedTinyInteger('report_month');
            $table->text('accomplishments');
            $table->decimal('hours_worked', 6, 2)->default(0);
            $table->text('notes')->nullable();
            $table->enum('status', ['draft', 'submitted', 'reviewed'])->default('draft');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->unique(['user_id', 'report_year', 'report_month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monthly_reports');
    }
};

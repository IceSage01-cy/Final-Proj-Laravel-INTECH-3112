<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MonthlyReport extends Model
{
    protected $fillable = [
        'user_id',
        'report_year',
        'report_month',
        'accomplishments',
        'hours_worked',
        'notes',
        'status',
        'reviewed_at',
    ];

    protected function casts(): array
    {
        return [
            'hours_worked' => 'decimal:2',
            'reviewed_at' => 'datetime',
        ];
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }
}

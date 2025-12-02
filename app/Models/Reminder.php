<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Reminder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'medication_id',
        'time',
        'frequency',
        'enabled',
        'days_of_week',
    ];

    protected $casts = [
        'enabled' => 'boolean',
        'time' => 'datetime',
        'days_of_week' => 'array',
    ];

    /**
     * Accessor to format time as H:i
     */
    public function getFormattedTimeAttribute()
    {
        return $this->time ? $this->time->format('H:i') : null;
    }

    /**
     * Get the user that owns the reminder.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the medication for the reminder.
     */
    public function medication(): BelongsTo
    {
        return $this->belongsTo(Medication::class);
    }

    /**
     * Get the intakes for the reminder.
     */
    public function intakes(): HasMany
    {
        return $this->hasMany(MedicationIntake::class);
    }
}


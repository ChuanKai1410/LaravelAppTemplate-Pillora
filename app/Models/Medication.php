<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Medication extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'dosage',
        'schedule',
        'stock',
        'notes',
        'barcode',
        'side_effects',
        'warnings',
        'interactions',
        'needs_refill',
    ];

    protected $casts = [
        'needs_refill' => 'boolean',
        'stock' => 'integer',
    ];

    /**
     * Get the user that owns the medication.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the reminders for the medication.
     */
    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }

    /**
     * Get the intakes for the medication.
     */
    public function intakes(): HasMany
    {
        return $this->hasMany(MedicationIntake::class);
    }
}


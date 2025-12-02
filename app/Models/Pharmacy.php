<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pharmacy extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'phone',
        'email',
        'latitude',
        'longitude',
        'is_open',
        'opening_time',
        'closing_time',
    ];

    protected $casts = [
        'is_open' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'opening_time' => 'datetime',
        'closing_time' => 'datetime',
    ];

    /**
     * Get the orders for the pharmacy.
     */
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }
}


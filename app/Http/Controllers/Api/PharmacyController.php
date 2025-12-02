<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pharmacy;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PharmacyController extends Controller
{
    /**
     * Display a listing of pharmacies.
     */
    public function index(Request $request): JsonResponse
    {
        // In a real app, you would use the user's location to find nearby pharmacies
        $pharmacies = Pharmacy::all()->map(function ($pharmacy) {
            return [
                'id' => $pharmacy->id,
                'name' => $pharmacy->name,
                'address' => $pharmacy->address,
                'phone' => $pharmacy->phone,
                'open' => $pharmacy->is_open,
                'distance' => '0.5 km', // Mock distance
            ];
        });

        return response()->json($pharmacies);
    }
}


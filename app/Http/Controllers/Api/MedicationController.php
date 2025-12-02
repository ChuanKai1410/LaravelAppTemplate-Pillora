<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medication;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class MedicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $medications = $request->user()->medications()->get();
        
        return response()->json($medications);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'schedule' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
            'barcode' => 'nullable|string',
            'side_effects' => 'nullable|string',
            'warnings' => 'nullable|string',
            'interactions' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $medication = $request->user()->medications()->create($validator->validated());

        return response()->json($medication, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Medication $medication): JsonResponse
    {
        if ($medication->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($medication);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Medication $medication): JsonResponse
    {
        if ($medication->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'dosage' => 'nullable|string|max:255',
            'schedule' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
            'barcode' => 'nullable|string',
            'side_effects' => 'nullable|string',
            'warnings' => 'nullable|string',
            'interactions' => 'nullable|string',
            'needs_refill' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $medication->update($validator->validated());

        return response()->json($medication);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Medication $medication): JsonResponse
    {
        if ($medication->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $medication->delete();

        return response()->json(['message' => 'Medication deleted successfully']);
    }

    /**
     * Scan medication by barcode.
     */
    public function scan(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'barcode' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // In a real application, you would query a medication database API
        // For now, we'll return a mock response
        $barcode = $request->input('barcode');
        
        // Check if medication already exists
        $existing = Medication::where('barcode', $barcode)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return response()->json($existing);
        }

        // Mock medication data - in production, query external API
        $medicationData = [
            'name' => 'Sample Medication',
            'dosage' => '500mg',
            'barcode' => $barcode,
        ];

        return response()->json($medicationData);
    }
}


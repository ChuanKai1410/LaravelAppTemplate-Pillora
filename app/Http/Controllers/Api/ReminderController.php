<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reminder;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ReminderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $reminders = $request->user()->reminders()
            ->with('medication')
            ->get()
            ->map(function ($reminder) {
                return [
                    'id' => $reminder->id,
                    'medicationId' => $reminder->medication_id,
                    'medicationName' => $reminder->medication->name ?? 'General Reminder',
                    'time' => $reminder->time->format('H:i'),
                    'frequency' => $reminder->frequency,
                    'enabled' => $reminder->enabled,
                    'daysOfWeek' => $reminder->days_of_week,
                ];
            });

        $globalEnabled = $request->user()->reminders()->where('enabled', true)->exists();

        return response()->json([
            'reminders' => $reminders,
            'globalEnabled' => $globalEnabled,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reminder $reminder): JsonResponse
    {
        if ($reminder->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'medication_id' => 'sometimes|nullable|exists:medications,id',
            'enabled' => 'sometimes|boolean',
            'time' => 'sometimes|date_format:H:i',
            'frequency' => 'sometimes|string|in:daily,twice_daily,weekly',
            'days_of_week' => 'sometimes|nullable|array',
            'days_of_week.*' => 'integer|min:0|max:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        
        // Ensure medication belongs to user if provided
        if (isset($data['medication_id'])) {
            $medication = \App\Models\Medication::find($data['medication_id']);
            if (!$medication || $medication->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized medication'], 403);
            }
        }

        $reminder->update($data);
        $reminder->load('medication');

        return response()->json([
            'id' => $reminder->id,
            'medicationId' => $reminder->medication_id,
            'medicationName' => $reminder->medication->name ?? 'General Reminder',
            'time' => $reminder->time->format('H:i'),
            'frequency' => $reminder->frequency,
            'enabled' => $reminder->enabled,
            'daysOfWeek' => $reminder->days_of_week,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'medication_id' => 'nullable|exists:medications,id',
            'time' => 'required|date_format:H:i',
            'frequency' => 'required|string|in:daily,twice_daily,weekly',
            'enabled' => 'sometimes|boolean',
            'days_of_week' => 'nullable|array',
            'days_of_week.*' => 'integer|min:0|max:6', // 0 = Sunday, 6 = Saturday
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        
        // Ensure medication belongs to user if provided
        if (isset($data['medication_id'])) {
            $medication = \App\Models\Medication::find($data['medication_id']);
            if (!$medication || $medication->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Unauthorized medication'], 403);
            }
        }

        $data['user_id'] = $request->user()->id;
        $reminder = Reminder::create($data);

        $reminder->load('medication');

        return response()->json([
            'id' => $reminder->id,
            'medicationName' => $reminder->medication->name ?? 'General Reminder',
            'medicationId' => $reminder->medication_id,
            'time' => $reminder->time->format('H:i'),
            'frequency' => $reminder->frequency,
            'enabled' => $reminder->enabled,
            'daysOfWeek' => $reminder->days_of_week,
        ], 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Reminder $reminder): JsonResponse
    {
        if ($reminder->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $reminder->delete();

        return response()->json(['message' => 'Reminder deleted successfully']);
    }

    /**
     * Update reminder settings.
     */
    public function updateSettings(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'globalEnabled' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $request->user()->reminders()->update([
            'enabled' => $request->input('globalEnabled'),
        ]);

        return response()->json(['message' => 'Settings updated successfully']);
    }
}


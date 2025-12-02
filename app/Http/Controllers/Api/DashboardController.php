<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicationIntake;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard data for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Get upcoming doses (next 24 hours)
        $upcomingDoses = $user->intakes()
            ->where('scheduled_at', '>=', now())
            ->where('scheduled_at', '<=', now()->addDay())
            ->where('status', 'pending')
            ->with('medication')
            ->orderBy('scheduled_at')
            ->get()
            ->map(function ($intake) {
                return [
                    'medicationName' => $intake->medication->name ?? 'Unknown',
                    'time' => $intake->scheduled_at->format('H:i'),
                    'dosage' => $intake->medication->dosage ?? 'N/A',
                ];
            });

        // Get alerts (low stock, missed doses, etc.)
        $alerts = [];
        
        // Check for medications needing refill
        $lowStock = $user->medications()
            ->where('stock', '<=', 5)
            ->where('stock', '>', 0)
            ->get();
            
        foreach ($lowStock as $med) {
            $alerts[] = [
                'type' => 'warning',
                'message' => "{$med->name} is running low ({$med->stock} remaining)",
            ];
        }

        // Check for missed doses today
        $missedToday = $user->intakes()
            ->whereDate('scheduled_at', today())
            ->where('status', 'missed')
            ->count();
            
        if ($missedToday > 0) {
            $alerts[] = [
                'type' => 'warning',
                'message' => "You have {$missedToday} missed dose(s) today",
            ];
        }

        // Calculate adherence rate (last 30 days)
        $thirtyDaysAgo = now()->subDays(30);
        $totalDoses = $user->intakes()
            ->where('scheduled_at', '>=', $thirtyDaysAgo)
            ->count();
            
        $takenDoses = $user->intakes()
            ->where('scheduled_at', '>=', $thirtyDaysAgo)
            ->where('status', 'taken')
            ->count();
            
        $missedDoses = $user->intakes()
            ->where('scheduled_at', '>=', $thirtyDaysAgo)
            ->where('status', 'missed')
            ->count();

        $adherenceRate = $totalDoses > 0 ? round(($takenDoses / $totalDoses) * 100) : 0;

        return response()->json([
            'upcomingDoses' => $upcomingDoses,
            'alerts' => $alerts,
            'adherenceRate' => $adherenceRate,
            'takenDoses' => $takenDoses,
            'missedDoses' => $missedDoses,
        ]);
    }
}


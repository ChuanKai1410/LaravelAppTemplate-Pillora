<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Get analytics data for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $thirtyDaysAgo = now()->subDays(30);

        // Overall statistics
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

        // Weekly data (last 7 days)
        $weeklyData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayStart = $date->copy()->startOfDay();
            $dayEnd = $date->copy()->endOfDay();
            
            $dayTotal = $user->intakes()
                ->whereBetween('scheduled_at', [$dayStart, $dayEnd])
                ->count();
                
            $dayTaken = $user->intakes()
                ->whereBetween('scheduled_at', [$dayStart, $dayEnd])
                ->where('status', 'taken')
                ->count();
                
            $dayAdherence = $dayTotal > 0 ? round(($dayTaken / $dayTotal) * 100) : 0;
            
            $weeklyData[] = [
                'day' => $date->format('D'),
                'adherence' => $dayAdherence,
            ];
        }

        // Medication breakdown
        $medicationBreakdown = $user->medications()
            ->withCount(['intakes as total_intakes' => function ($query) use ($thirtyDaysAgo) {
                $query->where('scheduled_at', '>=', $thirtyDaysAgo);
            }])
            ->withCount(['intakes as taken_intakes' => function ($query) use ($thirtyDaysAgo) {
                $query->where('scheduled_at', '>=', $thirtyDaysAgo)
                      ->where('status', 'taken');
            }])
            ->get()
            ->map(function ($medication) {
                $adherence = $medication->total_intakes > 0 
                    ? round(($medication->taken_intakes / $medication->total_intakes) * 100) 
                    : 0;
                    
                return [
                    'name' => $medication->name,
                    'adherence' => $adherence,
                ];
            });

        return response()->json([
            'adherenceRate' => $adherenceRate,
            'totalDoses' => $totalDoses,
            'takenDoses' => $takenDoses,
            'missedDoses' => $missedDoses,
            'weeklyData' => $weeklyData,
            'medicationBreakdown' => $medicationBreakdown,
        ]);
    }
}


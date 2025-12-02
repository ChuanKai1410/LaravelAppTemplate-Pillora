<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $orders = $request->user()->orders()
            ->with(['pharmacy', 'items.medication'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'pharmacy_id' => 'required|exists:pharmacies,id',
            'medication_ids' => 'required|array',
            'medication_ids.*' => 'exists:medications,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            // Calculate total (mock pricing)
            $medications = $request->user()->medications()
                ->whereIn('id', $request->input('medication_ids'))
                ->get();
                
            $total = $medications->sum(function ($med) {
                return 50.00; // Mock price per medication
            });

            $order = $request->user()->orders()->create([
                'pharmacy_id' => $request->input('pharmacy_id'),
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($medications as $medication) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'medication_id' => $medication->id,
                    'quantity' => 1,
                    'price' => 50.00, // Mock price
                ]);
            }

            DB::commit();

            return response()->json($order->load(['pharmacy', 'items.medication']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create order'], 500);
        }
    }
}


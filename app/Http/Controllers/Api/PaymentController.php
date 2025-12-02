<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Process payment for an order.
     */
    public function process(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:orders,id',
            'payment_method' => 'required|in:card,paypal,apple_pay',
            'card_data' => 'required_if:payment_method,card|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $order = Order::findOrFail($request->input('order_id'));

        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        DB::beginTransaction();
        try {
            // In a real app, you would process payment through a payment gateway
            $payment = Payment::create([
                'order_id' => $order->id,
                'method' => $request->input('payment_method'),
                'amount' => $order->total,
                'status' => 'completed', // In real app, this would come from payment gateway
                'transaction_id' => 'TXN' . time(),
                'payment_details' => $request->input('card_data'),
            ]);

            $order->update(['status' => 'processing']);

            DB::commit();

            return response()->json([
                'message' => 'Payment processed successfully',
                'payment' => $payment,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Payment processing failed'], 500);
        }
    }
}


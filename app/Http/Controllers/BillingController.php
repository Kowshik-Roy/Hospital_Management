<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Billing;

class BillingController extends Controller
{
    /**
     * Get billing invoices for a patient.
     */
    public function getByPatient($patientId)
    {
        $billings = Billing::where('patient_id', $patientId)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($billings);
    }

    /**
     * Pay a bill.
     */
    public function pay(Request $request, $billId)
    {
        $bill = Billing::where('bill_id', $billId)
            ->orWhere('id', $billId)
            ->first();

        if (!$bill) {
            return response()->json(['error' => 'Bill not found'], 404);
        }

        $paymentMethod = $request->input('paymentMethod') ?: 'bKash Online';
        $transactionId = $request->input('transactionId') ?: ('TXN-' . strtoupper(substr(uniqid(), -8)));

        $bill->update([
            'payment_status' => 'Paid',
            'payment_method' => $paymentMethod,
            'transaction_id' => $transactionId,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment processed successfully!',
            'bill' => $bill,
        ]);
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Billing extends Model
{
    use HasFactory;

    protected $table = 'billings';

    protected $fillable = [
        'bill_id',
        'invoice_number',
        'patient_id',
        'doctor_consultation_fee',
        'test_fee',
        'medicine_cost',
        'amount',
        'payment_status',
        'payment_method',
        'transaction_id',
        'date',
    ];

    protected $casts = [
        'doctor_consultation_fee' => 'float',
        'test_fee' => 'float',
        'medicine_cost' => 'float',
        'amount' => 'float',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }
}


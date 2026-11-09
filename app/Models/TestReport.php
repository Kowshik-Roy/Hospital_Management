<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TestReport extends Model
{
    use HasFactory;

    protected $table = 'test_reports';

    protected $fillable = [
        'report_id',
        'patient_id',
        'test_name',
        'doctor_recommendation',
        'test_date',
        'status',
        'result_summary',
        'file_name',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }
}


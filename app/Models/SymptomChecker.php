<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SymptomChecker extends Model
{
    use HasFactory;

    protected $table = 'symptom_checkers';

    protected $fillable = [
        'checker_id',
        'patient_id',
        'symptoms',
        'duration',
        'severity',
        'existing_diseases',
        'allergies',
        'analysis_result',
        'recommended_department',
        'urgency_level',
        'created_date',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id', 'patient_id');
    }
}


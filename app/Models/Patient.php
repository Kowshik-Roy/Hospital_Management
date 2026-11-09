<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Patient extends Authenticatable
{
    use HasApiTokens, HasFactory;

    protected $table = 'patients';

    protected $fillable = [
        'patient_id',
        'name',
        'email',
        'password',
        'phone',
        'dob',
        'gender',
        'blood_group',
        'address',
        'avatar_url',
    ];

    protected $hidden = [
        'password',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id', 'patient_id');
    }

    public function medicalRecords()
    {
        return $this->hasMany(MedicalRecord::class, 'patient_id', 'patient_id');
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class, 'patient_id', 'patient_id');
    }

    public function billings()
    {
        return $this->hasMany(Billing::class, 'patient_id', 'patient_id');
    }

    public function testReports()
    {
        return $this->hasMany(TestReport::class, 'patient_id', 'patient_id');
    }

    public function symptomChecks()
    {
        return $this->hasMany(SymptomChecker::class, 'patient_id', 'patient_id');
    }
}


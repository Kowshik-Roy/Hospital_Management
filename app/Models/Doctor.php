<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Doctor extends Model
{
    use HasFactory;

    protected $table = 'doctors';

    protected $fillable = [
        'doctor_id',
        'name',
        'specialization',
        'experience_years',
        'available_time',
        'consultation_fee',
        'room_no',
        'avatar_url',
        'phone',
        'email',
        'rating',
    ];

    protected $casts = [
        'consultation_fee' => 'float',
        'experience_years' => 'integer',
        'rating' => 'float',
    ];

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'doctor_id', 'doctor_id');
    }

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class, 'doctor_id', 'doctor_id');
    }
}


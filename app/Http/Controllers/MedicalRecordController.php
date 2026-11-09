<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MedicalRecord;

class MedicalRecordController extends Controller
{
    /**
     * Get medical history for a patient.
     */
    public function getByPatient($patientId)
    {
        $records = MedicalRecord::where('patient_id', $patientId)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($records);
    }
}


<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Prescription;

class PrescriptionController extends Controller
{
    /**
     * Get prescriptions for a patient.
     */
    public function getByPatient($patientId)
    {
        $prescriptions = Prescription::where('patient_id', $patientId)
            ->orderBy('prescription_date', 'desc')
            ->get();

        return response()->json($prescriptions);
    }
}


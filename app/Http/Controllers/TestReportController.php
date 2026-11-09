<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\TestReport;

class TestReportController extends Controller
{
    /**
     * Get diagnostic & laboratory reports for a patient.
     */
    public function getByPatient($patientId)
    {
        $reports = TestReport::where('patient_id', $patientId)
            ->orderBy('test_date', 'desc')
            ->get();

        return response()->json($reports);
    }
}


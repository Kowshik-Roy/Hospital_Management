<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Doctor;

class DoctorController extends Controller
{
    /**
     * List all doctors.
     */
    public function index()
    {
        $doctors = Doctor::orderBy('name', 'asc')->get();
        return response()->json($doctors);
    }

    /**
     * Get a specific doctor.
     */
    public function show($id)
    {
        $doctor = Doctor::where('doctor_id', $id)->first();
        if (!$doctor) {
            return response()->json(['error' => 'Doctor not found'], 404);
        }
        return response()->json($doctor);
    }
}


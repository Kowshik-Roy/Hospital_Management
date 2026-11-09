<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Appointment;
use App\Models\Doctor;

class AppointmentController extends Controller
{
    /**
     * Get appointments for a specific patient.
     */
    public function getByPatient($patientId)
    {
        $appointments = Appointment::where('patient_id', $patientId)
            ->orderBy('appointment_date', 'desc')
            ->get();

        return response()->json($appointments);
    }

    /**
     * Book a new appointment.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|string',
            'doctor_id' => 'required|string',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required|string',
            'symptoms' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => $validator->errors()->first(),
            ], 422);
        }

        $doctor = Doctor::where('doctor_id', $request->input('doctor_id'))->first();

        $count = Appointment::count();
        $appointmentId = 'APT-2026-' . str_pad($count + 1, 3, '0', STR_PAD_LEFT);

        $appointment = Appointment::create([
            'appointment_id' => $appointmentId,
            'patient_id' => $request->input('patient_id'),
            'doctor_id' => $request->input('doctor_id'),
            'doctor_name' => $doctor ? $doctor->name : ($request->input('doctor_name') ?: 'Specialist Doctor'),
            'specialization' => $doctor ? $doctor->specialization : ($request->input('specialization') ?: 'General Medicine'),
            'appointment_date' => $request->input('appointment_date'),
            'appointment_time' => $request->input('appointment_time'),
            'status' => 'Confirmed',
            'symptoms' => $request->input('symptoms') ?: 'General Consultation',
            'consultation_fee' => $doctor ? $doctor->consultation_fee : ($request->input('consultation_fee') ?: 800.00),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Appointment booked successfully!',
            'appointment' => $appointment,
        ], 201);
    }

    /**
     * Cancel an appointment.
     */
    public function cancel($id)
    {
        $appointment = Appointment::where('appointment_id', $id)
            ->orWhere('id', $id)
            ->first();

        if (!$appointment) {
            return response()->json(['error' => 'Appointment not found'], 404);
        }

        $appointment->update(['status' => 'Cancelled']);

        return response()->json([
            'success' => true,
            'message' => 'Appointment cancelled successfully',
            'appointment' => $appointment,
        ]);
    }
}


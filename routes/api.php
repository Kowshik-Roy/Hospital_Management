<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PatientAuthController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\TestReportController;
use App\Http\Controllers\AiAssistantController;

// 1. AI Healthcare Assistant Endpoints
Route::prefix('ai')->group(function () {
    Route::post('/chat', [AiAssistantController::class, 'chat']);
    Route::post('/symptom-triage', [AiAssistantController::class, 'symptomTriage']);
});

// 2. Patient Module APIs
Route::prefix('patient')->group(function () {
    // Auth & Profile
    Route::post('/register', [PatientAuthController::class, 'register']);
    Route::post('/login', [PatientAuthController::class, 'login']);
    Route::get('/profile/{id}', [PatientAuthController::class, 'getProfile']);
    Route::put('/profile/{id}', [PatientAuthController::class, 'updateProfile']);
    Route::put('/change-password/{id}', [PatientAuthController::class, 'changePassword']);

    // Doctors
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::get('/doctors/{id}', [DoctorController::class, 'show']);

    // Appointments
    Route::get('/appointments/{patientId}', [AppointmentController::class, 'getByPatient']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::put('/appointments/{id}/cancel', [AppointmentController::class, 'cancel']);

    // Clinical & Diagnostic Records
    Route::get('/medical-history/{patientId}', [MedicalRecordController::class, 'getByPatient']);
    Route::get('/prescriptions/{patientId}', [PrescriptionController::class, 'getByPatient']);
    Route::get('/test-reports/{patientId}', [TestReportController::class, 'getByPatient']);

    // Invoices & Billing
    Route::get('/billing/{patientId}', [BillingController::class, 'getByPatient']);
    Route::post('/billing/{billId}/pay', [BillingController::class, 'pay']);
});

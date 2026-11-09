<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Patients Table
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('patient_id', 50)->unique();
            $table->string('name', 150);
            $table->string('email', 150)->unique();
            $table->string('password', 255);
            $table->string('phone', 30);
            $table->date('dob');
            $table->enum('gender', ['Male', 'Female', 'Other']);
            $table->enum('blood_group', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);
            $table->text('address');
            $table->text('avatar_url')->nullable();
            $table->timestamps();

            $table->index('email');
            $table->index('phone');
        });

        // 2. Doctors Table
        Schema::create('doctors', function (Blueprint $table) {
            $table->id();
            $table->string('doctor_id', 50)->unique();
            $table->string('name', 150);
            $table->string('specialization', 100);
            $table->integer('experience_years')->default(1);
            $table->string('available_time', 100);
            $table->decimal('consultation_fee', 10, 2)->default(500.00);
            $table->string('room_no', 50)->default('Room 101');
            $table->text('avatar_url')->nullable();
            $table->string('phone', 30)->nullable();
            $table->string('email', 150)->nullable();
            $table->decimal('rating', 3, 1)->default(4.8);
            $table->timestamps();

            $table->index('specialization');
        });

        // 3. Appointments Table
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->string('appointment_id', 50)->unique();
            $table->string('patient_id', 50);
            $table->string('doctor_id', 50);
            $table->string('doctor_name', 150)->nullable();
            $table->string('specialization', 100)->nullable();
            $table->date('appointment_date');
            $table->string('appointment_time', 50);
            $table->enum('status', ['Pending', 'Confirmed', 'Completed', 'Cancelled'])->default('Pending');
            $table->text('symptoms')->nullable();
            $table->decimal('consultation_fee', 10, 2)->default(0.00);
            $table->timestamps();

            $table->foreign('patient_id')->references('patient_id')->on('patients')->onDelete('cascade');
            $table->foreign('doctor_id')->references('doctor_id')->on('doctors')->onDelete('cascade');
            $table->index('appointment_date');
            $table->index('status');
        });

        // 4. Medical Records Table
        Schema::create('medical_records', function (Blueprint $table) {
            $table->id();
            $table->string('record_id', 50)->unique();
            $table->string('patient_id', 50);
            $table->string('doctor_id', 50);
            $table->string('doctor_name', 150)->nullable();
            $table->text('diagnosis');
            $table->text('treatment');
            $table->text('doctor_notes')->nullable();
            $table->date('date');
            $table->timestamps();

            $table->foreign('patient_id')->references('patient_id')->on('patients')->onDelete('cascade');
            $table->foreign('doctor_id')->references('doctor_id')->on('doctors')->onDelete('cascade');
        });

        // 5. Prescriptions Table
        Schema::create('prescriptions', function (Blueprint $table) {
            $table->id();
            $table->string('prescription_id', 50)->unique();
            $table->string('patient_id', 50);
            $table->string('doctor_id', 50);
            $table->string('doctor_name', 150)->nullable();
            $table->string('medicine', 200);
            $table->string('dosage', 100);
            $table->string('duration', 100);
            $table->text('instructions');
            $table->date('prescription_date');
            $table->timestamps();

            $table->foreign('patient_id')->references('patient_id')->on('patients')->onDelete('cascade');
            $table->foreign('doctor_id')->references('doctor_id')->on('doctors')->onDelete('cascade');
        });

        // 6. Billings Table
        Schema::create('billings', function (Blueprint $table) {
            $table->id();
            $table->string('bill_id', 50)->unique();
            $table->string('invoice_number', 50)->unique();
            $table->string('patient_id', 50);
            $table->decimal('doctor_consultation_fee', 10, 2)->default(0.00);
            $table->decimal('test_fee', 10, 2)->default(0.00);
            $table->decimal('medicine_cost', 10, 2)->default(0.00);
            $table->decimal('amount', 10, 2);
            $table->enum('payment_status', ['Paid', 'Pending'])->default('Pending');
            $table->string('payment_method', 50)->nullable();
            $table->string('transaction_id', 100)->nullable();
            $table->date('date');
            $table->timestamps();

            $table->foreign('patient_id')->references('patient_id')->on('patients')->onDelete('cascade');
            $table->index('payment_status');
        });

        // 7. Test Reports Table
        Schema::create('test_reports', function (Blueprint $table) {
            $table->id();
            $table->string('report_id', 50)->unique();
            $table->string('patient_id', 50);
            $table->string('test_name', 150);
            $table->text('doctor_recommendation')->nullable();
            $table->date('test_date');
            $table->string('status', 30)->default('Completed');
            $table->text('result_summary');
            $table->string('file_name', 255)->default('diagnostic_report.pdf');
            $table->timestamps();

            $table->foreign('patient_id')->references('patient_id')->on('patients')->onDelete('cascade');
        });

        // 8. Symptom Checkers Table
        Schema::create('symptom_checkers', function (Blueprint $table) {
            $table->id();
            $table->string('checker_id', 50)->unique();
            $table->string('patient_id', 50)->nullable();
            $table->text('symptoms');
            $table->string('duration', 100)->default('Not specified');
            $table->string('severity', 50)->default('Not specified');
            $table->text('existing_diseases')->nullable();
            $table->text('allergies')->nullable();
            $table->text('analysis_result');
            $table->string('recommended_department', 150);
            $table->enum('urgency_level', ['Emergency', 'Priority', 'Normal'])->default('Normal');
            $table->date('created_date')->nullable();
            $table->timestamps();

            $table->index('urgency_level');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('symptom_checkers');
        Schema::dropIfExists('test_reports');
        Schema::dropIfExists('billings');
        Schema::dropIfExists('prescriptions');
        Schema::dropIfExists('medical_records');
        Schema::dropIfExists('appointments');
        Schema::dropIfExists('doctors');
        Schema::dropIfExists('patients');
    }
};


package com.carepulse.hospital.controller;

import com.carepulse.hospital.dto.AppointmentRequest;
import com.carepulse.hospital.dto.PrescriptionRequest;
import com.carepulse.hospital.model.Appointment;
import com.carepulse.hospital.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final HospitalService hospitalService;

    public AppointmentController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(hospitalService.getAllAppointments());
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(hospitalService.createAppointment(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        String status = body.get("status");
        Appointment updated = hospitalService.updateAppointmentStatus(id, status);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @PutMapping("/{id}/prescription")
    public ResponseEntity<Appointment> savePrescription(@PathVariable String id, @RequestBody PrescriptionRequest request) {
        Appointment updated = hospitalService.savePrescription(id, request.getNotes(), request.getMedicines());
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}

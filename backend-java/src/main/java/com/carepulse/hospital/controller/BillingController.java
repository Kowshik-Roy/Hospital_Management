package com.carepulse.hospital.controller;

import com.carepulse.hospital.dto.PaymentUpdateRequest;
import com.carepulse.hospital.model.Invoice;
import com.carepulse.hospital.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class BillingController {

    private final HospitalService hospitalService;

    public BillingController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> getAllInvoices() {
        return ResponseEntity.ok(hospitalService.getAllInvoices());
    }

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody Invoice invoice) {
        return ResponseEntity.ok(hospitalService.createInvoice(invoice));
    }

    @PutMapping("/{id}/payment")
    public ResponseEntity<Invoice> updatePayment(@PathVariable String id, @RequestBody PaymentUpdateRequest request) {
        Invoice updated = hospitalService.updatePayment(id, request);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}

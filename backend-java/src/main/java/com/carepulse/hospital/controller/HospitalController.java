package com.carepulse.hospital.controller;

import com.carepulse.hospital.model.BedCategory;
import com.carepulse.hospital.model.HospitalSettings;
import com.carepulse.hospital.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/hospital")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping("/beds")
    public ResponseEntity<List<BedCategory>> getBedCategories() {
        return ResponseEntity.ok(hospitalService.getAllBedCategories());
    }

    @PutMapping("/beds/{id}")
    public ResponseEntity<BedCategory> updateBedOccupancy(@PathVariable String id, @RequestBody Map<String, Integer> body) {
        int delta = body.getOrDefault("delta", 0);
        BedCategory updated = hospitalService.updateBedOccupancy(id, delta);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/settings")
    public ResponseEntity<HospitalSettings> getSettings() {
        return ResponseEntity.ok(hospitalService.getSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<HospitalSettings> updateSettings(@RequestBody HospitalSettings newSettings) {
        return ResponseEntity.ok(hospitalService.updateSettings(newSettings));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(hospitalService.getHospitalStats());
    }
}

package com.carepulse.hospital.controller;

import com.carepulse.hospital.dto.AiChatRequest;
import com.carepulse.hospital.dto.AiChatResponse;
import com.carepulse.hospital.service.HospitalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiChatController {

    private final HospitalService hospitalService;

    public AiChatController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(@RequestBody AiChatRequest request) {
        AiChatResponse response = hospitalService.processAiQuery(request);
        return ResponseEntity.ok(response);
    }
}

package com.carepulse.hospital.dto;

import com.carepulse.hospital.model.Medicine;
import java.util.List;

public class PrescriptionRequest {
    private String notes;
    private List<Medicine> medicines;

    public PrescriptionRequest() {}

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public List<Medicine> getMedicines() { return medicines; }
    public void setMedicines(List<Medicine> medicines) { this.medicines = medicines; }
}

package com.carepulse.hospital.model;

public class Medicine {
    private String name;
    private String dosage;
    private String instruction;
    private String duration;

    public Medicine() {}

    public Medicine(String name, String dosage, String instruction, String duration) {
        this.name = name;
        this.dosage = dosage;
        this.instruction = instruction;
        this.duration = duration;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDosage() { return dosage; }
    public void setDosage(String dosage) { this.dosage = dosage; }

    public String getInstruction() { return instruction; }
    public void setInstruction(String instruction) { this.instruction = instruction; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
}

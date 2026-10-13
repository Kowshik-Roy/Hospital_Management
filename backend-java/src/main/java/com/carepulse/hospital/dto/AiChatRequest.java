package com.carepulse.hospital.dto;

import java.util.List;

public class AiChatRequest {
    private String message;
    private String language; // "bn" or "en"
    private String role; // "patient", "doctor", "admin"
    private List<Object> history;

    public AiChatRequest() {}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public List<Object> getHistory() { return history; }
    public void setHistory(List<Object> history) { this.history = history; }
}

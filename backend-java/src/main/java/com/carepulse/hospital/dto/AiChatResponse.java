package com.carepulse.hospital.dto;

import java.util.List;

public class AiChatResponse {
    private String reply;
    private List<String> suggestedActions;

    public AiChatResponse() {}

    public AiChatResponse(String reply, List<String> suggestedActions) {
        this.reply = reply;
        this.suggestedActions = suggestedActions;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public List<String> getSuggestedActions() { return suggestedActions; }
    public void setSuggestedActions(List<String> suggestedActions) { this.suggestedActions = suggestedActions; }
}

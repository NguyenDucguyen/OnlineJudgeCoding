package com.showtime.onlinejudgecode.judge.dto.ai2;

import com.showtime.onlinejudgecode.judge.dto.ai2.ChatMessage;

import java.util.List;

public class ChatCompletionRequest {
    private String model;
    private boolean stream;
    private List<ChatMessage> messages;

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public boolean isStream() {
        return stream;
    }

    public void setStream(boolean stream) {
        this.stream = stream;
    }

    public List<ChatMessage> getMessages() {return messages;
    }

    public void setMessages(List<ChatMessage> messages) {
        this.messages = messages;
    }
}

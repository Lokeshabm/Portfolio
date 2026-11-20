package com.lokesha.portfolio.model;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class ContactMessage {
    private int id;
    private String name;
    private String email;
    private String subject;
    private String message;
    private String submittedAt;

    public ContactMessage() {
        this.submittedAt = LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }

    public ContactMessage(String name, String email, String subject, String message) {
        this();
        this.name = name;
        this.email = email;
        this.subject = subject;
        this.message = message;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }
}

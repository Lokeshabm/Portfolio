package com.lokesha.portfolio.service;

import com.lokesha.portfolio.model.ContactMessage;

import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import java.io.*;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * Pure Java SE Email Service using standard sockets.
 * Reads configuration strictly from environment variables without hardcoded secrets.
 */
public class EmailService {

    private final String host;
    private final int port;
    private final String username;
    private final String password;
    private final String recipient;
    private final boolean configured;

    public EmailService() {
        this.host = System.getenv("SMTP_HOST");
        String portStr = System.getenv("SMTP_PORT");
        this.port = (portStr != null && !portStr.isEmpty()) ? Integer.parseInt(portStr) : 465;
        this.username = System.getenv("SMTP_USER");
        this.password = System.getenv("SMTP_PASSWORD");
        
        String to = System.getenv("NOTIFICATION_EMAIL");
        this.recipient = (to != null && !to.isEmpty()) ? to : "lokeshbm2003@gmail.com";

        this.configured = (host != null && !host.trim().isEmpty() &&
                           username != null && !username.trim().isEmpty() &&
                           password != null && !password.trim().isEmpty());

        if (this.configured) {
            System.out.println("[EmailService] SMTP Email Service configured with host: " + host + ":" + port);
        } else {
            System.out.println("[EmailService] Info: SMTP credentials not set in environment variables (SMTP_HOST, SMTP_USER, SMTP_PASSWORD).");
            System.out.println("[EmailService] Messages will be securely persisted to MySQL / local JSON file without triggering false delivery notices.");
        }
    }

    public boolean isConfigured() {
        return configured;
    }

    /**
     * Attempts to send an email notification if SMTP is configured.
     * Returns true if sent, false otherwise.
     */
    public boolean sendNotification(ContactMessage message) {
        if (!configured) {
            return false;
        }

        try {
            SSLSocketFactory factory = (SSLSocketFactory) SSLSocketFactory.getDefault();
            try (SSLSocket socket = (SSLSocket) factory.createSocket(host, port)) {
                socket.setSoTimeout(10000);
                BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream(), StandardCharsets.UTF_8));
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream(), StandardCharsets.UTF_8));

                readResponse(reader); // 220 greeting

                sendCommand(writer, "EHLO " + host);
                readResponse(reader);

                sendCommand(writer, "AUTH LOGIN");
                readResponse(reader); // 334

                sendCommand(writer, Base64.getEncoder().encodeToString(username.getBytes(StandardCharsets.UTF_8)));
                readResponse(reader); // 334

                sendCommand(writer, Base64.getEncoder().encodeToString(password.getBytes(StandardCharsets.UTF_8)));
                readResponse(reader); // 235 Authentication succeeded

                sendCommand(writer, "MAIL FROM:<" + username + ">");
                readResponse(reader);

                sendCommand(writer, "RCPT TO:<" + recipient + ">");
                readResponse(reader);

                sendCommand(writer, "DATA");
                readResponse(reader); // 354

                // Email content
                StringBuilder emailContent = new StringBuilder();
                emailContent.append("From: Portfolio Contact Form <").append(username).append(">\r\n");
                emailContent.append("To: <").append(recipient).append(">\r\n");
                emailContent.append("Reply-To: ").append(message.getName()).append(" <").append(message.getEmail()).append(">\r\n");
                emailContent.append("Subject: [Portfolio Contact] ").append(message.getSubject()).append("\r\n");
                emailContent.append("MIME-Version: 1.0\r\n");
                emailContent.append("Content-Type: text/plain; charset=UTF-8\r\n\r\n");

                emailContent.append("New contact message received from your portfolio:\r\n\r\n");
                emailContent.append("Name: ").append(message.getName()).append("\r\n");
                emailContent.append("Email: ").append(message.getEmail()).append("\r\n");
                emailContent.append("Subject: ").append(message.getSubject()).append("\r\n");
                emailContent.append("Date: ").append(message.getSubmittedAt()).append("\r\n\r\n");
                emailContent.append("Message Content:\r\n");
                emailContent.append("--------------------------------------------------\r\n");
                emailContent.append(message.getMessage()).append("\r\n");
                emailContent.append("--------------------------------------------------\r\n.");

                sendCommand(writer, emailContent.toString());
                readResponse(reader); // 250 OK

                sendCommand(writer, "QUIT");
                readResponse(reader);

                System.out.println("[EmailService] Successfully dispatched notification email to " + recipient);
                return true;
            }
        } catch (Exception e) {
            System.err.println("[EmailService] Failed to send email: " + e.getMessage());
            return false;
        }
    }

    private void sendCommand(BufferedWriter writer, String command) throws IOException {
        writer.write(command + "\r\n");
        writer.flush();
    }

    private String readResponse(BufferedReader reader) throws IOException {
        String line = reader.readLine();
        // Handle multiline SMTP responses (e.g., 250-something)
        while (line != null && line.length() >= 4 && line.charAt(3) == '-') {
            line = reader.readLine();
        }
        return line;
    }
}

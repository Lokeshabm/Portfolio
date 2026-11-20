package com.lokesha.portfolio.service;

import com.lokesha.portfolio.model.ContactMessage;
import com.lokesha.portfolio.util.EnvConfig;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Properties;

/**
 * Real-time Email Delivery Service using Jakarta Mail (Angus implementation) with Gmail SMTP.
 */
public class GmailSmtpService {

    public GmailSmtpService() {
        if (isConfigured()) {
            System.out.println("[GmailSmtpService] Gmail SMTP configured successfully. Ready for real-time dispatch to: " + getReceiverEmail());
        } else {
            System.out.println("[GmailSmtpService] Notice: GMAIL_USERNAME or GMAIL_APP_PASSWORD is not set yet in environment variables or .env file.");
        }
    }

    public String getUsername() {
        return EnvConfig.get("GMAIL_USERNAME");
    }

    public String getPassword() {
        return EnvConfig.get("GMAIL_APP_PASSWORD");
    }

    public String getReceiverEmail() {
        return EnvConfig.get("RECEIVER_EMAIL", "lokeshbm2003@gmail.com");
    }

    public String getSmtpHost() {
        return EnvConfig.get("SMTP_HOST", "smtp.gmail.com");
    }

    public String getSmtpPort() {
        return EnvConfig.get("SMTP_PORT", "587");
    }

    public boolean isConfigured() {
        String u = getUsername();
        String p = getPassword();
        return u != null && !u.trim().isEmpty() &&
               p != null && !p.trim().isEmpty();
    }

    /**
     * Sends the contact form submission directly to Gmail.
     * Throws an Exception if delivery cannot be completed.
     */
    public void sendContactEmail(ContactMessage message) throws Exception {
        String username = getUsername();
        String password = getPassword();
        String receiverEmail = getReceiverEmail();
        String smtpHost = getSmtpHost();
        String smtpPort = getSmtpPort();

        if (!isConfigured()) {
            throw new IllegalStateException("Gmail credentials are not configured on the server. Please set GMAIL_USERNAME and GMAIL_APP_PASSWORD in environment variables or .env file.");
        }

        // Clean password: remove spaces if copied from Google (e.g. "qqki hxnv jhro wzej" -> "qqkihxnvjhrowzej")
        final String cleanPassword = password.replace(" ", "").trim();
        final String cleanUsername = username.trim();

        // Prevent email header injection by stripping CR and LF
        String safeName = sanitizeHeader(message.getName());
        String safeEmail = sanitizeHeader(message.getEmail());
        String safeSubject = sanitizeHeader(message.getSubject());

        Properties props = new Properties();
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", smtpPort);
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.starttls.required", "true");
        props.put("mail.smtp.ssl.protocols", "TLSv1.2 TLSv1.3");
        props.put("mail.smtp.connectiontimeout", "10000"); // 10s connection timeout
        props.put("mail.smtp.timeout", "10000");           // 10s socket I/O timeout
        props.put("mail.smtp.writetimeout", "10000");

        // Authenticate with Gmail
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(cleanUsername, cleanPassword);
            }
        });

        MimeMessage mimeMessage = new MimeMessage(session);

        // Sender: authenticated username with portfolio title
        mimeMessage.setFrom(new InternetAddress(cleanUsername, "B M LOKESHA Portfolio"));

        // Receiver: destination inbox
        mimeMessage.setRecipient(Message.RecipientType.TO, new InternetAddress(receiverEmail));

        // Reply-To: Visitor's email address
        mimeMessage.setReplyTo(new Address[] {
                new InternetAddress(safeEmail, safeName)
        });

        // Email Subject: New Portfolio Contact - [Visitor Subject]
        mimeMessage.setSubject("New Portfolio Contact - " + safeSubject, "UTF-8");

        // Email Body Format
        StringBuilder body = new StringBuilder();
        body.append("You have received a new message through your portfolio website.\n\n");
        body.append("Visitor Name: ").append(safeName).append("\n");
        body.append("Visitor Email: ").append(safeEmail).append("\n");
        body.append("Subject: ").append(safeSubject).append("\n\n");
        body.append("Message:\n");
        body.append(message.getMessage()).append("\n\n");
        body.append("--------------------------------------------------\n");
        body.append("Timestamp: ").append(message.getSubmittedAt()).append("\n");
        body.append("Sent via: B M LOKESHA Portfolio Website (Java SE + Jakarta Mail)\n");

        mimeMessage.setText(body.toString(), "UTF-8");

        // Actual SMTP Transmission
        System.out.println("[GmailSmtpService] Connecting to " + smtpHost + ":" + smtpPort + " using " + cleanUsername + "...");
        Transport.send(mimeMessage);
        System.out.println("[GmailSmtpService] SUCCESS: Email accepted by Gmail SMTP server for delivery to " + receiverEmail);
    }

    private String sanitizeHeader(String input) {
        if (input == null) return "";
        return input.replaceAll("[\\r\\n]+", " ").trim();
    }
}

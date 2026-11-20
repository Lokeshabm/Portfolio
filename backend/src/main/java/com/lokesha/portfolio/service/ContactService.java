package com.lokesha.portfolio.service;

import com.lokesha.portfolio.database.ContactDao;
import com.lokesha.portfolio.model.ApiResponse;
import com.lokesha.portfolio.model.ContactMessage;
import com.lokesha.portfolio.util.RateLimiter;
import jakarta.mail.AuthenticationFailedException;
import jakarta.mail.MessagingException;

import java.net.SocketTimeoutException;
import java.util.regex.Pattern;

public class ContactService {

    private final ContactDao contactDao;
    private final GmailSmtpService gmailSmtpService;
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    public ContactService() {
        this.contactDao = new ContactDao();
        this.gmailSmtpService = new GmailSmtpService();
    }

    public ApiResponse processContact(ContactMessage message, String clientIp) {
        // Rate Limiting Check
        if (!RateLimiter.isAllowed(clientIp)) {
            return ApiResponse.error("Too many message requests. Please wait a few minutes before submitting again.");
        }

        // Validation 1: Full Name
        if (message.getName() == null || message.getName().trim().isEmpty()) {
            return ApiResponse.error("Full Name is required.");
        }
        if (message.getName().trim().length() < 2) {
            return ApiResponse.error("Full Name must be at least 2 characters long.");
        }

        // Validation 2: Email Address
        if (message.getEmail() == null || message.getEmail().trim().isEmpty()) {
            return ApiResponse.error("Email Address is required.");
        }
        if (!EMAIL_PATTERN.matcher(message.getEmail().trim()).matches()) {
            return ApiResponse.error("Please enter a valid email address (e.g. name@example.com).");
        }

        // Validation 3: Subject
        if (message.getSubject() == null || message.getSubject().trim().isEmpty()) {
            return ApiResponse.error("Subject is required.");
        }
        if (message.getSubject().trim().length() < 2) {
            return ApiResponse.error("Subject must be at least 2 characters long.");
        }

        // Validation 4: Message
        if (message.getMessage() == null || message.getMessage().trim().isEmpty()) {
            return ApiResponse.error("Message content cannot be empty.");
        }
        if (message.getMessage().trim().length() < 10) {
            return ApiResponse.error("Message must be at least 10 characters long.");
        }

        // Sanitize
        message.setName(message.getName().trim());
        message.setEmail(message.getEmail().trim().toLowerCase());
        message.setSubject(message.getSubject().trim());
        message.setMessage(message.getMessage().trim());

        // Actual Real-Time Email Delivery via Gmail SMTP
        try {
            gmailSmtpService.sendContactEmail(message);

            // Audit record in database/file
            contactDao.save(message);

            return ApiResponse.ok("Your message has been sent successfully. I have received your email and will get back to you shortly.");

        } catch (IllegalStateException e) {
            // Configuration missing (GMAIL_USERNAME or GMAIL_APP_PASSWORD)
            System.err.println("[ContactService] Configuration error: " + e.getMessage());
            // Still save to local storage so user input is never lost during dev/setup
            contactDao.save(message);
            return ApiResponse.error(e.getMessage());

        } catch (AuthenticationFailedException e) {
            System.err.println("[ContactService] Gmail SMTP Authentication failed: " + e.getMessage());
            contactDao.save(message);
            return ApiResponse.error("Gmail SMTP authentication failed. Please verify that your GMAIL_USERNAME and 16-character GMAIL_APP_PASSWORD are set correctly in your environment or .env file.");

        } catch (MessagingException e) {
            System.err.println("[ContactService] Gmail SMTP MessagingException: " + e.getMessage());
            contactDao.save(message);
            if (e.getCause() instanceof SocketTimeoutException) {
                return ApiResponse.error("Connection timed out while connecting to Gmail SMTP (smtp.gmail.com:587). Please check your internet connection.");
            }
            return ApiResponse.error("Email delivery failed: " + e.getMessage());

        } catch (Exception e) {
            System.err.println("[ContactService] Unexpected error sending email: " + e.getMessage());
            contactDao.save(message);
            return ApiResponse.error("Failed to send email due to an unexpected error: " + e.getMessage());
        }
    }
}

package com.lokesha.portfolio.database;

import com.lokesha.portfolio.model.ContactMessage;
import com.lokesha.portfolio.util.JsonUtil;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

public class ContactDao {

    private static final String DATA_DIR = "data";
    private static final String MESSAGES_FILE = "data/messages.json";
    private final List<ContactMessage> memoryStore = Collections.synchronizedList(new ArrayList<>());
    private final AtomicInteger idSequence = new AtomicInteger(1);

    public ContactDao() {
        initFileStorage();
    }

    private void initFileStorage() {
        try {
            File dir = new File(DATA_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            File file = new File(MESSAGES_FILE);
            if (!file.exists()) {
                Files.writeString(file.toPath(), "[]");
            }
        } catch (Exception e) {
            System.err.println("[ContactDao] Could not initialize local storage file: " + e.getMessage());
        }
    }

    public boolean save(ContactMessage message) {
        message.setId(idSequence.getAndIncrement());
        memoryStore.add(message);

        // Try MySQL first if available
        Connection conn = DatabaseConnection.getConnection();
        if (conn != null) {
            String sql = "INSERT INTO contact_messages (name, email, subject, message, submitted_at) VALUES (?, ?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, message.getName());
                stmt.setString(2, message.getEmail());
                stmt.setString(3, message.getSubject());
                stmt.setString(4, message.getMessage());
                stmt.setString(5, message.getSubmittedAt());
                stmt.executeUpdate();
                System.out.println("[ContactDao] Successfully saved message to MySQL database.");
                return true;
            } catch (SQLException e) {
                System.err.println("[ContactDao] MySQL write error: " + e.getMessage() + ". Falling back to JSON file storage.");
            }
        }

        // Fallback: append to data/messages.json
        return saveToFile(message);
    }

    private synchronized boolean saveToFile(ContactMessage message) {
        try {
            File file = new File(MESSAGES_FILE);
            String currentJson = "[]";
            if (file.exists()) {
                currentJson = Files.readString(file.toPath());
            }

            // Simple json array append
            String itemJson = JsonUtil.toJson(message);
            String updated;
            if (currentJson.trim().equals("[]") || currentJson.trim().isEmpty()) {
                updated = "[\n  " + itemJson + "\n]";
            } else {
                int lastBracket = currentJson.lastIndexOf(']');
                if (lastBracket != -1) {
                    updated = currentJson.substring(0, lastBracket).trim() + ",\n  " + itemJson + "\n]";
                } else {
                    updated = "[\n  " + itemJson + "\n]";
                }
            }

            try (FileWriter writer = new FileWriter(file, false)) {
                writer.write(updated);
            }
            System.out.println("[ContactDao] Message successfully logged to " + MESSAGES_FILE);
            return true;
        } catch (IOException e) {
            System.err.println("[ContactDao] Error writing message to file: " + e.getMessage());
            return true; // Still preserved in memoryStore!
        }
    }

    public List<ContactMessage> getAllMessages() {
        return new ArrayList<>(memoryStore);
    }
}

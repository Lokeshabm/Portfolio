package com.lokesha.portfolio.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Loads configuration from System environment variables with fallback to .env file.
 * Automatically checks multiple candidate directories.
 * Ensures secrets remain strictly outside code and version control.
 */
public class EnvConfig {

    private static final Map<String, String> fileEnv = new HashMap<>();
    private static long lastLoadedTime = 0;

    static {
        loadDotEnv();
    }

    public static synchronized void loadDotEnv() {
        String userDir = System.getProperty("user.dir", ".");
        File[] candidates = new File[] {
                new File(".env"),
                new File("backend/.env"),
                new File("../.env"),
                new File("portfolio/.env"),
                new File("portfolio/backend/.env"),
                new File(userDir, ".env"),
                new File(userDir, "backend/.env"),
                new File(userDir, "portfolio/backend/.env"),
                new File(userDir, "../.env")
        };

        for (File candidate : candidates) {
            try {
                if (candidate.exists() && candidate.isFile() && candidate.canRead()) {
                    try (BufferedReader reader = new BufferedReader(new FileReader(candidate, StandardCharsets.UTF_8))) {
                        String line;
                        while ((line = reader.readLine()) != null) {
                            line = line.trim();
                            if (line.isEmpty() || line.startsWith("#")) {
                                continue;
                            }
                            int eqIdx = line.indexOf('=');
                            if (eqIdx > 0) {
                                String key = line.substring(0, eqIdx).trim();
                                String val = line.substring(eqIdx + 1).trim();
                                if ((val.startsWith("\"") && val.endsWith("\"")) ||
                                    (val.startsWith("'") && val.endsWith("'"))) {
                                    val = val.substring(1, val.length() - 1);
                                }
                                fileEnv.put(key, val);
                            }
                        }
                        lastLoadedTime = System.currentTimeMillis();
                        System.out.println("[EnvConfig] Successfully loaded configuration from: " + candidate.getCanonicalPath());
                        return;
                    }
                }
            } catch (Exception e) {
                // Check next candidate
            }
        }
    }

    public static String get(String key) {
        // First check OS environment variables
        String sysVal = System.getenv(key);
        if (sysVal != null && !sysVal.trim().isEmpty()) {
            return sysVal.trim();
        }

        // If not in fileEnv or fileEnv is empty, attempt reload
        if (fileEnv.isEmpty() || !fileEnv.containsKey(key)) {
            loadDotEnv();
        }

        String fileVal = fileEnv.get(key);
        return (fileVal != null && !fileVal.trim().isEmpty()) ? fileVal.trim() : null;
    }

    public static String get(String key, String defaultValue) {
        String val = get(key);
        return (val != null) ? val : defaultValue;
    }

    public static boolean has(String key) {
        String val = get(key);
        return val != null && !val.trim().isEmpty();
    }
}

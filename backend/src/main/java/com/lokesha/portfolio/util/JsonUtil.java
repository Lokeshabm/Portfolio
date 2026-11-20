package com.lokesha.portfolio.util;

import java.lang.reflect.Field;
import java.util.*;

/**
 * Robust Pure Java SE JSON serialization & deserialization utility.
 * Handles multiline text, escaped quotes, special characters, and nested strings
 * without requiring any external libraries.
 */
public class JsonUtil {

    public static String toJson(Object obj) {
        if (obj == null) return "null";

        if (obj instanceof String) {
            return "\"" + escapeString((String) obj) + "\"";
        }
        if (obj instanceof Number || obj instanceof Boolean) {
            return obj.toString();
        }
        if (obj instanceof List<?>) {
            List<?> list = (List<?>) obj;
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < list.size(); i++) {
                if (i > 0) sb.append(",");
                sb.append(toJson(list.get(i)));
            }
            sb.append("]");
            return sb.toString();
        }
        if (obj instanceof Map<?, ?>) {
            Map<?, ?> map = (Map<?, ?>) obj;
            StringBuilder sb = new StringBuilder("{");
            int i = 0;
            for (Map.Entry<?, ?> entry : map.entrySet()) {
                if (entry.getValue() == null) continue; // omit nulls
                if (i > 0) sb.append(",");
                sb.append("\"").append(escapeString(entry.getKey().toString())).append("\":");
                sb.append(toJson(entry.getValue()));
                i++;
            }
            sb.append("}");
            return sb.toString();
        }

        // POJO reflection serialization
        return pojoToJson(obj);
    }

    private static String pojoToJson(Object obj) {
        StringBuilder sb = new StringBuilder("{");
        Field[] fields = obj.getClass().getDeclaredFields();
        boolean first = true;

        for (Field field : fields) {
            field.setAccessible(true);
            try {
                Object value = field.get(obj);
                if (value == null) {
                    continue; // omit null fields for clean JSON
                }
                if (!first) sb.append(",");
                sb.append("\"").append(field.getName()).append("\":");
                sb.append(toJson(value));
                first = false;
            } catch (IllegalAccessException e) {
                // skip field
            }
        }
        sb.append("}");
        return sb.toString();
    }

    public static String escapeString(String s) {
        if (s == null) return "";
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            switch (ch) {
                case '"': sb.append("\\\""); break;
                case '\\': sb.append("\\\\"); break;
                case '\b': sb.append("\\b"); break;
                case '\f': sb.append("\\f"); break;
                case '\n': sb.append("\\n"); break;
                case '\r': sb.append("\\r"); break;
                case '\t': sb.append("\\t"); break;
                default:
                    if (ch < ' ') {
                        String t = "000" + Integer.toHexString(ch);
                        sb.append("\\u").append(t.substring(t.length() - 4));
                    } else {
                        sb.append(ch);
                    }
            }
        }
        return sb.toString();
    }

    /**
     * Robust character-by-character JSON parser for key-value payloads.
     * Correctly handles escaped quotes (\"), internal colons, commas, newlines, and unicode escapes.
     */
    public static Map<String, String> parseSimpleJson(String json) {
        Map<String, String> map = new LinkedHashMap<>();
        if (json == null || json.trim().isEmpty()) {
            return map;
        }

        String input = json.trim();
        int len = input.length();
        int i = 0;

        // Skip leading whitespace and opening brace
        while (i < len && (Character.isWhitespace(input.charAt(i)) || input.charAt(i) == '{')) {
            i++;
        }

        while (i < len) {
            // Find key starting with '"' or '\"'
            while (i < len && input.charAt(i) != '"' && input.charAt(i) != '}') {
                if (input.charAt(i) == '\\' && i + 1 < len && input.charAt(i + 1) == '"') {
                    i++;
                    break;
                }
                i++;
            }
            if (i >= len || input.charAt(i) == '}') break;

            // Read Key
            i++; // skip opening quote
            StringBuilder keyBuilder = new StringBuilder();
            boolean escaped = false;
            while (i < len) {
                char c = input.charAt(i);
                if (escaped) {
                    keyBuilder.append(c);
                    escaped = false;
                } else if (c == '\\') {
                    if (i + 1 < len && input.charAt(i + 1) == '"') {
                        // Could be closing escaped quote if followed by whitespace or colon
                        int peek = i + 2;
                        while (peek < len && Character.isWhitespace(input.charAt(peek))) peek++;
                        if (peek < len && input.charAt(peek) == ':') {
                            i += 2; // skip \" closing key
                            break;
                        }
                    }
                    escaped = true;
                } else if (c == '"') {
                    i++; // skip closing quote
                    break;
                } else {
                    keyBuilder.append(c);
                }
                i++;
            }

            // Find ':'
            while (i < len && input.charAt(i) != ':') {
                i++;
            }
            if (i >= len) break;
            i++; // skip ':'

            // Skip whitespace before value
            while (i < len && Character.isWhitespace(input.charAt(i))) {
                i++;
            }
            if (i >= len) break;

            // Check if value starts with \" (escaped quote) or " (standard quote)
            if (input.charAt(i) == '\\' && i + 1 < len && input.charAt(i + 1) == '"') {
                i++;
            }

            // Read Value
            char firstValChar = input.charAt(i);
            String value = "";

            if (firstValChar == '"') {
                // String value
                i++; // skip opening quote
                StringBuilder valBuilder = new StringBuilder();
                escaped = false;
                while (i < len) {
                    char c = input.charAt(i);
                    if (escaped) {
                        switch (c) {
                            case '"': valBuilder.append('"'); break;
                            case '\\': valBuilder.append('\\'); break;
                            case '/': valBuilder.append('/'); break;
                            case 'b': valBuilder.append('\b'); break;
                            case 'f': valBuilder.append('\f'); break;
                            case 'n': valBuilder.append('\n'); break;
                            case 'r': valBuilder.append('\r'); break;
                            case 't': valBuilder.append('\t'); break;
                            case 'u':
                                if (i + 4 < len) {
                                    try {
                                        String hex = input.substring(i + 1, i + 5);
                                        valBuilder.append((char) Integer.parseInt(hex, 16));
                                        i += 4;
                                    } catch (NumberFormatException ignored) {
                                        valBuilder.append('u');
                                    }
                                } else {
                                    valBuilder.append('u');
                                }
                                break;
                            default:
                                valBuilder.append(c);
                        }
                        escaped = false;
                    } else if (c == '\\') {
                        escaped = true;
                    } else if (c == '"') {
                        i++; // skip closing quote
                        break;
                    } else {
                        valBuilder.append(c);
                    }
                    i++;
                }
                value = valBuilder.toString();
            } else {
                // Primitive value (number, boolean, null)
                StringBuilder valBuilder = new StringBuilder();
                while (i < len && input.charAt(i) != ',' && input.charAt(i) != '}') {
                    valBuilder.append(input.charAt(i));
                    i++;
                }
                value = valBuilder.toString().trim();
                if ("null".equalsIgnoreCase(value)) {
                    value = "";
                }
            }

            map.put(keyBuilder.toString().trim(), value);

            // Skip until next comma or closing brace
            while (i < len && input.charAt(i) != ',' && input.charAt(i) != '}') {
                i++;
            }
            if (i < len && input.charAt(i) == ',') {
                i++;
            }
        }

        return map;
    }
}

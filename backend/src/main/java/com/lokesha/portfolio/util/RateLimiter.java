package com.lokesha.portfolio.util;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Basic in-memory rate limiter to protect Gmail SMTP quota and prevent spam abuse.
 */
public class RateLimiter {

    private static final int MAX_REQUESTS = 5;
    private static final long WINDOW_MILLIS = 10 * 60 * 1000L; // 10 minutes

    private static final Map<String, RequestCounter> clients = new ConcurrentHashMap<>();

    public static synchronized boolean isAllowed(String clientIdentifier) {
        if (clientIdentifier == null || clientIdentifier.isEmpty()) {
            clientIdentifier = "default_client";
        }

        long now = System.currentTimeMillis();
        RequestCounter counter = clients.computeIfAbsent(clientIdentifier, k -> new RequestCounter(now));

        // Reset if window has elapsed
        if (now - counter.windowStart > WINDOW_MILLIS) {
            counter.windowStart = now;
            counter.count = 0;
        }

        if (counter.count >= MAX_REQUESTS) {
            return false;
        }

        counter.count++;
        return true;
    }

    private static class RequestCounter {
        long windowStart;
        int count;

        RequestCounter(long windowStart) {
            this.windowStart = windowStart;
            this.count = 0;
        }
    }
}

package com.lokesha.portfolio.controller;

import com.lokesha.portfolio.model.ApiResponse;
import com.lokesha.portfolio.model.ProjectActivity;
import com.lokesha.portfolio.model.ProjectStats;
import com.lokesha.portfolio.model.ProjectStats.ProjectRanking;
import com.lokesha.portfolio.service.AnalyticsService;
import com.lokesha.portfolio.util.HttpUtils;
import com.lokesha.portfolio.util.JsonUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Controller handling project analytics endpoints:
 * - POST /api/analytics/track (Record project interaction)
 * - GET  /api/analytics/project-activity (Retrieve paginated/filtered activity logs)
 * - GET  /api/analytics/project-stats (Summary cards metrics)
 * - GET  /api/analytics/most-viewed-projects (Ranking and popularity statistics)
 */
public class AnalyticsController implements HttpHandler {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (HttpUtils.handlePreflight(exchange)) {
            return;
        }

        String path = exchange.getRequestURI().getPath();
        String method = exchange.getRequestMethod();

        try {
            if (path.endsWith("/track") || path.endsWith("/project")) {
                handleTrackActivity(exchange);
            } else if (path.endsWith("/project-activity")) {
                handleGetActivities(exchange);
            } else if (path.endsWith("/project-stats")) {
                handleGetStats(exchange);
            } else if (path.endsWith("/most-viewed-projects")) {
                handleGetMostViewed(exchange);
            } else {
                // Default analytics info / fallback
                if ("GET".equalsIgnoreCase(method)) {
                    ProjectStats stats = analyticsService.getProjectStats();
                    HttpUtils.sendJsonResponse(exchange, 200, JsonUtil.toJson(stats));
                } else {
                    HttpUtils.sendJsonResponse(exchange, 404, "{\"error\": \"Endpoint not found\"}");
                }
            }
        } catch (Exception e) {
            System.err.println("[AnalyticsController] Error handling " + path + ": " + e.getMessage());
            ApiResponse err = ApiResponse.error("Internal Server Error: " + e.getMessage());
            HttpUtils.sendJsonResponse(exchange, 500, JsonUtil.toJson(err));
        }
    }

    private void handleTrackActivity(HttpExchange exchange) throws IOException {
        if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
            HttpUtils.sendJsonResponse(exchange, 405, "{\"error\": \"Method Not Allowed. Use POST.\"}");
            return;
        }

        String body = HttpUtils.readRequestBody(exchange);
        if (body == null || body.trim().isEmpty()) {
            ApiResponse err = ApiResponse.error("Activity request body cannot be empty.");
            HttpUtils.sendJsonResponse(exchange, 400, JsonUtil.toJson(err));
            return;
        }

        Map<String, String> payload = JsonUtil.parseSimpleJson(body);
        if (payload.isEmpty() && !body.trim().equals("{}")) {
            ApiResponse err = ApiResponse.error("Malformed JSON payload.");
            HttpUtils.sendJsonResponse(exchange, 400, JsonUtil.toJson(err));
            return;
        }

        ApiResponse response = analyticsService.recordActivity(payload);
        int status = response.isSuccess() ? 200 : 400;
        HttpUtils.sendJsonResponse(exchange, status, JsonUtil.toJson(response));
    }

    private void handleGetActivities(HttpExchange exchange) throws IOException {
        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            HttpUtils.sendJsonResponse(exchange, 405, "{\"error\": \"Method Not Allowed. Use GET.\"}");
            return;
        }

        Map<String, String> queryParams = parseQueryParams(exchange.getRequestURI());
        String search = queryParams.getOrDefault("search", "");
        String project = queryParams.getOrDefault("project", "all");
        String action = queryParams.getOrDefault("action", "all");
        int page = 1;
        int limit = 10;

        try {
            if (queryParams.containsKey("page")) page = Integer.parseInt(queryParams.get("page"));
            if (queryParams.containsKey("limit")) limit = Integer.parseInt(queryParams.get("limit"));
        } catch (NumberFormatException ignored) {}

        Map<String, Object> result = analyticsService.getFilteredActivities(search, project, action, page, limit);
        HttpUtils.sendJsonResponse(exchange, 200, JsonUtil.toJson(result));
    }

    private void handleGetStats(HttpExchange exchange) throws IOException {
        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            HttpUtils.sendJsonResponse(exchange, 405, "{\"error\": \"Method Not Allowed. Use GET.\"}");
            return;
        }

        ProjectStats stats = analyticsService.getProjectStats();
        HttpUtils.sendJsonResponse(exchange, 200, JsonUtil.toJson(stats));
    }

    private void handleGetMostViewed(HttpExchange exchange) throws IOException {
        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            HttpUtils.sendJsonResponse(exchange, 405, "{\"error\": \"Method Not Allowed. Use GET.\"}");
            return;
        }

        List<ProjectRanking> list = analyticsService.getMostViewedProjects();
        HttpUtils.sendJsonResponse(exchange, 200, JsonUtil.toJson(list));
    }

    private Map<String, String> parseQueryParams(URI uri) {
        Map<String, String> queryMap = new LinkedHashMap<>();
        String query = uri.getRawQuery();
        if (query == null || query.trim().isEmpty()) {
            return queryMap;
        }

        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            try {
                if (idx > 0) {
                    String key = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8.name());
                    String value = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8.name());
                    queryMap.put(key, value);
                } else if (!pair.isEmpty()) {
                    String key = URLDecoder.decode(pair, StandardCharsets.UTF_8.name());
                    queryMap.put(key, "");
                }
            } catch (Exception ignored) {}
        }
        return queryMap;
    }
}

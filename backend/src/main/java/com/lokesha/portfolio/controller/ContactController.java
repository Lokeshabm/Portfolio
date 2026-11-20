package com.lokesha.portfolio.controller;

import com.lokesha.portfolio.model.ApiResponse;
import com.lokesha.portfolio.model.ContactMessage;
import com.lokesha.portfolio.service.ContactService;
import com.lokesha.portfolio.util.HttpUtils;
import com.lokesha.portfolio.util.JsonUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.Map;

public class ContactController implements HttpHandler {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (HttpUtils.handlePreflight(exchange)) {
            return;
        }

        String method = exchange.getRequestMethod();

        if ("POST".equalsIgnoreCase(method)) {
            try {
                String body = HttpUtils.readRequestBody(exchange);
                if (body == null || body.trim().isEmpty()) {
                    ApiResponse err = ApiResponse.error("Request body cannot be empty.");
                    HttpUtils.sendJsonResponse(exchange, 400, JsonUtil.toJson(err));
                    return;
                }

                Map<String, String> data = JsonUtil.parseSimpleJson(body);

                if (data.isEmpty() && !body.trim().equals("{}")) {
                    ApiResponse err = ApiResponse.error("Malformed JSON payload.");
                    HttpUtils.sendJsonResponse(exchange, 400, JsonUtil.toJson(err));
                    return;
                }

                ContactMessage message = new ContactMessage(
                        data.get("name"),
                        data.get("email"),
                        data.get("subject"),
                        data.get("message")
                );

                // Determine client IP for rate limiting
                String clientIp = exchange.getRequestHeaders().getFirst("X-Forwarded-For");
                if (clientIp == null || clientIp.trim().isEmpty()) {
                    InetSocketAddress remoteAddress = exchange.getRemoteAddress();
                    clientIp = (remoteAddress != null && remoteAddress.getAddress() != null)
                            ? remoteAddress.getAddress().getHostAddress()
                            : "127.0.0.1";
                } else if (clientIp.contains(",")) {
                    clientIp = clientIp.split(",")[0].trim();
                }

                ApiResponse response = contactService.processContact(message, clientIp);

                int status = 200;
                if (!response.isSuccess()) {
                    String msg = response.getMessage().toLowerCase();
                    if (msg.contains("rate") || msg.contains("too many")) {
                        status = 429; // Too Many Requests
                    } else if (msg.contains("required") || msg.contains("valid") || msg.contains("empty") || msg.contains("characters")) {
                        status = 400; // Bad Request (Validation)
                    } else {
                        status = 500; // Internal Server Error (SMTP/Config)
                    }
                }

                HttpUtils.sendJsonResponse(exchange, status, JsonUtil.toJson(response));

            } catch (Exception e) {
                System.err.println("[ContactController] Internal error processing contact: " + e.getMessage());
                ApiResponse err = ApiResponse.error("Internal server error: " + e.getMessage());
                HttpUtils.sendJsonResponse(exchange, 500, JsonUtil.toJson(err));
            }
        } else if ("GET".equalsIgnoreCase(method)) {
            ApiResponse info = ApiResponse.ok("Contact API endpoint is active. Submit messages via HTTP POST with JSON body.");
            HttpUtils.sendJsonResponse(exchange, 200, JsonUtil.toJson(info));
        } else {
            HttpUtils.sendJsonResponse(exchange, 405, "{\"error\": \"Method Not Allowed\"}");
        }
    }
}

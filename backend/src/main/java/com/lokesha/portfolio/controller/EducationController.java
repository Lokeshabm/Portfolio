package com.lokesha.portfolio.controller;

import com.lokesha.portfolio.model.Education;
import com.lokesha.portfolio.service.PortfolioService;
import com.lokesha.portfolio.util.HttpUtils;
import com.lokesha.portfolio.util.JsonUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.util.List;

public class EducationController implements HttpHandler {

    private final PortfolioService portfolioService;

    public EducationController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        if (HttpUtils.handlePreflight(exchange)) {
            return;
        }

        if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            List<Education> list = portfolioService.getEducationList();
            String json = JsonUtil.toJson(list);
            HttpUtils.sendJsonResponse(exchange, 200, json);
        } else {
            HttpUtils.sendJsonResponse(exchange, 405, "{\"error\": \"Method Not Allowed\"}");
        }
    }
}

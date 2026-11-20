package com.lokesha.portfolio.server;

import com.lokesha.portfolio.controller.*;
import com.lokesha.portfolio.service.AnalyticsService;
import com.lokesha.portfolio.service.ContactService;
import com.lokesha.portfolio.service.PortfolioService;
import com.lokesha.portfolio.util.HttpUtils;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;

public class PortfolioHttpServer {

    private final int port;
    private HttpServer server;
    private final PortfolioService portfolioService;
    private final ContactService contactService;
    private final AnalyticsService analyticsService;

    public PortfolioHttpServer(int port) {
        this.port = port;
        this.portfolioService = new PortfolioService();
        this.contactService = new ContactService();
        this.analyticsService = new AnalyticsService();
    }

    public void start() throws IOException {
        server = HttpServer.create(new InetSocketAddress(port), 0);

        // Register REST API endpoints wrapped with CorsHandler
        server.createContext("/api/profile", new CorsHandler(new ProfileController(portfolioService)));
        server.createContext("/api/projects", new CorsHandler(new ProjectController(portfolioService)));
        server.createContext("/api/skills", new CorsHandler(new SkillController(portfolioService)));
        server.createContext("/api/education", new CorsHandler(new EducationController(portfolioService)));
        server.createContext("/api/contact", new CorsHandler(new ContactController(contactService)));

        // Analytics endpoints
        AnalyticsController analyticsController = new AnalyticsController(analyticsService);
        server.createContext("/api/analytics/track", new CorsHandler(analyticsController));
        server.createContext("/api/analytics/project-activity", new CorsHandler(analyticsController));
        server.createContext("/api/analytics/project-stats", new CorsHandler(analyticsController));
        server.createContext("/api/analytics/most-viewed-projects", new CorsHandler(analyticsController));
        server.createContext("/api/analytics", new CorsHandler(analyticsController));

        // Root health check endpoint
        server.createContext("/", exchange -> {
            if (HttpUtils.handlePreflight(exchange)) return;
            String welcome = "{\"status\": \"UP\", \"message\": \"B M LOKESHA Portfolio Java SE REST API\", \"version\": \"1.0.0\"}";
            HttpUtils.sendJsonResponse(exchange, 200, welcome);
        });

        // Use multi-threaded executor for handling concurrent requests
        server.setExecutor(Executors.newFixedThreadPool(12));
        server.start();

        System.out.println("==========================================================");
        System.out.println("  B M LOKESHA Portfolio Backend - Java SE HttpServer");
        System.out.println("==========================================================");
        System.out.println("  [OK] Server running on:  http://localhost:" + port);
        System.out.println("  [OK] API Profile:        http://localhost:" + port + "/api/profile");
        System.out.println("  [OK] API Projects:       http://localhost:" + port + "/api/projects");
        System.out.println("  [OK] API Skills:         http://localhost:" + port + "/api/skills");
        System.out.println("  [OK] API Education:      http://localhost:" + port + "/api/education");
        System.out.println("  [OK] API Contact:        http://localhost:" + port + "/api/contact [POST]");
        System.out.println("  [OK] API Analytics:      http://localhost:" + port + "/api/analytics/project-stats");
        System.out.println("  [OK] CORS Enabled:       * (All origins allowed)");
        System.out.println("==========================================================");
    }

    public void stop() {
        if (server != null) {
            server.stop(1);
            System.out.println("[PortfolioHttpServer] Server stopped.");
        }
    }
}

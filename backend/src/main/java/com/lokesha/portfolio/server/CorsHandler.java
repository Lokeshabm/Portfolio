package com.lokesha.portfolio.server;

import com.lokesha.portfolio.util.HttpUtils;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;

/**
 * Delegating HttpHandler that applies CORS headers and intercepts OPTIONS requests.
 */
public class CorsHandler implements HttpHandler {

    private final HttpHandler delegate;

    public CorsHandler(HttpHandler delegate) {
        this.delegate = delegate;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        HttpUtils.applyCorsHeaders(exchange);

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            exchange.close();
            return;
        }

        delegate.handle(exchange);
    }
}

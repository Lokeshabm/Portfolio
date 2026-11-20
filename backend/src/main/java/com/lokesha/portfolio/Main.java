package com.lokesha.portfolio;

import com.lokesha.portfolio.server.PortfolioHttpServer;

public class Main {

    public static void main(String[] args) {
        int port = 8080;

        if (args.length > 0) {
            try {
                port = Integer.parseInt(args[0]);
            } catch (NumberFormatException e) {
                System.out.println("Invalid port parameter provided. Defaulting to 8080.");
            }
        }

        try {
            PortfolioHttpServer server = new PortfolioHttpServer(port);
            server.start();

            // Register shutdown hook
            final PortfolioHttpServer shutdownServer = server;
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("\nShutting down portfolio server gracefully...");
                shutdownServer.stop();
            }));

        } catch (Exception e) {
            System.err.println("Fatal error starting Portfolio server: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

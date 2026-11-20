package com.lokesha.portfolio.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Manages JDBC connection to MySQL database.
 * Designed to gracefully fall back if MySQL service is not currently running.
 */
public class DatabaseConnection {

    private static final String URL = "jdbc:mysql://localhost:3306/portfolio_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "root";

    private static boolean driverLoaded = false;
    private static boolean loggedWarning = false;

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            driverLoaded = true;
        } catch (ClassNotFoundException e) {
            driverLoaded = false;
        }
    }

    public static boolean isDriverAvailable() {
        return driverLoaded;
    }

    public static Connection getConnection() {
        if (!driverLoaded) {
            return null;
        }
        try {
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (SQLException e) {
            if (!loggedWarning) {
                System.out.println("[DatabaseConnection] Notice: MySQL server on localhost:3306 is not connected or driver not present. Falling back to local file/memory storage.");
                loggedWarning = true;
            }
            return null;
        }
    }
}

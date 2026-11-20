package com.lokesha.portfolio.database;

import com.lokesha.portfolio.model.ProjectActivity;
import com.lokesha.portfolio.model.ProjectStats;
import com.lokesha.portfolio.model.ProjectStats.ProjectRanking;
import com.lokesha.portfolio.util.JsonUtil;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Data Access Object for Project Activity tracking.
 * Provides resilient persistence using MySQL RDBMS when available,
 * with seamless fallback to local JSON files (data/project_activities.json)
 * and thread-safe in-memory caching.
 */
public class ProjectActivityDao {

    private static final String DATA_DIR = "data";
    private static final String ACTIVITIES_FILE = "data/project_activities.json";
    private static final String SESSIONS_FILE = "data/visitor_sessions.json";

    private final List<ProjectActivity> activitiesStore = Collections.synchronizedList(new ArrayList<>());
    private final Map<String, String> sessionToVisitorMap = new ConcurrentHashMap<>();
    private final AtomicInteger activityIdSequence = new AtomicInteger(1);
    private final AtomicInteger visitorCounter = new AtomicInteger(0);

    public ProjectActivityDao() {
        initFileStorage();
        loadExistingData();
        ensureTablesExist();
    }

    private void initFileStorage() {
        try {
            File dir = new File(DATA_DIR);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            File actFile = new File(ACTIVITIES_FILE);
            if (!actFile.exists()) {
                Files.writeString(actFile.toPath(), "[]");
            }
            File sessFile = new File(SESSIONS_FILE);
            if (!sessFile.exists()) {
                Files.writeString(sessFile.toPath(), "{}");
            }
        } catch (Exception e) {
            System.err.println("[ProjectActivityDao] Could not initialize file storage: " + e.getMessage());
        }
    }

    private void ensureTablesExist() {
        Connection conn = DatabaseConnection.getConnection();
        if (conn != null) {
            try (Statement stmt = conn.createStatement()) {
                stmt.execute(
                    "CREATE TABLE IF NOT EXISTS visitor_sessions (" +
                    "id INT AUTO_INCREMENT PRIMARY KEY, " +
                    "session_token VARCHAR(100) UNIQUE NOT NULL, " +
                    "visitor_display_id VARCHAR(50) NOT NULL, " +
                    "first_seen VARCHAR(50) NOT NULL, " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
                );
                stmt.execute(
                    "CREATE TABLE IF NOT EXISTS project_activities (" +
                    "id INT AUTO_INCREMENT PRIMARY KEY, " +
                    "visitor_id VARCHAR(50) NOT NULL, " +
                    "project_id INT NOT NULL, " +
                    "project_name VARCHAR(150) NOT NULL, " +
                    "action VARCHAR(50) NOT NULL, " +
                    "activity_date VARCHAR(20) NOT NULL, " +
                    "activity_time VARCHAR(20) NOT NULL, " +
                    "device_type VARCHAR(50) NOT NULL, " +
                    "browser VARCHAR(50) NOT NULL, " +
                    "traffic_source VARCHAR(100) NOT NULL, " +
                    "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
                );
                System.out.println("[ProjectActivityDao] MySQL analytics tables verified.");
            } catch (SQLException e) {
                System.err.println("[ProjectActivityDao] Note on MySQL table creation: " + e.getMessage());
            }
        }
    }

    /**
     * Loads existing activities and visitor sessions from disk or MySQL on boot.
     */
    private void loadExistingData() {
        // 1. Try reading from MySQL if active
        Connection conn = DatabaseConnection.getConnection();
        if (conn != null) {
            try (Statement stmt = conn.createStatement()) {
                // Load sessions
                ResultSet rsSess = stmt.executeQuery("SELECT session_token, visitor_display_id FROM visitor_sessions");
                while (rsSess.next()) {
                    String token = rsSess.getString("session_token");
                    String vid = rsSess.getString("visitor_display_id");
                    sessionToVisitorMap.put(token, vid);
                    extractAndBumpVisitorCounter(vid);
                }

                // Load activities
                ResultSet rsAct = stmt.executeQuery("SELECT * FROM project_activities ORDER BY id ASC");
                int maxId = 0;
                while (rsAct.next()) {
                    ProjectActivity act = new ProjectActivity(
                        rsAct.getInt("id"),
                        rsAct.getString("visitor_id"),
                        rsAct.getInt("project_id"),
                        rsAct.getString("project_name"),
                        rsAct.getString("action"),
                        rsAct.getString("activity_date"),
                        rsAct.getString("activity_time"),
                        rsAct.getString("device_type"),
                        rsAct.getString("browser"),
                        rsAct.getString("traffic_source"),
                        rsAct.getString("created_at")
                    );
                    activitiesStore.add(act);
                    if (act.getId() > maxId) maxId = act.getId();
                }
                activityIdSequence.set(maxId + 1);
                System.out.println("[ProjectActivityDao] Loaded " + activitiesStore.size() + " activities from MySQL.");
                return;
            } catch (SQLException e) {
                System.err.println("[ProjectActivityDao] Could not read from MySQL: " + e.getMessage() + ". Reading local files.");
            }
        }

        // 2. Fallback: Read from local JSON files
        loadFromFileStorage();
    }

    private void loadFromFileStorage() {
        try {
            File sessFile = new File(SESSIONS_FILE);
            if (sessFile.exists()) {
                String json = Files.readString(sessFile.toPath());
                Map<String, String> map = JsonUtil.parseSimpleJson(json);
                if (map != null) {
                    for (Map.Entry<String, String> entry : map.entrySet()) {
                        sessionToVisitorMap.put(entry.getKey(), entry.getValue());
                        extractAndBumpVisitorCounter(entry.getValue());
                    }
                }
            }

            File actFile = new File(ACTIVITIES_FILE);
            if (actFile.exists()) {
                String json = Files.readString(actFile.toPath()).trim();
                if (json.startsWith("[") && json.endsWith("]")) {
                    List<ProjectActivity> parsed = parseActivitiesJsonArray(json);
                    activitiesStore.addAll(parsed);
                    int maxId = 0;
                    for (ProjectActivity act : parsed) {
                        if (act.getId() > maxId) maxId = act.getId();
                        extractAndBumpVisitorCounter(act.getVisitorId());
                    }
                    activityIdSequence.set(maxId + 1);
                }
            }
            System.out.println("[ProjectActivityDao] Loaded " + activitiesStore.size() + " activities and " + sessionToVisitorMap.size() + " visitor sessions from local JSON.");
        } catch (Exception e) {
            System.err.println("[ProjectActivityDao] Error reading JSON storage: " + e.getMessage());
        }
    }

    private void extractAndBumpVisitorCounter(String vid) {
        if (vid != null && vid.startsWith("Visitor ")) {
            try {
                int num = Integer.parseInt(vid.substring("Visitor ".length()).trim());
                if (num > visitorCounter.get()) {
                    visitorCounter.set(num);
                }
            } catch (NumberFormatException ignored) {}
        }
    }

    /**
     * Resolves or assigns a sequential anonymous visitor ID (e.g., "Visitor 001", "Visitor 002").
     */
    public synchronized String getOrCreateVisitorId(String sessionToken) {
        if (sessionToken == null || sessionToken.trim().isEmpty()) {
            sessionToken = "anon_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        }

        if (sessionToVisitorMap.containsKey(sessionToken)) {
            return sessionToVisitorMap.get(sessionToken);
        }

        int newNum = visitorCounter.incrementAndGet();
        String displayId = String.format("Visitor %03d", newNum);
        sessionToVisitorMap.put(sessionToken, displayId);

        // Save session mapping to MySQL
        Connection conn = DatabaseConnection.getConnection();
        if (conn != null) {
            String sql = "INSERT INTO visitor_sessions (session_token, visitor_display_id, first_seen) VALUES (?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, sessionToken);
                stmt.setString(2, displayId);
                stmt.setString(3, LocalDateTime.now().toString());
                stmt.executeUpdate();
            } catch (SQLException e) {
                System.err.println("[ProjectActivityDao] Session MySQL insert error: " + e.getMessage());
            }
        }

        // Save session mapping to file
        saveSessionsToFile();

        return displayId;
    }

    /**
     * Records a new project interaction activity.
     */
    public synchronized boolean recordActivity(ProjectActivity activity, String sessionToken) {
        String visitorId = getOrCreateVisitorId(sessionToken);
        activity.setVisitorId(visitorId);

        if (activity.getId() <= 0) {
            activity.setId(activityIdSequence.getAndIncrement());
        }

        LocalDateTime now = LocalDateTime.now();
        if (activity.getActivityDate() == null || activity.getActivityDate().isEmpty()) {
            activity.setActivityDate(now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        }
        if (activity.getActivityTime() == null || activity.getActivityTime().isEmpty()) {
            activity.setActivityTime(now.format(DateTimeFormatter.ofPattern("HH:mm:ss")));
        }
        if (activity.getCreatedAt() == null || activity.getCreatedAt().isEmpty()) {
            activity.setCreatedAt(now.toString());
        }

        activitiesStore.add(activity);

        // Try MySQL
        Connection conn = DatabaseConnection.getConnection();
        if (conn != null) {
            String sql = "INSERT INTO project_activities (visitor_id, project_id, project_name, action, activity_date, activity_time, device_type, browser, traffic_source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            try (PreparedStatement stmt = conn.prepareStatement(sql)) {
                stmt.setString(1, activity.getVisitorId());
                stmt.setInt(2, activity.getProjectId());
                stmt.setString(3, activity.getProjectName());
                stmt.setString(4, activity.getAction());
                stmt.setString(5, activity.getActivityDate());
                stmt.setString(6, activity.getActivityTime());
                stmt.setString(7, activity.getDeviceType());
                stmt.setString(8, activity.getBrowser());
                stmt.setString(9, activity.getTrafficSource());
                stmt.executeUpdate();
                System.out.println("[ProjectActivityDao] Activity saved to MySQL: " + activity.getVisitorId() + " -> " + activity.getAction() + " on " + activity.getProjectName());
                return true;
            } catch (SQLException e) {
                System.err.println("[ProjectActivityDao] MySQL insert failed: " + e.getMessage() + ". Appending to file.");
            }
        }

        // Fallback: append to activities file
        return appendActivityToFile(activity);
    }

    private synchronized boolean appendActivityToFile(ProjectActivity activity) {
        try {
            File file = new File(ACTIVITIES_FILE);
            String currentJson = "[]";
            if (file.exists()) {
                currentJson = Files.readString(file.toPath());
            }

            String itemJson = JsonUtil.toJson(activity);
            String updated;
            if (currentJson.trim().equals("[]") || currentJson.trim().isEmpty()) {
                updated = "[\n  " + itemJson + "\n]";
            } else {
                int lastBracket = currentJson.lastIndexOf(']');
                if (lastBracket != -1) {
                    updated = currentJson.substring(0, lastBracket).trim() + ",\n  " + itemJson + "\n]";
                } else {
                    updated = "[\n  " + itemJson + "\n]";
                }
            }

            try (FileWriter writer = new FileWriter(file, false)) {
                writer.write(updated);
            }
            return true;
        } catch (IOException e) {
            System.err.println("[ProjectActivityDao] Error writing activity to file: " + e.getMessage());
            return true; // Still preserved in memory!
        }
    }

    private synchronized void saveSessionsToFile() {
        try {
            File file = new File(SESSIONS_FILE);
            String json = JsonUtil.toJson(sessionToVisitorMap);
            try (FileWriter writer = new FileWriter(file, false)) {
                writer.write(json);
            }
        } catch (IOException e) {
            System.err.println("[ProjectActivityDao] Error saving sessions to file: " + e.getMessage());
        }
    }

    /**
     * Calculates project view statistics and popularity rankings.
     */
    public ProjectStats getProjectStats() {
        List<ProjectActivity> snapshot;
        synchronized (activitiesStore) {
            snapshot = new ArrayList<>(activitiesStore);
        }

        Set<String> uniqueVisitors = new HashSet<>();
        int totalViews = snapshot.size();
        int todayViews = 0;
        String todayStr = LocalDate.now().toString();
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);

        Map<String, List<ProjectActivity>> projectGroups = new LinkedHashMap<>();

        for (ProjectActivity act : snapshot) {
            if (act.getVisitorId() != null) {
                uniqueVisitors.add(act.getVisitorId());
            }
            if (todayStr.equals(act.getActivityDate())) {
                todayViews++;
            }

            String pName = act.getProjectName() != null ? act.getProjectName() : "Unknown Project";
            projectGroups.computeIfAbsent(pName, k -> new ArrayList<>()).add(act);
        }

        // Build project ranking list
        List<ProjectRanking> rankingList = new ArrayList<>();
        String mostViewed = "N/A";
        int maxViews = 0;

        for (Map.Entry<String, List<ProjectActivity>> entry : projectGroups.entrySet()) {
            String pName = entry.getKey();
            List<ProjectActivity> list = entry.getValue();

            int pTotal = list.size();
            Set<String> pVisitors = new HashSet<>();
            int pToday = 0;
            int pWeekly = 0;
            int pCard = 0;
            int pDetails = 0;
            int pGithub = 0;
            int pLive = 0;
            int pId = 0;

            for (ProjectActivity a : list) {
                if (a.getVisitorId() != null) pVisitors.add(a.getVisitorId());
                if (todayStr.equals(a.getActivityDate())) pToday++;

                try {
                    if (a.getActivityDate() != null) {
                        LocalDate d = LocalDate.parse(a.getActivityDate());
                        if (!d.isBefore(sevenDaysAgo)) {
                            pWeekly++;
                        }
                    }
                } catch (Exception ignored) {
                    pWeekly++;
                }

                if (a.getProjectId() > 0) pId = a.getProjectId();

                String action = a.getAction() != null ? a.getAction().toLowerCase() : "";
                if (action.contains("card")) pCard++;
                else if (action.contains("detail")) pDetails++;
                else if (action.contains("github")) pGithub++;
                else if (action.contains("demo") || action.contains("live")) pLive++;
                else pCard++;
            }

            double percentage = totalViews > 0 ? ((double) pTotal / totalViews) * 100.0 : 0.0;

            ProjectRanking pr = new ProjectRanking(
                0, pId, pName, pTotal, pVisitors.size(), pToday, pWeekly,
                pCard, pDetails, pGithub, pLive, Math.round(percentage * 10.0) / 10.0
            );
            rankingList.add(pr);

            if (pTotal > maxViews) {
                maxViews = pTotal;
                mostViewed = pName;
            }
        }

        // Sort descending by totalViews
        rankingList.sort((a, b) -> Integer.compare(b.getTotalViews(), a.getTotalViews()));

        // Assign ranks #1, #2, #3...
        for (int i = 0; i < rankingList.size(); i++) {
            rankingList.get(i).setRank(i + 1);
        }

        return new ProjectStats(
            uniqueVisitors.size(),
            totalViews,
            mostViewed,
            maxViews,
            todayViews,
            rankingList
        );
    }

    /**
     * Retrieves filtered and paginated activities for the real-time project activity table.
     */
    public Map<String, Object> getFilteredActivities(String search, String projectFilter, String actionFilter, int page, int limit) {
        List<ProjectActivity> snapshot;
        synchronized (activitiesStore) {
            snapshot = new ArrayList<>(activitiesStore);
        }

        // Sort newest first
        snapshot.sort((a, b) -> Integer.compare(b.getId(), a.getId()));

        String sQuery = search != null ? search.trim().toLowerCase() : "";
        String pFilter = projectFilter != null ? projectFilter.trim().toLowerCase() : "all";
        String aFilter = actionFilter != null ? actionFilter.trim().toLowerCase() : "all";

        List<ProjectActivity> filtered = new ArrayList<>();
        for (ProjectActivity act : snapshot) {
            // Project filter
            if (!pFilter.equals("all")) {
                String actProject = act.getProjectName() != null ? act.getProjectName().toLowerCase() : "";
                if (!actProject.contains(pFilter)) {
                    continue;
                }
            }

            // Action filter
            if (!aFilter.equals("all")) {
                String actAction = act.getAction() != null ? act.getAction().toLowerCase() : "";
                if (!actAction.contains(aFilter)) {
                    continue;
                }
            }

            // Search query
            if (!sQuery.isEmpty()) {
                String combined = (
                    (act.getVisitorId() != null ? act.getVisitorId() : "") + " " +
                    (act.getProjectName() != null ? act.getProjectName() : "") + " " +
                    (act.getAction() != null ? act.getAction() : "") + " " +
                    (act.getDeviceType() != null ? act.getDeviceType() : "") + " " +
                    (act.getBrowser() != null ? act.getBrowser() : "") + " " +
                    (act.getTrafficSource() != null ? act.getTrafficSource() : "") + " " +
                    (act.getActivityDate() != null ? act.getActivityDate() : "") + " " +
                    (act.getActivityTime() != null ? act.getActivityTime() : "")
                ).toLowerCase();

                if (!combined.contains(sQuery)) {
                    continue;
                }
            }

            filtered.add(act);
        }

        int totalCount = filtered.size();
        int safeLimit = limit > 0 ? limit : 10;
        int safePage = page > 0 ? page : 1;
        int startIndex = (safePage - 1) * safeLimit;

        List<ProjectActivity> pageItems = new ArrayList<>();
        if (startIndex < totalCount) {
            int endIndex = Math.min(startIndex + safeLimit, totalCount);
            pageItems = filtered.subList(startIndex, endIndex);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("items", pageItems);
        result.put("total", totalCount);
        result.put("page", safePage);
        result.put("limit", safeLimit);
        result.put("totalPages", (int) Math.ceil((double) totalCount / safeLimit));

        return result;
    }

    /**
     * Parses stored JSON array into a list of ProjectActivity objects.
     */
    private List<ProjectActivity> parseActivitiesJsonArray(String json) {
        List<ProjectActivity> list = new ArrayList<>();
        int i = 0;
        int len = json.length();

        while (i < len) {
            int startObj = json.indexOf('{', i);
            if (startObj == -1) break;

            int braceCount = 0;
            int endObj = -1;
            boolean inQuote = false;
            boolean escaped = false;

            for (int j = startObj; j < len; j++) {
                char c = json.charAt(j);
                if (escaped) {
                    escaped = false;
                } else if (c == '\\') {
                    escaped = true;
                } else if (c == '"') {
                    inQuote = !inQuote;
                } else if (!inQuote) {
                    if (c == '{') braceCount++;
                    else if (c == '}') {
                        braceCount--;
                        if (braceCount == 0) {
                            endObj = j;
                            break;
                        }
                    }
                }
            }

            if (endObj != -1) {
                String objJson = json.substring(startObj, endObj + 1);
                Map<String, String> map = JsonUtil.parseSimpleJson(objJson);
                if (map != null && !map.isEmpty()) {
                    ProjectActivity act = new ProjectActivity();
                    try { act.setId(Integer.parseInt(map.getOrDefault("id", "0"))); } catch (Exception ignored) {}
                    try { act.setProjectId(Integer.parseInt(map.getOrDefault("projectId", "0"))); } catch (Exception ignored) {}
                    act.setVisitorId(map.getOrDefault("visitorId", "Visitor 001"));
                    act.setProjectName(map.getOrDefault("projectName", ""));
                    act.setAction(map.getOrDefault("action", ""));
                    act.setActivityDate(map.getOrDefault("activityDate", ""));
                    act.setActivityTime(map.getOrDefault("activityTime", ""));
                    act.setDeviceType(map.getOrDefault("deviceType", ""));
                    act.setBrowser(map.getOrDefault("browser", ""));
                    act.setTrafficSource(map.getOrDefault("trafficSource", ""));
                    act.setCreatedAt(map.getOrDefault("createdAt", ""));
                    list.add(act);
                }
                i = endObj + 1;
            } else {
                break;
            }
        }
        return list;
    }

    public List<ProjectActivity> getAllActivities() {
        synchronized (activitiesStore) {
            return new ArrayList<>(activitiesStore);
        }
    }
}

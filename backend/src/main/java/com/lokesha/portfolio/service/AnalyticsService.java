package com.lokesha.portfolio.service;

import com.lokesha.portfolio.database.ProjectActivityDao;
import com.lokesha.portfolio.model.ApiResponse;
import com.lokesha.portfolio.model.ProjectActivity;
import com.lokesha.portfolio.model.ProjectStats;
import com.lokesha.portfolio.model.ProjectStats.ProjectRanking;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * Service orchestrating project analytics tracking, validation,
 * metric aggregation, and activity querying.
 */
public class AnalyticsService {

    private final ProjectActivityDao activityDao;

    public AnalyticsService() {
        this.activityDao = new ProjectActivityDao();
    }

    public AnalyticsService(ProjectActivityDao activityDao) {
        this.activityDao = activityDao;
    }

    /**
     * Validates and records a project activity event.
     */
    public ApiResponse recordActivity(Map<String, String> payload) {
        if (payload == null || payload.isEmpty()) {
            return ApiResponse.error("Invalid activity payload.");
        }

        String sessionToken = sanitize(payload.get("sessionToken"));
        String projectName = sanitize(payload.get("projectName"));
        String action = sanitize(payload.get("action"));

        if (projectName == null || projectName.trim().isEmpty()) {
            return ApiResponse.error("Project name is required.");
        }
        if (action == null || action.trim().isEmpty()) {
            action = "card_view";
        }

        int projectId = 0;
        try {
            String pIdStr = payload.get("projectId");
            if (pIdStr != null && !pIdStr.trim().isEmpty()) {
                projectId = Integer.parseInt(pIdStr.trim());
            }
        } catch (NumberFormatException ignored) {}

        String deviceType = sanitize(payload.getOrDefault("deviceType", "Desktop"));
        if (deviceType.isEmpty()) deviceType = "Desktop";

        String browser = sanitize(payload.getOrDefault("browser", "Browser"));
        if (browser.isEmpty()) browser = "Browser";

        String trafficSource = sanitize(payload.getOrDefault("trafficSource", "Direct"));
        if (trafficSource.isEmpty()) trafficSource = "Direct";

        String date = LocalDate.now().toString();
        String time = LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm:ss"));

        ProjectActivity activity = new ProjectActivity();
        activity.setProjectId(projectId);
        activity.setProjectName(projectName);
        activity.setAction(action);
        activity.setActivityDate(date);
        activity.setActivityTime(time);
        activity.setDeviceType(deviceType);
        activity.setBrowser(browser);
        activity.setTrafficSource(trafficSource);

        boolean success = activityDao.recordActivity(activity, sessionToken);
        if (success) {
            return ApiResponse.ok("Project activity recorded successfully.", activity);
        } else {
            return ApiResponse.error("Failed to record project activity.");
        }
    }

    public ProjectStats getProjectStats() {
        return activityDao.getProjectStats();
    }

    public List<ProjectRanking> getMostViewedProjects() {
        return activityDao.getProjectStats().getMostViewedProjects();
    }

    public Map<String, Object> getFilteredActivities(String search, String projectFilter, String actionFilter, int page, int limit) {
        return activityDao.getFilteredActivities(search, projectFilter, actionFilter, page, limit);
    }

    private String sanitize(String input) {
        if (input == null) return "";
        return input.trim()
                .replace("\r", "")
                .replace("\n", "")
                .replace("<", "&lt;")
                .replace(">", "&gt;");
    }
}
